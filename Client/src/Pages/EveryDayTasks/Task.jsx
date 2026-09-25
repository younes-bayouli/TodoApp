import { useState } from "react";
import {
	stringToMinutes,
	timeDifferenceInMinutes,
} from "../../Utils/timeUtilities";
import trash from "../../assets/icons/trash.png";

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

			style={{
				marginTop: 50,
				marginLeft: (stringToMinutes(task.start) * 10) / 6,
				width: tooltip
					? 200
					: (timeDifferenceInMinutes(task.start, task.end) * 10) / 6,
				minHeight: tooltip ? "50%" : "auto",
				maxHeight: "80%",
				zIndex: tooltip ? 554 : 4,
				cursor: "default",
				position: "relative",
				...style,
			}}
			onClick={handleClick}
		>
			{!tooltip && <>{task.title}</>}
			{tooltip && (
				<>
					<button
						type="button"
						onClick={handleDelete}
						aria-label={`Delete ${task.title}`}
						title="Delete task"
					>
						<img src={trash} alt="Delete" />
					</button>
					<h4>{task.title}</h4>
					<p>{task.details}</p>
				</>
			)}
		</div>
	);
}
