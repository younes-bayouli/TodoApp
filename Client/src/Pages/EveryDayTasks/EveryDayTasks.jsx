import { useRef } from "react";
import Schedule from "./Schedule.jsx";
import TimeCard from "../../Components/Cards/TimeCard.jsx";
import { useDate } from "../../Utils/useTime";
import Tasks from "../../fakeData/fakeTasks";
import { format } from "../../Utils/timeUtilities";
import { getCurrentAndNextTask } from "../../Utils/Utils";
import TaskStatusCard from "../../Components/Cards/TaskStatusCard.jsx";

function Myeveryday() {
	const Date = useDate();
	const scheduleControlsRef = useRef(null);
	const currentTime = format(Date).hour24;
	const currentDayIndex = (Date.getDay() + 6) % 7;
	const { current, next } = getCurrentAndNextTask(
		currentTime,
		Tasks,
		currentDayIndex,
	);

	return (
		<>
			<div className="d-flex flex-column h-100">
				<div className="d-flex align-items-center justify-content-between">
					<h3 className="mb-0">My Every Day</h3>
					<div ref={scheduleControlsRef}></div>
				</div>
				<div className="flex-grow-1 d-flex flex-column gap-5 pt-4">
					<Schedule
						time={Date}
						Tasks={Tasks}
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
