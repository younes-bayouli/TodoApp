function getPrayerDate(time, date, addDay = false) {
	const [hours, minutes] = time.split(":").map(Number);
	const prayerDate = new Date(date);
	prayerDate.setHours(hours, minutes, 0, 0);
	if (addDay) prayerDate.setDate(prayerDate.getDate() + 1);
	return prayerDate;
}

function NextPrayerCard({ prayers, date }) {
	const prayerNames = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
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
		Math.floor((nextPrayer.date.getTime() - date.getTime()) / 1000),
	);
	const hours = Math.floor(remainingSeconds / 3600);
	const minutes = Math.floor((remainingSeconds % 3600) / 60);
	const seconds = remainingSeconds % 60;
	const countdown = [hours, minutes, seconds]
		.map((unit) => String(unit).padStart(2, "0"))
		.join(":");
	const label = nextPrayer.name[0].toUpperCase() + nextPrayer.name.slice(1);

	return (
		<div className="card shadow-sm border rounded bg-white p-4 next-prayer-card">
			<p className="text-secondary small fw-semibold text-uppercase mb-1">
				Up next
			</p>
			<h2>{label}</h2>
			<div
				className="next-prayer-time"
				aria-label="Time remaining"
			>
				{countdown}
			</div>
		</div>
	);
}

export default NextPrayerCard;
