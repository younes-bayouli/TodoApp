import fajrIcon from "../../icons/fajr.png";
import sunriseIcon from "../../icons/sunrise.png";
import dhuhrIcon from "../../icons/dhuhr.png";
import asrIcon from "../../icons/asr.png";
import maghribIcon from "../../icons/ma8rib.png";
import ishaIcon from "../../icons/isha.png";
import prayerTimesIcon from "../../icons/prayertimes.png";

const prayerLabels = {
	fajr: "Fajr",
	sunrise: "Sunrise",
	dhuhr: "Dhuhr",
	asr: "Asr",
	maghrib: "Maghrib",
	isha: "Isha",
};

const prayerIcons = {
	fajr: fajrIcon,
	sunrise: sunriseIcon,
	dhuhr: dhuhrIcon,
	asr: asrIcon,
	maghrib: maghribIcon,
	isha: ishaIcon,
};

function PrayerTimesCard({ prayers }) {
	return (
		<article className="card shadow-sm border rounded bg-white p-4 h-100 prayer-times-card">
			<div className="d-flex align-items-start justify-content-between mb-3">
				<div>
					<p className="text-secondary small fw-semibold text-uppercase mb-1">
						Today
					</p>
					<h2>Prayer times</h2>
				</div>
			</div>
			<div className="prayer-times-list">
				{Object.entries(prayers).map(([key, time]) => (
					<div className="prayer-time-row" key={key}>
						<div className="prayer-time-name">
							<img
								src={prayerIcons[key]}
								className="prayer-time-icon"
								alt=""
							/>
							{prayerLabels[key] ?? key}
						</div>
						<time>{time}</time>
					</div>
				))}
			</div>
		</article>
	);
}

export default PrayerTimesCard;
