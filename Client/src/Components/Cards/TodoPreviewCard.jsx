import Card from "../Card";

const priorityColors = {
	high: "#b54545",
	medium: "#b08a3e",
	low: "#4b7a5a",
};

function TodoPreviewCard({ todos = [], limit = 3 }) {
	const openCount = todos.filter((todo) => !todo.completed).length;
	const visibleTodos = todos
		.filter((todo) => !todo.completed && todo.priority === "high")
		.slice(0, limit);

	return (
		<Card>
			<article>
				<div>
					<div>
						<p>Focus list</p>
						<h2>Open todos</h2>
					</div>
					<span>{openCount}</span>
				</div>
				<ul>
					{visibleTodos.length > 0 ? (
						visibleTodos.map((todo) => (
							<li key={todo.id}>
								<span
									className="app-list-dot"
									style={{ backgroundColor: priorityColors[todo.priority] }}
								/>
								<span>{todo.title}</span>
							</li>
						))
					) : (
						<li>All clear for now.</li>
					)}
				</ul>
				{visibleTodos.length < openCount && (
					<p>+ more waiting in your list</p>
				)}
			</article>
		</Card>
	);
}

export default TodoPreviewCard;
