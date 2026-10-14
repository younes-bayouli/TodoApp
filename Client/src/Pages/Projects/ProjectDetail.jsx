import { useState } from "react";
import { formatDate } from "../../Utils/dateUtilities";
import Button from "../../Components/Basic/Button";
import EmptyState from "../../Components/Composite/EmptyState";
import QuickAddForm from "../../Components/Composite/QuickAddForm";
import { getPriority, priorityOrder } from "../../Utils/priorities";
import { X } from "lucide-react";
import PageHeader from "../../Components/Composite/PageHeader";

function ProjectDetail({
	onBack,
	project,
	updateProjectMutation,
	deleteProjectMutation,
	onModifyProject,
}) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const changeStatus = (event) => {
		updateProjectMutation.mutate({
			Id: project.id,
			Data: { ...project, status: event.target.value },
		});
	};

	const toggleTodo = (todoId) => {
		const updatedTodos = project.todos.map((todo) =>
			todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
		);
		const updatedProject = {
			...project,
			todos: updatedTodos,
		};

		updateProjectMutation.mutate({
			Id: project.id,
			Data: updatedProject,
		});
	};

	const deleteTodo = (todoId) => {
		const updatedTodos = project.todos.filter((todo) => todo.id !== todoId);
		const updatedProject = {
			...project,
			todos: updatedTodos,
		};

		updateProjectMutation.mutate({
			Id: project.id,
			Data: updatedProject,
		});
	};

	const sortedTodos = [...project.todos].sort((a, b) => {
		if (a.completed !== b.completed) {
			return Number(a.completed) - Number(b.completed);
		}
		return priorityOrder[a.priority] - priorityOrder[b.priority];
	});

	const handleAddTodo = ({ title, priority }) => {
		const newTodo = {
			id: new Date().getMilliseconds(),
			title,
			completed: false,
			priority,
		};
		const updatedProject = {
			...project,
			todos: [...(project.todos ?? []), newTodo],
		};

		updateProjectMutation.mutate({
			Id: project.id,
			Data: updatedProject,
		});
	};

	const handleConfirmDelete = () => {
		deleteProjectMutation.mutate(project.id);
		setShowDeleteDialog(false);
		onBack();
	};

	return (
		<>
			<div>
				<PageHeader title={`${project.name}`}>
					<div className="d-flex gap-2 align-items-center flex-wrap">
						<small>Due: {formatDate(project.deadline)}</small>
						<label className="d-flex align-items-center gap-2">
							<span>Status</span>
							<select
								className="form-select form-select-sm w-auto"
								value={project.status ?? "Active"}
								disabled={updateProjectMutation.isPending}
								onChange={changeStatus}
							>
								<option value="Active">Active</option>
								<option value="Completed">Completed</option>
								<option value="Suspended">Suspended</option>
								<option value="Testing">Testing</option>
							</select>
						</label>
						<label className="d-flex align-items-center gap-2">
							<span>Main</span>
							<input
								type="checkbox"
								className="form-check-input"
								checked={project.main}
								disabled={updateProjectMutation.isPending}
								onChange={(e) => {
									updateProjectMutation.mutate({
										Id: project.id,
										Data: {
											...project,
											main: e.target.checked,
										},
									});
								}}
							/>
						</label>
						<Button
							type="button"
							onClick={() => setShowDeleteDialog(true)}
							variant="danger-secondary"
						>
							Delete Project
						</Button>
						<Button variant="secondary" onClick={onModifyProject}>
							Modify Project
						</Button>

						<Button variant="secondary" onClick={onBack}>
							Back to Projects
						</Button>
					</div>
				</PageHeader>

				<div>
					<div>
						<h6>Add New Todo</h6>
						<QuickAddForm
							onSubmit={({ title, priority }) =>
								handleAddTodo({ title, priority })
							}
						/>
					</div>
				</div>

				{showDeleteDialog && (
					<div onClick={() => setShowDeleteDialog(false)}>
						<div onClick={(e) => e.stopPropagation()}>
							<div>
								<div>
									<h5>Delete project?</h5>
									<Button
										type="button"
										variant="ghost"
										onClick={() =>
											setShowDeleteDialog(false)
										}
										aria-label="Close"
									>
										<X></X>
									</Button>
								</div>
								<div>
									<p>
										This will permanently remove{" "}
										<strong>{project.name}</strong> and all
										of its todos. This action cannot be
										undone.
									</p>
								</div>
								<div>
									<Button
										type="button"
										onClick={() =>
											setShowDeleteDialog(false)
										}
										variant="secondary"
									>
										Cancel
									</Button>
									<Button
										type="button"
										variant="danger"
										onClick={handleConfirmDelete}
									>
										Delete Project
									</Button>
								</div>
							</div>
						</div>
					</div>
				)}

				<div>
					<h5>Todos</h5>
				</div>

				<div className="list-group list-group-flush border rounded">
					{sortedTodos.length > 0 ? (
						sortedTodos.map((todo) => {
							const priority = getPriority(todo.priority);
							return (
								<div
									key={todo.id}
									className="d-flex align-items-center p-2 justify-content-between"
								>
									<div className="d-flex align-items-center">
										<div
											onClick={() => toggleTodo(todo.id)}
											className="app-clickable m-2"
										>
											<input
												type="checkbox"
												checked={todo.completed}
												onChange={() =>
													toggleTodo(todo.id)
												}
											/>
										</div>
										<div>
											<span
												className={
													todo.completed
														? "text-decoration-line-through"
														: ""
												}
											>
												{todo.title}
											</span>
										</div>
									</div>
									<div className="d-flex align-items-center">
										<span
											className="d-flex align-items-center gap-2"
											style={{
												color: priority.color,
											}}
										>
											<span
												className="app-list-dot"
												style={{
													backgroundColor:
														priority.color,
													color: priority.color,
												}}
											/>
											{priority.label}
										</span>
										<Button
											type="button"
											variant="danger-ghost text"
											onClick={() => deleteTodo(todo.id)}
										>
											Delete
										</Button>
									</div>
								</div>
							);
						})
					) : (
						<EmptyState
							title="No tasks yet"
							description="Click 'Add Todo' to create one."
						/>
					)}
				</div>
			</div>
		</>
	);
}

export default ProjectDetail;
