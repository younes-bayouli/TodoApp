import { useState } from "react";
import ProjectCard from "./ProjectCard";

function ProjectList({
	projects,
	onProjectClick,
	filter,
	onFilterChange,
	onAddProject,
}) {
	const [showAddProject, setShowAddProject] = useState(false);
	const [projectName, setProjectName] = useState("");
	const [projectDescription, setProjectDescription] = useState("");
	const [projectDeadline, setProjectDeadline] = useState("");
	const [projectOwner, setProjectOwner] = useState("");
	const [projectTeam, setProjectTeam] = useState("");
	const [projectColor, setProjectColor] = useState("#0d6efd");

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

	const closeAddProject = () => {
		setShowAddProject(false);
		setProjectName("");
		setProjectDescription("");
		setProjectDeadline("");
		setProjectOwner("");
		setProjectTeam("");
		setProjectColor("#0d6efd");
	};

	const handleAddProject = (event) => {
		event.preventDefault();
		if (!projectName.trim() || !projectDeadline) return;

		const newProject={
			name: projectName.trim(),
			description: projectDescription.trim(),
			deadline: projectDeadline,
			owner: projectOwner.trim(),
			teamMembers: projectTeam
				.split(",")
				.map((member) => member.trim())
				.filter(Boolean),
			color: projectColor,
			todos: [],
		}

		onAddProject(newProject);
		closeAddProject();
	};

	return (
		<div>
			<div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
				<h3 className="mb-0 fw-semibold">Projects</h3>
				<span className="badge text-primary-emphasis fw-normal">
					{projects?.length} projects
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
								onClick={() => onFilterChange(filterOption)}
							>
								{filterOption}
							</button>
						</li>
					))}
				</ul>
			</div>

			<div className="row g-4">
				{filteredProjects?.map((project) => (
					<div className="col-12 col-md-6 col-lg-4" key={project.id}>
						<ProjectCard
							project={project}
							onClick={onProjectClick}
							isSelected={false}
						/>
					</div>
				))}
				<div className="col-12 col-md-6 col-lg-4">
					<button
						type="button"
						className="card h-100 w-100 project-card add-project-card"
						onClick={() => setShowAddProject(true)}
					>
						<span
							className="display-4 text-primary"
							aria-hidden="true"
						>
							+
						</span>
					</button>
				</div>
			</div>

			{showAddProject && (
				<div
					className="modal show d-block bg-light bg-opacity-50"
					role="dialog"
					aria-modal="true"
				>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<form onSubmit={handleAddProject}>
								<div className="modal-header">
									<h5 className="modal-title">Add Project</h5>
									<button
										type="button"
										className="btn-close"
										aria-label="Close"
										onClick={closeAddProject}
									/>
								</div>
								<div className="modal-body">
									<div className="mb-3">
										<label
											htmlFor="project-name"
											className="form-label"
										>
											Name
										</label>
										<input
											id="project-name"
											className="form-control"
											value={projectName}
											onChange={(event) =>
												setProjectName(
													event.target.value,
												)
											}
											required
											autoFocus
										/>
									</div>
									<div className="mb-3">
										<label
											htmlFor="project-description"
											className="form-label"
										>
											Description
										</label>
										<textarea
											id="project-description"
											className="form-control"
											value={projectDescription}
											onChange={(event) =>
												setProjectDescription(
													event.target.value,
												)
											}
											rows="2"
										/>
									</div>
									<div className="row g-3 mb-3">
										<div className="col-sm-6">
											<label
												htmlFor="project-deadline"
												className="form-label"
											>
												Deadline
											</label>
											<input
												id="project-deadline"
												type="date"
												className="form-control"
												value={projectDeadline}
												onChange={(event) =>
													setProjectDeadline(
														event.target.value,
													)
												}
												required
											/>
										</div>
										<div className="col-sm-6">
											<label
												htmlFor="project-color"
												className="form-label"
											>
												Color
											</label>
											<input
												id="project-color"
												type="color"
												className="form-control form-control-color"
												value={projectColor}
												onChange={(event) =>
													setProjectColor(
														event.target.value,
													)
												}
											/>
										</div>
									</div>
									<div className="mb-3">
										<label
											htmlFor="project-owner"
											className="form-label"
										>
											Owner
										</label>
										<input
											id="project-owner"
											className="form-control"
											value={projectOwner}
											onChange={(event) =>
												setProjectOwner(
													event.target.value,
												)
											}
										/>
									</div>
									<div>
										<label
											htmlFor="project-team"
											className="form-label"
										>
											Team members
										</label>
										<input
											id="project-team"
											className="form-control"
											value={projectTeam}
											onChange={(event) =>
												setProjectTeam(
													event.target.value,
												)
											}
											placeholder="Alice Chen, Bob Smith"
										/>
									</div>
								</div>
								<div className="modal-footer">
									<button
										type="button"
										className="btn btn-secondary"
										onClick={closeAddProject}
									>
										Cancel
									</button>
									<button
										type="submit"
										className="btn btn-primary"
									>
										Add Project
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ProjectList;
