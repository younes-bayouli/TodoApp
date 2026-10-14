import ProjectCard from "./ProjectCard";

function ProjectList({ projects, onClick, onOpenAddProject }) {
	const mainProjects = projects?.filter((p) => p.main);
	const secondaryProjects = projects?.filter((p) => !p.main);

	const renderSection = (title, items, showAdd) => (
		<div className="mb-4">
			<h6 className="text-uppercase text-muted small fw-bold mb-2">
				{title}
			</h6>
			<div className="row g-4">
				{items?.map((project) => (
					<div className="col-12 col-md-6 col-lg-4" key={project.id}>
						<ProjectCard
							project={project}
							onClick={onClick}
							isSelected={false}
						/>
					</div>
				))}
				{showAdd && (
					<div className="col-12 col-md-6 col-lg-4">
						<button
							type="button"
							className="card h-100 w-100 project-card add-project-card"
							onClick={onOpenAddProject}
						>
							<span className="display-4" aria-hidden="true">
								+
							</span>
						</button>
					</div>
				)}
			</div>
		</div>
	);

	return (
		<div>
			{mainProjects?.length > 0 && renderSection("Main", mainProjects, false)}
			{renderSection("Secondary", secondaryProjects, true)}
		</div>
	);
}

export default ProjectList;
