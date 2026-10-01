import Arrow from "../../Components/Basic/Arrow";
import PageHeader from "../../Components/Composite/PageHeader";
import { useEffect, useRef, useState } from "react";
import Schedule from "./Schedule.jsx";
import TimeCard from "../../Components/Cards/TimeCard.jsx";
import { useDate } from "../../Utils/useTime";
import {
	compareTime,
	format,
	minutesToString,
	stringToMinutes,
	timeDifferenceInMinutes,
} from "../../Utils/timeUtilities";
import { checkOverlap, getCurrentAndNextTask } from "../../Utils/Utils";
import TaskStatusCard from "../../Components/Cards/TaskStatusCard.jsx";
import { DAYS, dateToString } from "../../Utils/dateUtilities";
import useData from "../../Utils/useData.js";
import useModal from "../../hooks/useModal.jsx";
import { usePosition } from "../../hooks/usePosition";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";
import { useAppContext } from "../../Context";
import Button from "../../Components/Basic/Button.jsx";
import { CalendarDays } from "lucide-react";
import WeekView from "./WeekView.jsx";

const validateForm = (Task) => {
	const newErrors = {};
	if (!Task.title.trim()) {
		newErrors.title = "Task title is required";
	} else if (compareTime(Task.start, Task.end) >= 0) {
		newErrors.end = "End time must be after start time";
	} else if (Task.days.every((day) => !day)) {
		newErrors.days = "At least one day must be selected";
	}
	return newErrors;
};

const taskFields = {
	title: {
		type: "text",
		label: "Title",
		placeholder: "Enter task title",
		size: "full",
	},

	details: {
		type: "textarea",
		label: "Details",
		placeholder: "Enter task details...",
		size: "full",
	},

	start: {
		type: "duelClock",
		label: "Start",
		size: "full",
		with: "end",
	},

	end: {
		type: "duelClock",
		label: "End",
		size: "full",
		with: "start",
	},

	days: {
		type: "days",
		size: "full",
	},
};

const nullTask = {
	title: "",
	start: "00:00",
	end: "00:30",
	days: [false, false, false, false, false, false, false],
	details: "",
};

const checkForOverLapping = (Task, TasksList) => {
	const ov = checkOverlap(Task, TasksList);
	return ov.mesg;
};

function Myeveryday() {
	const { addError, settings } = useAppContext();
	const { data: Tasks, update, remove, create } = useData("tasks");
	const Date = useDate();
	const dateString = dateToString(Date);
	const [position, positionError] = usePosition();
	const { data: prayers, error: prayersError } = useQuery({
		queryKey: ["prayers", position, dateString],
		queryFn: () =>
			api.prayerTimes.get(
				position?.latitude,
				position?.longitude,
				dateString,
			),
		enabled: !!position?.latitude && !!position?.longitude,
	});
	const currentDayIndex = (Date.getDay() + 6) % 7;
	const [chosenDay, setChosenDay] = useState(() => currentDayIndex);
	const [showWeekView, setShowWeekView] = useState(false);
	const visibleTasks = Tasks?.filter((task) => task.days[chosenDay]);
	const currentTime = format(Date).hour24;
	const { current, next } = getCurrentAndNextTask(currentTime, visibleTasks);
	const { Modal, openModal } = useModal({
		name: "Task",
		modalFields: taskFields,
		validate: validateForm,
		onChange: (Task) => checkForOverLapping(Task, visibleTasks),
	});

	useEffect(() => {
		if (positionError) addError(positionError);
		if (prayersError) addError(prayersError);
	}, [addError, positionError, prayersError]);

	const addTask = (time) => {
		const plusOneHour = minutesToString(stringToMinutes(time) + 60);
		const timeToNext = next
			? timeDifferenceInMinutes(next.start, time)
			: Infinity;
		const newTask = {
			...nullTask,
			days: nullTask.days.map((_, index) => index === currentDayIndex),
			start: time,
			end: 0 <= timeToNext && timeToNext <= 60 ? next.start : plusOneHour,
		};
		openModal({ object: newTask, mutation: create });
	};

	return (
		<>
			<PageHeader title="My Every Day">
				{!showWeekView && (
					<div
						className="d-flex align-items-center gap-2"
						role="group"
						aria-label="Day navigation"
					>
						<Button
							className="p-1"
							variant="secondary"
							onClick={() => setChosenDay(currentDayIndex)}
						>
							For {chosenDay === currentDayIndex && "Today ("}
							{DAYS[chosenDay]}
							{chosenDay === currentDayIndex && ")"}
						</Button>
						<Button
							aria-label="Previous day"
							onClick={() =>
								setChosenDay(
									(day) =>
										(day - 1 + DAYS.length) % DAYS.length,
								)
							}
							variant="secondary"
							className="p-1"
						>
							<Arrow deg={90} />
						</Button>
						<Button
							aria-label="Next day"
							onClick={() =>
								setChosenDay((day) => (day + 1) % DAYS.length)
							}
							variant="secondary"
							className="p-1"
						>
							<Arrow deg={-90} />
						</Button>
					</div>
				)}
				<Button
					variant="secondary"
					className="p-1"
					icon={<CalendarDays size={16} />}
					aria-pressed={showWeekView}
					onClick={() => setShowWeekView((isShowing) => !isShowing)}
				>
					{showWeekView ? "Day view" : "Week view"}
				</Button>
				<Button
					onClick={() => {
						addTask(current ? current.end : currentTime);
					}}
					variant="secondary"
					className="p-1"
				>
					Add Task
				</Button>
			</PageHeader>
			{showWeekView ? (
				<WeekView
					tasks={Tasks ?? []}
					todayIndex={currentDayIndex}
					onTaskClick={(task) =>
						openModal({ object: task, mutation: update })
					}
				/>
			) : (
				<div className="everyday-summary flex-grow-1 d-flex flex-column min-h-0 gap-3">
					<div className="position-relative flex-grow-1">
						<Schedule
							time={Date}
							handleClickOnTask={(task) =>
								openModal({ object: task, mutation: update })
							}
							Tasks={visibleTasks}
							onDeleteTask={remove.mutate}
							onClick={addTask}
							prayers={prayers?.data.timings}
							settings={settings}
						></Schedule>
					</div>
					<div className="d-flex gap-2 min-h-0">
						<TimeCard date={Date} className="flex-fill" />
						<TaskStatusCard
							currentTask={current}
							nextTask={next}
							split
							className="flex-grow-1"
						/>
					</div>
				</div>
			)}
			{Modal}
		</>
	);
}

export default Myeveryday;
