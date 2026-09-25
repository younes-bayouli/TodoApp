import { useState } from "react";
import Todo from "./Todo.jsx";
import useData from "../../Utils/useData.js";
import useModal from "../../hooks/useModal.jsx";

const filters = ["All", "Open", "Completed"];
const priorityOrder = { high: 0, medium: 1, low: 2 };

const todoFields = {
	title: {
		type: "text",
		label: "Title",
		placeholder: "Enter todo title",
		size: "full",
	},

	details: {
		type: "textarea",
		label: "Details",
		placeholder: "Enter todo details...",
		size: "full",
	},

	priority: {
		type: "select",
		label: "Priority",
		size: "small",
		options: [
			{ value: "high", label: "High" },
			{ value: "medium", label: "Medium" },
			{ value: "low", label: "Low" },
		],
	},
};

const validateForm = (todo) => {
	const newErrors = {};
	if (!todo?.title?.trim()) {
		newErrors.title = "todo title is required";
	}
	return newErrors;
};

function TodoList() {
	const {
		data: tasks,
		create: addTaskMutation,
		update: updateTaskMutation,
		remove: deleteTaskMutation,
	} = useData("todos");
	const { Modal, openModal } = useModal({
		name: "Todo",
		modalFields: todoFields,
		validate: validateForm,
	});
	const [filter, setFilter] = useState("All");
	const [title, setTitle] = useState("");
	const [priority, setPriority] = useState("medium");

	const visibleTasks = tasks
		?.filter((task) => {
			if (filter === "Open") return !task.completed;
			if (filter === "Completed") return task.completed;
			return true;
		})
		.sort((firstTask, secondTask) => {
			if (firstTask.completed !== secondTask.completed) {
				return (
					Number(firstTask.completed) - Number(secondTask.completed)
				);
			}

			return (
				priorityOrder[firstTask.priority] -
				priorityOrder[secondTask.priority]
			);
		});

	const openCount = tasks?.filter((task) => !task.completed).length;

	const addTask = (event) => {
		event.preventDefault();
		const trimmedTitle = title.trim();
		if (!trimmedTitle) return;

		addTaskMutation.mutate({
			Data: {
				title: trimmedTitle,
				details: "",
				priority: priority,
				completed: false,
			},
		});
		setTitle("");
	};

	const toggleTask = (taskId) => {
		const task = tasks?.find((item) => item.id === taskId);
		if (!task) return;

		updateTaskMutation.mutate({
			Id: taskId,
			Data: {
				...task,
				completed: !task.completed,
			},
		});
	};

	const removeTask = (taskId) => {
		deleteTaskMutation.mutate(taskId);
	};

	return (
		<div>
			<div>
				<h3>Tasks</h3>
				<span>
					{openCount} open
				</span>
			</div>

			<form onSubmit={addTask}>
				<input
					value={title}
					placeholder="What needs to be done?"
					onChange={(event) => setTitle(event.target.value)}
				/>
				<select
					style={{ maxWidth: "140px" }}
					value={priority}
					aria-label="Task priority"
					onChange={(event) => setPriority(event.target.value)}
				>
					<option value="high">High</option>
					<option value="medium">Medium</option>
					<option value="low">Low</option>
				</select>
				<button
					type="submit"
				>
					Add
				</button>
			</form>

			<div>
				<ul>
					{filters.map((filterName) => (
						<li key={filterName}>
							<button
								type="button"
								onClick={() => setFilter(filterName)}
							>
								{filterName}
							</button>
						</li>
					))}
				</ul>
			</div>

			<div>
				{visibleTasks?.length ? (
					visibleTasks.map((task) => (
						<Todo
							key={task.id}
							task={task}
							onToggle={toggleTask}
							onRemove={removeTask}
							onEdit={(task)=>openModal({ object: task, mutation: updateTaskMutation })}
						/>
					))
				) : (
					<div>
						Nothing here — add a task above.
					</div>
				)}
			</div>
			{Modal}
		</div>
	);
}

export default TodoList;
