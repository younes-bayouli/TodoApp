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
			style={{ width: "0px", marginLeft: LeftMargin, position: position }}
		>
			<div className={`${theme} ${headStyle}`}>{time}</div>
			<div
				className={`${theme} ${barStyle}`}
				style={{ border: borderStyle }}
			></div>
		</div>
	);
}

export default TimeBar;
