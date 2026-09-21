import { checkOverlap, getSizeClass } from "../Utils/Utils";
import { DAYS } from "../Utils/dateUtilities";
import DuelClockInput from "../Components/DuelClockInput";
import { useMemo, useState } from "react";

export default function useModal(
	title,
	object,
	setObject,
	fieldsConfig = {},
	validateObject,
	onSubmit,
	data,
) {
	const [visible, setVisible] = useState(false);
	const isNewObject = !object.id;
	const [errors, setErrors] = useState({});

	const handleChange = (eventOrName, value) => {
		setErrors({});
		const name =
			typeof eventOrName === "string"
				? eventOrName
				: eventOrName.target.name;

		const nextValue =
			typeof eventOrName === "string" ? value : eventOrName.target.value;

		console.log(data);
		const copy = { ...object, [name]: nextValue };
		const overl = checkOverlap(copy, data);
		console.log(copy, overl);
		if (overl.check) {
			setErrors((prev) => ({
				...prev,
				saveWarning: overl.mesg,
			}));
		}

		setObject(copy);
	};
	let skip;

	const fields = useMemo(
		() => (
			<div className="row g-3">
				{Object.entries(fieldsConfig).map(([name, config]) => {
					if (skip === name) return;
					const {
						type,
						label,
						placeholder = "",
						size = "full",
					} = config;

					const value = object?.[name] ?? "";

					if (type === "duelClock") {
						skip = config.with;
					}

					return (
						<div className={getSizeClass(size)} key={name}>
							<label htmlFor={name} className="form-label">
								{label}
							</label>

							{type === "duelClock" ? (
								<div className="d-flex justify-content-center">
									<DuelClockInput
										left={{
											time: object?.[name],
											name: name,
										}}
										right={{
											time: object?.[config.with],
											name: config.with,
										}}
										handleChange={handleChange}
									></DuelClockInput>
								</div>
							) : type === "textarea" ? (
								<textarea
									id={name}
									name={name}
									className="form-control"
									value={value}
									placeholder={placeholder}
									onChange={handleChange}
								/>
							) : type === "select" ? (
								<select
									id={name}
									name={name}
									className="form-select"
									value={value}
									onChange={handleChange}
								>
									{config.options?.map((option) => (
										<option
											key={option.value}
											value={option.value}
										>
											{option.label}
										</option>
									))}
								</select>
							) : type === "days" ? (
								<div className="my-3 w-100 d-flex flex-column align-items-center">
									<div className="w-100 d-flex align-items-center mb-3">
										<label className="form-label m-0">
											Repeat on:
										</label>
										<label className="ms-3 mb-0">
											<input
												type="checkbox"
												className="mx-2"
												name="allDays"
												checked={object.days.every(
													Boolean,
												)}
												onChange={() =>
													handleChange(
														"days",
														DAYS.map(
															() =>
																!object.days.every(
																	Boolean,
																),
														),
													)
												}
											/>
											All days
										</label>
									</div>
									<div className="w-75 d-flex justify-content-between">
										{DAYS.map((day, index) => (
											<label
												key={day}
												className="d-flex flex-column align-items-center justify-content-center"
											>
												<input
													type="checkbox"
													name="days"
													value={index}
													checked={object.days[index]}
													onChange={() =>
														handleChange(
															"days",
															object.days.map(
																(item, i) =>
																	i === index
																		? !object
																				.days[
																				index
																			]
																		: item,
															),
														)
													}
												/>
												{day.slice(0, 3)}
											</label>
										))}
									</div>
								</div>
							) : (
								<input
									id={name}
									name={name}
									type={type}
									className={`form-control ${
										type === "color"
											? "form-control-color"
											: ""
									}`}
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

	const validate = () => {
		const result = validateObject(object) ?? {};

		setErrors(result);

		return Object.keys(result).length === 0;
	};

	const submit = () => {
		if (!validate()) return;

		onSubmit.mutate({ Data: object, Id: object.id });
	};

	const closeModal = () => {
		setErrors({});
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
							{errors.saveWarning && (
								<p className="text-danger mt-1 mb-0">
									{errors.saveWarning}
								</p>
							)}
							<button
								type="button"
								className="btn btn-secondary"
								onClick={closeModal}
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
