import React, { useState } from "react";
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
    const [hovered, setHovered] = useState(false);

    return (
        <Card 
            padding="small" 
            className="mb-2 d-flex align-items-center gap-3"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <input
                type="checkbox"
                className="form-check-input m-0"
                checked={todo.completed}
                aria-label={`Complete ${todo.title}`}
                onChange={() => onToggle(todo.id)}
                style={{ cursor: 'pointer' }}
            />
            
            <div className="flex-grow-1 text-truncate">
                <span className={todo.completed ? "text-decoration-line-through text-muted" : ""}>
                    {todo.title}
                </span>
            </div>

            <Badge variant={priority.variant}>
                {priority.label}
            </Badge>

            <div 
                className="d-flex gap-1 ms-2"
                style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.2s ease-in-out" }}
            >
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
