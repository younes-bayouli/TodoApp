function getPrayerDate(time, date, addDay = false) {
	if(!time) {return null};
	const [hours, minutes] = time.split(":").map(Number);
	const prayerDate = new Date(date);
	prayerDate.setHours(hours, minutes, 0, 0);
	if (addDay) prayerDate.setDate(prayerDate.getDate() + 1);
	return prayerDate;
}

function NextPrayerCard({ prayers={}, date, small = false, className="" }) {
	const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
	let nextPrayer = prayerNames
		.map((name) => ({
			name,
			time: prayers[name],
			date: getPrayerDate(prayers[name], date),
		}))
		.find((prayer) => prayer.date > date);
	
	if (!nextPrayer) {
		const tomorrow = getPrayerDate(prayers.fajr, date, true);
		nextPrayer = { name: "fajr", time: prayers.fajr, date: tomorrow };
	}

	const remainingSeconds = Math.max(
		0,
		Math.floor((nextPrayer.date?.getTime() - date.getTime()) / 1000),
	);
	const hours = Math.floor(remainingSeconds / 3600);
	const minutes = Math.floor((remainingSeconds % 3600) / 60);
	const seconds = remainingSeconds % 60;
	const countdown = [hours, minutes, seconds]
		.map((unit) => String(unit).padStart(2, "0"))
		.join(":");
	const label = nextPrayer.name[0].toUpperCase() + nextPrayer.name.slice(1);

	return (
		<div className={`card shadow-sm border rounded bg-white p-4 next-prayer-card ${className}`}>
			<p className="text-secondary small fw-semibold text-uppercase mb-1">
				Up next
			</p>
			<h2>{label}</h2>
			{small && (
				<h4 className="next-prayer-time-sm" aria-label="Time remaining">
					{countdown}
				</h4>
			)}
			{!small && (
				<h1 className="next-prayer-time" aria-label="Time remaining">
					{countdown}
				</h1>
			)}
		</div>
	);
}

export default NextPrayerCard;
