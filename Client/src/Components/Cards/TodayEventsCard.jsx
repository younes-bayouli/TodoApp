import { formatDate } from "../../Utils/dateUtilities";
import Card from "../Composite/Card";

function TodayEventsCard({ events = [], date }) {
	return (
		<Card name="card-schedule">
			<article>
				<div className="app-card-header">
					<div>
						<p>Schedule</p>
						<h2>Today&apos;s events</h2>
					</div>
				</div>
				<p>{formatDate(date.toISOString())}</p>
				{events.length > 0 ? (
					<ul className="app-list">
						{events.map((event) => (
							<li key={event.id}>
								<span
									className="app-list-dot"
									style={{
										backgroundColor: event.backgroundColor,
									}}
								/>
								<span>{event.title}</span>
							</li>
						))}
					</ul>
				) : (
					<p>Nothing scheduled. Keep the day open.</p>
				)}
			</article>
		</Card>
	);
}

export default TodayEventsCard;
