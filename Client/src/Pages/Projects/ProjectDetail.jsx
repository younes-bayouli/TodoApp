import { useState } from "react";
import { formatDate } from "../../Utils/dateUtilities";
import "./Projects.css";
import ProjectModal from "./ProjectModal";

const PRIORITY_BADGES = {
	high: "bg-danger",
	medium: "bg-warning",
	low: "bg-secondary",
};

const priorityOrder = { high: 0, medium: 1, low: 2 };

function ProjectDetail({ project, onBack, deleteProject, updateProject }) {
	const [showUpdateProject, setShowUpdateProject] = useState(false);
	const [updProject, setupdProject] = useState(project);
	const [newTodoTitle, setNewTodoTitle] = useState("");
	const [newTodoPriority, setNewTodoPriority] = useState("medium");
	const [showAddTodo, setShowAddTodo] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [errors, setErrors] = useState({});

	const toggleTodo = (todoId) => {
		const updatedTodos = project.todos.map((todo) =>
			todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
		);

		updateProject({
			projectId: project.id,
			projectData: {
				...project,
				todos: updatedTodos,
			},
		});
	};

	const deleteTodo = (todoId) => {
		const updatedTodos = project.todos.filter((todo) => todo.id !== todoId);

		updateProject({
			projectId: project.id,
			projectData: {
				...project,
				todos: updatedTodos,
			},
		});
	};

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
			title: newTodoTitle.trim(),
			completed: false,
			priority: newTodoPriority,
		};
		updateProject.mutate({
			projectId: project.id,
			projectData: {
				...project,
				todos: [...(project.todos ?? []), newTodo],
			},
		});
		setNewTodoTitle("");
		setNewTodoPriority("medium");
		setShowAddTodo(false);
	};

	const handleConfirmDelete = () => {
		deleteProject(project.id);
		setShowDeleteDialog(false);
		onBack();
	};
	const validateForm = () => {
		const newErrors = {};
		if (!project.name.trim()) {
			newErrors.projectName = "Project name is required";
		} else if (!project.deadline) {
			newErrors.projectDeadline = "Project deadline is required";
		} else if (!project.owner.trim()) {
			newErrors.projectOwner = "Project owner is required";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleUpdateProject = (event) => {
		event.preventDefault();
		if (!validateForm()) return;

		const newProject = {
			name: updProject.name.trim(),
			description: updProject.description.trim(),
			deadline: updProject.deadline,
			owner: updProject.owner.trim(),
			color: updProject.color,
			todos: [],
		};

		updateProject({ projectId: project.id, projectData: newProject });
		setShowUpdateProject(false);
	};

	const changeValues = (event) => {
		const field = event.target.name;
		const value = event.target.value;
		setupdProject((old) => ({ ...old, [field]: value }));
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
							onClick={() => setShowUpdateProject(true)}
						>
							{showUpdateProject ? "Modifying" : "Modify Project"}
						</div>
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
						sortedTodos.map((todo) => (
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
							</div>
						))
					) : (
						<div className="text-center text-secondary py-5">
							No todos yet. Click "Add Todo" to create one.
						</div>
					)}
				</div>
			</div>
			{showUpdateProject && (
				<ProjectModal
					onSubmit={handleUpdateProject}
					closeModal={() => setShowUpdateProject(false)}
					project={updProject}
					onChange={changeValues}
					errors={errors}
					title={"Modify Project"}
				></ProjectModal>
			)}
		</>
	);
}

export default ProjectDetail;
