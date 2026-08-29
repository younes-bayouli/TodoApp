export const DAYS = Array.from({ length: 7 }, (_, i) =>
	new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
		new Date(2024, 0, 1 + i),
	),
);

export function toMonthValue(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export const formatDay = (date) =>
	new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
	}).format(date);

export const toDateKey = (date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const toDateKeyFromString = (dateString) => {
	const [year, month, day] = dateString.slice(0, 10).split("-").map(Number);
	return toDateKey(new Date(year, month - 1, day));
};

export const formatDate = (dateString) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

export function dateToString(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}
