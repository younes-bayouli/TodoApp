import { useEffect, useState } from "react";
import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";
import "./Projects.css";
import useData from "../../Utils/useData";
import { useAppContext } from "../../Context";

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
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [filter, setFilter] = useState("all");
	const { data: projects, create, update } = useData("projects");
	const { configModal,openModal } = useAppContext();
	useEffect(() => {
		configModal({
			modalName: "projects",
			modalObject: nullProject,
			config: projectFields,
			validate: validateForm,
			onSubmit: create,
		});
	}, []);
	const openDetails = (project) => {
		configModal({ modalObject: project, onSubmit: update });
		setIsDetailsOpen(true);
	};
	const closeDetails = () => {
		configModal({ modalObject: nullProject, onSubmit: create });
		setIsDetailsOpen(false);
	};

	const openAddProject=()=>{
		configModal({ modalObject: nullProject, onSubmit: create });
		openModal();
	}

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

	if (!isDetailsOpen) {
		return (
			<div>
				<div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
					<h3 className="mb-0 fw-semibold">Projects</h3>
					<span className="badge text-primary-emphasis fw-normal">
						{filteredProjects?.length} projects
					</span>
				</div>

				<div className="w-100 d-flex justify-content-end mb-4">
					<ul className="nav nav-pills gap-2">
						{["all", "active", "completed"].map((filterOption) => (
							<li className="nav-item" key={filterOption}>
								<button
									type="button"
									className={`nav-link alert p-1 m-0 text-capitalize ${
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
					onOpenAddProject={openAddProject}
					projects={filteredProjects}
				></ProjectList>
			</div>
		);
	}

	return <ProjectDetail onBack={closeDetails}/>;
}

export default Projects;
