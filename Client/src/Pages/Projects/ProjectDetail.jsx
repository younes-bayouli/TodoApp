import { useState } from "react";
import { formatDate } from "../../Utils/dateUtilities";
import "./Projects.css";

const PRIORITY_BADGES = {
	high: "bg-danger",
	medium: "bg-warning",
	low: "bg-secondary",
};

const priorityOrder = { high: 0, medium: 1, low: 2 };

function ProjectDetail({
	project,
	onBack,
	onToggleTodo,
	onDeleteTodo,
	onAddTodo,
}) {
	const [newTodoTitle, setNewTodoTitle] = useState("");
	const [newTodoPriority, setNewTodoPriority] = useState("medium");
	const [showAddTodo, setShowAddTodo] = useState(false);

	const sortedTodos = [...project.todos].sort((a, b) => {
		if (a.completed !== b.completed) {
			return Number(a.completed) - Number(b.completed);
		}
		return priorityOrder[a.priority] - priorityOrder[b.priority];
	});

	const handleAddTodo = (event) => {
		event.preventDefault();
		if (!newTodoTitle.trim()) return;

		const newTodo = {
			id: `todo-${Date.now()}`,
			title: newTodoTitle.trim(),
			completed: false,
			priority: newTodoPriority,
		};

		onAddTodo(newTodo);
		setNewTodoTitle("");
		setNewTodoPriority("medium");
		setShowAddTodo(false);
	};

	return (
		<div className="container bg-white">
			<div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
				<div className="d-flex align-items-center gap-3">
					<div>
						<h3 className="mb-0 fw-semibold">
							project: {project.name}
						</h3>
					</div>
				</div>
				<div className="d-flex align-items-center gap-2">
					<small className="text-secondary">
						Due: {formatDate(project.deadline)}
					</small>
					<div
						className="btn alert alert-light p-2 m-0"
						onClick={() => setShowAddTodo(!showAddTodo)}
					>
						{showAddTodo ? "Cancel" : "Add Todo"}
					</div>
					<div
						className="btn alert alert-light m-0 p-2"
						onClick={onBack}
					>
						Back to Projects
					</div>
				</div>
			</div>

			{showAddTodo && (
				<div className="card mb-4 border-primary">
					<div className="card-body">
						<h6 className="mb-3">Add New Todo</h6>
						<form onSubmit={handleAddTodo}>
							<div className="row g-3">
								<div className="col-md-8">
									<input
										type="text"
										className="form-control"
										placeholder="What needs to be done?"
										value={newTodoTitle}
										onChange={(e) =>
											setNewTodoTitle(e.target.value)
										}
										autoFocus
									/>
								</div>
								<div className="col-md-1">
									<button
										type="submit"
										className="btn btn-primary w-100"
									>
										Add
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			)}

			<div className="mb-3">
				<h5 className="fw-semibold">Todos</h5>
			</div>

			<div className="list-group list-group-flush border rounded">
				{sortedTodos.length > 0 ? (
					sortedTodos.map((todo) => (
						<div
							key={todo.id}
							className="list-group-item d-flex align-items-center gap-3 py-3"
						>
							<div
								className="form-check mb-0"
								onClick={() => onToggleTodo(todo.id)}
								style={{ cursor: "pointer" }}
							>
								<input
									className="form-check-input"
									type="checkbox"
									checked={todo.completed}
									onChange={() => onToggleTodo(todo.id)}
								/>
							</div>
							<div className="flex-grow-1">
								<span
									className={
										todo.completed
											? "text-decoration-line-through text-secondary"
											: ""
									}
								>
									{todo.title}
								</span>
							</div>
							<button
								type="button"
								className="btn btn-sm text-danger"
								onClick={() => onDeleteTodo(todo.id)}
							>
								Delete
							</button>
						</div>
					))
				) : (
					<div className="text-center text-secondary py-5">
						No todos yet. Click "Add Todo" to create one.
					</div>
				)}
			</div>
		</div>
	);
}

export default ProjectDetail;
