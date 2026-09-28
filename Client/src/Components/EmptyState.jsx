import React from 'react';

function EmptyState({
    title,
    description,
    icon,
    children,
    className = ""
}) {
    return (
        <div className={`app-empty-state d-flex flex-column align-items-center justify-content-center text-center p-5 rounded border border-dashed bg-light bg-opacity-50 ${className}`}>
            {icon && <div className="mb-3 text-muted">{icon}</div>}
            <h5 className="mb-2 text-secondary">{title}</h5>
            {description && <p className="text-muted mb-3">{description}</p>}
            {children && <div className="mt-2">{children}</div>}
        </div>
    );
}

export default EmptyState;
