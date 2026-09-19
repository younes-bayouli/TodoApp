import { useState } from "react";
import Arrow from "./Arrow";
import { compareTime } from "../Utils/timeUtilities";

export default function TimeInputClock({
	initialTime = "00:00",
	maxTime = "23:59",
	minTime = "00:00",
	onChange,
	className = "",
}) {
	const [[hours, minutes], setHM] = useState(
		initialTime.split(":").map((h) => parseInt(h)),
	);
	const [hovered, setHovered] = useState(false);
	const [activeButtons, setActiveButtons] = useState([1, 1, 1, 1]);

	const updateTime = (delta) => {
		let temp = [hours, minutes].map(
			(h, i) => (h + delta[i] + [24, 60][i]) % [24, 60][i],
		);

		setHM(temp);

		const newTime = `${String(temp[0]).padStart(2, "0")}:${String(temp[1]).padStart(2, "0")}`;
		setActiveButtons(() => {
			let t = [
				[1, 0],
				[-1, 0],
				[0, 1],
				[0, -1],
			].map((vect) => {
				let [h, m] = vect.map(
					(k, i) => (k + temp[i] + [24, 60][i]) % [24, 60][i],
				);
				let time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
				return (
					compareTime(time, maxTime) <= 0 &&
					compareTime(time, minTime) >= 0
				);
			});
			return t;
		});
		onChange(newTime);
	};

	return (
		<div
			style={{ fontSize: "1.8rem", fontWeight: "600" }}
			className={`d-flex p-2 m-0 align-items-center justify-content-center ${className}`}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			{/* Hours Section */}
			<div className="d-flex flex-column align-items-center position-relative">
				<Arrow
					deg={180}
					className={`h-25 ${hovered ? "" : "invisible"}`}
					onClick={() => updateTime([1 * activeButtons[0], 0])}
					cliCkable={activeButtons[0]}
				></Arrow>
				<span
					className="h-50 d-flex align-items-center justify-content-center"
					style={{ lineHeight: "1.8rem" }}
				>
					{String(hours).padStart(2, "0")}
				</span>
				<Arrow
					className={`h-25 ${hovered ? "" : "invisible"}`}
					onClick={() => updateTime([-1 * activeButtons[1], 0])}
					cliCkable={activeButtons[1]}
				></Arrow>
			</div>
			<div className="pb-1">:</div>

			{/* Minutes Section */}
			<div className="d-flex flex-column align-items-center position-relative">
				<Arrow
					deg={180}
					className={`h-25 ${hovered ? "" : "invisible"}`}
					onClick={() => updateTime([0, 1 * activeButtons[2]])}
					cliCkable={activeButtons[2]}
				></Arrow>

				<span
					className="h-50 d-flex align-items-center justify-content-center"
					style={{ lineHeight: "1.8rem" }}
				>
					{String(minutes).padStart(2, "0")}
				</span>

				<Arrow
					className={`h-25 ${hovered ? "" : "invisible"}`}
					onClick={() => updateTime([0, -1 * activeButtons[3]])}
					cliCkable={activeButtons[3]}
				></Arrow>
			</div>
		</div>
	);
}
