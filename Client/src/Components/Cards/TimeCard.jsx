import { format } from "../../Utils/timeUtilities";

export default function TimeDisplay({ date }) {
	const { hour24, hour12 } = format(date);

	return (
		<div>
			<div style={{ fontSize: "3rem" }}>
				{hour12}
			</div>
			<div>
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
