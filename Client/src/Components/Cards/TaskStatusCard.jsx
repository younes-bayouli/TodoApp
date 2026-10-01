import Card from "../Composite/Card";

function TaskStatusCard({ currentTask, nextTask, split = false }) {
	const renderTask = (label, task) => (
		<div>
			<div className="task-label">{label}</div>
			{task ? (
				<>
					<div>{task.title}</div>
					<div>
						{task.start} - {task.end}
					</div>
				</>
			) : (
				<div>No task</div>
			)}
		</div>
	);
	if (split) {
		return (
			<div className="next-current-tasks d-flex gap-3">
				<Card className="flex-fill">
					{renderTask("Current task", currentTask)}
				</Card>
				<Card className="flex-fill">
					{renderTask("Next task", nextTask)}
				</Card>
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
