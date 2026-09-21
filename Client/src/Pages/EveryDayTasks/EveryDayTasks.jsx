import Arrow from "../../Components/Arrow";
import { useEffect, useRef, useState } from "react";
import Schedule from "./Schedule.jsx";
import TimeCard from "../../Components/Cards/TimeCard.jsx";
import { useDate } from "../../Utils/useTime";
import {
	format,
	minutesToString,
	stringToMinutes,
	timeDifferenceInMinutes,
} from "../../Utils/timeUtilities";
import { getCurrentAndNextTask } from "../../Utils/Utils";
import TaskStatusCard from "../../Components/Cards/TaskStatusCard.jsx";
import { DAYS } from "../../Utils/dateUtilities";
import useData from "../../Utils/useData.js";
import { useAppContext } from "../../Context.jsx";

const nullTask = {
	title: "",
	start: "00:00",
	end: "00:30",
	days: [false, false, false, false, false, false, false],
	details: "",
};

function Myeveryday() {
	const { data: Tasks, update } = useData("tasks");
	const { openModal, configModal, object } = useAppContext();
	const Date = useDate();
	const scheduleControlsRef = useRef(null);
	const currentDayIndex = (Date.getDay() + 6) % 7;
	const [chosenDay, setChosenDay] = useState(() => currentDayIndex);
	const visibleTasks = Tasks?.filter((task) => task.days[chosenDay]);
	const currentTime = format(Date).hour24;
	const { current, next } = getCurrentAndNextTask(
		currentTime,
		visibleTasks,
		chosenDay,
	);

	useEffect(() => {
		configModal({
			modaldata: Tasks,
		});
	}, []);

	return (
		<>
			<div className="d-flex flex-column h-100 gap-5">
				<div className="d-flex align-items-center justify-content-between">
					<h3 className="mb-0">My Every Day</h3>
					<div>
						<div className="d-flex align-items-center gap-2">
							<div
								className="d-flex gap-1"
								role="group"
								aria-label="Day navigation"
							>
								<div className="btn alert alert-light d-flex align-items-center justify-content-center p-1 m-0">
									For{" "}
									{chosenDay === currentDayIndex && "Today ("}
									{DAYS[chosenDay]}
									{chosenDay === currentDayIndex && ")"}
								</div>
								<div
									className="btn alert alert-light d-flex align-items-center justify-content-center p-1 m-0"
									aria-label="Previous day"
									onClick={() =>
										setChosenDay(
											(day) =>
												(day - 1 + DAYS.length) %
												DAYS.length,
										)
									}
								>
									<Arrow deg={90} />
								</div>
								<div
									className="btn alert alert-light d-flex align-items-center justify-content-center p-1 m-0"
									aria-label="Next day"
									onClick={() =>
										setChosenDay(
											(day) => (day + 1) % DAYS.length,
										)
									}
								>
									<Arrow deg={-90} />
								</div>
							</div>
							<div
								className="btn alert alert-light p-1 m-0"
								onClick={() => {
									const newTask = {
										...nullTask,
										days: nullTask.days.map(
											(_, index) =>
												index === currentDayIndex,
										),
										start: current
											? current.end
											: currentTime,
										end: next
											? next.start
											: minutesToString(
													stringToMinutes(
														current
															? current.end
															: currentTime,
													) + 60,
												),
									};
									configModal({
										modalObject: newTask,
										onSubmit: update,
									});
									openModal();
								}}
							>
								Add Task
							</div>
						</div>
					</div>
				</div>
				<div className="flex-grow-1 d-flex flex-column gap-5">
					<Schedule
						chosenDay={chosenDay}
						time={Date}
						Tasks={visibleTasks}
						controlsTargetRef={scheduleControlsRef}
					></Schedule>
					<div className="d-flex flex-fill gap-4 align-items-stretch">
						<div className="flex-fill">
							<TimeCard date={Date}></TimeCard>
						</div>
						<div className="flex-fill">
							<TaskStatusCard
								currentTask={current}
								nextTask={next}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Myeveryday;
