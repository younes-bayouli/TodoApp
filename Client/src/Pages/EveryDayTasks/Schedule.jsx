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
import TimeInputClock from "./TimeInputClock.jsx";
import StaticTimeBars from "../../Components/StaticTimeBars.jsx";
import TimeBar from "../../Components/TimeBar.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api.js";
import useData from "../../Utils/useData.js";

const nullTask = {
	title: "",
	start: "00:00",
	end: "00:00",
	days: [false, false, false, false, false, false, false],
	details: "",
};

function Schedule({
	time,
	Tasks = [],
	chosenDay,
	isModalOpen,
	setIsModalOpen,
}) {
	const [editMode, setEditMode] = useState(false);
	const [activeTask, setActiveTask] = useState(nullTask);
	const [Hovered, setHovered] = useState(false);
	const [overlap, setOverlap] = useState({ check: false, mesg: "" });
	const [errors, setErrors] = useState({});
	const scrollRef = useRef(null);
	const distanceMouseLeftedge = useMouseDistance(scrollRef);
	const {
		create: addTaskMutation,
		update: updateTaskMutation,
		remove: deleteTaskMutation,
	} = useData("tasks");

	const scroll = (direction) => {
		const amount = 500;

		if (!scrollRef.current) return;

		scrollRef.current.scrollBy({
			left: direction * amount,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		scrollRef.current.scrollLeft = (timeToMinutes(time) * 10) / 6 - 300;
	}, []);

	const handleClickOnTask = (task) => {
		setActiveTask(task);
		setEditMode(true);
		setIsModalOpen(true);
	};

	const save = () => {
		if (!validateForm()) return;

		if (editMode) {
			setEditMode(false);
			updateTaskMutation.mutate(activeTask);
		} else {
			addTaskMutation.mutate(activeTask);
		}
		setIsModalOpen(false);
		setActiveTask(nullTask);
		setErrors({});
	};

	const updateTask = (e) => {
		const { name, value, checked } = e.target;

		if (name === "title") {
			setErrors((prev) => ({ ...prev, taskTitle: "" }));
		}

		if (name === "start" || name === "end") {
			setErrors((prev) => ({ ...prev, taskTime: "" }));
		}

		if (name === "allDays" || name === "days") {
			setErrors((prev) => ({ ...prev, taskDays: "" }));
		}

		if (name === "allDays") {
			setActiveTask((prevTask) => ({
				...prevTask,
				days: DAYS.map(() => checked),
			}));
			return;
		}

		name === "days"
			? setActiveTask((oldVersion) => {
					const newDays = [...oldVersion.days];
					newDays[value] = !newDays[value];

					return {
						...oldVersion,
						days: newDays,
					};
				})
			: setActiveTask((prevTask) => ({
					...prevTask,
					[name]: value,
				}));
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

	const allDaysSelected = activeTask.days.every(Boolean);

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
								if (!Hovered) return;
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
								const overlap = checkOverlap(newTask, Tasks);
								setOverlap(overlap);
								setActiveTask(newTask);
								setIsModalOpen(true);
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

				{isModalOpen && (
					<div
						className="modal show d-block bg-light bg-opacity-50 position-fixed d-flex align-items-center justify-content-center"
						style={{ zIndex: 947852634958 }}
					>
						<div className="modal-dialog w-50">
							<div className="modal-content">
								<button
									type="button"
									className="btn-close align-self-end m-3"
									onClick={() => {
										setIsModalOpen(false);
										setEditMode(false);
										setActiveTask(nullTask);
									}}
								></button>
								<div className="modal-body">
									<form className="d-flex flex-column align-items-center">
										<div className="mb-3 w-100">
											<label className="form-label">
												Title:
											</label>
											<input
												type="text"
												name="title"
												className="form-control"
												value={activeTask.title}
												onChange={updateTask}
											/>
											{errors.taskTitle && (
												<p className="text-danger mt-1 mb-0">
													{errors.taskTitle}
												</p>
											)}
										</div>

										<div className="mb-3 w-100">
											<label className="form-label">
												Details:
											</label>
											<textarea
												className="form-control"
												rows="3"
												name="details"
												value={activeTask.details}
												onChange={updateTask}
												style={{ resize: "none" }}
											></textarea>
										</div>

										<div className="px-5 w-100 d-flex justify-content-center gap-4">
											<div className="flex-fill">
												<label className="form-label">
													Start at:
												</label>
												<TimeInputClock
													initialTime={
														activeTask.start
													}
													maxTime={activeTask.end}
													className="py-1 alert alert-light bg-transparent"
													onChange={(newTime) => {
														const updatedTask = {
															...activeTask,
															start: newTime,
														};
														setActiveTask(
															updatedTask,
														);
														setErrors((prev) => ({
															...prev,
															taskTime: "",
														}));
														checkOverlap(
															updatedTask,
															newTime,
															updatedTask.end,
															Tasks,
															setOverlap,
														);
													}}
												></TimeInputClock>
											</div>
											<span className="span"></span>
											<div className="flex-fill">
												<label className="form-label">
													End at:
												</label>
												<TimeInputClock
													initialTime={activeTask.end}
													minTime={activeTask.start}
													className="py-1 alert alert-light bg-transparent"
													onChange={(newTime) => {
														const updatedTask = {
															...activeTask,
															end: newTime,
														};
														setActiveTask(
															updatedTask,
														);
														setErrors((prev) => ({
															...prev,
															taskTime: "",
														}));
														checkOverlap(
															updatedTask,
															updatedTask.start,
															newTime,
															Tasks,
															setOverlap,
														);
													}}
												></TimeInputClock>
											</div>
										</div>

										{errors.taskTime && (
											<div className="w-100 text-center">
												<p className="text-danger mt-1 mb-0">
													{errors.taskTime}
												</p>
											</div>
										)}

										<div className="my-3 w-100 d-flex flex-column align-items-center">
											<div className="w-100 d-flex align-items-center mb-3">
												<label className="form-label m-0">
													Repeat on:
												</label>
												<label className="ms-3 mb-0">
													<input
														type="checkbox"
														className="mx-2"
														name="allDays"
														checked={
															allDaysSelected
														}
														onChange={updateTask}
													/>
													All days
												</label>
											</div>
											<div className="w-75 d-flex justify-content-between">
												{DAYS.map((day, index) => (
													<label
														key={day}
														className="d-flex flex-column align-items-center justify-content-center"
													>
														<input
															type="checkbox"
															name="days"
															value={index}
															checked={
																activeTask.days[
																	index
																]
															}
															onChange={
																updateTask
															}
														/>
														{day.slice(0, 3)}
													</label>
												))}
											</div>
											{errors.taskDays && (
												<div className="w-100">
													<p className="text-danger mt-1 mb-0">
														{errors.taskDays}
													</p>
												</div>
											)}
										</div>

										<div className="align-self-end d-flex align-items-center">
											<p className="text-danger">
												{overlap.mesg}
											</p>
											<button
												type="button"
												className="btn btn-primary"
												disabled={overlap.check}
												onClick={save}
											>
												Save
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

export default Schedule;
