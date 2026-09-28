import TaskStatusCard from "../../Components/Cards/TaskStatusCard";
import PageHeader from "../../Components/PageHeader";
import TodoPreviewCard from "../../Components/Cards/TodoPreviewCard";
import TodayEventsCard from "../../Components/Cards/TodayEventsCard";
import IslamicDateCard from "../../Components/Cards/IslamicDateCard";
import NextPrayerCard from "../../Components/Cards/NextPrayerCard";
import PhotoGallery from "../../Components/PhotoGallery.jsx";
import TimeCard from "../../Components/Cards/TimeCard";
import { useEffect } from "react";
import { usePosition } from "../../hooks/usePosition.js";
import { dateToString, toDateKey } from "../../Utils/dateUtilities";
import { formatLocation, getCurrentAndNextTask } from "../../Utils/Utils";
import { format } from "../../Utils/timeUtilities";
import { useDate } from "../../Utils/useTime";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api.js";
import pinLocation from "../../assets/icons/location-pin.png";
import useData from "../../Utils/useData.js";
import { useAppContext } from "../../Context.jsx";

function Home() {
	const { addError } = useAppContext();
	const date = useDate();
	const { data: Tasks } = useData("tasks");
	const { data: events } = useData("events");
	const { data: Todos } = useData("todos");

	const dateString = dateToString(date);
	const [position, error] = usePosition();
	const { data: location, error: locationError } = useQuery({
		queryKey: ["location", position],
		queryFn: () => api.location.get(position),
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
	const todayKey = toDateKey(date);
	const currentDayIndex = (date.getDay() + 6) % 7;
	const { current, next } = getCurrentAndNextTask(
		format(date).hour24,
		Tasks?.filter((task) => task.days[currentDayIndex]),
	);
	const todaysEvents = events?.filter((event) =>
		event.start.startsWith(todayKey),
	);

	useEffect(() => {
		if (locationError) addError(locationError);
		if (prayersError) addError(prayersError);
		if (error) addError(error);
	}, [locationError, prayersError, error]);

	return (
		<main>
			<PageHeader
				title="Good morning, Younes."
				description={
					location ? (
						<span className="d-flex align-items-center gap-1">
							<img src={pinLocation} alt="" style={{ width: '16px', height: '16px' }} />
							{formatLocation(location)}
						</span>
					) : null
				}
			/>
			<section>
				<div>
					<TimeCard date={date} />
				</div>
				<div>
					<IslamicDateCard date={date} />
					<NextPrayerCard
						prayers={prayers?.data.timings}
						date={date}
						small={true}
					/>
				</div>
				<TaskStatusCard currentTask={current} nextTask={next} />
				<div>
					<TodayEventsCard events={todaysEvents} date={date} />
					<TodoPreviewCard todos={Todos} />
				</div>
				<PhotoGallery />
			</section>
		</main>
	);
}

export default Home;
