const priorityColors = {
	high: "#b54545",
	medium: "#b08a3e",
	low: "#4b7a5a",
};

function TodoPreviewCard({ todos = [], limit = 3 }) {
	const visibleTodos = todos
		.filter((todo) => !todo.completed && todo.priority==="high")
		.slice(0, limit);

	return (
		<article className="home-card todo-preview-card flex-fill">
			<div className="home-card-heading">
				<div>
					<p className="home-card-kicker">Focus list</p>
					<h2>Open todos</h2>
				</div>
				<span className="home-card-count">
					{todos.filter((todo) => !todo.completed).length}
				</span>
			</div>
			<ul className="home-todo-list mt-2">
				{visibleTodos.length > 0 ? (
					visibleTodos.map((todo) => (
						<li key={todo.id}>
							<span
								className="home-todo-priority"
								style={{
									backgroundColor:
										priorityColors[todo.priority],
								}}
							/>
							<span>{todo.title}</span>
						</li>
					))
				) : (
					<li className="home-card-empty">All clear for now.</li>
				)}
			</ul>
			{visibleTodos.length <
				todos.filter((todo) => !todo.completed).length && (
				<p className="home-card-footnote">
					+ more waiting in your list
				</p>
			)}
		</article>
	);
}

export default TodoPreviewCard;
