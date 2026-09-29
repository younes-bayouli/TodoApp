import Card from "../Card";

function TaskStatusCard({ currentTask, nextTask }) {
	const renderTask = (label, task) => (
		<div>
			<div>{label}</div>
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

	return (
		<Card>
			<div>
				<h5>Tasks</h5>
				{renderTask("Current task", currentTask)}
				{renderTask("Next task", nextTask)}
			</div>
		</Card>
	);
}

export default TaskStatusCard;
