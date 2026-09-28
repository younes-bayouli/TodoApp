function Card({
    children,
    variant = "default",
    padding = "medium",
    className = "",
    ...props
}) {
    const classes = [
        "app-card",
        `app-card-${variant}`,
        `app-card-${padding}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
}

export default Card;