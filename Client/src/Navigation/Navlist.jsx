import "./Navlist.css";
import { NavLink } from "react-router-dom";

const Navlist = ({ List }) => {
	return (
		<>
			<NavLink
				className="navbar-brand d-flex align-items-center fs-3 h1 my-3 mx-3 p-0"
				to="/"
				style={{ cursor: "pointer" }}
				end
			>
				<img src="../src/icons/todo.png" className="icon me-2" alt="" />
				MyTODO
			</NavLink>
			<div className={`flex-grow-1 flex-column py-5 align-self-start`}>
				{List.map((item, index) => {
					const path = item.toLowerCase().replace(/\s+/g, "");
					return (
						<NavLink
							to={`/${path}`}
							className={({ isActive }) =>
								`text-secondary d-flex align-items-center text-decoration-none nav-item my-1 py-1 ${isActive ? "active" : ""}`
							}
							key={index}
							style={{ cursor: "pointer" }}
						>
							<div className="active-indicator me-3"></div>
							<img
								src={`../src/icons/${item
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
		</>
	);
};

export default Navlist;
