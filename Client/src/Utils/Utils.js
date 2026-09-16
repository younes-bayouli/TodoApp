import { checkOverLapTime } from "./timeUtilities";

export const checkOverlap = (
	activeTask,
	tasks,
) => {

	let hasOverlap = false;
	let overlapMessage = "";

	for (const task of tasks) {
		if (activeTask && task.id === activeTask.id) continue;

		const dayOverlap = task.days.some((day) => day);
		if (!dayOverlap) continue;

		const overlap = checkOverLapTime(
			activeTask.newStart,
			activeTask.newEnd,
			task.start,
			task.end,
		);

		if (overlap) {
			hasOverlap = true;
			overlapMessage = `Overlaps with: ${task.title} (${task.start}-${task.end})`;
			break;
		}
	}

	return { check: hasOverlap, mesg: overlapMessage };
};

export function getCurrentAndNextTask(time, tasks=[], dayIndex = 0) {
	const [givenHours, givenMinutes] = time.split(":").map(Number);
	const givenMinutesTotal = givenHours * 60 + givenMinutes;

	let currentTask = null;
	let nextTask = null;
	let nextTaskIndex = tasks.length;
	let nextTaskStartTotal = Infinity;

	tasks.forEach((task) => {
		const [startHours, startMinutes] = task.start.split(":").map(Number);
		const [endHours, endMinutes] = task.end.split(":").map(Number);
		const startTotal = startHours * 60 + startMinutes;
		const endTotal = endHours * 60 + endMinutes;

		let isCurrent = false;
		let isAfter = false;

		isCurrent =
			givenMinutesTotal >= startTotal && givenMinutesTotal < endTotal;
		isAfter = givenMinutesTotal < startTotal;

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

	return { current: currentTask, next: nextTask };
}
