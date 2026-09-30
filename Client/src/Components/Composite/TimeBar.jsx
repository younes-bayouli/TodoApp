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
			// marginLeft and position come from the caller's time
			// calculation; width is always 0 and is in the class.
			style={{ marginLeft: LeftMargin, position }}
			className="app-time-bar"
		>
			<div className={`${theme} ${headStyle}`}>{time}</div>
			<div
				className={`${theme} ${barStyle} app-time-bar-${borderStyle}`}
			></div>
		</div>
	);
}

export default TimeBar;
