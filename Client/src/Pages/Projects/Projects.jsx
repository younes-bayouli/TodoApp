import { useState } from "react";
import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";
import "./Projects.css";
import useData from "../../Utils/useData";
import ProjectModal from "./ProjectModal";

const nullProject = {
	name: "",
	description: "",
	deadline: "",
	owner: "",
	teamMembers: [],
	color: "#0d6efd",
};

function Projects() {
	const projects = useData("projects");
	const [selectedProject, openDetails] = useState(null);
	const [showAddProject, setShowAddProject] = useState(false);
	const [project, setProject] = useState(nullProject);
	const [errors, setErrors] = useState({});
	const [filter, setFilter] = useState("all");

	const filteredProjects = projects.data?.filter((project) => {
		if (filter === "all") return true;
		if (filter === "active") {
			return project.todos.some((t) => !t.completed);
		}
		if (filter === "completed") {
			return project.todos.every((t) => t.completed);
		}
		return true;
	});

	const closeAddProject = () => {
		setShowAddProject(false);
		setProject(nullProject);
	};

	const addProject = (event) => {
		event.preventDefault();
		if (!validateForm()) return;

		const newProject = {
			name: project.name.trim(),
			description: project.description.trim(),
			deadline: project.deadline,
			owner: project.owner.trim(),
			color: project.color,
			todos: [],
		};

		projects.create.mutate(newProject);
		closeAddProject();
	};

	const changeValues = (event) => {
		let field = event.target.name;
		let value = event.target.value;
		setProject((old) => ({ ...old, [field]: value }));
	};

	const validateForm = () => {
		const newErrors = {};
		if (!project.name.trim()) {
			newErrors.projectName = "Project name is required";
		} else if (!project.deadline) {
			newErrors.projectDeadline = "Project deadline is required";
		} else if (!project.owner.trim()) {
			newErrors.projectOwner = "Project owner is required";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	if (!selectedProject) {
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
					projects={filteredProjects}
					showAddProject={setShowAddProject}
				></ProjectList>

				{showAddProject && (
					<ProjectModal
						project={project}
						onSubmit={addProject}
						closeModal={closeAddProject}
						onChange={changeValues}
						errors={errors}
						title={"Add Project"}
					></ProjectModal>
				)}
			</div>
		);
	}

	return (
		<ProjectDetail
			project={selectedProject}
			onBack={() => openDetails(null)}
			deleteProject={projects.remove?.mutate}
			updateProject={projects.update?.mutate}
		/>
	);
}

export default Projects;
