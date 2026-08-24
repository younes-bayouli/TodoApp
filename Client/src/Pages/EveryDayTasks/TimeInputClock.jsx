import { useState } from "react";
import Arrow from "../../Components/Arrow";
import { compareTime } from "../../Utils/timeUtilities";

export default function TimeInputClock({
	initialTime = "00:00",
	maxTime = "23:59",
	minTime = "00:00",
	onChange,
	className = "",
}) {
	const [hours, setHours] = useState(parseInt(initialTime.split(":")[0]));
	const [minutes, setMinutes] = useState(parseInt(initialTime.split(":")[1]));
	const [hovered, setHovered] = useState(false);
	const [activeButtons, setActiveButtons] = useState([1, 1, 1, 1]);

	// Check for overlaps when time changes

	const updateTime = (field, delta) => {
		let newValue = (field === "hours" ? hours : minutes) + delta;
		if (field === "hours" && newValue > 23) newValue = 0;
		if (field === "hours" && newValue < 0) newValue = 23;
		if (field === "minutes" && newValue > 59) newValue = 0;
		if (field === "minutes" && newValue < 0) newValue = 59;

		let h = hours;
		let m = minutes;

		if (field === "hours") {
			setHours(newValue);
			h = newValue;
		}
		if (field === "minutes") {
			setMinutes(newValue);
			m = newValue;
		}

		const newTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

		let copy = activeButtons;
		h = (h - 1 + 24) % 24;
		copy[0] =
			compareTime(
				`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
				minTime,
			) > 0;
		h = (h+2) % 24;
		copy[1] =
			compareTime(
				`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
				maxTime,
			) < 0;
		h = (h - 1+24) % 24;
		m = (m - 1 + 60) % 60;
		copy[2] =
			compareTime(
				`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
				minTime,
			) > 0;
		m = (m + 2) % 60;
		copy[3] =
			compareTime(
				`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
				maxTime,
			) < 0;
		setActiveButtons(copy);
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
					onClick={() => updateTime("hours", 1*activeButtons[1])}
					cliCkable={activeButtons[1]}
				></Arrow>
				<span
					className="h-50 d-flex align-items-center justify-content-center"
					style={{ lineHeight: "1.8rem" }}
				>
					{String(hours).padStart(2, "0")}
				</span>
				<Arrow
					className={`h-25 ${hovered ? "" : "invisible"}`}
					onClick={() => updateTime("hours", -1*activeButtons[0])}
					cliCkable={activeButtons[0]}
				></Arrow>
			</div>
			<div className="pb-1">:</div>

			{/* Minutes Section */}
			<div className="d-flex flex-column align-items-center position-relative">
				<Arrow
					deg={180}
					className={`h-25 ${hovered ? "" : "invisible"}`}
					onClick={() => updateTime("minutes", 1*activeButtons[3])}
					cliCkable={activeButtons[3]}
				></Arrow>

				<span
					className="h-50 d-flex align-items-center justify-content-center"
					style={{ lineHeight: "1.8rem" }}
				>
					{String(minutes).padStart(2, "0")}
				</span>

				<Arrow
					className={`h-25 ${hovered ? "" : "invisible"}`}
					onClick={() => updateTime("minutes", -1*activeButtons[2])}
					cliCkable={activeButtons[2]}
				></Arrow>
			</div>
		</div>
	);
}
