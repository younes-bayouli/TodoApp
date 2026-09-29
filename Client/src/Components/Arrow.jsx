import React from "react";
import { ChevronDown } from "lucide-react";

function ArrowH({ deg, onClick, className = "", cliCkable = true }) {
	return (
		<ChevronDown
			// deg drives the rotation at runtime, so it stays inline;
			// the cursor is a two-state prop and maps to a class.
			style={{ rotate: `${deg}deg` }}
			className={`${cliCkable ? "app-clickable" : ""} ${className}`}
			alt=""
			onClick={onClick}
		/>
	);
}

const Arrow = React.memo(ArrowH);

export default Arrow;
