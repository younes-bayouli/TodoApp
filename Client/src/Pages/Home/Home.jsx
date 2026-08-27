import TodayEventsCard from "../../Components/Cards/TodayEventsCard";
import PhotoCard from "../../Components/Cards/PhotoCard";
import TodoPreviewCard from "../../Components/Cards/TodoPreviewCard";
import TimeCard from "../../Components/Cards/TimeCard";
import TaskStatusCard from "../../Components/Cards/TaskStatusCard";
import fakeEvents from "../../fakeData/fakeEvents.json";
import fakeTodos from "../../fakeData/fakeTodos.json";
import fakeTasks from "../../fakeData/fakeTasks.json";
import { toDateKey } from "../../Utils/dateUtilities";
import { useDate } from "../../Utils/useTime";
import { format } from "../../Utils/timeUtilities";
import { getCurrentAndNextTask } from "../../Utils/Utils";
import "./Home.css";

function Home({ photo }) {
	const date = useDate();
	const todayKey = toDateKey(date);
	const currentDayIndex = (date.getDay() + 6) % 7;
	const { current, next } = getCurrentAndNextTask(
		format(date).hour24,
		fakeTasks,
		currentDayIndex,
	);
	const todaysEvents = fakeEvents.filter((event) =>
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
				<div className="home-card home-status-card">
					<TaskStatusCard currentTask={current} nextTask={next} />
				</div>
				<TodayEventsCard events={todaysEvents} date={date} />
				<PhotoCard photo={photo} />
				<TodoPreviewCard todos={fakeTodos} />
			</section>
		</main>
	);
}

export default Home;
