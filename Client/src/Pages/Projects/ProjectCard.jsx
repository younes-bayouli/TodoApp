import { useState } from "react";
import { formatDate } from "../../Utils/dateUtilities";

const PRIORITY_BADGES = {
	high: "bg-danger",
	medium: "bg-warning",
	low: "bg-secondary",
};

function ProjectCard({ project, onClick, isSelected, colorScheme }) {
	const handleCardClick = () => {
		onClick(project);
	};

	return (
		<div
			className="card h-100 project-card"
			onClick={handleCardClick}
			style={{ cursor: "pointer" }}
		>
			<div
				className="card-header d-flex align-items-center gap-2"
				style={{
					borderLeftColor: project.color,
					borderLeftWidth: "4px",
					borderLeftStyle: "solid",
				}}
			>
				<h5 className="mb-0">{project.name}</h5>
			</div>
			<div className="card-body">
				<div className="d-flex align-items-center justify-content-between mb-2">
					<small className="text-secondary">
						Due: {formatDate(project.deadline)}
					</small>
					{project.todos.length > 0 && (
						<span
							className="badge rounded-pill alert alert-danger text-dark px-3 py-2"
							title="Has todos"
						>
							!
						</span>
					)}
				</div>

				<div className="mt-2">
					<small className="text-secondary d-block mb-1">Owner</small>
					<span className="small">{project.owner}</span>
				</div>

				<div className="mt-2">
					<small className="text-secondary d-block mb-1">
						Team ({project.teamMembers.length})
					</small>
					<div className="small">
						{project.teamMembers.map((member, index) => (
							<span key={index}>
								{member}
								{index < project.teamMembers.length - 1
									? ", "
									: ""}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProjectCard;
