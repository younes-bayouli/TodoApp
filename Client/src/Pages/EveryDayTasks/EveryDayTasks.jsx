import Schedule from "./Schedule.jsx";

function Myeveryday() {

	return (
		<>
			<div className="d-flex flex-column h-100">
				<h3>My Every Day</h3>
				<div className="flex-grow-1 d-flex flex-column gap-3">
					<Schedule></Schedule>
					<div className="w-100 flex-grow-1"></div>
				</div>
			</div>
		</>
	);
}

export default Myeveryday;
