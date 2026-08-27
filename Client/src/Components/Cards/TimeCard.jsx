import { format } from "../../Utils/timeUtilities";

export default function TimeDisplay({ date }) {
	const { hour24, hour12 } = format(date);

	return (
		<div className="time-display d-flex flex-column align-items-center justify-content-center p-3 bg-white border rounded h-100">
			<div className="time-12h text-muted " style={{ fontSize: "3rem" }}>
				{hour12}
			</div>
			<div className="time-date text-secondary small mt-2">
				{date.toLocaleDateString("en-US", {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			</div>
		</div>
	);
}
