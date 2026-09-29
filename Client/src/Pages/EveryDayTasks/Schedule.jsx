import Arrow from "../../Components/Arrow";
import { useRef, useCallback, useState, useEffect } from "react";
import {
	format,
	timeToMinutes,
	minutesToTime,
	compareTime,
	minutesToString,
	stringToMinutes,
} from "../../Utils/timeUtilities";
import { useMouseDistance } from "../../Utils/useMouseDistance";
import Task from "./Task";
import StaticTimeBars from "../../Components/StaticTimeBars.jsx";
import TimeBar from "../../Components/TimeBar.jsx";

function Schedule({
	time,
	Tasks = [],
	prayers = {},
	settings = {},
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
	const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
	const sleepTimes = [
		{ name: "Sleep", time: settings.sleepStart },
		{ name: "Wake up", time: settings.sleepEnd },
	].filter(({ time: sleepTime }) => {
		if (!sleepTime) return false;
		const sleepMinutes = stringToMinutes(sleepTime);
		return (
			!Number.isNaN(sleepMinutes) &&
			sleepMinutes >= 0 &&
			sleepMinutes < 1440
		);
	});

	return (
		<>
			<div>
				<div>
					<Arrow
						deg={90}
						onClick={scrollLeft}
					></Arrow>
					<div
						className="app-schedule-scroll"
						ref={scrollRef}
						onMouseEnter={() => setHovered(true)}
						onMouseLeave={() => setHovered(false)}
					>
						<div
							className="app-schedule-cursor"
							style={{
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
							headStyle={"app-time-bar-now shadow p-0 m-0"}
							barStyle={"shadow bg-danger border-0 p-0 m-0"}
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
									"border-0 text-opacity-25 p-0 m-0 position-relative z-3 app-schedule-hover-time"
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
						{prayerNames.map((name) => {
							const prayerTime = prayers[name];
							if (!prayerTime) return null;

							const prayerMinutes = stringToMinutes(prayerTime);
							if (Number.isNaN(prayerMinutes)) return null;

							return (
								<div
									key={name}
									className="app-schedule-marker app-schedule-marker-prayer"
									style={{
										marginLeft: (prayerMinutes * 10) / 6,
									}}
								>
									<span>{name}</span>
								</div>
							);
						})}
						{sleepTimes.map(({ name, time: sleepTime }) => (
							<div
								key={name}
								className="app-schedule-marker app-schedule-marker-sleep"
								style={{
									marginLeft:
										(stringToMinutes(sleepTime) * 10) / 6,
								}}
							>
								<span>{name}</span>
							</div>
						))}
						<div className="app-schedule-tasks">
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
						onClick={scrollRight}
					></Arrow>
				</div>
			</div>
		</>
	);
}

export default Schedule;
