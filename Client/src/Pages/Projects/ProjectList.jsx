import { useAppContext } from "../../Context";
import ProjectCard from "./ProjectCard";

function ProjectList({ projects, onClick,onOpenAddProject }) {
	return (
		<div>
			<div>
				{projects?.map((project) => (
					<div key={project.id}>
						<ProjectCard
							project={project}
							onClick={onClick}
							isSelected={false}
						/>
					</div>
				))}
				<div>
					<button
						type="button"
						onClick={onOpenAddProject}
					>
						<span
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
