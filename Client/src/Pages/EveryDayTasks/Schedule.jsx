import Arrow from "../../Components/Arrow";
import TimeBar from "./TimeBar";
import { useRef, useCallback, useState, useEffect, memo } from "react";
import "./style.css";
import { useTime } from "../../Utils/useTime";
import {
	format,
	timeToMinutes,
	minutesToTime,
	checkOverLap,
} from "../../Utils/timeUtilities";
import { useMouseDistance } from "../../Utils/useMouseDistance";
import Tasks from "./Tasks";

const TimeList = Array.from(
	{ length: 24 },
	(_, i) => `${String(i).padStart(2, "0")}:00`,
);


const checkOverlap = (newStart, newEnd, tasks, onOverlapChange) => {
	if (!onOverlapChange) return;

	let hasOverlap = false;
	let overlapMessage = "";

	for (const task of tasks) {
		// Skip the task being edited
		if (task.id === editedTaskId) continue;

		// Check if days overlap (simplified - check if any day matches)
		const dayOverlap = task.days.some((day) => day);

		if (!dayOverlap) continue;

		// Check time overlap
		const overlap = checkOverLap(newStart, newEnd, task.start, task.end);
		if (overlap) {
			hasOverlap = true;
			overlapMessage = `Overlaps with: ${task.title} (${task.start}-${task.end})`;
			break;
		}
	}

	onOverlapChange({ check: hasOverlap, mesg: overlapMessage });
};

const StaticTimeBars = memo(() => {
	return (
		<>
			{TimeList.map((item, key) => {
				return (
					<TimeBar key={item} LeftMargin={key * 100} time={item} />
				);
			})}
		</>
	);
});

function Schedule({onTaskClick}) {
	const scrollRef = useRef(null);
	const time = useTime();
	const distanceMouseLeftedge = useMouseDistance(scrollRef);
	const [Hovered, setHovered] = useState(false);

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
				<Tasks onClick={onTaskClick} TasksList={Tasks} ></Tasks>
			</div>
			<Arrow
				deg={-90}
				style={{ width: "5%", height: "10%" }}
				onClick={useCallback(() => scroll(1), [])}
			></Arrow>
		</div>
	);
}

export default Schedule;
