import { useState } from "react";
import {
	stringToMinutes,
	timeDifferenceInMinutes,
} from "../../Utils/timeUtilities";
import trash from "../../assets/icons/trash.png";
import Button from "../../Components/Composite/DuelClockInput";

export default function Task({ task, onClick, onDelete, style }) {
	const [tooltip, setTooltip] = useState(false);
	const openTooltip = () => {
		setTooltip(true);
	};
	const closeTooltip = () => {
		setTooltip(false);
	};

	const handleClick = () => {
		onClick(task);
	};

	const handleDelete = (event) => {
		event.stopPropagation();
		if (onDelete) {
			onDelete(task.id);
		}
		setTooltip(false);
	};

	return (
		<div
			onMouseEnter={() => openTooltip()}
			onMouseLeave={() => closeTooltip()}
			className={`app-schedule-task ${tooltip ? "app-schedule-task-open" : ""}`}
			// marginLeft and width come from the task's times; the open
			// variant's fixed width/height/z-index is in the class.
			style={{
				marginLeft: (stringToMinutes(task.start) * 10) / 6,
				width: tooltip
					? undefined
					: (timeDifferenceInMinutes(task.start, task.end) * 10) / 6,
				...style,
			}}
			onClick={handleClick}
		>
			{!tooltip && (
				<span className="app-schedule-task-label">{task.title}</span>
			)}
			{tooltip && (
				<>
					<Button
						type="button"
						className="app-task-delete"
						onClick={handleDelete}
						aria-label={`Delete ${task.title}`}
						title="Delete task"
						variant="ghost"
						size="small"
					>
						<img src={trash} alt="" />
					</Button>
					<h4>{task.title}</h4>
					<p className="app-schedule-task-time">
						{task.start} &ndash; {task.end}
					</p>
					{task.details && <p>{task.details}</p>}
				</>
			)}
		</div>
	);
}
