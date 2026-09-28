import Button from "../../Components/Button";

export default function DayEvents({day,events,addEvent,editEvent,onBack,deleteEventMutation}) {
	return (
		<div>
			<div>
				<div>
					<h4>{day}</h4>
					<p>Events for this day</p>
				</div>
				<div>
					<Button
						onClick={addEvent}
					>
						Add event
					</Button>
					<Button
						onClick={onBack}
						variant="secondary"
					>
						Back to calendar
					</Button>
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
								<Button
									type="button"
									onClick={()=>editEvent(calendarEvent)}
									variant="secondary"
								>
									Edit
								</Button>
								<Button
									type="button"
									onClick={() =>
										deleteEventMutation.mutate(calendarEvent.id)
									}
									variant="secondary"
									disabled={deleteEventMutation.isPending}
								>
									{deleteEventMutation.isPending
										? "Deleting..."
										: "Delete"}
								</Button>
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
