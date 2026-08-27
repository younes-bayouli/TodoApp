import PrayerTimesCard from "../../Components/Cards/PrayerTimesCard";
import IslamicDateCard from "../../Components/Cards/IslamicDateCard";
import NextPrayerCard from "../../Components/Cards/NextPrayerCard";
import TimeCard from "../../Components/Cards/TimeCard";
import prayers from "../../fakeData/fakePrayers.json";
import { useDate } from "../../Utils/useTime";
import "./PrayerTimes.css";

function PrayerTimes() {
	const date = useDate();

	return (
		<main className="prayer-page h-100 w-100 min-vh-0 d-flex flex-column">
			<header className="d-flex align-items-end justify-content-between gap-3 mb-3 flex-shrink-0">
				<div>
					<h1 className="mb-0 fw-semibold">Prayer Times</h1>
				</div>
			</header>
			<section
				className="prayer-card-grid"
				aria-label="Prayer information"
			>
				<PrayerTimesCard prayers={prayers} />
				<NextPrayerCard prayers={prayers} date={date} />
				<IslamicDateCard date={date} />
				<TimeCard date={date} />
			</section>
		</main>
	);
}

export default PrayerTimes;
