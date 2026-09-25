import { useState } from "react";
import { formatDate } from "../../Utils/dateUtilities";

const PRIORITY_BADGES = {
	high: "bg-danger",
	medium: "bg-warning",
	low: "bg-secondary",
};

function ProjectCard({ project, onClick }) {

	return (
		<div
			onClick={()=>onClick(project)}
		>
			<div
				style={{
					borderLeftColor: project.color,
					borderLeftWidth: "4px",
					borderLeftStyle: "solid",
				}}
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
