function Button({
    children,
    variant = "primary",
    size = "medium",
    type = "button",
    icon,
    fullWidth = false,
    className = "",
    active=false,
    ...props
}) {
    const classes = [
        "app-button",
        `app-button-${variant}`,
        `app-button-${active?"active":"normal"}`,
        `app-button-${size}`,
        fullWidth && "app-button-full",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type={type}
            className={classes}
            {...props}
        >
            {icon && <span className="app-button-icon">{icon}</span>}
            {children}
        </button>
    );
}

export default Button;