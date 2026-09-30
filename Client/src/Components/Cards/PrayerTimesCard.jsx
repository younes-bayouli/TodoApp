import { Sunrise, Sunset, Sun, Moon, SunMoon } from "lucide-react";
import Card from "../Composite/Card";

// Fixed display order, independent of what the API returns. The API
// also sends Sunset, which is not one of the six shown here.
const PRAYERS = [
	{ key: "Fajr", label: "Fajr", Icon: Sunrise },
	{ key: "Sunrise", label: "Sunrise", Icon: Sunrise },
	{ key: "Dhuhr", label: "Dhuhr", Icon: Sun },
	{ key: "Asr", label: "Asr", Icon: SunMoon },
	{ key: "Maghrib", label: "Maghrib", Icon: Sunset },
	{ key: "Isha", label: "Isha", Icon: Moon },
];

function PrayerTimesCard({ prayers = {}, nextPrayer }) {
	return (
		<Card name="card-prayers" className="prayer-times-card" padding="large">
			<article className="prayer-times">
				<header className="prayer-times-header">
					<h3>Prayer times</h3>
				</header>

				<ul className="prayer-times-list">
					{PRAYERS.map(({ key, label, Icon }) => (
						<li
							key={key}
							className={`prayer-row${
								nextPrayer === label ? " is-next" : ""
							}`}
						>
							<Icon
								className="prayer-row-icon"
								aria-hidden="true"
							/>
							<span className="prayer-row-name">{label}</span>
							<time className="prayer-row-time">
								{prayers?.[key] ?? "--:--"}
							</time>
						</li>
					))}
				</ul>
			</article>
		</Card>
	);
}

export default PrayerTimesCard;
