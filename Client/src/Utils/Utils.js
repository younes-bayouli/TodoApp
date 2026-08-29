import { checkOverLapTime } from "./timeUtilities";

export const checkOverlap = (
	activeTask,
	newStart,
	newEnd,
	tasks,
	onOverlapChange,
) => {
	if (!onOverlapChange) return;

	let hasOverlap = false;
	let overlapMessage = "";

	for (const task of tasks) {
		// Skip the task being edited
		if (activeTask && task.id === activeTask.id) continue;

		// Check if days overlap (simplified - check if any day matches)
		const dayOverlap = task.days.some((day) => day);
		if (!dayOverlap) continue;

		// Check time overlap
		const overlap = checkOverLapTime(
			newStart,
			newEnd,
			task.start,
			task.end,
		);
		if (overlap) {
			hasOverlap = true;
			overlapMessage = `Overlaps with: ${task.title} (${task.start}-${task.end})`;
			break;
		}
	}

	onOverlapChange({ check: hasOverlap, mesg: overlapMessage });
};

export function getCurrentAndNextTask(time, tasks=[], dayIndex = 0) {
	const [givenHours, givenMinutes] = time.split(":").map(Number);
	const givenMinutesTotal = givenHours * 60 + givenMinutes;

	let currentTask = null;
	let nextTask = null;
	let nextTaskIndex = tasks.length;
	let nextTaskStartTotal = Infinity;

	tasks.forEach((task, index) => {
		if (!task.days[dayIndex]) return;

		const [startHours, startMinutes] = task.start.split(":").map(Number);
		const [endHours, endMinutes] = task.end.split(":").map(Number);
		const startTotal = startHours * 60 + startMinutes;
		const endTotal = endHours * 60 + endMinutes;

		let isCurrent = false;
		let isAfter = false;

		isCurrent =
			givenMinutesTotal >= startTotal && givenMinutesTotal < endTotal;
		isAfter = givenMinutesTotal <= startTotal;

		if (isCurrent) {
			currentTask = task;
		}

		if (isAfter) {
			if (startTotal < nextTaskStartTotal) {
				nextTask = task;
				nextTaskStartTotal=startTotal;
			}
		}
	});

	if (!currentTask) {
		tasks.forEach((task, index) => {
			if (!task.days[dayIndex]) return;

			const [startHours, startMinutes] = task.start
				.split(":")
				.map(Number);
			const startTotal = startHours * 60 + startMinutes;

			if (startTotal > givenMinutesTotal && index < nextTaskIndex) {
				nextTaskIndex = index;
				nextTask = task;
			}
		});
	}

	return { current: currentTask, next: nextTask };
}
