import { checkOverLapTime } from "./timeUtilities";

export const checkOverlap = (activeTask, tasks) => {
	let hasOverlap = false;
	let overlapMessage = "";

	for (const task of tasks) {
		if (activeTask && task.id === activeTask.id) continue;

		const dayOverlap = task.days.some((day) => day);
		if (!dayOverlap) continue;

		const overlap = checkOverLapTime(
			activeTask.start,
			activeTask.end,
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

export function getCurrentAndNextTask(time, tasks = []) {
	const [givenHours, givenMinutes] = time.split(":").map(Number);
	const givenMinutesTotal = givenHours * 60 + givenMinutes;

	let currentTask = null;
	let nextTask = null;
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
				nextTaskStartTotal = startTotal;
			}
		}
	});

	return { current: currentTask, next: nextTask };
}

export function getSizeClass(size) {
	switch (size) {
		case "full":
			return "col-12";

		case "half":
			return "col-6";

		case "small":
			return "col-auto";

		default:
			return "col-12";
	}
}

export const formatLocation = (location) => {
	const address = location?.address;
	if (!address) return "";

	const area =
		address.county ||
		address.city_district ||
		address.neighbourhood ||
		address.suburb ||
		address.city;

	const district =
		address.state_district ||
		address.city ||
		address.county ||
		address.state;

	return [address.country, area, district !== area ? district : null]
		.filter(Boolean)
		.join(", ");
};

// export const formatLocation = (location) => {
// 	const address = location?.address;
// 	if (!address) return "";

// 	const country = address.country;
// 	const area =
// 		address.neighbourhood ||
// 		address.suburb ||
// 		address.city_district ||
// 		address.village;

// 	const governorate = address.state;

// 	return [country, area, governorate].filter(Boolean).join(", ");
// };

// const formatLocation = (location) => {
// 	const address = location?.address;
// 	if (!address) return "Location unavailable";

// 	const area =
// 		address.neighbourhood ||
// 		address.suburb ||
// 		address.city_district;

// 	const city = address.city || address.town || address.village;

// 	return [area, city, address.country]
// 		.filter(Boolean)
// 		.join(", ");
// };
