import { useEffect, useState } from "react";
import Todo from "./Todo.jsx";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api.js";

const filters = ["All", "Open", "Completed"];
const priorityOrder = { high: 0, medium: 1, low: 2 };

function TodoList() {
	const {
        data: tasks,
        isPending,
		isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["todos"],
        queryFn: api.todos.getAll
    });
	// const [tasks, setTasks] = useState(() =>
	// 	Todos?Todos.map((task) => ({ ...task, completed: false })):[],
	// );
	// useEffect(()=>{
	// 	setTasks(() => Todos?Todos.map((task) => ({ ...task, completed: false })):[]);
	// },[Todos])
	const [filter, setFilter] = useState("All");
	const [title, setTitle] = useState("");
	const [priority, setPriority] = useState("medium");

	const visibleTasks = tasks?.filter((task) => {
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

		setTasks((currentTasks) => [
			...currentTasks,
			{
				id: Date.now(),
				title: trimmedTitle,
				details: "",
				priority,
				completed: false,
			},
		]);
		setTitle("");
	};

	const toggleTask = (taskId) => {
		setTasks((currentTasks) =>
			currentTasks.map((task) =>
				task.id === taskId
					? { ...task, completed: !task.completed }
					: task,
			),
		);
	};

	const removeTask = (taskId) => {
		setTasks((currentTasks) =>
			currentTasks.filter((task) => task.id !== taskId),
		);
	};

	return (
		<div className="container bg-white">
			<div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
				<h3 className="mb-0 fw-semibold">Tasks</h3>
				<span className="badge text-primary-emphasis fw-normal">
					{openCount} open
				</span>
			</div>

			<form className="input-group mb-4" onSubmit={addTask}>
				<input
					className="form-control"
					value={title}
					placeholder="What needs to be done?"
					onChange={(event) => setTitle(event.target.value)}
				/>
				<select
					className="form-select"
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
					className="btn alert alert-primary p-2 m-0 btn-outline-primary"
					type="submit"
				>
					Add
				</button>
			</form>

			<div className="w-100 d-flex justify-content-end">
				<ul className="nav nav-pills gap-2 mb-3">
					{filters.map((filterName) => (
						<li className="nav-item" key={filterName}>
							<button
								type="button"
								className={`nav-link alert p-1 m-0 ${filter === filterName ? "alert-primary" : "alert-light"}`}
								onClick={() => setFilter(filterName)}
							>
								{filterName}
							</button>
						</li>
					))}
				</ul>
			</div>

			<div className="list-group list-group-flush border rounded">
				{isLoading && <h1>Loading...</h1> }
				{visibleTasks?.length ? (
					visibleTasks.map((task) => (
						<Todo
							key={task.id}
							task={task}
							onToggle={toggleTask}
							onRemove={removeTask}
						/>
					))
				) : (
					<div className="text-center text-secondary py-5">
						Nothing here — add a task above.
					</div>
				)}
			</div>
		</div>
	);
}

export default TodoList;
