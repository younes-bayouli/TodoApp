import PrayerTimesCard from "../../Components/Cards/PrayerTimesCard";
import IslamicDateCard from "../../Components/Cards/IslamicDateCard";
import NextPrayerCard from "../../Components/Cards/NextPrayerCard";
import TimeCard from "../../Components/Cards/TimeCard";
import { useDate } from "../../Utils/useTime";
import { dateToString } from "../../Utils/dateUtilities";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";
import pinLocation from "../../assets/icons/location-pin.png"
import "./PrayerTimes.css";
import { usePosition } from "../../hooks/usePosition";
import { useAppContext } from "../../Context";
import { useEffect } from "react";

function PrayerTimes() {
	const { addError } = useAppContext();
	const date = useDate();
	const dateString = dateToString(date);
	const [position, error] = usePosition();
	const {
		data: location,
		error:locationError
	} = useQuery({
		queryKey: ["location", position, error],
		queryFn: () => api.location.get(position, error),
		enabled: !!position?.latitude && !!position?.longitude,
	});
	const { data: prayers, error: prayersError } = useQuery({
		queryKey: ["prayers", position],
		queryFn: () =>
			api.prayerTimes.get(
				position?.latitude,
				position?.longitude,
				dateString,
			),
		enabled: !!position?.latitude && !!position?.longitude,
	});

	useEffect(() => {
		addError(error);
	}, [error]);

	useEffect(() => {
		addError(locationError);
	}, [locationError]);

	useEffect(() => {
		addError(prayersError);
	}, [prayersError]);

	return (
		<main className="prayer-page h-100 w-100 min-vh-0 d-flex flex-column">
			<header className="prayer-page-header d-flex align-items-center justify-content-between gap-3 mb-3 flex-shrink-0">
				<h1 className="mb-0 fw-semibold">Prayer Times</h1>
				{location && (
					<span className="prayer-page-location">
						<img src={pinLocation} alt="" />
						{`${location?.country}, ${location?.county}, ${location?.state_district}`}
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
