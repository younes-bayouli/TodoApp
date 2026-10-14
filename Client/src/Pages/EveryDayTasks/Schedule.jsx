import Arrow from "../../Components/Basic/Arrow";
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
import StaticTimeBars from "../../Components/Composite/StaticTimeBars.jsx";
import TimeBar from "../../Components/Composite/TimeBar.jsx";

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
		...(settings.secondSleepEnabled
			? [
					{ name: "Sleep", time: settings.secondSleepStart },
					{ name: "Wake up", time: settings.secondSleepEnd },
				]
			: []),
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
		<div className="d-flex align-items-center h-100">
			<Arrow deg={90} onClick={scrollLeft}></Arrow>
			<div
				className="app-schedule-scroll h-100"
				ref={scrollRef}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				style={{ paddingLeft: "20px" }}
			>
				<div
					className="h-100 w-100 position-absolute"
					style={{
						zIndex: 4,
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
					variant="danger"
					time={format(time).hour24}
				></TimeBar>
				{Hovered && (
					<TimeBar
						variant="ghost"
						LeftMargin={Math.ceil(
							distanceMouseLeftedge -
								20 +
								scrollRef.current.scrollLeft,
						)}
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
							className="prayer-marker"
							style={{
								marginLeft: (prayerMinutes * 10) / 6,
							}}
						>
							<span>{name}</span>
						</div>
					);
				})}
				{sleepTimes.map(({ name, time: sleepTime }, i) => (
					<div
						key={`${i}-${name}`}
						className="sleep-marker"
						style={{
							marginLeft: (stringToMinutes(sleepTime) * 10) / 6,
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
			<Arrow deg={-90} onClick={scrollRight}></Arrow>
		</div>
	);
}

export default Schedule;
