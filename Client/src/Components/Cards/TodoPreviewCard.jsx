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
		<article>
			<div>
				<div>
					<p>Focus list</p>
					<h2>Open todos</h2>
				</div>
				<span>
					{todos.filter((todo) => !todo.completed).length}
				</span>
			</div>
			<ul>
				{visibleTodos.length > 0 ? (
					visibleTodos.map((todo) => (
						<li key={todo.id}>
							<span
								style={{
									backgroundColor:
										priorityColors[todo.priority],
								}}
							/>
							<span>{todo.title}</span>
						</li>
					))
				) : (
					<li>All clear for now.</li>
				)}
			</ul>
			{visibleTodos.length <
				todos.filter((todo) => !todo.completed).length && (
				<p>
					+ more waiting in your list
				</p>
			)}
		</article>
	);
}

export default TodoPreviewCard;
