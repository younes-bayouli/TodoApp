export default function DayEvents({day,events,addEvent,editEvent,onBack,deleteEventMutation}) {
	return (
		<div>
			<div>
				<div>
					<h4>{day}</h4>
					<p>Events for this day</p>
				</div>
				<div>
					<div
						onClick={addEvent}
					>
						Add event
					</div>
					<div
						onClick={onBack}
					>
						Back to calendar
					</div>
				</div>
			</div>
			<div>
				{events?.length > 0 ? (
					events.map((calendarEvent) => (
						<div
							key={calendarEvent.id}
						>
							<div>
								<span
									style={{
										backgroundColor:
											calendarEvent.backgroundColor,
									}}
								/>
								<span>{calendarEvent.title}</span>
							</div>
							<div>
								<button
									type="button"
									onClick={()=>editEvent(calendarEvent)}
								>
									Edit
								</button>
								<button
									type="button"
									onClick={() =>
										deleteEventMutation.mutate(calendarEvent.id)
									}
									disabled={deleteEventMutation.isPending}
								>
									{deleteEventMutation.isPending
										? "Deleting..."
										: "Delete"}
								</button>
							</div>
						</div>
					))
				) : (
					<div>
						No events scheduled for this day.
					</div>
				)}
			</div>
		</div>
	);
}
