import Arrow from "../../Components/Arrow";
import { useRef, useCallback, useState, useEffect } from "react";
import "./style.css";
import {
	format,
	timeToMinutes,
	minutesToTime,
	stringToMinutes,
	compareTime,
} from "../../Utils/timeUtilities";
import { checkOverlap, getCurrentAndNextTask } from "../../Utils/Utils.js";
import { useMouseDistance } from "../../Utils/useMouseDistance";
import Task from "./Task";
import { DAYS } from "../../Utils/dateUtilities";
import TimeInputClock from "../../Components/TimeInputClock.jsx";
import StaticTimeBars from "../../Components/StaticTimeBars.jsx";
import TimeBar from "../../Components/TimeBar.jsx";
import useData from "../../Utils/useData.js";
import { useAppContext } from "../../Context.jsx";

const nullTask = {
	title: "",
	start: "00:00",
	end: "00:00",
	days: [false, false, false, false, false, false, false],
	details: "",
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
		type: "time",
		label: "Start",
		size: "half",
	},

	end: {
		type: "time",
		label: "End",
		size: "half",
	},

	days: {
		type: "days",
		label: "Days",
		size: "full",
	},
};

function Schedule({
	time,
	Tasks = [],
	chosenDay,
	isModalOpen,
	setIsModalOpen,
}) {
	const [Hovered, setHovered] = useState(false);
	const scrollRef = useRef(null);
	const distanceMouseLeftedge = useMouseDistance(scrollRef);
	const { openModal, configModal } = useAppContext();
	const {
		create: addTaskMutation,
		update: updateTaskMutation,
		remove: deleteTaskMutation,
	} = useData("tasks");

	const checkForOverLapping = (newTask) => {
		return checkOverlap(newTask, Tasks);
	};

	const scroll = (direction) => {
		const amount = 500;

		if (!scrollRef.current) return;

		scrollRef.current.scrollBy({
			left: direction * amount,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		configModal({
			modalName: "task",
			modalObject: nullTask,
			config: taskFields,
			validate: validateForm,
			onSubmit: addTaskMutation,
			onMount: checkForOverLapping,
		});
		scrollRef.current.scrollLeft = (timeToMinutes(time) * 10) / 6 - 300;
	}, []);

	const handleClickOnTask = (task) => {
		configModal({ modalObject: task, onSubmit: updateTaskMutation });
		openModal();
	};

	const validateForm = () => {
		const newErrors = {};
		if (!activeTask.title.trim()) {
			newErrors.title = "Task title is required";
		} else if (compareTime(activeTask.start, activeTask.end) >= 0) {
			newErrors.end = "End time must be after start time";
		} else if (activeTask.days.every((day) => !day)) {
			newErrors.days = "At least one day must be selected";
		}
		return newErrors;
	};

	return (
		<>
			<div className="container w-100 h-100 p-0 d-flex flex-column overflow-hidden">
				<div className="d-flex flex-grow-1 align-items-center overflow-hidden">
					<Arrow
						deg={90}
						style={{ width: "5%", height: "10%" }}
						onClick={useCallback(() => scroll(-1), [])}
					></Arrow>
					<div
						className="d-flex h-100 scroller"
						style={{ paddingLeft: 20, position: "relative" }}
						ref={scrollRef}
						onMouseEnter={() => setHovered(true)}
						onMouseLeave={() => setHovered(false)}
					>
						<div
							className="h-100 w-100 position-absolute"
							style={{
								zIndex: 3,
								marginLeft: scrollRef.current?.scrollLeft - 20,
							}}
							onClick={() => {
								let min = Math.ceil(
									((distanceMouseLeftedge -
										20 +
										scrollRef.current.scrollLeft) *
										6) /
										10,
								);
								let nextTask = getCurrentAndNextTask(
									format(minutesToTime(min)).hour24,
									Tasks,
									chosenDay,
								).next;
								let end = min;
								if (
									nextTask &&
									stringToMinutes(nextTask.start) < min + 30
								) {
									end = stringToMinutes(nextTask.start) - 30;
								}
								const newTask = {
									...nullTask,
									start: format(minutesToTime(min)).hour24,
									end: format(minutesToTime(end + 30)).hour24,
								};
								setActiveTask(newTask);
								configModal({
									modalObject: newTask,
									onSubmit: addTaskMutation,
								});
							}}
						></div>
						<StaticTimeBars />
						<TimeBar
							LeftMargin={(timeToMinutes(time) * 10) / 6}
							headStyle={"shadow alert alert-danger p-0 m-0"}
							barStyle={
								"shadow alert alert-danger bg-danger border-0 p-0 m-0"
							}
							time={format(time).hour24}
						></TimeBar>
						{Hovered && (
							<TimeBar
								LeftMargin={Math.ceil(
									distanceMouseLeftedge -
										20 +
										scrollRef.current.scrollLeft,
								)}
								headStyle={
									"alert alert-secondary text-secondary border-0 bg-white text-opacity-25 p-0 m-0"
								}
								barStyle={"border-1 border-light p-0 m-0"}
								borderStyle={"dashed"}
								time={
									format(
										minutesToTime(
											Math.ceil(
												((distanceMouseLeftedge -
													20 +
													scrollRef.current
														.scrollLeft) *
													6) /
													10,
											),
										),
									).hour24
								}
							></TimeBar>
						)}
						<div className="h-100 w-100 position-absolute d-flex align-items-center">
							{Tasks.map((task) => (
								<Task
									task={task}
									onClick={handleClickOnTask}
									onDelete={(selectedTask) =>
										deleteTaskMutation.mutate(
											selectedTask.id,
										)
									}
									style={{ zIndex: 4 }}
								></Task>
							))}
						</div>
					</div>
					<Arrow
						deg={-90}
						style={{ width: "5%", height: "10%" }}
						onClick={useCallback(() => scroll(1), [])}
					></Arrow>
				</div>
			</div>
		</>
	);
}

export default Schedule;
