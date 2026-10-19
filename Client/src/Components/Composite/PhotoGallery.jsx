import { useEffect, useRef, useState } from "react";
import { Trash2, Upload, X } from "lucide-react";
import useData from "../../Utils/useData.js";
import PhotoCard from "../Cards/PhotoCard.jsx";
import Button from "../Basic/Button.jsx";
import EmptyState from "./EmptyState.jsx";

const PHOTO_URL = import.meta.env.VITE_API_URL;
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
		const root = document.documentElement;
		const previousOverflow = document.body.style.overflow;
		root.classList.add("photo-gallery-open");
		document.body.style.overflow = "hidden";

		const handleKeyDown = (event) => {
			if (event.key === "Escape") setIsOpen(false);
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			root.classList.remove("photo-gallery-open");
			document.body.style.overflow = previousOverflow;
		};
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
					className="photo-gallery-backdrop"
					role="presentation"
					onClick={() => setIsOpen(false)}
				>
					<section
						className="photo-gallery-modal"
						role="dialog"
						aria-modal="true"
						aria-labelledby="photo-gallery-title"
						onClick={(event) => event.stopPropagation()}
					>
						<header className="photo-gallery-header">
							<div className="photo-gallery-heading">
								<div>
									<h2 id="photo-gallery-title">Photos</h2>
									<p>Your collection</p>
								</div>
								<span className="photo-gallery-count">
									{photos.length}{" "}
									{photos.length === 1 ? "photo" : "photos"}
								</span>
							</div>
							<Button
								className="photo-gallery-close"
								variant="ghost"
								size="small"
								type="button"
								aria-label="Close photo gallery"
								onClick={() => setIsOpen(false)}
								icon={<X size={18} aria-hidden="true" />}
							/>
						</header>
						<div className="photo-gallery-toolbar">
							<p>Photo library</p>
							<div className="photo-gallery-upload">
								<Button
									type="button"
									onClick={() => inputRef.current?.click()}
									disabled={create.isPending}
									icon={
										<Upload size={16} aria-hidden="true" />
									}
								>
									{create.isPending
										? "Uploading..."
										: "Add photo"}
								</Button>
								<input
									ref={inputRef}
									className="photo-gallery-file-input"
									type="file"
									accept="image/*"
									onChange={handleFileChange}
								/>
							</div>
						</div>
						<div className="photo-gallery-content">
							{photos.length === 0 && !create.isPending ? (
								<EmptyState
									className="photo-gallery-empty"
									title="No photos yet"
									description="Add a photo to personalize your space."
								/>
							) : photos.length === 0 ? (
								<p
									className="photo-gallery-uploading"
									role="status"
								>
									Uploading photo...
								</p>
							) : (
								<div className="photo-gallery-grid">
									{photos.map((filename) => (
										<article
											className="photo-gallery-item"
											key={filename}
										>
											<img
												src={`${PHOTO_URL}/photos/${encodeURIComponent(filename)}`}
												alt={filename}
											/>
											<div className="photo-gallery-item-footer">
												<span title={filename}>
													{filename}
												</span>
												<Button
													className="photo-gallery-delete"
													variant="danger-ghost"
													size="small"
													type="button"
													onClick={() =>
														remove.mutate(filename)
													}
													disabled={remove.isPending}
													aria-label={`Delete ${filename}`}
													icon={
														<Trash2
															size={16}
															aria-hidden="true"
														/>
													}
												/>
											</div>
										</article>
									))}
								</div>
							)}
						</div>
						<footer className="photo-gallery-footer">
							<span>
								{photos.length === 0
									? ""
									: `${photos.length} ${photos.length === 1 ? "photo" : "photos"}`}
							</span>
							<Button
								type="button"
								variant="secondary"
								onClick={() => setIsOpen(false)}
							>
								Done
							</Button>
						</footer>
					</section>
				</div>
			)}
		</>
	);
}

export default PhotoGallery;
