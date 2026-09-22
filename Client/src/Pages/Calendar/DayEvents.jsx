export default function DayEvents({day,events,addEvent,editEvent,onBack,deleteEventMutation}) {
	return (
		<div className="calendar-day-events flex-grow-1">
			<div className="d-flex justify-content-between align-items-center mb-3">
				<div>
					<h4 className="mb-1">{day}</h4>
					<p className="mb-0">Events for this day</p>
				</div>
				<div className="d-flex gap-2">
					<div
						className="btn alert alert-light m-0 p-2"
						onClick={addEvent}
					>
						Add event
					</div>
					<div
						className="btn alert alert-light m-0 p-2"
						onClick={onBack}
					>
						Back to calendar
					</div>
				</div>
			</div>
			<div className="list-group">
				{events?.length > 0 ? (
					events.map((calendarEvent) => (
						<div
							key={calendarEvent.id}
							className="list-group-item d-flex justify-content-between align-items-center gap-3"
						>
							<div className="d-flex align-items-center gap-2">
								<span
									className="calendar-event-color"
									style={{
										backgroundColor:
											calendarEvent.backgroundColor,
									}}
								/>
								<span>{calendarEvent.title}</span>
							</div>
							<div className="d-flex gap-2">
								<button
									type="button"
									className="btn btn-sm btn-outline-primary"
									onClick={()=>editEvent(calendarEvent)}
								>
									Edit
								</button>
								<button
									type="button"
									className="btn btn-sm btn-outline-danger"
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
					<div className="list-group-item">
						No events scheduled for this day.
					</div>
				)}
			</div>
		</div>
	);
}
