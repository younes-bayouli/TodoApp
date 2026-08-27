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

function App() {
	const pagesList = [
		"Home",
		"TODO list",
		"Projects",
		"MyEveryday",
		"Calender",
	];
	return (
		<>
			<BrowserRouter>
				<div className="d-flex p-0">
					<nav className="navbar vh-100 p-4 d-flex flex-column">
						<Navlist List={pagesList}></Navlist>
					</nav>
					<div className="span"></div>
					<div className="flex-grow-1 p-5 overflow-auto">
						<Routes>
							<Route path="/" element={<first />} />
							<Route path="/home" element={<Home />} />
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
