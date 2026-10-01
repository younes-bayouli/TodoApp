/* A vertical rule on the timeline, with an optional time label on top.

   `variant` is one of default, danger, secondary, ghost — the pair of
   fills the label and the bar get. headStyle and barStyle stay as
   escape hatches for the now/hover cursors, which position the label
   from runtime data rather than expressing a variant. */
function TimeBar({
	time,
	variant = "default",
	LeftMargin = 0,
	onClick = () => {},
}) {
	return (
		<div
			onClick={onClick}
			style={{ marginLeft: LeftMargin }}
			className={`app-time-bar app-time-bar-${variant}`}
		>
			<div
				className={`label`}
			>
				{time}
			</div>
			<div
				className={`bar`}
			></div>
		</div>
	);
}

export default TimeBar;
