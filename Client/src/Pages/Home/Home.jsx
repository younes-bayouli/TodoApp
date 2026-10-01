import TaskStatusCard from "../../Components/Cards/TaskStatusCard";
import TodoPreviewCard from "../../Components/Cards/TodoPreviewCard";
import TodayEventsCard from "../../Components/Cards/TodayEventsCard";
import IslamicDateCard from "../../Components/Cards/IslamicDateCard";
import NextPrayerCard from "../../Components/Cards/NextPrayerCard";
import PhotoGallery from "../../Components/Composite/PhotoGallery.jsx";
import TimeCard from "../../Components/Cards/TimeCard";
import { useEffect } from "react";
import { usePosition } from "../../hooks/usePosition.js";
import { dateToString, toDateKey } from "../../Utils/dateUtilities";
import {
	formatLocation,
	getCurrentAndNextTask,
	getNextPrayer,
} from "../../Utils/Utils";
import { format } from "../../Utils/timeUtilities";
import { useDate } from "../../Utils/useTime";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api.js";
import useData from "../../Utils/useData.js";
import { useAppContext } from "../../Context.jsx";
import PageHeader from "../../Components/Composite/PageHeader.jsx";
import { MapPin } from "lucide-react";
import "../../styles/home.css";

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

	const nextPrayer = getNextPrayer(prayers?.data.timings, date);

	return (
		<div className="page">
			<PageHeader title={"Good morning, Younes."}>
				{location && (
					<div className="d-flex align-items-center gap-1 text-muted fs-6">
						{/* MapPin inherits the row's font-size; pin it to a
						    fixed square so it does not scale with it. */}
						<MapPin className="d-block flex-shrink-0" size={16} />
						{formatLocation(location)}
					</div>
				)}
			</PageHeader>

			<div className="home-grid">
				<TimeCard date={date} />
				<IslamicDateCard date={date} />
				<NextPrayerCard nextPrayer={nextPrayer} date={date} large />
				<TodayEventsCard events={todaysEvents} date={date} />
				<div className="d-flex flex-column gap-3">
					<TaskStatusCard
						currentTask={current}
						nextTask={next}
						split
						className="home-task-status"
					/>
					<TodoPreviewCard todos={Todos} />
				</div>
				<PhotoGallery />
			</div>
		</div>
	);
}

export default Home;
