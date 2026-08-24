export const DAYS = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
        new Date(2024, 0, 1 + i)
    )
);

