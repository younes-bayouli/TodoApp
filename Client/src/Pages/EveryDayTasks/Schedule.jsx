import Arrow from "../../Components/Arrow";
import { useRef, useCallback, useState, useEffect } from "react";
import "./style.css";
import {
	format,
	timeToMinutes,
	minutesToTime,
	compareTime,
	minutesToString,
} from "../../Utils/timeUtilities";
import { useMouseDistance } from "../../Utils/useMouseDistance";
import Task from "./Task";
import StaticTimeBars from "../../Components/StaticTimeBars.jsx";
import TimeBar from "../../Components/TimeBar.jsx";

function Schedule({
	time,
	Tasks = [],
	onClick,
	onDeleteTask,
	handleClickOnTask,
}) {
	const [Hovered, setHovered] = useState(false);
	const scrollRef = useRef(null);
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

	const scrollLeft = useCallback(() => scroll(-1), []);
	const scrollRight = useCallback(() => scroll(1), []);

	return (
		<>
			<div className="container w-100 h-100 p-0 d-flex flex-column overflow-hidden">
				<div className="d-flex flex-grow-1 align-items-center overflow-hidden">
					<Arrow
						deg={90}
						style={{ width: "5%", height: "10%" }}
						onClick={scrollLeft}
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
								onClick(format(minutesToTime(min)).hour24);
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
								time={minutesToString(
									Math.ceil(
										((distanceMouseLeftedge -
											20 +
											scrollRef.current.scrollLeft) *
											6) /
											10,
									),
								)}
							></TimeBar>
						)}
						<div className="h-100 w-100 position-absolute d-flex align-items-center">
							{Tasks.map((task) => (
								<Task
									task={task}
									key={task.id}
									onClick={handleClickOnTask}
									onDelete={onDeleteTask}
								></Task>
							))}
						</div>
					</div>
					<Arrow
						deg={-90}
						style={{ width: "5%", height: "10%" }}
						onClick={scrollRight}
					></Arrow>
				</div>
			</div>
		</>
	);
}

export default Schedule;
