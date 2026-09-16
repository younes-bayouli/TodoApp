import { useMemo, useState } from "react";
import TimeInputClock from "../Pages/EveryDayTasks/TimeInputClock";

const inputType = (name) => {
	if (name.toLowerCase().includes("deadline")) return "date";
	if (name.toLowerCase().includes("time")) return "time";
	if (name.toLowerCase().includes("details")) return "details";
	return name.toLowerCase();
};

export default function useModal(
	object,
	setObject,
	validateObject,
	nullObject,
	saveMutation,
	editMutation,
	title = "TODO",
) {
	const [visible, setVisible] = useState(false);
	const [errors, setErrors] = useState({});
	const isNewObject = object === nullObject;

	const handleChange = (eventOrName, value) => {
		const name =
			typeof eventOrName === "string"
				? eventOrName
				: eventOrName.target.name;
		const nextValue =
			typeof eventOrName === "string" ? value : eventOrName.target.value;
		setObject((current) => ({ ...current, [name]: nextValue }));
		setErrors({});
	};

	const validate = () => {
		const result = validateObject() ?? {};
		setErrors(result);
		return Object.keys(result).length === 0;
	};

	const fields = useMemo(
		() => (
			<>
				{Object.entries(object || {}).map(([name, value]) => {
					const type = inputType(name);
					if (type === "time") {
						return (
							<div className="px-5 w-100 d-flex justify-content-center gap-4">
								<div className="flex-fill">
									<label className="form-label">
										Start at:
									</label>
									<TimeInputClock
										initialTime={object?.start}
										maxTime={object?.end}
										className="py-1 alert alert-light bg-transparent"
										onChange={(newTime) =>
											handleChange("start", newTime)
										}
									></TimeInputClock>
								</div>
								<span className="span"></span>
								<div className="flex-fill">
									<label className="form-label">
										End at:
									</label>
									<TimeInputClock
										initialTime={object?.end}
										minTime={object?.start}
										className="py-1 alert alert-light bg-transparent"
										onChange={(newTime) =>
											handleChange("end", newTime)
										}
									></TimeInputClock>
								</div>
							</div>
						);
					}
					return (
						<>
							<div className="mb-3" key={name}>
								<label
									htmlFor="project-name"
									className="form-label"
								>
									{name}
								</label>
								<input
									name={name}
									type={type}
									className="form-control"
									value={value ?? ""}
									onChange={handleChange}
								/>
							</div>
							{errors[name] && (
								<p className="text-danger mt-1 mb-0">
									{errors[name]}
								</p>
							)}
						</>
					);
				})}
			</>
		),
		[object],
	);

	const cancel = () => {
		setObject(nullObject);
		setErrors({});
		setVisible(false);
	};

	const submit = () => {
		if (!validate()) return;
		(isNewObject ? saveMutation : editMutation)?.(object);
		setVisible(false);
	};

	const Modal = visible && (
		<div className="modal show d-block bg-light bg-opacity-50 position-fixed d-flex align-items-center justify-content-center">
			<div className="modal-dialog w-50">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">
							{isNewObject ? "Add" : "Edit"} {title}
						</h5>
						<button
							type="button"
							className="btn-close align-self-end m-3"
							onClick={() => {
								setVisible(false);
							}}
						></button>
					</div>
					<div className="modal-body">
						<form className="d-flex flex-column align-items-center">
							{fields}
							<button type="button" onClick={cancel}>
								Cancel
							</button>
							<button type="button" onClick={submit}>
								{isNewObject ? "Add" : "Edit"}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);

	const closeModal = () => setVisible(false);
	const openModal = () => setVisible(true);

	return { openModal, closeModal, Modal };
}
