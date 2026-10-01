import Card from "../Composite/Card";
import Badge from "../Basic/Badge";
import { getPriority } from "../../Utils/priorities";

function TodoPreviewCard({ todos = [], limit = 3 }) {
	const openCount = todos.filter((todo) => !todo.completed).length;
	const visibleTodos = todos
		.filter((todo) => !todo.completed && todo.priority === "high")
		.slice(0, limit);

	return (
		<Card name="card-focus">
			<article>
				<div className="app-card-header">
					<div>
						<h3>Todos</h3>
					</div>
				</div>
				<ul className="app-list">
					{visibleTodos.length > 0 ? (
						visibleTodos.map((todo) => (
							<li key={todo.id}>
								<span
									className="app-list-dot"
									style={{
										backgroundColor: getPriority(
											todo.priority,
										).color,
									}}
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
