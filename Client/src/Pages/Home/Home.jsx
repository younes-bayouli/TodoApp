import TaskStatusCard from "../../Components/Cards/TaskStatusCard";
import TodoPreviewCard from "../../Components/Cards/TodoPreviewCard";
import TodayEventsCard from "../../Components/Cards/TodayEventsCard";
import IslamicDateCard from "../../Components/Cards/IslamicDateCard";
import NextPrayerCard from "../../Components/Cards/NextPrayerCard";
import PhotoCard from "../../Components/Cards/PhotoCard";
import TimeCard from "../../Components/Cards/TimeCard";
import { useEffect, useState } from "react";
import { usePosition } from "../../hooks/usePosition.js";
import { dateToString, toDateKey } from "../../Utils/dateUtilities";
import { getCurrentAndNextTask } from "../../Utils/Utils";
import { format } from "../../Utils/timeUtilities";
import { useDate } from "../../Utils/useTime";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api.js";
import pinLocation from "../../assets/icons/location-pin.png";
import "./Home.css";
import ErrorMessage from "../../Components/error.jsx";
import { useAppContext } from "../../Context.jsx";

const photos = Object.values(
	import.meta.glob("../../assets/Photos/*.{jpg,jpeg,png,webp}", {
		eager: true,
		query: "?url",
		import: "default",
	}),
);
let nextPhotoIndex = 0;

function Home() {
	const { addError, removeError } = useAppContext();
	const date = useDate();
	const { data: Tasks, error: tasksError } = useQuery({
		queryKey: ["tasks"],
		queryFn: api.tasks.getAll,
	});
	const { data: events, error: eventsError } = useQuery({
		queryKey: ["events"],
		queryFn: api.events.getAll,
	});
	const { data: Todos, error: todosError } = useQuery({
		queryKey: ["todos"],
		queryFn: api.todos.getAll,
	});
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
	const [photo] = useState(() => {
		const selectedPhoto = photos[nextPhotoIndex % photos.length];
		nextPhotoIndex += 1;
		return selectedPhoto;
	});
	const todayKey = toDateKey(date);
	const currentDayIndex = (date.getDay() + 6) % 7;
	const { current, next } = getCurrentAndNextTask(
		format(date).hour24,
		Tasks,
		currentDayIndex,
	);
	const todaysEvents = events?.filter((event) =>
		event.start.startsWith(todayKey),
	);

	useEffect(() => {
		addError(eventsError);
	}, [eventsError]);
	
	useEffect(() => {
		addError(tasksError);
	}, [tasksError]);

	useEffect(() => {
		addError(todosError);
	}, [todosError]);

	useEffect(() => {
		addError(locationError);
	}, [locationError]);

	useEffect(() => {
		addError(prayersError);
	}, [prayersError]);

	useEffect(() => {
		addError(error);
	}, [error]);

	return (
		<main className="home-page">
			<header className="home-intro">
				<div>
					<h1>Good morning, Younes.</h1>
				</div>
				{location && (
					<span className="prayer-page-location">
						<img src={pinLocation} alt="" />
						{`${location?.country}, ${location?.county}, ${location?.state_district}`}
					</span>
				)}
			</header>
			<section className="home-gallery" aria-label="Daily overview">
				<div className="home-card home-time-card">
					<TimeCard date={date} />
				</div>
				<div className="d-flex gap-3">
					<IslamicDateCard date={date} />
					<NextPrayerCard
						prayers={prayers?.data.timings}
						className="flex-fill"
						date={date}
						small={true}
					/>
				</div>
				<TaskStatusCard currentTask={current} nextTask={next} />
				<div className="d-flex gap-3">
					<TodayEventsCard events={todaysEvents} date={date} />
					<TodoPreviewCard todos={Todos} />
				</div>
				<PhotoCard photo={photo} />
			</section>
		</main>
	);
}

export default Home;
