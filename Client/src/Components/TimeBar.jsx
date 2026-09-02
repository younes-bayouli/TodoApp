function TimeBar({
	time,
	theme,
	headStyle,
	barStyle = "border-0",
	position = "absolute",
	LeftMargin = 0,
	borderStyle = "solid",
	onClick=()=>{},
}) {
	return (
		<div
			onClick={onClick}
			className="d-flex flex-column align-items-center align-self-stretch p-0 h-100"
			style={{ width: "0px", marginLeft: LeftMargin, position: position }}
		>
			<div className={`${theme} ${headStyle} m-0`}>{time}</div>
			<div
				className={`${theme} ${barStyle} span flex-grow-1 m-0`}
				style={{ border: borderStyle }}
			></div>
		</div>
	);
}

export default TimeBar;
