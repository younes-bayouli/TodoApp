const API_URL = import.meta.env.VITE_API_URL;
const NOMINATIM_URL = import.meta.env.VITE_NOMINATIM_URL;
const ALADHAN_API = import.meta.env.VITE_ALADHAN_API;
console.log(NOMINATIM_URL,ALADHAN_API)

async function request(endpoint, {options = {}, fullEndpoint = false}={}) {
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

async function getLocation(latitude, longitude,error) {
	if (error) throw error;
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
	return address;
}

export const api = {
	todos: {
		getAll: () => request("/todos"),
		getById: (id) => request(`/todos/${id}`),

		create: (todo) =>
			request("/todos", {options:{
				method: "POST",
				body: JSON.stringify(todo),
			}}),

		update: (id, todo) =>
			request(`/todos/${id}`, {options:{
				method: "PUT",
				body: JSON.stringify(todo),
			}}),

		delete: (id) =>
			request(`/todos/${id}`, {options:{
				method: "DELETE",
			}}),
	},

	events: {
		getAll: () => request("/events"),
		getById: (id) => request(`/events/${id}`),

		create: (event) =>
			request("/events", {options:{
				method: "POST",
				body: JSON.stringify(event),
			}}),

		update: (id, event) =>
			request(`/events/${id}`, {options:{
				method: "PUT",
				body: JSON.stringify(event),
			}}),

		delete: (id) =>
			request(`/events/${id}`, {options:{
				method: "DELETE",
			}}),
	},

	projects: {
		getAll: () => request("/projects"),
		getById: (id) => request(`/projects/${id}`),

		create: (project) =>
			request("/projects", {options:{
				method: "POST",
				body: JSON.stringify(project),
			}}),

		update: (id, project) =>
			request(`/projects/${id}`, {options:{
				method: "PUT",
				body: JSON.stringify(project),
			}}),

		delete: (id) =>
			request(`/projects/${id}`, {options:{
				method: "DELETE",
			}}),
	},

	tasks: {
		getAll: () => request("/tasks"),
		getById: (id) => request(`/tasks/${id}`),

		create: (task) =>
			request("/tasks", {options:{
				method: "POST",
				body: JSON.stringify(task),
			}}),

		update: (id, task) =>
			request(`/tasks/${id}`, {options:{
				method: "PUT",
				body: JSON.stringify(task),
			}}),

		delete: (id) =>
			request(`/tasks/${id}`, {options:{
				method: "DELETE",
			}}),
	},

	prayerTimes: {
		get: (latitude, longitude, date) =>{
			return request(
				`${ALADHAN_API}${date}?latitude=${latitude}&longitude=${longitude}`,
				{fullEndpoint:true}
			)
		}
	},

	location: {
		get: ({ latitude, longitude }) => getLocation(latitude, longitude),
	},
};
