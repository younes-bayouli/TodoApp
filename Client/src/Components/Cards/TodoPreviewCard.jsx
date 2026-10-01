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
				<ul className="app-list">
					{visibleTodos.length > 0 ? (
						visibleTodos.map((todo) => (
							<li
								key={todo.id}
								className="d-flex align-items-center gap-2"
							>
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
						<li>There is nothing in the list of todos.</li>
					)}
				</ul>
			</article>
		</Card>
	);
}

export default TodoPreviewCard;
