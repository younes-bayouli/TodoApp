import { useAppContext } from "../../Context";
import ProjectCard from "./ProjectCard";

function ProjectList({ projects, onClick,onOpenAddProject,onCloseAddProject }) {
	const { openModal } = useAppContext();
	return (
		<div>
			<div className="row g-4">
				{projects?.map((project) => (
					<div className="col-12 col-md-6 col-lg-4" key={project.id}>
						<ProjectCard
							project={project}
							onClick={onClick}
							isSelected={false}
						/>
					</div>
				))}
				<div className="col-12 col-md-6 col-lg-4">
					<button
						type="button"
						className="card h-100 w-100 project-card add-project-card"
						onClick={onOpenAddProject}
					>
						<span
							className="display-4"
							aria-hidden="true"
						>
							+
						</span>
					</button>
				</div>
			</div>
		</div>
	);
}

export default ProjectList;
