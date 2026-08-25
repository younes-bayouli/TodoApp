import { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./Calendar.css";

function toMonthValue(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function Calendar() {
	const calendarRef = useRef(null);
	const [selectedMonth, setSelectedMonth] = useState(toMonthValue(new Date()));

	const changeMonth = (event) => {
		const value = event.target.value;
		setSelectedMonth(value);
		calendarRef.current?.getApi().gotoDate(`${value}-01`);
	};

	const handleDatesSet = ({ view }) => {
		setSelectedMonth(toMonthValue(view.currentStart));
	};

	return (
		<section className="calendar-page">
			<header className="calendar-header">
				<div>
					<p className="calendar-eyebrow">Planning</p>
					<h1>Calendar</h1>
					<p className="calendar-description">
						Keep birthdays, deadlines, and daily tasks in one place.
					</p>
				</div>
				<label className="month-picker">
					<span>Choose month</span>
					<input
						type="month"
						value={selectedMonth}
						onChange={changeMonth}
					/>
				</label>
			</header>

			<div className="calendar-shell">
				<FullCalendar
					ref={calendarRef}
					plugins={[dayGridPlugin]}
					initialView="dayGridMonth"
					headerToolbar={{
						left: "prev,next today",
						center: "title",
						right: "",
					}}
					events={[]}
					height="auto"
					navLinks={true}
					datesSet={handleDatesSet}
				/>
			</div>
		</section>
	);
}

export default Calendar;