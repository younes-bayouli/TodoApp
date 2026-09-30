import TimeBar from "./TimeBar";
import { memo } from "react";

const TimeList = Array.from(
	{ length: 24 },
	(_, i) => `${String(i).padStart(2, "0")}:00`,
);

const StaticTimeBars = memo(() => {
	return (
		<>
			{TimeList.map((item, key) => {
				return (
					<TimeBar key={item} LeftMargin={key * 100} time={item} />
				);
			})}
		</>
	);
});

export default StaticTimeBars;
