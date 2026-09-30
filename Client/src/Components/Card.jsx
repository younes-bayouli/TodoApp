/* `name` is the page-grid slot this card sits in (e.g. "card-clock").
   It lands on this div so the grid can target the card directly, with
   no wrapper element in between. */
function Card({
    children,
    name = "",
    variant = "default",
    padding = "medium",
    className = "",
    ...props
}) {
    const classes = [
        "app-card",
        `app-card-${variant}`,
        `app-card-${padding}`,
        name,
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