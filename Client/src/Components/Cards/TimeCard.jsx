import { format } from "../../Utils/timeUtilities";
import Card from "../Composite/Card";

export default function TimeDisplay({ date }) {
	const { hour12 } = format(date);

	return (
		<Card name="card-clock">
			<div>
				<div className="app-time-display">{hour12}</div>
				<div>
					{date.toLocaleDateString("en-US", {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</div>
			</div>
		</Card>
	);
}
