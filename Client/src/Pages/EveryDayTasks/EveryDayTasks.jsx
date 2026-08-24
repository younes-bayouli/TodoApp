import Schedule from "./Schedule.jsx";
import { useState } from "react";
import { DAYS } from "../../Utils/dateUtilities.js";
import TimeInputClock from "./TimeInputClock.jsx";
import { checkOverLap } from "../../Utils/timeUtilities.js";
import Tasks from "./Tasks";

const nullTask = {
	title: "",
	start: "00:00",
	end: "00:00",
	days: [false, false, false, false, false, false, false],
	details: "",
};

function Myeveryday() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [Task, setTask] = useState(nullTask);
	const [overlap, setOverlap] = useState({ check: false, mesg: "" });

	const handleEdit = (task) => {
		setTask(task);
		setEditMode(true);
		setIsModalOpen(true);
	};

	const save = () => {
		if (editMode) {
			setEditMode(false);
		}
		setIsModalOpen(false);
		setTask(nullTask);
	};

	const updateTask = (e) => {
		const { name, value } = e.target;
		name === "days"
			? setTask((oldVersion) => {
					const newDays = [...oldVersion.days];
					newDays[value] = !newDays[value];

					return {
						...oldVersion,
						days: newDays,
					};
				})
			: setTask((prevTask) => ({
					...prevTask,
					[name]: value,
				}));
	};
	return (
		<>
			<div className="d-flex flex-column h-100">
				<h3>My Every Day</h3>
				<div className="flex-grow-1 d-flex flex-column gap-3">
					<Schedule onTaskClick={handleEdit}></Schedule>
					<div className="w-100 flex-grow-1"></div>
				</div>
			</div>
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
											value={Task.title}
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
											value={Task.details}
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
												initialTime={Task.start}
												maxTime={Task.end}
												className="py-1 alert alert-light bg-transparent"
											></TimeInputClock>
										</div>
										<span className="span"></span>
										<div className=" flex-fill">
											<label className="form-label">
												End at:
											</label>
											<TimeInputClock
												initialTime={Task.end}
												minTime={Task.start}
												className="py-1 alert alert-light bg-transparent"
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
															Task.days[index]
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
											disabled={overlap.is}
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
		</>
	);
}

export default Myeveryday;
