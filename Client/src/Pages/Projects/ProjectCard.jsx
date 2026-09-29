import { formatDate } from "../../Utils/dateUtilities";

function ProjectCard({ project, onClick }) {
	return (
		<div
			className="app-clickable"
			onClick={()=>onClick(project)}
		>
			{/* The accent color is per-project data; the border geometry
			    is the same for every card, so only that lives in CSS. */}
			<div
				className="app-accent-left"
				style={{ borderLeftColor: project.color }}
			>
				<h5>{project.name}</h5>
			</div>
			<div>
				<div>
					<small>
						Due: {formatDate(project.deadline)}
					</small>
					{project.todos.length > 0 && (
						<span
							title="Has todos"
						>
							!
						</span>
					)}
				</div>

				<div>
					<small>Owner</small>
					<span>{project.owner}</span>
				</div>
			</div>
		</div>
	);
}

export default ProjectCard;
