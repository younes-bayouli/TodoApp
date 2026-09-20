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
			onDelete(task);
		}
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
				zIndex: tooltip ? 554654355544 : 4,
				cursor: "default",
				position: "relative",
				...style,
			}}
			className="alert alert-primary p-2 overflow-hidden position-absolute"
			onClick={handleClick}
		>
			{!tooltip && <>{task.title}</>}
			{tooltip && (
				<>
					<button
						type="button"
						className="btn btn-sm d-flex align-items-center justify-content-center"
						onClick={handleDelete}
						aria-label={`Delete ${task.title}`}
						title="Delete task"
						style={{
							position: "absolute",
							top: "8px",
							right: "8px",
							width: "28px",
							height: "28px",
							padding: 0,
							lineHeight: 1,
						}}
					>
						<img src={trash} alt="Delete" />
					</button>
					<h4 style={{ paddingRight: "32px" }}>{task.title}</h4>
					<p>{task.details}</p>
				</>
			)}
		</div>
	);
}
