import { useEffect, useState } from "react";
import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";
import useData from "../../Utils/useData";
import useModal from "../../hooks/useModal.jsx";
import PageHeader from "../../Components/Composite/PageHeader.jsx";
import FilterTabs from "../../Components/Composite/FilterTabs.jsx";
import "../../styles/projects.css";

const normalise = (project) => {
	return {
		name: project.name.trim(),
		description: project.description.trim(),
		deadline: project.deadline,
		owner: project.owner.trim(),
		color: project.color,
		isMain: !!project.isMain,
		todos: [],
	};
};

const projectFields = {
	name: {
		type: "text",
		label: "Title",
		placeholder: "Enter task title",
		size: "full",
	},

	description: {
		type: "textarea",
		label: "Description",
		placeholder: "Enter task details...",
		size: "full",
	},

	deadline: {
		type: "date",
		label: "Deadline",
		placeholder: "",
		size: "half",
	},
	status: {
		type: "select",
		label: "Status",
		size: "half",
		options: [
			{ value: "Active", label: "Active" },
			{ value: "Testing", label: "Testing" },
			{ value: "Completed", label: "Completed" },
			{ value: "Suspended", label: "Suspended" },
		],
	},

	color: {
		type: "color",
		label: "Color",
		size: "small",
	},
	owner: {
		type: "text",
		label: "Project Owner",
		placeholder: "Younes Bayouli",
		size: "full",
	},
};
const nullProject = {
	name: "",
	description: "",
	deadline: "",
	color: "#0d6efd",
	status: "Active",
	main: false,
	owner: "",
	todos: [],
};

const validateForm = (project) => {
	const newErrors = {};
	if (!project?.name?.trim()) {
		newErrors.projectName = "Project name is required";
	} else if (!project?.owner?.trim()) {
		newErrors.projectOwner = "Project owner is required";
	}
	return newErrors;
};

function Projects() {
	const [selectedProject, setSelectedProject] = useState(null);
	const [filter, setFilter] = useState("all");
	const { data: projects, create, update, remove } = useData("projects");
	const { Modal, openModal } = useModal({
		name: "Project",
		modalFields: projectFields,
		validate: validateForm,
	});

	const openDetails = (project) => {
		setSelectedProject(project);
	};
	const closeDetails = () => {
		setSelectedProject(null);
	};

	const filteredProjects = projects?.filter(
		(project) =>
			filter === "all" ||
			(project.status ?? "Active").toLowerCase() === filter,
	);

	useEffect(() => {
		setSelectedProject((prev) => {
			if (!prev) return prev;

			return projects?.find((project) => project.id === prev.id) ?? prev;
		});
	}, [projects]);

	if (selectedProject) {
		return (
			<>
				<ProjectDetail
					project={selectedProject}
					updateProjectMutation={update}
					deleteProjectMutation={remove}
					onBack={closeDetails}
					onModifyProject={() =>
						openModal({
							mutation: update,
							object: {
								...selectedProject,
								status: selectedProject.status ?? "Active",
							},
						})
					}
				/>
				{Modal}
			</>
		);
	}

	return (
		<div className="page flex-grow-1 min-h-0 d-flex flex-column">
			<PageHeader title="Projects" className="under-line">
				{`${filteredProjects?.length || 0} projects`}
			</PageHeader>
			<FilterTabs
				options={["all", "active", "testing", "completed", "suspended"]}
				value={filter}
				onChange={setFilter}
			/>

			<ProjectList
				onClick={openDetails}
				onOpenAddProject={() =>
					openModal({ mutation: create, object: nullProject })
				}
				projects={filteredProjects}
			></ProjectList>
			{Modal}
		</div>
	);
}

export default Projects;
