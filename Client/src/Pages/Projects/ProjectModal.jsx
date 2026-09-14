export default function ProjectModal({project,onSubmit,closeModal,onChange,errors,title}) {
	return (
		<div
			className="modal show d-block bg-light bg-opacity-50"
			role="dialog"
			aria-modal="true"
		>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">{title}</h5>
							<button
								type="button"
								className="btn-close"
								aria-label="Close"
								onClick={closeModal}
							/>
						</div>
						<div className="modal-body">
							<div className="mb-3">
								<label
									htmlFor="project-name"
									className="form-label"
								>
									Name
								</label>
								<input
									id="project-name"
									className="form-control"
									name="name"
									value={project?.name}
									onChange={onChange}
									autoFocus
								/>
								{errors?.projectName && (
									<div className="text-danger">
										{errors?.projectName}
									</div>
								)}
							</div>
							<div className="mb-3">
								<label
									htmlFor="project-description"
									className="form-label"
								>
									Description
								</label>
								<textarea
									id="project-description"
									className="form-control"
									name="description"
									value={project?.description}
									onChange={onChange}
									rows="2"
								/>
							</div>
							<div className="row g-3 mb-3">
								<div className="col-sm-6">
									<label
										htmlFor="project-deadline"
										className="form-label"
									>
										Deadline
									</label>
									<input
										id="project-deadline"
										type="date"
										className="form-control"
										name="deadline"
										value={project?.deadline}
										onChange={onChange}
									/>
									{errors?.projectDeadline && (
										<div className="text-danger">
											{errors?.projectDeadline}
										</div>
									)}
								</div>
								<div className="col-sm-6">
									<label
										htmlFor="project-color"
										className="form-label"
									>
										Color
									</label>
									<input
										id="project-color"
										type="color"
										className="form-control form-control-color"
										name="color"
										value={project?.color}
										onChange={onChange}
									/>
								</div>
							</div>
							<div className="mb-3">
								<label
									htmlFor="project-owner"
									className="form-label"
								>
									Owner
								</label>
								<input
									id="project-owner"
									className="form-control"
									name="owner"
									value={project?.owner}
									onChange={onChange}
								/>
								{errors?.projectOwner && (
									<div className="text-danger">
										{errors?.projectOwner}
									</div>
								)}
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-secondary"
								onClick={closeModal}
							>
								Cancel
							</button>
							<button type="submit" className="btn btn-primary" onClick={onSubmit}>
								Add Project
							</button>
						</div>
				</div>
			</div>
		</div>
	);
}
