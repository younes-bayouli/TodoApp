import React from "react";
import image from "../icons/arrow.png";

function ArrowH({ deg, onClick, className = "", cliCkable=true }) {
	return (
		<img
			style={{
				cursor: cliCkable?"pointer":"not-allowed",
				rotate: `${deg}deg`,
			}}
			className={className}
			src={image}
			alt=""
			onClick={onClick}
		/>
	);
}


const Arrow = React.memo(ArrowH);

export default Arrow;
