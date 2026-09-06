import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Arrow from "../../Components/Arrow.jsx";
import "./Calendar.css";
import {
	toMonthValue,
	formatDay,
	toDateKey,
	toDateKeyFromString,
} from "../../Utils/dateUtilities.js";
import { useDate } from "../../Utils/useTime.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api.js";
import { useAppContext } from "../../Context.jsx";

function Calendar() {
	const { addError } = useAppContext();
	const calendarRef = useRef(null);
	const showTooltipTimer = useRef(null);
	const queryClient = useQueryClient();
	const [dayTooltip, setDayTooltip] = useState(null);
	const [dayEvents, setDayEvents] = useState(null);
	const [eventModal, setEventModal] = useState(false);
	const [editingEvent, setEditingEvent] = useState(null);
	const [eventTitle, setEventTitle] = useState("");
	const [eventColor, setEventColor] = useState("#0d6efd");
	const [planModal, setPlanModal] = useState(false);
	const [planTitle, setPlanTitle] = useState("");
	const [planStart, setPlanStart] = useState(toDateKey(new Date()));
	const [planEnd, setPlanEnd] = useState(toDateKey(new Date()));
	const [planColor, setPlanColor] = useState("#0d6efd");
	const [selectedMonth, setSelectedMonth] = useState(toMonthValue(useDate()));
	const [errors, setErrors] = useState({});
	const { data: events, error: eventsError } = useQuery({
		queryKey: ["events"],
		queryFn: api.events.getAll,
	});
	const createEventMutation = useMutation({
		mutationFn: (newEvent) => api.events.create(newEvent),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
		onError: (error) => {
			addError(error);
			closeEventModal();
		},
	});
	const updateEventMutation = useMutation({
		mutationFn: ({ eventId, eventData }) =>
			api.events.update(eventId, eventData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
		onError: (error) => {
			addError(error);
			closeEventModal();
		},
	});
	const deleteEventMutation = useMutation({
		mutationFn: (eventId) => api.events.delete(eventId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
		onError: (error) => {
			addError(error);
		},
	});

	const getEventsForDay = (date) => {
		const dateKey =
			date instanceof Date ? toDateKey(date) : toDateKeyFromString(date);
		return events?.filter((event) => event.start.slice(0, 10) === dateKey);
	};

	const showDayTooltip = (date, pointerEvent) => {
		const tooltipWidth = 250;
		const tooltipHeight = 100;
		const left =
			pointerEvent.clientX + tooltipWidth > window.innerWidth
				? pointerEvent.clientX - tooltipWidth
				: pointerEvent.clientX;
		const top =
			pointerEvent.clientY + tooltipHeight > window.innerHeight
				? pointerEvent.clientY - tooltipHeight
				: pointerEvent.clientY;

		setDayTooltip({
			date,
			events: getEventsForDay(date),
			position: {
				top: Math.max(8, top),
				left: Math.max(8, left),
			},
		});
	};

	const hideDayTooltip = () => {
		clearTimeout(showTooltipTimer.current);
		setDayTooltip(null);
	};

	const openDayEvents = (date) => {
		hideDayTooltip();
		setDayEvents(date);
	};

	const closeDayEvents = () => {
		setDayEvents(null);
	};

	const openEventModal = (event = null) => {
		setEditingEvent(event);
		setEventTitle(event?.title ?? "");
		setEventColor(event?.backgroundColor ?? "#0d6efd");
		setErrors({});
		setEventModal(true);
	};

	const closeEventModal = () => {
		setEventModal(false);
		setEditingEvent(null);
		setEventTitle("");
		setEventColor("#0d6efd");
		setErrors({});
	};

	const openPlanModal = (Plan = null) => {
		setDayTooltip(null);
		setEditingEvent(Plan);
		setPlanTitle(Plan?.title ?? "");
		setPlanStart(Plan?.start ?? toDateKey(new Date()));
		setPlanEnd(Plan?.end ?? toDateKey(new Date()));
		setPlanColor(Plan?.backgroundColor ?? "#0d6efd");
		setErrors({});
		setPlanModal(true);
	};

	const closePlanModal = () => {
		setPlanModal(false);
		setEditingEvent(null);
		setPlanTitle("");
		setErrors({});
	};

	const validatePlanForm = () => {
		const newErrors = {};
		if (!planTitle.trim()) {
			newErrors.planTitle = "Plan title is required";
		}
		if (planEnd < planStart) {
			newErrors.planDates = "End date must be on or after start date";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateEventForm = () => {
		const newErrors = {};
		if (!eventTitle.trim()) {
			newErrors.eventTitle = "Event title is required";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const addPlan = (event) => {
		event.preventDefault();
		if (!validatePlanForm()) return;

		const endDate = new Date(`${planEnd}T00:00:00`);
		endDate.setDate(endDate.getDate() + 1);
		const newPlan = {
			title: planTitle.trim(),
			start: planStart,
			end: toDateKey(endDate),
			allDay: true,
			backgroundColor: planColor,
			borderColor: planColor,
		};
		if (editingEvent) {
			updateEventMutation.mutate(
				{ eventId: editingEvent.id, eventData: newPlan },
				{ onSuccess: () => closePlanModal() },
			);
			return;
		}
		createEventMutation.mutate(newPlan, {
			onSuccess: () => closePlanModal(),
			onError: (error) => {
				addError(error);
				closePlanModal();
			},
		});
	};

	const addEvent = (event) => {
		event.preventDefault();
		if (!validateEventForm()) return;

		const newEvent = {
			title: eventTitle.trim(),
			start: dayEvents,
			allDay: true,
			backgroundColor: eventColor,
			borderColor: eventColor,
		};
		if (editingEvent) {
			updateEventMutation.mutate(
				{ eventId: editingEvent.id, eventData: newEvent },
				{ onSuccess: () => closeEventModal() },
			);
			return;
		}
		createEventMutation.mutate(newEvent, {
			onSuccess: () => closeEventModal(),
		});
	};

	const deleteEvent = (eventId) => {
		deleteEventMutation.mutate(eventId);
	};

	const handleDateClick = ({ dateStr }) => {
		openDayEvents(dateStr);
	};

	const changeMonth = (event) => {
		const value = event.target.value;
		setSelectedMonth(value);
		calendarRef.current?.getApi().gotoDate(`${value}-01`);
	};

	const handleDatesSet = ({ view }) => {
		setSelectedMonth(toMonthValue(view.currentStart));
	};

	useEffect(() => {
		addError(eventsError);
	}, [eventsError]);

	return (
		<section className="d-flex flex-column h-100">
			<header className="d-flex justify-content-between align-items-center flex-shrink-0 mb-3">
				<div>
					<h3 className="mb-0">Calendar</h3>
				</div>
				<div className="d-flex align-items-center gap-2">
					<div className="d-flex gap-1" role="group">
						<div
							className="alert alert-light p-1 m-0"
							onClick={() => calendarRef.current?.getApi().prev()}
						>
							<Arrow deg={90} />
						</div>
						<div
							className="alert alert-light p-1 m-0"
							onClick={() => calendarRef.current?.getApi().next()}
						>
							<Arrow deg={-90} />
						</div>
						<div
							type="button"
							onClick={() =>
								calendarRef.current?.getApi().today()
							}
							className="btn alert alert-light p-1 m-0"
						>
							Today
						</div>
						<div
							type="button"
							className="btn alert alert-light p-1 m-0"
							onClick={openPlanModal}
						>
							Make a Plan
						</div>
					</div>
					<div className="alert alert-light p-1 m-0">
						<input
							type="month"
							style={{
								border: "none",
								background: "transparent",
							}}
							value={selectedMonth}
							onChange={changeMonth}
						/>
					</div>
				</div>
			</header>

			{!dayEvents && (
				<div className="flex-grow-1" style={{ minHeight: 0 }}>
					<FullCalendar
						ref={calendarRef}
						plugins={[dayGridPlugin, interactionPlugin]}
						fixedWeekCount={false}
						initialView="dayGridMonth"
						headerToolbar={{
							left: "",
							right: "",
						}}
						events={events}
						height="100%"
						navLinks={false}
						dateClick={handleDateClick}
						dayCellDidMount={({ date, el }) => {
							const showTooltip = (event) => {
								hideDayTooltip();
								showTooltipTimer.current = setTimeout(() => {
									showDayTooltip(date, event);
								}, 500);
							};

							el.addEventListener("mousemove", showTooltip);
							el.addEventListener("mouseleave", hideDayTooltip);
						}}
						datesSet={handleDatesSet}
					/>
				</div>
			)}

			{dayTooltip && (
				<div
					className="calendar-day-tooltip"
					style={dayTooltip.position}
					onMouseLeave={hideDayTooltip}
				>
					<div className="fw-semibold mb-2">
						{formatDay(dayTooltip.date)}
					</div>
					{dayTooltip.events?.length > 0 ? (
						<ul className="list-unstyled mb-3">
							{dayTooltip.events.map((event) => (
								<li
									key={`${event.title}-${event.start}`}
									className="mb-1"
								>
									{event.title}
								</li>
							))}
						</ul>
					) : (
						<p className="text-secondary mb-3">No events</p>
					)}
				</div>
			)}

			{dayEvents && (
				<div className="calendar-day-events flex-grow-1">
					<div className="d-flex justify-content-between align-items-center mb-3">
						<div>
							<h4 className="mb-1">{dayEvents}</h4>
							<p className="text-secondary mb-0">
								Events for this day
							</p>
						</div>
						<div className="d-flex gap-2">
							<div
								className="btn alert alert-light m-0 p-2"
								onClick={() => openEventModal()}
							>
								Add event
							</div>
							<div
								className="btn alert alert-light m-0 p-2"
								onClick={closeDayEvents}
							>
								Back to calendar
							</div>
						</div>
					</div>
					<div className="list-group">
						{getEventsForDay(dayEvents)?.length > 0 ? (
							getEventsForDay(dayEvents).map((calendarEvent) => (
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
											onClick={() =>
												calendarEvent.end === null
													? openEventModal(
															calendarEvent,
														)
													: openPlanModal(
															calendarEvent,
														)
											}
										>
											Edit
										</button>
										<button
											type="button"
											className="btn btn-sm btn-outline-danger"
											onClick={() =>
												deleteEvent(calendarEvent.id)
											}
											disabled={
												deleteEventMutation.isPending
											}
										>
											{deleteEventMutation.isPending
												? "Deleting..."
												: "Delete"}
										</button>
									</div>
								</div>
							))
						) : (
							<div className="list-group-item text-secondary">
								No events scheduled for this day.
							</div>
						)}
					</div>
				</div>
			)}

			{eventModal && (
				<div
					className="modal show d-block bg-light bg-opacity-50"
					role="dialog"
					aria-modal="true"
					onMouseDown={(event) => {
						if (event.target === event.currentTarget)
							closeEventModal();
					}}
				>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<form onSubmit={addEvent}>
								<div className="modal-header">
									<h5 className="modal-title">
										{editingEvent
											? "Edit event"
											: "Add event"}
									</h5>
									<button
										type="button"
										className="btn-close"
										aria-label="Close"
										onClick={closeEventModal}
									/>
								</div>
								<div className="modal-body">
									<div className="mb-3">
										<label
											htmlFor="event-title"
											className="form-label"
										>
											Event title
										</label>
										<input
											id="event-title"
											type="text"
											className="form-control"
											value={eventTitle}
											onChange={(inputEvent) => {
												setEventTitle(
													inputEvent.target.value,
												);
												setErrors((prev) => ({
													...prev,
													eventTitle: "",
												}));
											}}
											autoFocus
										/>
										{errors.eventTitle && (
											<p className="text-danger mt-1 mb-0">
												{errors.eventTitle}
											</p>
										)}
									</div>
									<label
										htmlFor="event-color"
										className="form-label"
									>
										Event color
									</label>
									<input
										id="event-color"
										type="color"
										className="form-control form-control-color"
										value={eventColor}
										onChange={(inputEvent) =>
											setEventColor(
												inputEvent.target.value,
											)
										}
										title="Choose event color"
									/>
								</div>
								<div className="modal-footer">
									<button
										type="button"
										className="btn btn-secondary"
										onClick={closeEventModal}
									>
										Cancel
									</button>
									<button
										type="submit"
										className="btn btn-primary"
									>
										{editingEvent
											? "Save changes"
											: "Add event"}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}

			{planModal && (
				<div
					className="modal show d-block bg-light bg-opacity-50"
					role="dialog"
					aria-modal="true"
					onMouseDown={(event) => {
						if (event.target === event.currentTarget)
							closePlanModal();
					}}
				>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<form onSubmit={addPlan}>
								<div className="modal-header">
									<h5 className="modal-title">Make a plan</h5>
									<button
										type="button"
										className="btn-close"
										aria-label="Close"
										onClick={closePlanModal}
									/>
								</div>
								<div className="modal-body">
									<div className="mb-3">
										<label
											htmlFor="plan-title"
											className="form-label"
										>
											Plan title
										</label>
										<input
											id="plan-title"
											type="text"
											className="form-control"
											value={planTitle}
											onChange={(event) => {
												setPlanTitle(
													event.target.value,
												);
												setErrors((prev) => ({
													...prev,
													planTitle: "",
												}));
											}}
											autoFocus
										/>
										{errors.planTitle && (
											<p className="text-danger mt-1 mb-0">
												{errors.planTitle}
											</p>
										)}
									</div>
									<div className="row g-3">
										<div className="col">
											<label
												htmlFor="plan-start"
												className="form-label"
											>
												Start date
											</label>
											<input
												id="plan-start"
												type="date"
												className="form-control"
												value={planStart}
												onChange={(event) => {
													setPlanStart(
														event.target.value,
													);
													setErrors((prev) => ({
														...prev,
														planDates: "",
													}));
												}}
											/>
										</div>
										<div className="col">
											<label
												htmlFor="plan-end"
												className="form-label"
											>
												End date
											</label>
											<input
												id="plan-end"
												type="date"
												className="form-control"
												value={planEnd}
												onChange={(event) => {
													setPlanEnd(
														event.target.value,
													);
													setErrors((prev) => ({
														...prev,
														planDates: "",
													}));
												}}
											/>
										</div>
									</div>
									{errors.planDates && (
										<p className="text-danger mt-1 mb-0">
											{errors.planDates}
										</p>
									)}
									<label
										htmlFor="plan-color"
										className="form-label"
									>
										Plan color
									</label>
									<input
										id="plan-color"
										type="color"
										className="form-control form-control-color"
										value={planColor}
										onChange={(event) =>
											setPlanColor(event.target.value)
										}
										title="Choose plan color"
									/>
								</div>
								<div className="modal-footer">
									<button
										type="button"
										className="btn btn-secondary"
										onClick={closePlanModal}
									>
										Cancel
									</button>
									<button
										type="submit"
										className="btn btn-primary"
									>
										{editingEvent
											? updateEventMutation.isPending
												? "saving..."
												: "Save plan"
											: createEventMutation.isPending
												? "creating..."
												: "Create plan"}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}

export default Calendar;
