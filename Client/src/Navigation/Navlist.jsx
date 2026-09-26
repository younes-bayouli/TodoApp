import { NavLink } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useAppContext } from "../Context.jsx";

const Navlist = ({ List }) => {
	const {toggleTheme,theme}=useAppContext();
	const isLightTheme=theme==="light"

	return (
		<>
			<NavLink
				to="/"
				style={{ cursor: "pointer" }}
				end
			>
				<img src="logo.png" alt="" />
				MyTODO
			</NavLink>
			<div>
				{List.map((item, index) => {
					const path = item.toLowerCase().replace(/\s+/g, "");
					return (
						<NavLink
							to={`/${path}`}
							className={({ isActive }) =>
								`${isActive ? "active" : ""}`
							}
							key={index}
						>
							<div></div>
							<img
								src={`./Pages/${item
									.toLowerCase()
									.replace(/\s+/g, "")}.png`}
								alt=""
							/>
							{item}
						</NavLink>
					);
				})}
			</div>
			<button
				type="button"
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
