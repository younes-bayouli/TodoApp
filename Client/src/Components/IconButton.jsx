function IconButton({
    children,
    variant = "default",
    size = "medium",
    disabled = false,
    ariaLabel = "",
    className = "",
    ...props
}) {
    const sizeMap = {
        small: "app-icon-button-small",
        medium: "app-icon-button-medium",
        large: "app-icon-button-large",
    };

    const variantMap = {
        default: "app-icon-button-default",
        primary: "app-icon-button-primary",
        secondary: "app-icon-button-secondary",
    };

    const classes = [
        "app-icon-button",
        sizeMap[size],
        variantMap[variant],
        disabled && "app-icon-button-disabled",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type="button"
            className={classes}
            disabled={disabled}
            aria-label={ariaLabel}
            {...props}
        >
            {children}
        </button>
    );
}

export default IconButton;