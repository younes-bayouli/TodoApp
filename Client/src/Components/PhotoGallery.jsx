import { useEffect, useRef, useState } from "react";
import { Trash2, Upload, X } from "lucide-react";
import useData from "../Utils/useData.js";
import PhotoCard from "./Cards/PhotoCard.jsx";

const API_URL = import.meta.env.VITE_API_URL;
const PHOTO_URL = API_URL.replace(/\/api\/?$/, "");
let nextPhotoIndex = 0;

function PhotoGallery() {
	const inputRef = useRef(null);
	const hasSelectedPhoto = useRef(false);
	const [isOpen, setIsOpen] = useState(false);
	const [featuredPhoto, setFeaturedPhoto] = useState(null);
	const { data: photos = [], create, remove } = useData("photos");

	useEffect(() => {
		if (hasSelectedPhoto.current || photos.length === 0) return;

		setFeaturedPhoto(photos[nextPhotoIndex % photos.length]);
		nextPhotoIndex += 1;
		hasSelectedPhoto.current = true;
	}, [photos]);

	useEffect(() => {
		if (!isOpen) return undefined;

		const handleKeyDown = (event) => {
			if (event.key === "Escape") setIsOpen(false);
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen]);

	function handleFileChange(event) {
		const file = event.target.files?.[0];
		if (file) create.mutate({ Data: file });
		event.target.value = "";
	}

	return (
		<>
			<PhotoCard
				photo={
					featuredPhoto &&
					`${PHOTO_URL}/photos/${encodeURIComponent(featuredPhoto)}`
				}
				onClick={() => setIsOpen(true)}
			/>

			{isOpen && (
				<div
					className="modal show d-block photo-gallery-modal"
					role="presentation"
					onClick={() => setIsOpen(false)}
				>
					<div
						className="modal-dialog modal-dialog-centered modal-lg"
						onClick={(event) => event.stopPropagation()}
					>
						<section
							className="modal-content"
							role="dialog"
							aria-modal="true"
							aria-labelledby="photo-gallery-title"
						>
							<div className="modal-header">
								<h2
									id="photo-gallery-title"
									className="modal-title h5"
								>
									Photos
								</h2>
								<button
									type="button"
									className="btn-close"
									aria-label="Close photo gallery"
									onClick={() => setIsOpen(false)}
								/>
							</div>
							<div className="modal-body">
								<div className="d-flex justify-content-end mb-3">
									<button
										type="button"
										className="btn btn-primary d-inline-flex align-items-center gap-2"
										onClick={() =>
											inputRef.current?.click()
										}
										disabled={create.isPending}
									>
										<Upload size={16} aria-hidden="true" />
										{create.isPending
											? "Uploading..."
											: "Add Photo"}
									</button>
									<input
										ref={inputRef}
										type="file"
										accept="image/*"
										className="d-none"
										onChange={handleFileChange}
									/>
								</div>

								{photos.length === 0 && !create.isPending ? (
									<p className="photo-gallery-empty text-secondary">
										No photos yet. Add one to personalize
										your space.
									</p>
								) : (
									<div className="row g-3">
										{photos.map((filename) => (
											<div
												className="col-12 col-sm-6 col-lg-4"
												key={filename}
											>
												<article className="photo-gallery-item position-relative">
													<img
														src={`${PHOTO_URL}/photos/${encodeURIComponent(filename)}`}
														alt={filename}
														className="w-100"
													/>
													<button
														type="button"
														className="btn btn-light photo-gallery-delete"
														onClick={() =>
															remove.mutate(
																filename,
															)
														}
														disabled={
															remove.isPending
														}
														aria-label={`Delete ${filename}`}
													>
														<Trash2
															size={16}
															aria-hidden="true"
														/>
													</button>
												</article>
											</div>
										))}
									</div>
								)}
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary d-inline-flex align-items-center gap-2"
									onClick={() => setIsOpen(false)}
								>
									<X size={16} aria-hidden="true" />
									Close
								</button>
							</div>
						</section>
					</div>
				</div>
			)}
		</>
	);
}

export default PhotoGallery;
