import { useEffect, useState } from "react";

export function usePosition() {
	const [location, setLocation] = useState(null);
	const [error, setError] = useState(null);
	useEffect(() => {
		if (!navigator.geolocation) {
			setLocation({ latitude: 36.422575, longitude: 10.666789 });
			setError(
				new Error("Geolocation is not supported by this browser."),
			);
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(pos) => {
                const {latitude,longitude}=pos.coords;
				setLocation({latitude,longitude});
				setError(null);
			},
			(error) => {
				setLocation({ latitude: 36.422575, longitude: 10.666789 });
				setError(error);
			},
		);
	}, []);
	return [location, error];
}
