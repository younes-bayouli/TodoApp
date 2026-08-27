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
		<div className="card shadow-sm border rounded bg-white p-4 islamic-date-card">
			<div className="islamic-date-number text-primary">{day}</div>
			<h2 className="mt-2">{month}</h2>
			<p className="islamic-date-year">{year} AH</p>
		</div>
	);
}

export default IslamicDateCard;
