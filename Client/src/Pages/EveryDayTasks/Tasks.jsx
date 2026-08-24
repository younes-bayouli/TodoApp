import { useState, memo } from "react";
import tasks from "../../fakeData/fakeTasks.json";
import Task from "./Task";


function TasksH({ onClick,TasksList = [] }) {
	const [tasksList, setTasks] = useState(TasksList);
	return (
		<div className="h-100 w-100 position-absolute d-flex align-items-center">
			{tasksList.map((task) => (
				<Task task={task} onClick={onClick}></Task>
			))}
		</div>
	);
}
const Tasks = memo(TasksH);

export default Tasks;
