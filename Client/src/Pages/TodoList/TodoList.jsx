import { useEffect, useState } from "react";
import Todo from "./Todo.jsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api.js";

const filters = ["All", "Open", "Completed"];
const priorityOrder = { high: 0, medium: 1, low: 2 };

function TodoList() {
	const queryClient = useQueryClient();
	const { data: tasks, isLoading } = useQuery({
		queryKey: ["todos"],
		queryFn: api.todos.getAll,
	});
	const addTaskMutation = useMutation({
		mutationFn: (newTask) => api.todos.create(newTask),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});
	const updateTaskMutation = useMutation({
		mutationFn: ({ taskId, taskData }) =>
			api.todos.update(taskId, taskData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});
	const toggleTaskMutation = useMutation({
		mutationFn: ({ taskId, taskData }) =>
			api.todos.update(taskId, taskData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});
	const deleteTaskMutation = useMutation({
		mutationFn: (taskId) => api.todos.delete(taskId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});
	const [filter, setFilter] = useState("All");
	const [title, setTitle] = useState("");
	const [priority, setPriority] = useState("medium");
	const [editingTask, setEditingTask] = useState(null);
	const [editTitle, setEditTitle] = useState("");
	const [editDetails, setEditDetails] = useState("");
	const [editPriority, setEditPriority] = useState("medium");

	useEffect(() => {
		if (!editingTask) return;

		setEditTitle(editingTask.title || "");
		setEditDetails(editingTask.details || "");
		setEditPriority(editingTask.priority || "medium");
	}, [editingTask]);

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
			title: trimmedTitle,
			details: "",
			priority,
			completed: false,
		});
		setTitle("");
	};

	const toggleTask = (taskId) => {
		const task = tasks?.find((item) => item.id === taskId);
		if (!task) return;

		toggleTaskMutation.mutate({
			taskId,
			taskData: {
				...task,
				completed: !task.completed,
			},
		});
	};

	const openEditDialog = (task) => {
		setEditingTask(task);
	};

	const closeEditDialog = () => {
		setEditingTask(null);
	};

	const saveTaskChanges = (event) => {
		event.preventDefault();
		if (!editingTask) return;

		const trimmedTitle = editTitle.trim();
		if (!trimmedTitle) return;

		updateTaskMutation.mutate({
			taskId: editingTask.id,
			taskData: {
				...editingTask,
				title: trimmedTitle,
				details: editDetails.trim(),
				priority: editPriority,
			},
		});
		closeEditDialog();
	};

	const removeTask = (taskId) => {
		try {
			deleteTaskMutation.mutate(taskId);
		} catch (error) {
			alert("failed to delete");
		}
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
				{isLoading && <h1>Loading...</h1>}
				{visibleTasks?.length ? (
					visibleTasks.map((task) => (
						<Todo
							key={task.id}
							task={task}
							onToggle={toggleTask}
							onRemove={removeTask}
							onEdit={openEditDialog}
						/>
					))
				) : (
					<div className="text-center text-secondary py-5">
						Nothing here — add a task above.
					</div>
				)}
			</div>

			{editingTask && (
				<div
					className="modal show d-block bg-dark bg-opacity-50"
					role="dialog"
					aria-modal="true"
					style={{ backdropFilter: "blur(3px)" }}
					onClick={closeEditDialog}
				>
					<div
						className="modal-dialog modal-dialog-centered"
						onClick={(event) => event.stopPropagation()}
					>
						<div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
							<div className="modal-header border-0 bg-light-subtle px-4 py-3">
								<div>
									<p className="text-uppercase small text-primary fw-semibold mb-1">
										Update task
									</p>
									<h5 className="modal-title mb-0">
										Edit todo
									</h5>
								</div>
								<button
									type="button"
									className="btn-close"
									onClick={closeEditDialog}
									aria-label="Close edit dialog"
								></button>
							</div>
							<form onSubmit={saveTaskChanges}>
								<div className="modal-body px-4 py-4">
									<div className="mb-3">
										<label
											htmlFor="editTodoTitle"
											className="form-label fw-medium"
										>
											Title
										</label>
										<input
											id="editTodoTitle"
											className="form-control form-control-lg"
											value={editTitle}
											onChange={(event) =>
												setEditTitle(event.target.value)
											}
											placeholder="Task title"
										/>
									</div>
									<div className="mb-3">
										<label
											htmlFor="editTodoDetails"
											className="form-label fw-medium"
										>
											Details
										</label>
										<textarea
											id="editTodoDetails"
											className="form-control"
											rows="4"
											value={editDetails}
											onChange={(event) =>
												setEditDetails(
													event.target.value,
												)
											}
											placeholder="Add more context or notes"
										></textarea>
									</div>
									<div>
										<label
											htmlFor="editTodoPriority"
											className="form-label fw-medium"
										>
											Priority
										</label>
										<select
											id="editTodoPriority"
											className="form-select"
											value={editPriority}
											onChange={(event) =>
												setEditPriority(
													event.target.value,
												)
											}
										>
											<option value="high">High</option>
											<option value="medium">
												Medium
											</option>
											<option value="low">Low</option>
										</select>
									</div>
								</div>
								<div className="modal-footer border-0 px-4 pb-4 pt-0">
									<button
										type="button"
										className="btn btn-light"
										onClick={closeEditDialog}
									>
										Cancel
									</button>
									<button
										type="submit"
										className="btn btn-primary px-4 rounded-pill"
									>
										Save changes
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default TodoList;
