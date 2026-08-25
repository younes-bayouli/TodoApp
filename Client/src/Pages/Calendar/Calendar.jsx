import { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Arrow from "../../Components/Arrow.jsx";
import "./Calendar.css";
import {
	toMonthValue,
	formatDay,
	toDateKey,
} from "../../Utils/dateUtilities.js";
import fakeEvents from "../../fakeData/fakeEvents.json";
import { useDate } from "../../Utils/useTime.js";

function Calendar() {
	const calendarRef = useRef(null);
	const hideTooltipTimer = useRef(null);
	const [events, setEvents] = useState(fakeEvents);
	const [eventsRef] = useState({ current: fakeEvents });
	const [dayTooltip, setDayTooltip] = useState(null);
	const [eventModal, setEventModal] = useState(null);
	const [eventTitle, setEventTitle] = useState("");
	const [planModal, setPlanModal] = useState(false);
	const [planTitle, setPlanTitle] = useState("");
	const [planStart, setPlanStart] = useState(toDateKey(new Date()));
	const [planEnd, setPlanEnd] = useState(toDateKey(new Date()));
	const [planColor, setPlanColor] = useState("#0d6efd");
	const [selectedMonth, setSelectedMonth] = useState(toMonthValue(useDate()));

	const getEventsForDay = (date) => {
		const dateKey = toDateKey(date);
		return eventsRef.current.filter(
			(event) => event.start.slice(0, 10) === dateKey,
		);
	};

	const showDayTooltip = (date, pointerEvent) => {
		clearTimeout(hideTooltipTimer.current);
		const tooltipWidth = 250;
		const tooltipHeight = 100;
		const gap = 14;
		const left =
			pointerEvent.clientX + gap + tooltipWidth > window.innerWidth
				? pointerEvent.clientX - tooltipWidth - gap
				: pointerEvent.clientX + gap;
		const top =
			pointerEvent.clientY + gap + tooltipHeight > window.innerHeight
				? pointerEvent.clientY - tooltipHeight - gap
				: pointerEvent.clientY + gap;

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
		hideTooltipTimer.current = setTimeout(() => setDayTooltip(null), 150);
	};

	const openEventModal = (date) => {
		setDayTooltip(null);
		setEventTitle("");
		setEventModal(date);
	};

	const closeEventModal = () => {
		setEventModal(null);
		setEventTitle("");
	};

	const openPlanModal = () => {
		setDayTooltip(null);
		setPlanTitle("");
		setPlanStart(toDateKey(new Date()));
		setPlanEnd(toDateKey(new Date()));
		setPlanColor("#0d6efd");
		setPlanModal(true);
	};

	const closePlanModal = () => {
		setPlanModal(false);
		setPlanTitle("");
	};

	const addPlan = (event) => {
		event.preventDefault();
		if (!planTitle.trim() || planEnd < planStart) return;

		const endDate = new Date(`${planEnd}T00:00:00`);
		endDate.setDate(endDate.getDate() + 1);
		const newPlan = {
			id: `plan-${Date.now()}`,
			title: planTitle.trim(),
			start: planStart,
			end: toDateKey(endDate),
			allDay: true,
			backgroundColor: planColor,
			borderColor: planColor,
		};
		eventsRef.current = [...eventsRef.current, newPlan];
		setEvents((currentEvents) => [...currentEvents, newPlan]);
		closePlanModal();
	};

	const addEvent = (event) => {
		event.preventDefault();
		if (!eventTitle.trim() || !eventModal) return;

		const newEvent = {
			id: `event-${Date.now()}`,
			title: eventTitle.trim(),
			start: eventModal,
			allDay: true,
			backgroundColor: "#0d6efd",
			borderColor: "#0d6efd",
		};
		eventsRef.current = [...eventsRef.current, newEvent];
		setEvents((currentEvents) => [...currentEvents, newEvent]);
		closeEventModal();
	};

	const handleDateClick = ({ dateStr }) => openEventModal(dateStr);

	const changeMonth = (event) => {
		const value = event.target.value;
		setSelectedMonth(value);
		calendarRef.current?.getApi().gotoDate(`${value}-01`);
	};

	const handleDatesSet = ({ view }) => {
		setSelectedMonth(toMonthValue(view.currentStart));
	};

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

			<div className="flex-grow-1" style={{ minHeight: 0 }}>
				<FullCalendar
					ref={calendarRef}
					plugins={[dayGridPlugin, interactionPlugin]}
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
						const showTooltip = (event) =>
							showDayTooltip(date, event);
						el.addEventListener("mouseenter", showTooltip);
						el.addEventListener("mouseleave", hideDayTooltip);
					}}
					datesSet={handleDatesSet}
				/>
			</div>

			{dayTooltip && (
				<div
					className="calendar-day-tooltip"
					style={dayTooltip.position}
					onMouseEnter={() => clearTimeout(hideTooltipTimer.current)}
					onMouseLeave={hideDayTooltip}
				>
					<div className="fw-semibold mb-2">
						{formatDay(dayTooltip.date)}
					</div>
					{dayTooltip.events.length > 0 ? (
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
									<h5 className="modal-title">Add event</h5>
									<button
										type="button"
										className="btn-close"
										aria-label="Close"
										onClick={closeEventModal}
									/>
								</div>
								<div className="modal-body">
									<p className="text-secondary">
										{formatDay(
											new Date(`${eventModal}T00:00:00`),
										)}
									</p>
									<label
										htmlFor="calendar-event-title"
										className="form-label"
									>
										Event title
									</label>
									<input
										id="calendar-event-title"
										type="text"
										className="form-control"
										value={eventTitle}
										onChange={(event) =>
											setEventTitle(event.target.value)
										}
										autoFocus
										required
									/>
								</div>
								<div className="modal-footer">
									<button
										type="submit"
										className="btn btn-primary"
									>
										Save event
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
											onChange={(event) =>
												setPlanTitle(event.target.value)
											}
											autoFocus
											required
										/>
									</div>
									<div className="row g-3 mb-3">
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
												onChange={(event) =>
													setPlanStart(
														event.target.value,
													)
												}
												required
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
												min={planStart}
												onChange={(event) =>
													setPlanEnd(
														event.target.value,
													)
												}
												required
											/>
										</div>
									</div>
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
										Save plan
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
