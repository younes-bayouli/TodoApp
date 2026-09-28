import { useEffect, useState } from "react";
import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";
import useData from "../../Utils/useData";
import useModal from "../../hooks/useModal.jsx";
import PageHeader from "../../Components/PageHeader.jsx";

const normalise = (project) => {
	return {
		name: project.name.trim(),
		description: project.description.trim(),
		deadline: project.deadline,
		owner: project.owner.trim(),
		color: project.color,
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

	const filteredProjects = projects?.filter((project) => {
		if (filter === "all") return true;
		if (filter === "active") {
			return project.todos.some((t) => !t.completed);
		}
		if (filter === "completed") {
			return project.todos.every((t) => t.completed);
		}
		return true;
	});

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
						openModal({ mutation: update, object: selectedProject })
					}
				/>
				{Modal}
			</>
		);
	}

	return (
		<div>
			<PageHeader
				title="Projects"
				description={`${filteredProjects?.length || 0} projects`}
			/>

			<div>
				<ul>
					{["all", "active", "completed"].map((filterOption) => (
						<li key={filterOption}>
							<button
								type="button"
								className={`${
									filter === filterOption
										? "alert-primary"
										: "alert-light"
								}`}
								onClick={() => setFilter(filterOption)}
							>
								{filterOption}
							</button>
						</li>
					))}
				</ul>
			</div>

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
