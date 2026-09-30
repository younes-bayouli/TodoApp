import { useState } from "react";
import Button from "../Basic/Button";
import Input from "../Basic/Input";

/**
 * Title + priority + submit, for adding a todo inline on a page.
 *
 * Exists because TodoList and ProjectDetail each had their own copy
 * of this form, with the same three fields in the same order. The
 * initialise/submit pair is the caller's: it knows what to do with a
 * title and priority, and when to clear the field.
 */
function QuickAddForm({
	onSubmit,
	initialPriority = "medium",
	submitLabel = "Add",
	priorities = ["high", "medium", "low"],
}) {
	const [title, setTitle] = useState("");
	const [priority, setPriority] = useState(initialPriority);

	const handleSubmit = (event) => {
		event.preventDefault();
		const trimmedTitle = title.trim();
		if (!trimmedTitle) return;

		onSubmit({ title: trimmedTitle, priority });
		setTitle("");
	};

	return (
		<form className="app-quick-add" onSubmit={handleSubmit}>
			<Input
				className="form-control"
				value={title}
				placeholder="What needs to be done?"
				aria-label="Todo title"
				onChange={(event) => setTitle(event.target.value)}
			/>
			<select
				className="app-priority-select form-select"
				value={priority}
				aria-label="Task priority"
				onChange={(event) => setPriority(event.target.value)}
			>
				{priorities.map((level) => (
					<option key={level} value={level}>
						{level[0].toUpperCase() + level.slice(1)}
					</option>
				))}
			</select>
			<Button type="submit">{submitLabel}</Button>
		</form>
	);
}

export default QuickAddForm;
