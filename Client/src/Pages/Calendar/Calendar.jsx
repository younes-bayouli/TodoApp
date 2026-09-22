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
import useData from "../../Utils/useData.js";
import useModal from "../../hooks/useModal.jsx";
import DayEvents from "./DayEvents.jsx";

const nullPlan = {
	title: "",
	start: "",
	end: "",
	backgroundColor: "#bd4b4b",
};

const nullEvent = {
	title: "",
	backgroundColor: "#bd4b4b",
};

const eventFields = {
	title: {
		type: "text",
		label: "title",
		placeholder: "Enter event title",
		size: "full",
	},

	backgroundColor: {
		type: "color",
		label: "color",
		size: "small",
	},
};

const planFields = {
	title: {
		type: "text",
		label: "title",
		placeholder: "Enter plan title",
		size: "full",
	},

	start: {
		type: "date",
		label: "Start date",
		size: "half",
	},

	end: {
		type: "date",
		label: "End date",
		size: "half",
	},

	backgroundColor: {
		type: "color",
		label: "color",
		size: "small",
	},
};

const validatePlanForm = (plan) => {
	const newErrors = {};
	return newErrors;
};

const validateEventForm = (event) => {
	const newErrors = {};
	if (!event.title.trim()) {
		newErrors.title = "Event title is required";
	}
	return newErrors;
};

function Calendar() {
	const calendarRef = useRef(null);
	const showTooltipTimer = useRef(null);
	const [dayTooltip, setDayTooltip] = useState(null);
	const [dayEvents, setDayEvents] = useState(null);
	const [selectedMonth, setSelectedMonth] = useState(toMonthValue(useDate()));
	const [selectedDay, setSelectedDay] = useState("");
	const {
		data: events,
		create: createEventMutation,
		update: updateEventMutation,
		remove: deleteEventMutation,
	} = useData("events");

	const planModal = useModal({
		name: "Plan",
		modalFields: planFields,
		validate: validatePlanForm,
	});

	const eventModal = useModal({
		name: "Event",
		modalFields: eventFields,
		validate: validateEventForm,
	});

	const getEventsForDay = (date) => {
		const dateKey =
			date instanceof Date ? toDateKey(date) : toDateKeyFromString(date);
		return events?.filter(
			(event) =>
				event.start.slice(0, 10) === dateKey &&
				event.end === event.start,
		);
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
		setSelectedDay(date);
		setDayEvents(getEventsForDay(date));
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
		if (dayEvents) {
			setDayEvents(getEventsForDay(selectedDay));
		}
	}, [events]);

	if (dayEvents) {
		return (
			<>
				<DayEvents
					day={selectedDay}
					addEvent={() =>
						eventModal.openModal({
							object: {
								...nullEvent,
								start: selectedDay,
								end: selectedDay,
							},
							mutation: createEventMutation,
						})
					}
					editEvent={(event) =>
						eventModal.openModal({
							object: event,
							mutation: updateEventMutation,
						})
					}
					onBack={() => setDayEvents(null)}
					events={dayEvents}
					deleteEventMutation={deleteEventMutation}
				/>
				{eventModal.Modal}{" "}
			</>
		);
	}

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
							onClick={() =>
								planModal.openModal({
									object: { ...nullPlan },
									mutation: createEventMutation,
								})
							}
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
			{planModal.Modal}
		</section>
	);
}

export default Calendar;
