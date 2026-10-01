import Card from "../Composite/Card";

function TaskStatusCard({
	currentTask,
	nextTask,
	split = false,
	className = "",
}) {
	const renderTask = (label, task) => (
		<div className="task-status-content">
			<div className="task-label task-status-text">{label}</div>
			{task ? (
				<>
					<div className="task-status-title task-status-text">
						{task.title}
					</div>
					<div className="task-status-time task-status-text">
						{task.start} - {task.end}
					</div>
				</>
			) : (
				<div className="task-status-text">No task</div>
			)}
		</div>
	);
	if (split) {
		return (
			<div className={`next-current-tasks d-flex gap-2 ${className}`}>
				<Card>{renderTask("Current task", currentTask)}</Card>
				<Card>{renderTask("Next task", nextTask)}</Card>
			</div>
		);
	}

	return (
		<Card name="card-tasks">
			<div>
				{renderTask("Current task", currentTask)}
				{renderTask("Next task", nextTask)}
			</div>
		</Card>
	);
}

export default TaskStatusCard;
