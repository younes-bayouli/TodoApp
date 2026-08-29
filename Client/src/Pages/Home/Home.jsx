import { useState } from "react";
import PhotoCard from "../../Components/Cards/PhotoCard";
import TimeCard from "../../Components/Cards/TimeCard";
import TaskStatusCard from "../../Components/Cards/TaskStatusCard";
import TodoPreviewCard from "../../Components/Cards/TodoPreviewCard";
import TodayEventsCard from "../../Components/Cards/TodayEventsCard";
import IslamicDateCard from "../../Components/Cards/IslamicDateCard";
import NextPrayerCard from "../../Components/Cards/NextPrayerCard";
import fakeEvents from "../../fakeData/fakeEvents.json";
import fakeTodos from "../../fakeData/fakeTodos.json";
import prayers from "../../fakeData/fakePrayers.json";
import { toDateKey } from "../../Utils/dateUtilities";
import { useDate } from "../../Utils/useTime";
import { format } from "../../Utils/timeUtilities";
import { getCurrentAndNextTask } from "../../Utils/Utils";
import "./Home.css";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api.js";

const photos = Object.values(
	import.meta.glob("../../Photos/*.{jpg,jpeg,png,webp}", {
		eager: true,
		query: "?url",
		import: "default",
	}),
);
let nextPhotoIndex = 0;

function Home() {
	const {
		data:Tasks
	}=useQuery({
		queryKey:["tasks"],
		queryFn:api.tasks.getAll
	})
	const {data:events}=useQuery({
		queryKey:["events"],
		queryFn:api.events.getAll
	})
	const [photo] = useState(() => {
		const selectedPhoto = photos[nextPhotoIndex % photos.length];
		nextPhotoIndex += 1;
		return selectedPhoto;
	});
	const {
        data: Todos
    } = useQuery({
        queryKey: ["todos"],
        queryFn: api.todos.getAll
    });
	const date = useDate();
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

	return (
		<main className="home-page">
			<header className="home-intro">
				<div>
					<h1>Good morning, Younes.</h1>
				</div>
				<p className="home-intro-note">
					A small view of what matters today.
				</p>
			</header>
			<section className="home-gallery" aria-label="Daily overview">
				<div className="home-card home-time-card">
					<TimeCard date={date} />
				</div>
				<div className="d-flex gap-3">
					<IslamicDateCard date={date} />
					<NextPrayerCard prayers={prayers} className="flex-fill" date={date} small={true}/>
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
