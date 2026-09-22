import "./Navlist.css";
import { NavLink } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useAppContext } from "../Context.jsx";

const Navlist = ({ List }) => {
	const { theme, toggleTheme } = useAppContext();
	const isLightTheme = theme === "light";

	return (
		<>
			<NavLink
				className="navbar-brand d-flex align-items-center fs-3 h1 my-3 mx-3 p-0"
				to="/"
				style={{ cursor: "pointer" }}
				end
			>
				<img src="logo.png" className="icon me-2" alt="" />
				MyTODO
			</NavLink>
			<div className={`flex-grow-1 flex-column py-5 align-self-start`}>
				{List.map((item, index) => {
					const path = item.toLowerCase().replace(/\s+/g, "");
					return (
						<NavLink
							to={`/${path}`}
							className={({ isActive }) =>
								`d-flex align-items-center text-decoration-none nav-item my-1 py-1 ${isActive ? "active" : ""}`
							}
							key={index}
							style={{ cursor: "pointer" }}
						>
							<div className="active-indicator me-3"></div>
							<img
								src={`./Pages/${item
									.toLowerCase()
									.replace(/\s+/g, "")}.png`}
								className="me-2"
								alt=""
							/>
							{item}
						</NavLink>
					);
				})}
			</div>
			<button
				type="button"
				className="theme-toggle btn btn-outline-secondary align-self-start"
				onClick={toggleTheme}
				aria-label={
					isLightTheme
						? "Switch to dark theme"
						: "Switch to light theme"
				}
				title={isLightTheme ? "Dark theme" : "Light theme"}
			>
				{isLightTheme ? <Moon size={18} /> : <Sun size={18} />}
			</button>
		</>
	);
};

export default Navlist;
