import { useMemo, useState } from "react";
import TimeInputClock from "../Pages/EveryDayTasks/TimeInputClock";

const getSizeClass = (size) => {
	switch (size) {
		case "full":
			return "col-12";

		case "half":
			return "col-6";

		case "small":
			return "col-auto";

		default:
			return "col-12";
	}
};

export default function useModal(
	object,
	setObject,
	validateObject,
	nullObject,
	saveMutation,
	editMutation,
	title = "TODO",
	fieldsConfig = {},
	onSubmit=()=>{},
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

		setObject((current) => ({
			...current,
			[name]: nextValue,
		}));

		setErrors({});
	};

	const validate = () => {
		const result = validateObject() ?? {};

		setErrors(result);

		return Object.keys(result).length === 0;
	};

	const fields = useMemo(
		() => (
			<div className="row g-3">
				{Object.entries(fieldsConfig).map(([name, config]) => {
					const {
						type,
						label,
						placeholder = "",
						size = "full",
					} = config;

					const value = object?.[name] ?? "";

					if (type === "time" && name === "start") {
						const endConfig = fieldsConfig.end;

						return (
							<div className="col-12" key="time-fields">
								<div className="d-flex gap-4">
									<div className="flex-fill">
										<label className="form-label">
											{label}
										</label>

										<TimeInputClock
											initialTime={object?.start}
											maxTime={object?.end}
											className="py-1 alert alert-light bg-transparent"
											onChange={(newTime) =>
												handleChange("start", newTime)
											}
										/>

										{errors.start && (
											<p className="text-danger mt-1 mb-0">
												{errors.start}
											</p>
										)}
									</div>

									{endConfig && (
										<div className="flex-fill">
											<label className="form-label">
												{endConfig.label}
											</label>

											<TimeInputClock
												initialTime={object?.end}
												minTime={object?.start}
												className="py-1 alert alert-light bg-transparent"
												onChange={(newTime) =>
													handleChange("end", newTime)
												}
											/>

											{errors.end && (
												<p className="text-danger mt-1 mb-0">
													{errors.end}
												</p>
											)}
										</div>
									)}
								</div>
							</div>
						);
					}

					/*
					 * End is rendered together with start.
					 */
					if (type === "time" && name === "end") {
						return null;
					}

					return (
						<div className={getSizeClass(size)} key={name}>
							<label htmlFor={name} className="form-label">
								{label}
							</label>

							{type === "textarea" ? (
								<textarea
									id={name}
									name={name}
									className="form-control"
									value={value}
									placeholder={placeholder}
									onChange={handleChange}
								/>
							) : (
								<input
									id={name}
									name={name}
									type={type}
									className={`form-control ${type==="color"?"p-1":""}`}
									value={value}
									placeholder={placeholder}
									onChange={handleChange}
								/>
							)}

							{errors[name] && (
								<p className="text-danger mt-1 mb-0">
									{errors[name]}
								</p>
							)}
						</div>
					);
				})}
			</div>
		),
		[object, errors, fieldsConfig],
	);

	const cancel = () => {
		setObject(nullObject);
		setErrors({});
		setVisible(false);
	};

	const submit = () => {
		if (!validate()) return;

		onSubmit();

		(isNewObject ? saveMutation : editMutation)?.mutate(object);

		setVisible(false);
	};

	const closeModal = () => {
		setVisible(false);
	};

	const openModal = () => {
		setVisible(true);
	};

	const Modal = visible && (
		<div className="modal show d-block bg-light bg-opacity-50 position-fixed d-flex align-items-center justify-content-center">
			<div className="modal-dialog w-50">
				<div className="modal-content">
					<div className="modal-header p-3">
						<h5 className="modal-title">
							{isNewObject ? "Add" : "Edit"} {title}
						</h5>

						<button
							type="button"
							className="btn-close m-0"
							onClick={closeModal}
						/>
					</div>

					<div className="modal-body">
						{fields}

						<div className="mt-4 d-flex gap-2 justify-content-end">
							<button
								type="button"
								className="btn btn-secondary"
								onClick={cancel}
							>
								Cancel
							</button>

							<button
								type="button"
								className="btn btn-primary"
								onClick={submit}
							>
								{isNewObject ? "Add" : "Edit"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	return {
		openModal,
		closeModal,
		Modal,
	};
}
