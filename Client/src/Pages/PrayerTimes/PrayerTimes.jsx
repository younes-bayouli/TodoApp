import PrayerTimesCard from "../../Components/Cards/PrayerTimesCard";
import PageHeader from "../../Components/Composite/PageHeader";
import IslamicDateCard from "../../Components/Cards/IslamicDateCard";
import NextPrayerCard from "../../Components/Cards/NextPrayerCard";
import TimeCard from "../../Components/Cards/TimeCard";
import { useDate } from "../../Utils/useTime";
import { dateToString } from "../../Utils/dateUtilities";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";
import { usePosition } from "../../hooks/usePosition";
import { useAppContext } from "../../Context";
import { useEffect } from "react";
import { formatLocation, getNextPrayer } from "../../Utils/Utils";
import { MapPin } from "lucide-react";
import "../../styles/prayertimes.css";
import { data } from "react-router-dom";

function PrayerTimes() {
	const { addError } = useAppContext();
	const date = useDate();
	const dateString = dateToString(date);
	const [position, error] = usePosition();
	const { data: location, error: locationError } = useQuery({
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

	const timings = prayers?.data.timings;
	const nextPrayer = getNextPrayer(timings, date);

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
		<div className="page">
			<PageHeader title="Prayer Times">
				{location && (
					<div className="d-flex align-items-center gap-1 text-muted fs-6">
						<MapPin
							className="d-block flex-shrink-0"
							size={16}
							aria-hidden="true"
						/>
						{formatLocation(location)}
					</div>
				)}
			</PageHeader>

			<section className="prayer-grid" aria-label="Prayer information">
				<PrayerTimesCard prayers={timings} nextPrayer={nextPrayer} />
				<IslamicDateCard date={date} />
				<NextPrayerCard date={date} nextPrayer={nextPrayer} large />
				<TimeCard date={date} />
			</section>
		</div>
	);
}

export default PrayerTimes;
