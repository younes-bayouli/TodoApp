import Arrow from "../../Components/Arrow";
import { useRef, useCallback, useState, useEffect, memo } from "react";
import "./style.css";
import { useTime } from "../../Utils/useTime";
import {
	format,
	timeToMinutes,
	minutesToTime,
	checkOverLapTime,
} from "../../Utils/timeUtilities";
import { useMouseDistance } from "../../Utils/useMouseDistance";
import Task from "./Task";
import Tasks from "../../fakeData/fakeTasks";
import { DAYS } from "../../Utils/dateUtilities";
import TimeInputClock from "./TimeInputClock.jsx";
import StaticTimeBars from "../../Components/StaticTimeBars.jsx";
import TimeBar from "../../Components/TimeBar.jsx";

const nullTask = {
	title: "",
	start: "00:00",
	end: "00:00",
	days: [false, false, false, false, false, false, false],
	details: "",
};

function Schedule() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [activeTask, setActiveTask] = useState(nullTask);
	const [Hovered, setHovered] = useState(false);
	const [overlap, setOverlap] = useState({ check: false, mesg: "" });
	const scrollRef = useRef(null);
	const time = useTime();
	const distanceMouseLeftedge = useMouseDistance(scrollRef);

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
		if (editMode) {
			setEditMode(false);
		}
		setIsModalOpen(false);
		setActiveTask(nullTask);
	};

	const updateTask = (e) => {
		const { name, value } = e.target;
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

	return (
		<div className="container w-100 py-4 px-0 flex-grow-1 d-flex align-items-center">
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
											scrollRef.current.scrollLeft) *
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
						<Task task={task} onClick={handleClickOnTask}></Task>
					))}
				</div>
			</div>
			<Arrow
				deg={-90}
				style={{ width: "5%", height: "10%" }}
				onClick={useCallback(() => scroll(1), [])}
			></Arrow>

			{isModalOpen && (
				<div
					className="modal show d-block  bg-light bg-opacity-50 position-fixed d-flex align-items-center justify-content-center"
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
									<div className="px-5 w-100 d-flex justify-content-center gap-4 ">
										<div className=" flex-fill">
											<label className="form-label">
												Start at:
											</label>
											<TimeInputClock
												initialTime={activeTask.start}
												maxTime={activeTask.end}
												className="py-1 alert alert-light bg-transparent"
												onChange={(newTime) => {
													setActiveTask((prevTask) => ({
														...prevTask,
														start: newTime,
													}));
													setOverlap((prev) => {
														const isOverlap = checkOverLapTime(
															newTime,
															activeTask.end,
															activeTask.days
														);
														return { check: isOverlap, mesg: isOverlap ? `Overlaps with: ${activeTask.title} (${activeTask.start}-${activeTask.end})` : "" };
													});
												}}
											></TimeInputClock>
										</div>
										<span className="span"></span>
										<div className=" flex-fill">
											<label className="form-label">
												End at:
											</label>
											<TimeInputClock
												initialTime={activeTask.end}
												minTime={activeTask.start}
												className="py-1 alert alert-light bg-transparent"
												onChange={(newTime) => {
													setActiveTask((prevTask) => ({
														...prevTask,
														start: newTime,
													}));
													setOverlap((prev) => {
														const isOverlap = checkOverLapTime(
															newTime,
															activeTask.end,
															activeTask.days
														);
														return { check: isOverlap, mesg: isOverlap ? `Overlaps with: ${activeTask.title} (${activeTask.start}-${activeTask.end})` : "" };
													});
												}}
											></TimeInputClock>
										</div>
									</div>
									<div className="my-5 w-100 d-flex">
										<label className="form-label me-3">
											Repeat on:
										</label>
										<div className="w-75 d-flex justify-content-between">
											{DAYS.map((day, index) => (
												<label className="d-flex flex-column align-items-center justify-content-center">
													<input
														type="checkbox"
														name="days"
														value={index}
														checked={
															activeTask.days[index]
														}
														onChange={updateTask}
														id=""
													/>
													{day}
												</label>
											))}
										</div>
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
	);
}

export default Schedule;
