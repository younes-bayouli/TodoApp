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
import { formatLocation } from "../../Utils/Utils";
import { MapPin } from "lucide-react";

// Matches NextPrayerCard's own prayer order, so the highlight in the
// list and the card above it always name the same prayer.
const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

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
	const nextPrayer = PRAYER_NAMES.find((name) => {
		if (!timings?.[name]) return false;
		const [hours, minutes] = timings[name].split(":").map(Number);
		const prayerDate = new Date(date);
		prayerDate.setHours(hours, minutes, 0, 0);
		return prayerDate > date;
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
				<NextPrayerCard prayers={timings} date={date} large />
				<TimeCard date={date} />
			</section>
		</div>
	);
}

export default PrayerTimes;
