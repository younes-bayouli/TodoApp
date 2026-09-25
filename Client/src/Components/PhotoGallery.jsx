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
					role="presentation"
					onClick={() => setIsOpen(false)}
				>
					<div
						onClick={(event) => event.stopPropagation()}
					>
						<section
							role="dialog"
							aria-modal="true"
							aria-labelledby="photo-gallery-title"
						>
							<div>
								<h2
									id="photo-gallery-title"
								>
									Photos
								</h2>
								<button
									type="button"
									aria-label="Close photo gallery"
									onClick={() => setIsOpen(false)}
								/>
							</div>
							<div>
								<div>
									<button
										type="button"
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
										onChange={handleFileChange}
									/>
								</div>

								{photos.length === 0 && !create.isPending ? (
									<p>
										No photos yet. Add one to personalize
										your space.
									</p>
								) : (
									<div>
										{photos.map((filename) => (
											<div
												key={filename}
											>
												<article>
													<img
														src={`${PHOTO_URL}/photos/${encodeURIComponent(filename)}`}
														alt={filename}
													/>
													<button
														type="button"
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
							<div>
								<button
									type="button"
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
