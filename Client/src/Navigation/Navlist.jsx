import { NavLink } from "react-router-dom";
import { Settings } from "lucide-react";

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
	{ to: "/settings", label: "Settings", icon: Settings },
];

const Navlist = () => {
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
							{typeof item.icon === "string" ? (
								<img
									src={item.icon}
									alt=""
									className="app-nav-link-icon"
								/>
							) : (
								<item.icon
									size={18}
									className="app-nav-link-icon"
									aria-hidden="true"
								/>
							)}
							{item.label}
						</NavLink>
					))}
				</div>
			</div>
		</nav>
	);
};

export default Navlist;
