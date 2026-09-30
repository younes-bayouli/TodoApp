function Badge({ children, variant = "default", className = "" }) {
    const classes = [
        "app-badge",
        `app-badge-${variant}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return <span className={classes}>{children}</span>;
}

export default Badge;