import Card from "../Card";

export const islamicDateToParts = (date) => {
	return new Intl.DateTimeFormat("en", {
		calendar: "islamic",
		day: "numeric",
		month: "long",
		year: "numeric",
	}).formatToParts(date);
};

function IslamicDateCard({ date }) {
	const parts = islamicDateToParts(date);
	const day = parts.find((part) => part.type === "day")?.value;
	const month = parts.find((part) => part.type === "month")?.value;
	const year = parts.find((part) => part.type === "year")?.value;

	return (
		<Card name="card-hijri">
			<div>
				<div>{day}</div>
				<h2>{month}</h2>
				<p>{year} AH</p>
			</div>
		</Card>
	);
}

export default IslamicDateCard;
