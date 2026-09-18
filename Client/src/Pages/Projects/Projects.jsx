import { useState } from "react";
import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";
import "./Projects.css";
import useData from "../../Utils/useData";

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

function Projects() {
	const { data: projects } = useData("projects");
	const [selectedProject, openDetails] = useState(null);
	const [filter, setFilter] = useState("all");

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
				></ProjectList>
			</div>
		);
	}

	return (
		<ProjectDetail
			project={selectedProject}
			onBack={() => openDetails(null)}
		/>
	);
}

export default Projects;
