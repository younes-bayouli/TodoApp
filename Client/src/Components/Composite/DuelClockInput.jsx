import TimeInputClock from "./TimeInputClock";

export default function DuelClockInput({handleChange,left,right}) {
	return (
			<div className="d-flex gap-4">
				<div>
					<TimeInputClock
						initialTime={left?.time}
						maxTime={right?.time}
						onChange={(newTime) => handleChange(left?.name, newTime)}
					/>
				</div>
				<span className="line"></span>
				<div>
					<TimeInputClock
						initialTime={right?.time}
						minTime={left?.time}
						onChange={(newTime) => handleChange(right?.name, newTime)}
					/>
				</div>
			</div>
	);
}
