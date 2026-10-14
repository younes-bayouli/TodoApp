import { checkOverLapTime } from "./timeUtilities";

export const checkOverlap = (activeTask, tasks) => {
	let hasOverlap = false;
	let overlapMessage = "";

	for (const task of tasks) {
		if (activeTask && task.id === activeTask.id) continue;

		const dayOverlap = task.days.some((day,i) => day && activeTask.days[i]);
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

	let current = null;
	let next = null;
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
			current = task;
		}

		if (isAfter) {
			if (startTotal < nextTaskStartTotal) {
				next = task;
				nextTaskStartTotal = startTotal;
			}
		}
	});

	return { current, next };
}

// The API's timings object also carries Sunrise and Sunset, which are
// not prayers. The PRAYERS list in PrayerTimesCard is the display order
// and the icon set; this is the same list reduced to keys.
const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export function getNextPrayer(timings, date) {
	if (!timings || !date) return null;

	const todaysPrayers = PRAYER_KEYS.map((name) => ({
		name,
		time: timings[name],
		date: atMinutes(timings[name], date),
	})).filter((prayer) => prayer.date);

	const upcoming = todaysPrayers.find(
		(prayer) => prayer.date.getTime() > date.getTime(),
	);

	// Past Isha: the next prayer is tomorrow's Fajr, so it keeps today's
	// time string and only the date moves.
	if (upcoming) return upcoming;

	const fajr = todaysPrayers[0];
	if (!fajr) return null;

	const tomorrow = new Date(date);
	tomorrow.setDate(tomorrow.getDate() + 1);
	return {
		name: fajr.name,
		time: fajr.time,
		date: atMinutes(fajr.time, tomorrow),
	};
}

function atMinutes(time, date) {
	if (!time) return null;
	const prayerDate = new Date(date);
	const [hours, minutes] = time.split(":").map(Number);
	prayerDate.setHours(hours, minutes, 0, 0);
	return prayerDate;
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
