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
import { formatLocation } from "../../Utils/Utils";

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
		<main>
			<header>
				<h1>Prayer Times</h1>
				{location && (
					<span>
						<img src={pinLocation} alt="" />
						{formatLocation(location)}
					</span>
				)}
			</header>
			<section
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
