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
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<input
				type="checkbox"
				checked={task.completed}
				aria-label={`Complete ${task.title}`}
				onChange={() => onToggle(task.id)}
			/>
			<div>
				<span
					className={
						task.completed
							? "text-decoration-line-through"
							: ""
					}
				>
					{task.title}
				</span>
			</div>
			{hovered && (
				<div>
					<button
						type="button"
						onClick={() => onRemove(task.id)}
						aria-label={`Delete ${task.title}`}
					>
						<Trash2 color="red" size={18} />
					</button>
					<button
						type="button"
						onClick={() => onEdit(task)}
						aria-label={`Edit ${task.title}`}
					>
						<Pencil size={18} />
					</button>
				</div>
			)}
			<span>
				<span
					style={{
						width: "8px",
						height: "8px",
					}}
				/>
				{priority.label}
			</span>
		</div>
	);
}

export default Todo;
