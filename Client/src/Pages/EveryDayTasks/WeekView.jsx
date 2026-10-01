import { DAYS } from "../../Utils/dateUtilities.js";
import { stringToMinutes } from "../../Utils/timeUtilities.js";

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

export default function WeekView({ tasks, todayIndex, onTaskClick }) {
	const tasksByDayAndHour = Array.from({ length: DAYS.length }, () =>
		Array.from({ length: HOURS.length }, () => []),
	);

	for (const task of tasks) {
		if (
			!Array.isArray(task.days) ||
			typeof task.start !== "string" ||
			typeof task.end !== "string"
		)
			continue;

		const [hour, minute] = task.start.split(":").map(Number);
		if (
			!Number.isInteger(hour) ||
			!Number.isInteger(minute) ||
			hour < 0 ||
			hour >= HOURS.length ||
			minute < 0 ||
			minute >= 60
		)
			continue;
		const startMinutes = hour * 60 + minute;
		const endMinutes = stringToMinutes(task.end);
		const duration = endMinutes - startMinutes;
		if (!Number.isInteger(endMinutes) || duration <= 0) continue;

		task.days.forEach((isScheduled, dayIndex) => {
			if (isScheduled && tasksByDayAndHour[dayIndex]) {
				tasksByDayAndHour[dayIndex][hour].push({
					task,
					minute,
					duration,
				});
			}
		});
	}

	return (
		<div
			className="week-view-scroll"
			role="region"
			aria-label="Weekly task schedule"
			tabIndex={0}
		>
			<table className="week-table">
				<caption className="visually-hidden">
					Everyday tasks by weekday and start hour
				</caption>
				<thead>
					<tr>
						<th className="week-time-heading" scope="col">
							Time
						</th>
						{DAYS.map((day, dayIndex) => (
							<th
								key={day}
								scope="col"
								className={
									dayIndex === todayIndex
										? "week-today"
										: undefined
								}
							>
								{day}
								{dayIndex === todayIndex && (
									<span className="week-today-label">
										Today
									</span>
								)}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{HOURS.map((hour) => (
						<tr key={hour}>
							<th className="week-hour" scope="row">
								{`${String(hour).padStart(2, "0")}:00`}
							</th>
							{DAYS.map((day, dayIndex) => (
								<td
									className="week-cell"
									key={`${day}-${hour}`}
								>
									{tasksByDayAndHour[dayIndex][hour].map(
										({ task, minute, duration }) => (
											<button
												className="week-task"
												key={task.id}
												type="button"
												title={`${task.start} - ${task.end}`}
												aria-label={`${task.title}, ${task.start} to ${task.end}`}
												style={{
													top: `${(minute / 60) * 100}%`,
													height: `${(duration / 60) * 100}%`,
												}}
												onClick={() =>
													onTaskClick(task)
												}
											>
												<span className="week-task-title">
													{task.title}
												</span>
												{duration >= 45 && (
													<span className="week-task-time">
														{task.start} -{" "}
														{task.end}
													</span>
												)}
											</button>
										),
									)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
