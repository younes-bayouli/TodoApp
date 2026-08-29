const API_URL = import.meta.env.VITE_API_URL;
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

async function request(endpoint, fullEndpoint = false, options = {}) {
	const response = await fetch(`${fullEndpoint ? "" : API_URL}${endpoint}`, {
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
		...options,
	});

	if (!response.ok) {
		throw new Error(`Request failed: ${response.status}`);
	}

	if (response.status === 204) {
		return null;
	}

	return response.json();
}

export const api = {
	todos: {
		getAll: () => request("/todos"),
		getById: (id) => request(`/todos/${id}`),

		create: (todo) =>
			request("/todos", {
				method: "POST",
				body: JSON.stringify(todo),
			}),

		update: (id, todo) =>
			request(`/todos/${id}`, {
				method: "PUT",
				body: JSON.stringify(todo),
			}),

		delete: (id) =>
			request(`/todos/${id}`, {
				method: "DELETE",
			}),
	},

	events: {
		getAll: () => request("/events"),
		getById: (id) => request(`/events/${id}`),

		create: (event) =>
			request("/events", {
				method: "POST",
				body: JSON.stringify(event),
			}),

		update: (id, event) =>
			request(`/events/${id}`, {
				method: "PUT",
				body: JSON.stringify(event),
			}),

		delete: (id) =>
			request(`/events/${id}`, {
				method: "DELETE",
			}),
	},

	projects: {
		getAll: () => request("/projects"),
		getById: (id) => request(`/projects/${id}`),

		create: (project) =>
			request("/projects", {
				method: "POST",
				body: JSON.stringify(project),
			}),

		update: (id, project) =>
			request(`/projects/${id}`, {
				method: "PUT",
				body: JSON.stringify(project),
			}),

		delete: (id) =>
			request(`/projects/${id}`, {
				method: "DELETE",
			}),
	},

	tasks: {
		getAll: () => request("/tasks"),
		getById: (id) => request(`/tasks/${id}`),

		create: (task) =>
			request("/tasks", {
				method: "POST",
				body: JSON.stringify(task),
			}),

		update: (id, task) =>
			request(`/tasks/${id}`, {
				method: "PUT",
				body: JSON.stringify(task),
			}),

		delete: (id) =>
			request(`/tasks/${id}`, {
				method: "DELETE",
			}),
	},

	prayerTimes: {
		get: (latitude = "", longitude = "", date) =>
			request(
				`https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}`,
				true,
			),
	},

	location: {
		get: () =>
			new Promise((resolve, reject) => {
				if (!navigator.geolocation) {
					reject(
						new Error(
							"Geolocation is not supported by this browser.",
						),
					);
					return;
				}

				navigator.geolocation.getCurrentPosition(
					async (position) => {
						const { latitude, longitude } = position.coords;

						try {
							const url = new URL(NOMINATIM_URL);

							url.searchParams.set("format", "jsonv2");
							url.searchParams.set("lat", latitude);
							url.searchParams.set("lon", longitude);
							url.searchParams.set("addressdetails", "1");
							const response = await fetch(url);

							if (!response.ok) {
								throw new Error("Failed to determine city.");
							}

							const data = await response.json();
							const address = data.address;

							resolve({
								latitude,
								longitude,
								...address,
								country: address.country || null,
							});
						} catch (error) {
							reject(error);
						}
					},

					async (error) => {
						let message;

						switch (error.code) {
							case error.PERMISSION_DENIED:
								console.log("Location permission was denied.")
								message = "Location permission was denied.";
								let latitude = 36.406355;
								let longitude = 10.622964;
								const url = new URL(NOMINATIM_URL);

								url.searchParams.set("format", "jsonv2");
								url.searchParams.set("lat", latitude);
								url.searchParams.set("lon", longitude);
								url.searchParams.set("addressdetails", "1");
								const response = await fetch(url);

								if (!response.ok) {
									throw new Error(
										"Failed to determine city.",
									);
								}

								const data = await response.json();
								const address = data.address;

								resolve({
									latitude,
									longitude,
									...address,
									country: address.country || null,
								});
								break;

							case error.POSITION_UNAVAILABLE:
								message =
									"Location information is unavailable.";
								break;

							case error.TIMEOUT:
								message = "Location request timed out.";
								break;

							default:
								message = "Unable to get your location.";
						}

					},
				);
			}),
	},
};
