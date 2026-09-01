import fajrIcon from "../../assets/icons/prayerIcons/fajr.png";
import sunriseIcon from "../../assets/icons/prayerIcons/sunrise.png";
import dhuhrIcon from "../../assets/icons/prayerIcons/dhuhr.png";
import asrIcon from "../../assets/icons/prayerIcons/asr.png";
import maghribIcon from "../../assets/icons/prayerIcons/ma8rib.png";
import ishaIcon from "../../assets/icons/prayerIcons/isha.png";

const prayerLabels = {
	fajr: "Fajr",
	sunrise: "Sunrise",
	dhuhr: "Dhuhr",
	asr: "Asr",
	maghrib: "Maghrib",
	isha: "Isha",
};

const prayerIcons = {
	Fajr: fajrIcon,
	Sunrise: sunriseIcon,
	Dhuhr: dhuhrIcon,
	Asr: asrIcon,
	Maghrib: maghribIcon,
	Isha: ishaIcon,
};

function PrayerTimesCard({ prayers=[] }) {
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
				{Object.entries(prayers).slice(0,7).filter((prayer)=> prayer[0]!=="Sunset").map(([key, time]) => (
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
