import Button from "../../Components/Basic/Button";
import EmptyState from "../../Components/Composite/EmptyState";
import PageHeader from "../../Components/Composite/PageHeader";

export default function DayEvents({
	day,
	events,
	addEvent,
	editEvent,
	onBack,
	deleteEventMutation,
}) {
	return (
		<div>
			<PageHeader
				title={
					<div>
						<p className="m-0">Events for this day: {day}</p>
					</div>
				}
			>
				<Button onClick={addEvent} variant="secondary" size="small" className="p-2">
					Add event
				</Button>
				<Button onClick={onBack} variant="secondary" size="small" className="p-2">
					Back to calendar
				</Button>
			</PageHeader>
			<div>
				{events?.length > 0 ? (
					events.map((calendarEvent) => (
						<div key={calendarEvent.id}>
							<div>
								<span
									className="app-list-dot"
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
									onClick={() => editEvent(calendarEvent)}
									variant="secondary"
								>
									Edit
								</Button>
								<Button
									type="button"
									onClick={() =>
										deleteEventMutation.mutate(
											calendarEvent.id,
										)
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
					<EmptyState
						title="No events today"
						description="No events scheduled for this day."
					/>
				)}
			</div>
		</div>
	);
}
