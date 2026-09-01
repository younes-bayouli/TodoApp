import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

function ArrowH({ deg, onClick, className = "", cliCkable=true }) {
	return (
		<ChevronDown
			style={{
				cursor: cliCkable?"pointer":"not-allowed",
				rotate: `${deg}deg`,
			}}
			className={className}
			color="#D1D5DB"
			alt=""
			onClick={onClick}
		/>
	);
}


const Arrow = React.memo(ArrowH);

export default Arrow;
