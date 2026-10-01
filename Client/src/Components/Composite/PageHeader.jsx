import React from 'react';

function PageHeader({
    title,
    description,
    children,
    className = "",
}) {
    return (
        <div className={`d-flex justify-content-between align-items-md-center flex-column flex-md-row gap-3 pb-3 ${className}`}>
            <div>
                <h2 className="mb-1">{title}</h2>
                {description && (
                    <p className="text-muted mb-0">{description}</p>
                )}
            </div>
            
            {children && (
                <div className="app-page-header-actions d-flex gap-2">
                    {children}
                </div>
            )}
        </div>
    );
}

export default PageHeader;
