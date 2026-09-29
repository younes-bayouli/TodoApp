import React from "react";
import { Trash2, Pencil } from "lucide-react";
import Card from "./Card";
import Badge from "./Badge";
import IconButton from "./IconButton";

const priorityStyles = {
    high: { label: "High", variant: "danger" },
    medium: { label: "Medium", variant: "warning" },
    low: { label: "Low", variant: "success" },
};

function Todo({ todo, onToggle, onRemove, onEdit }) {
    const priority = priorityStyles[todo.priority] || { label: todo.priority, variant: "default" };

    return (
        <Card
            padding="small"
            className="app-row mb-2 d-flex align-items-center gap-3"
        >
            <input
                type="checkbox"
                className="form-check-input m-0 app-clickable"
                checked={todo.completed}
                aria-label={`Complete ${todo.title}`}
                onChange={() => onToggle(todo.id)}
            />

            <div className="flex-grow-1 text-truncate">
                <span className={todo.completed ? "text-decoration-line-through text-muted" : ""}>
                    {todo.title}
                </span>
            </div>

            <Badge variant={priority.variant}>
                {priority.label}
            </Badge>

            {/* Opacity is driven by .app-row:hover / :focus-within, so the
                actions stay reachable by keyboard without a state flag. */}
            <div className="app-row-actions">
                <IconButton
                    size="small"
                    onClick={() => onEdit(todo)}
                    ariaLabel={`Edit ${todo.title}`}
                >
                    <Pencil size={16} />
                </IconButton>
                <IconButton
                    size="small"
                    variant="danger"
                    onClick={() => onRemove(todo.id)}
                    ariaLabel={`Delete ${todo.title}`}
                >
                    <Trash2 size={16} />
                </IconButton>
            </div>
        </Card>
    );
}

export default Todo;
