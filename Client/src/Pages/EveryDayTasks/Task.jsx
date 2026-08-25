import { useState } from "react";
import { stringToMinutes,timeDifferenceInMinutes } from "../../Utils/timeUtilities";

export default function Task({ task, onClick }) {
	const [tooltip, setTooltip] = useState(false);
	const openTooltip = () => {
			setTooltip(true);
	};
	const closeTooltip = () => {
		setTooltip(false);
	};

    const handleClick=()=>{
        onClick(task)
    }

	return (
		<div
			onMouseEnter={() => openTooltip()}
			onMouseLeave={() => closeTooltip()}
			style={{
                marginTop:50,
				marginLeft: (stringToMinutes(task.start) * 10) / 6,
				width: tooltip?200:(timeDifferenceInMinutes(task.start, task.end) * 10) / 6,
                minHeight:tooltip?"50%":"auto",
				maxHeight:"80%",
                zIndex:tooltip?554654355544:0,
				cursor: "default",
			}}
			className="alert alert-primary p-2 overflow-hidden position-absolute"
			onClick={handleClick}
		>
			{!tooltip && <>{task.title}</>}
            {tooltip && (<><h4>{task.title}</h4><p>{task.details}</p></>)}
		</div>
	);
}
