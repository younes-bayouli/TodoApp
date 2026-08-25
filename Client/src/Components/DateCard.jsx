import React, { useEffect } from "react";

function DateCardH({
	all = "show",
	day = all,
	month = all,
	year = all,
	dayint = all,
	hour = all,
	hour12 = true,
	date,
}) {

	return (
		<>
			<h3 className={`visually-${hour}`}>
				{hour12 ? date.time.hour12 : date.time.hour24}
			</h3>
			<div>
				<pre className="d-flex m-0 justify-content-center">
					<h1 className={`visually-${day} m-0`}>{date.date.day} </h1>
					<p className={`visually-${month} m-0`}>
						{date.date.month}{" "}
					</p>
					<p className={`visually-${dayint} m-0`}>{date.date.date}</p>
					<p className={`visually-${year} m-0`}>{date.date.year}</p>
				</pre>
			</div>
		</>
	);
}

const DateCard = React.memo(DateCardH);

export default DateCard;
