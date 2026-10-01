import { formatDate } from "../../Utils/dateUtilities";

function ProjectCard({ project, onClick }) {
	const todoCount =
		project.todos?.filter((todo) => !todo.completed).length ?? 0;
	const status = project.status ?? "Active";

	return (
		<button
			type="button"
			className="project-card"
			style={{ "--project-accent": project.color }}
			onClick={() => onClick(project)}
		>
			<span className="project-card-heading">
				<span className="project-card-title">{project.name}</span>
				<span className="project-card-indicators">
					<span
						className={`project-card-status project-card-status-${status.toLowerCase()}`}
					>
						{status}
					</span>
					{todoCount > 0 && (
						<span
							className="project-card-todo-count"
							title={`${todoCount} unfinished project tasks`}
						>
							{todoCount} {todoCount === 1 ? "task" : "tasks"}
						</span>
					)}
				</span>
			</span>
			<span className="project-card-details">
				<span className="project-card-detail project-card-due">
					<span className="project-card-label">Due:</span>
					<span className="project-card-value">
						{formatDate(project.deadline)}
					</span>
				</span>
				<span className="project-card-detail">
					<span className="project-card-label">Owner</span>
					<span className="project-card-value">{project.owner}</span>
				</span>
			</span>
		</button>
	);
}

export default ProjectCard;
