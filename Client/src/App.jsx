import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Routes, Route, BrowserRouter, NavLink } from "react-router-dom";
import Navlist from "./Navigation/Navlist";
import EveryDayTasks from "./Pages/EveryDayTasks/EveryDayTasks.jsx";
import TodoList from "./Pages/TodoList/TodoList.jsx";
import Calendar from "./Pages/Calendar/Calendar.jsx";
import Projects from "./Pages/Projects/Projects.jsx";
import Home from "./Pages/Home/Home.jsx";
import PrayerTimes from "./Pages/PrayerTimes/PrayerTimes.jsx";
import ErrorMessage from "./Components/error.jsx";
import { useAppContext } from "./Context.jsx";
import { use, useEffect, useState } from "react";

function First() {
	return (
		<div className="d-flex align-items-center justify-content-center flex-column h-100">
			<h3>Welcome, Younes. Happy Engineering!</h3>
		</div>
	);
}

function App() {
	const { errors,nbrErr, removeError } = useAppContext();
	const [hiddenIndex, setHiddenIndex] = useState(1);
	
	useEffect(() => {
		if (errors?.length === 0) return;

		const timer = setTimeout(() => {
			console.log(`hidingerror-${hiddenIndex}`);
			document
				.getElementById(`error-${hiddenIndex}`)
				?.classList.add("hidden");
				setHiddenIndex((prevIndex) => prevIndex + 1);
		}, 5000);

		return () => clearTimeout(timer);
	}, [errors]);

	const pagesList = [
		"Home",
		"TODO list",
		"Prayer Times",
		"Projects",
		"MyEveryday",
		"Calender",
	];
	return (
		<>
			<BrowserRouter>
				<div className="d-flex p-0 app-shell">
					<nav className="navbar vh-100 p-4 d-flex flex-column">
						<Navlist List={pagesList}></Navlist>
						{errors?.length > 0 && (
							<div
								className="m-3"
								style={{
									position: "fixed",
									bottom: 0,
									left: 0,
									zIndex: 1000,
								}}
							>
								{errors.map((error, index) => {
									console.log(`showing error-${nbrErr-index}`);
									return (
										<ErrorMessage
											id={`error-${nbrErr-index}`}
											className={`slide-left`}
											key={index}
											error={error}
											onTransitionEnd={
												removeError
											}
										/>
									);
								})}
							</div>
						)}
					</nav>
					<div className="span"></div>
					<div className="flex-grow-1 app-content p-4 overflow-auto">
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
								path="/Myeveryday"
								element={<EveryDayTasks />}
							/>
							<Route path="/calender" element={<Calendar />} />
						</Routes>
					</div>
				</div>
			</BrowserRouter>
		</>
	);
}

export default App;
