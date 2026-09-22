import { getSizeClass } from "../Utils/Utils";
import { DAYS } from "../Utils/dateUtilities";
import DuelClockInput from "../Components/DuelClockInput";
import { useEffect, useState } from "react";

export default function useModal({
	name,
	modalFields = {},
	validate,
	onChange=()=>{},
}) {
	const [modalConfig, setModalConfig] = useState({
		name: name,
		object: {},
		modalFields: modalFields,
		validate: validate,
		onChange: onChange,
		mutation: null,
	});
	const [visible, setVisible] = useState(false);
	const [errors, setErrors] = useState({});

	const isNewObject = !modalConfig.object?.id;

	const handleChange = (name, value) => {
		setErrors({});
		setModalConfig((prev) => {
			const err = onChange({ ...prev.object, [name]: value });
			setErrors({ saveWarning: err });
			return {
				...prev,
				object: { ...prev.object, [name]: value },
			};
		});
	};

	let skip;

	const fields = (
		<div className="row g-3">
			{Object.entries(modalConfig.modalFields).map(([name, config]) => {
				if (skip === name) return;
				const { type, label, placeholder = "", size = "full" } = config;

				const value = modalConfig.object[name];

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
										time: modalConfig.object[name],
										name: name,
									}}
									right={{
										time: modalConfig.object[config.with],
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
								onChange={(e) =>
									handleChange(e.target.name, e.target.value)
								}
							/>
						) : type === "select" ? (
							<select
								id={name}
								name={name}
								className="form-select"
								value={value}
								onChange={(e) =>
									handleChange(e.target.name, e.target.value)
								}
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
											checked={modalConfig.object.days?.every(
												Boolean,
											)}
											onChange={() =>
												handleChange(
													"days",
													DAYS.map(
														() =>
															!modalConfig.object.days.every(
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
												checked={
													modalConfig.object.days?.[
														index
													]
												}
												onChange={() =>
													handleChange(
														"days",
														modalConfig.object.days?.map(
															(item, i) =>
																i === index
																	? !modalConfig
																			.object
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
									type === "color" ? "form-control-color" : ""
								}`}
								value={value}
								placeholder={placeholder}
								onChange={(e) =>
									handleChange(e.target.name, e.target.value)
								}
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
	);

	const validateInputs = () => {
		const result = modalConfig.validate(modalConfig.object);

		setErrors((prev) => ({ ...prev, ...result }));

		return Object.keys(result).length === 0;
	};

	const submit = () => {
		if (!validateInputs()) return;

		modalConfig.mutation.mutate(
			{
				Data: modalConfig.object,
				Id: modalConfig.object.id,
			},
			{
				onSuccess: () => {
					closeModal();
				},
			},
		);
	};

	const closeModal = () => {
		setErrors({});
		setVisible(false);
	};

	const openModal = (config) => {
		setErrors({});
		setModalConfig((prev) => ({
			...prev,
			...config,
		}));
		if (config.object) {
			const err = onChange(config.object);
			setErrors({ saveWarning: err });
		}
		setVisible(true);
	};

	const Modal = visible && (
		<div
			className="modal show d-block bg-light bg-opacity-50 position-fixed d-flex align-items-center justify-content-center"
			onClick={closeModal}
		>
			<div
				className="modal-dialog w-50"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="modal-content">
					<div className="modal-header p-3 justify-content-between">
						<h5 className="modal-title">
							{isNewObject ? "Add" : "Edit"} {modalConfig.name}
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
								disabled={modalConfig.mutation?.isPending}
							>
								Cancel
							</button>

							<button
								type="button"
								className="btn btn-primary"
								onClick={submit}
								disabled={
									modalConfig.mutation?.isPending ||
									errors.saveWarning
								}
							>
								{modalConfig.mutation?.isPending
									? "Saving..."
									: isNewObject
										? "Add"
										: "Edit"}
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
