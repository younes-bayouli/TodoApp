import Card from "../Composite/Card";

function NextPrayerCard({
	nextPrayer,
	date
}) {

	const remainingSeconds = Math.max(
		0,
		Math.floor((nextPrayer?.date?.getTime() - date.getTime()) / 1000),
	);
	const hours = Math.floor(remainingSeconds / 3600);
	const minutes = Math.floor((remainingSeconds % 3600) / 60);
	const seconds = remainingSeconds % 60;
	const countdown = nextPrayer
		? [hours, minutes, seconds]
				.map((unit) => String(unit).padStart(2, "0"))
				.join(":")
		: "--:--:--";
	const label = nextPrayer?.name[0].toUpperCase() + nextPrayer?.name.slice(1);

	// `large` is the Prayer Times page's own presentation and is scoped
	// to this usage; Home keeps its existing sizes.

	return (
		<Card name="card-next">
			<div>
				<p>Up next</p>
				<h2 className="prayer-name">{label}</h2>
				<h4 aria-label="Time remaining">{countdown}</h4>
			</div>
		</Card>
	);
}

export default NextPrayerCard;
