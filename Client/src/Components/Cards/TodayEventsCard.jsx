import { formatDate } from "../../Utils/dateUtilities";

function TodayEventsCard({ events = [], date }) {
	return (
		<article>
			<div>
				<div>
					<p>Schedule</p>
					<h2>Today&apos;s events</h2>
				</div>
				<span>{events.length}</span>
			</div>
			<p>{formatDate(date.toISOString())}</p>
			{events.length > 0 ? (
				<ul>
					{events.map((event) => (
						<li key={event.id}>
							<span
								style={{
									backgroundColor: event.backgroundColor,
								}}
							/>
							<span>{event.title}</span>
						</li>
					))}
				</ul>
			) : (
				<p>
					Nothing scheduled. Keep the day open.
				</p>
			)}
		</article>
	);
}

export default TodayEventsCard;
