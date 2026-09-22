export const islamicDateToParts =(date)=>{
	return new Intl.DateTimeFormat("en", {
		calendar: "islamic",
		day: "numeric",
		month: "long",
		year: "numeric",
	}).formatToParts(date)
}

function IslamicDateCard({ date }) {
	const parts = islamicDateToParts(date);
	const day = parts.find((part) => part.type === "day")?.value;
	const month = parts.find((part) => part.type === "month")?.value;
	const year = parts.find((part) => part.type === "year")?.value;

	return (
		<div className="rounded border p-4">
			<div className="display-1 fw-light lh-1">{day}</div>
			<h2 className="mt-2">{month}</h2>
			<p>{year} AH</p>
		</div>
	);
}

export default IslamicDateCard;
