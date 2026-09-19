import { useEffect, useState } from "react";
import { formatDate } from "../../Utils/dateUtilities";
import "./Projects.css";
import useData from "../../Utils/useData";
import { useAppContext } from "../../Context";

const priorityStyles = {
	high: { label: "High", dot: "#B54545" },
	medium: { label: "Medium", dot: "#B08A3E" },
	low: { label: "Low", dot: "#4B7A5A" },
};

const priorityOrder = { high: 0, medium: 1, low: 2 };

function ProjectDetail({ onBack }) {
	const { update: updateProject, remove: deleteProject } =
		useData("projects");
	const [newTodoTitle, setNewTodoTitle] = useState("");
	const [newTodoPriority, setNewTodoPriority] = useState("medium");
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const { openModal, configModal, object: project } = useAppContext();

	const toggleTodo = (todoId) => {
		const updatedTodos = project.todos.map((todo) =>
			todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
		);
		const updatedProject = {
			...project,
			todos: updatedTodos,
		};

		updateProject.mutate({
			Id: project.id,
			Data: updatedProject,
		});
		configModal({ modalObject: updatedProject });
	};

	const deleteTodo = (todoId) => {
		const updatedTodos = project.todos.filter((todo) => todo.id !== todoId);
		const updatedProject = {
			...project,
			todos: updatedTodos,
		};

		updateProject.mutate({
			Id: project.id,
			Data: updatedProject,
		});
		configModal({ modalObject: updatedProject });
	};

	const sortedTodos = [...project.todos].sort((a, b) => {
		if (a.completed !== b.completed) {
			return Number(a.completed) - Number(b.completed);
		}
		return priorityOrder[a.priority] - priorityOrder[b.priority];
	});

	const handleAddTodo = (e) => {
		e.preventDefault();
		if (!newTodoTitle.trim()) return;
		const id = new Date().getMilliseconds();
		const newTodo = {
			id: id,
			title: newTodoTitle.trim(),
			completed: false,
			priority: newTodoPriority,
		};
		const updatedProject = {
			...project,
			todos: [...(project.todos ?? []), newTodo],
		};

		updateProject.mutate({
			Id: project.id,
			Data: updatedProject,
		});
		setNewTodoTitle("");
		setNewTodoPriority("medium");
		configModal({ modalObject: updatedProject });
	};

	const handleConfirmDelete = () => {
		deleteProject.mutate(project.id);
		setShowDeleteDialog(false);
		onBack();
	};

	return (
		<>
			<div className="container bg-white">
				<div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
					<div className="d-flex align-items-center gap-3">
						<div>
							<h3 className="mb-0 fw-semibold">
								project: {project.name}
							</h3>
						</div>
						<button
							type="button"
							className="btn btn-outline-danger m-0 p-2"
							onClick={() => setShowDeleteDialog(true)}
						>
							Delete Project
						</button>
					</div>
					<div className="d-flex align-items-center gap-2">
						<small className="text-secondary">
							Due: {formatDate(project.deadline)}
						</small>
						<div
							className="btn alert alert-light p-2 m-0"
							onClick={openModal}
						>
							Modify Project
						</div>

						<div
							className="btn alert alert-light m-0 p-2"
							onClick={onBack}
						>
							Back to Projects
						</div>
					</div>
				</div>

				<div className="card mb-4">
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
									/>
								</div>

								<div className="col-md-3">
									<select
										className="form-select"
										value={newTodoPriority}
										onChange={(e) =>
											setNewTodoPriority(e.target.value)
										}
									>
										<option value="high">High</option>
										<option value="medium">Medium</option>
										<option value="low">Low</option>
									</select>
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

				{showDeleteDialog && (
					<div
						className="modal fade show d-block"
						style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
						onClick={() => setShowDeleteDialog(false)}
					>
						<div
							className="modal-dialog modal-dialog-centered"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="modal-content border-0 shadow-lg rounded-4">
								<div className="modal-header border-0 pb-2">
									<h5 className="modal-title fw-bold text-danger">
										Delete project?
									</h5>
									<button
										type="button"
										className="btn-close"
										onClick={() =>
											setShowDeleteDialog(false)
										}
										aria-label="Close"
									></button>
								</div>
								<div className="modal-body py-3">
									<p className="mb-0 text-secondary">
										This will permanently remove{" "}
										<strong>{project.name}</strong> and all
										of its todos. This action cannot be
										undone.
									</p>
								</div>
								<div className="modal-footer border-0 pt-2">
									<button
										type="button"
										className="btn btn-outline-secondary"
										onClick={() =>
											setShowDeleteDialog(false)
										}
									>
										Cancel
									</button>
									<button
										type="button"
										className="btn btn-danger"
										onClick={handleConfirmDelete}
									>
										Delete Project
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				<div className="mb-3">
					<h5 className="fw-semibold">Todos</h5>
				</div>

				<div className="list-group list-group-flush border rounded">
					{sortedTodos.length > 0 ? (
						sortedTodos.map((todo) => {
							const priority = priorityStyles[todo.priority];
							return (
								<div
									key={todo.id}
									className="list-group-item d-flex align-items-center gap-3 py-3"
								>
									<div
										className="form-check mb-0"
										onClick={() => toggleTodo(todo.id)}
										style={{ cursor: "pointer" }}
									>
										<input
											className="form-check-input"
											type="checkbox"
											checked={todo.completed}
											onChange={() => toggleTodo(todo.id)}
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
										onClick={() => deleteTodo(todo.id)}
									>
										Delete
									</button>
									<span className="d-flex align-items-center gap-2 small text-secondary">
										<span
											className="rounded-circle"
											style={{
												width: "8px",
												height: "8px",
												backgroundColor: priority.dot,
											}}
										/>
										{priority.label}
									</span>
								</div>
							);
						})
					) : (
						<div className="text-center text-secondary py-5">
							No todos yet. Click "Add Todo" to create one.
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default ProjectDetail;
