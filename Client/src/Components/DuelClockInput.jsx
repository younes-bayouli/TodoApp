import TimeInputClock from "./TimeInputClock";

export default function DuelClockInput({handleChange,left,right}) {
	return (
			<div className="d-flex gap-4">
				<div className="flex-fill">
					<TimeInputClock
						initialTime={left.time}
						maxTime={right.time}
						className="py-1 alert alert-light"
						onChange={(newTime) => handleChange(left.name, newTime)}
					/>
				</div>
				<span className="span"></span>
				<div className="flex-fill">
					<TimeInputClock
						initialTime={right.time}
						minTime={left.time}
						className="py-1 alert alert-light"
						onChange={(newTime) => handleChange(right.name, newTime)}
					/>
				</div>
			</div>
	);
}
