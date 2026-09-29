import { useState } from "react";
import {
	stringToMinutes,
	timeDifferenceInMinutes,
} from "../../Utils/timeUtilities";
import trash from "../../assets/icons/trash.png";
import Button from "../../Components/Button";

export default function Task({ task, onClick, onDelete,style }) {
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
			{!tooltip && <>{task.title}</>}
			{tooltip && (
				<>
					<Button
						type="button"
						onClick={handleDelete}
						aria-label={`Delete ${task.title}`}
						title="Delete task"
						variant="ghost"
					>
						<img src={trash} alt="Delete" />
					</Button>
					<h4>{task.title}</h4>
					<p>{task.details}</p>
				</>
			)}
		</div>
	);
}
