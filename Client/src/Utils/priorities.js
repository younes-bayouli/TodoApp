/**
 * Single source for todo priority styling.
 *
 * Was duplicated: TodoPreviewCard, Todo and ProjectDetail each had
 * their own map, and ProjectDetail's dot color was never even
 * rendered. Colors reference design tokens so they follow the theme.
 */
export const priorityStyles = {
	high: { label: "High", variant: "danger", color: "var(--color-priority-high)" },
	medium: { label: "Medium", variant: "warning", color: "var(--color-priority-medium)" },
	low: { label: "Low", variant: "success", color: "var(--color-priority-low)" },
};

export const priorityOrder = { high: 0, medium: 1, low: 2 };

export const getPriority = (priority) =>
	priorityStyles[priority] ?? {
		label: priority,
		variant: "default",
		color: "var(--color-text-muted)",
	};
