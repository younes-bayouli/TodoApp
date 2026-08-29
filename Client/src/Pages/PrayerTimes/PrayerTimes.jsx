import PrayerTimesCard from "../../Components/Cards/PrayerTimesCard";
import IslamicDateCard from "../../Components/Cards/IslamicDateCard";
import NextPrayerCard from "../../Components/Cards/NextPrayerCard";
import TimeCard from "../../Components/Cards/TimeCard";
import { useDate } from "../../Utils/useTime";
import "./PrayerTimes.css";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";
import { formatDate } from "../../Utils/dateUtilities";

function PrayerTimes() {
	const date = useDate();
	const { data:location, isLoading, error } = useQuery({
        queryKey: ["location"],
        queryFn: api.location.get,
    });
	const { data: prayers } = useQuery({
		queryKey: ["prayers"],
		queryFn: ()=>api.prayerTimes.get(location?.latitude,location?.longitude),
	});

	console.log(formatDate(date))

	return (
		<main className="prayer-page h-100 w-100 min-vh-0 d-flex flex-column">
			<header className="prayer-page-header d-flex align-items-center justify-content-between gap-3 mb-3 flex-shrink-0">
				<h1 className="mb-0 fw-semibold">Prayer Times</h1>
				{true && (
					<span className="prayer-page-location">
						<img src="../../src/icons/location-pin.png" alt="" />
						{`${location?.country}, ${location?.county}, ${location?.state_district}`}
					</span>
				)}
				{!isLoading && error && (
					<span className="prayer-page-location text-danger">
						{error}
					</span>
				)}
			</header>
			<section
				className="prayer-card-grid"
				aria-label="Prayer information"
			>
				<PrayerTimesCard prayers={prayers?.data.timings} />
				<NextPrayerCard prayers={prayers?.data.timings} date={date} />
				<IslamicDateCard date={date} />
				<TimeCard date={date} />
			</section>
		</main>
	);
}

export default PrayerTimes;
