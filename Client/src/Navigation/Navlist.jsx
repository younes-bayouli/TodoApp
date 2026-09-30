import { NavLink } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useAppContext } from "../Context.jsx";
import IconButton from "../Components/Composite/IconButton.jsx";

// Routes are written out, not derived from the label. The old
// `label.toLowerCase().replace(/\s+/g, "")` coupling meant renaming a
// label silently changed the URL it points at.
const NAV_ITEMS = [
	{ to: "/home", label: "Home", icon: "/Pages/home.png" },
	{ to: "/todolist", label: "TODO list", icon: "/Pages/todolist.png" },
	{
		to: "/prayertimes",
		label: "Prayer Times",
		icon: "/Pages/prayertimes.png",
	},
	{ to: "/projects", label: "Projects", icon: "/Pages/projects.png" },
	{ to: "/myeveryday", label: "MyEveryday", icon: "/Pages/myeveryday.png" },
	{ to: "/calender", label: "Calender", icon: "/Pages/calender.png" },
];

const Navlist = () => {
	const { toggleTheme, theme } = useAppContext();
	const nextTheme = theme === "light" ? "dark" : "light";

	return (
		<nav className="app-nav flex-shrink-0" aria-label="Main">
			<div className="app-nav-inner">
				<NavLink to="/" end className="app-nav-brand">
					<img
						src="/logo.png"
						alt=""
						className="app-nav-brand-logo"
					/>
					MyTODO
				</NavLink>

				<div className="app-nav-links">
					{NAV_ITEMS.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							className={({ isActive }) =>
								isActive
									? "app-nav-link active"
									: "app-nav-link"
							}
						>
							<img
								src={item.icon}
								alt=""
								className="app-nav-link-icon"
							/>
							{item.label}
						</NavLink>
					))}
				</div>

				<div className="app-nav-actions">
					<IconButton
						variant="secondary"
						ariaLabel={`Switch to ${nextTheme} theme`}
						title={`Switch to ${nextTheme} theme`}
						onClick={toggleTheme}
					>
						{theme === "light" ? (
							<Moon size={18} />
						) : (
							<Sun size={18} />
						)}
					</IconButton>
				</div>
			</div>
		</nav>
	);
};

export default Navlist;
