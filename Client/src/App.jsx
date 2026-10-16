import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Navlist from "./Navigation/Navlist";
import EveryDayTasks from "./Pages/EveryDayTasks/EveryDayTasks.jsx";
import TodoList from "./Pages/TodoList/TodoList.jsx";
import Calendar from "./Pages/Calendar/Calendar.jsx";
import Projects from "./Pages/Projects/Projects.jsx";
import Home from "./Pages/Home/Home.jsx";
import PrayerTimes from "./Pages/PrayerTimes/PrayerTimes.jsx";
import Settings from "./Pages/Settings/Settings.jsx";
import ErrorMessage from "./Components/Composite/Error.jsx";
import { useAppContext } from "./Context.jsx";
import { useEffect, useState } from "react";
import Button from "./Components/Basic/Button.jsx";
import EnableNotifications from "./Notifications/notifications.js";

function First() {
	return (
		<div className="d-flex align-items-center justify-content-center flex-column h-100">
			<h3>Welcome, Younes. Happy Engineering!</h3>
		</div>
	);
}

function App() {
	const { errors, nbrErr, removeError } = useAppContext();
	const [hiddenIndex, setHiddenIndex] = useState(1);

	useEffect(() => {
		if (errors?.length === 0) return;

		const timer = setTimeout(() => {
			document
				.getElementById(`error-${hiddenIndex}`)
				?.classList.add("hidden");
			setHiddenIndex((prevIndex) => prevIndex + 1);
		}, 5000);

		return () => clearTimeout(timer);
	}, [errors]);

	return (
		<>
			<BrowserRouter>
				<div
					className="app-shell d-flex"
					style={{ minHeight: "100vh" }}
				>
					<Navlist />
					{errors?.length > 0 && (
						<div className="app-error-stack">
							{errors.map((error, index) => {
								return (
									<ErrorMessage
										id={`error-${nbrErr - index}`}
										className={`slide-left`}
										key={index}
										error={error}
										onTransitionEnd={removeError}
									/>
								);
							})}
						</div>
					)}
					{/* min-width:0 lets wide pages scroll rather than forcing
					    the shell wider than the viewport. */}
					<div className="app-content flex-grow-1 overflow-y-auto d-flex flex-column">
						<Routes>
							<Route path="/" element={<First />} />
							<Route path="/home" element={<Home />} />
							<Route
								path="/prayertimes"
								element={<PrayerTimes />}
							/>
							<Route path="/todolist" element={<TodoList />} />
							<Route path="/projects" element={<Projects />} />
							<Route
								path="/myeveryday"
								element={<EveryDayTasks />}
							/>
							<Route path="/calender" element={<Calendar />} />
							<Route path="/settings" element={<Settings />} />
						</Routes>
					</div>
				</div>
			</BrowserRouter>
		</>
	);
}

export default App;
