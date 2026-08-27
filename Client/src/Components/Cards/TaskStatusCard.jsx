function TaskStatusCard({ currentTask, nextTask }) {
	const renderTask = (label, task) => (
		<div className="mb-3">
			<div className="text-muted small">{label}</div>
			{task ? (
				<>
					<div className="fw-semibold">{task.title}</div>
					<div className="text-secondary small">
						{task.start} - {task.end}
					</div>
				</>
			) : (
				<div className="text-secondary">No task</div>
			)}
		</div>
	);

	return (
		<div className="card h-100 flex-grow-1 shadow-sm">
			<div className="card-body">
				<h5 className="card-title">Tasks</h5>
				{renderTask("Current task", currentTask)}
				{renderTask("Next task", nextTask)}
			</div>
		</div>
	);
}

export default TaskStatusCard;
