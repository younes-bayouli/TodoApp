import { formatDate } from "../../Utils/dateUtilities";

function TodayEventsCard({ events = [], date }) {
	return (
		<article className="home-card today-events-card">
			<div className="home-card-heading">
				<div>
					<p className="home-card-kicker">Schedule</p>
					<h2>Today&apos;s events</h2>
				</div>
				<span className="home-card-count">{events.length}</span>
			</div>
			<p className="home-card-date">{formatDate(date.toISOString())}</p>
			{events.length > 0 ? (
				<ul className="home-event-list">
					{events.map((event) => (
						<li key={event.id}>
							<span
								className="home-event-dot"
								style={{
									backgroundColor: event.backgroundColor,
								}}
							/>
							<span>{event.title}</span>
						</li>
					))}
				</ul>
			) : (
				<p className="home-card-empty">
					Nothing scheduled. Keep the day open.
				</p>
			)}
		</article>
	);
}

export default TodayEventsCard;
