import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";

const priorityStyles = {
	high: { label: "High", dot: "#B54545" },
	medium: { label: "Medium", dot: "#B08A3E" },
	low: { label: "Low", dot: "#4B7A5A" },
};

function Todo({ task, onToggle, onRemove, onEdit }) {
	const priority = priorityStyles[task.priority];
	const [hovered, setHovered] = useState(false);

	return (
		<div
			className="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<input
				className="form-check-input mt-0"
				type="checkbox"
				checked={task.completed}
				aria-label={`Complete ${task.title}`}
				onChange={() => onToggle(task.id)}
			/>
			<div className="flex-grow-1">
				<span
					className={
						task.completed
							? "text-decoration-line-through text-secondary"
							: ""
					}
				>
					{task.title}
				</span>
			</div>
			{hovered && (
				<div>
					<button
						className="btn btn-sm btn-link text-secondary text-decoration-none"
						type="button"
						onClick={() => onRemove(task.id)}
						aria-label={`Delete ${task.title}`}
					>
						<Trash2 color="red" size={18} />
					</button>
					<button
						className="btn btn-sm btn-link text-secondary text-decoration-none"
						type="button"
						onClick={() => onEdit(task)}
						aria-label={`Edit ${task.title}`}
					>
						<Pencil size={18} />
					</button>
				</div>
			)}
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
}

export default Todo;
