import React from 'react';

function FormField({
    label,
    htmlFor,
    error,
    required = false,
    helpText,
    children,
    className = ""
}) {
    return (
        <div className={`app-form-field ${className}`}>
            {label && (
                <label htmlFor={htmlFor} className="form-label d-flex gap-1 mb-1">
                    {label}
                    {required && <span className="text-danger">*</span>}
                </label>
            )}
            
            {children}

            {helpText && !error && (
                <div className="form-text mt-1 text-muted">{helpText}</div>
            )}
            
            {error && (
                <p className="text-danger mt-1 mb-0">
                    {error}
                </p>
            )}
        </div>
    );
}

export default FormField;
