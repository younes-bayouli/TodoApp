function PhotoCard({ photo, alt = "Personal profile", onClick }) {
	return (
		<article
			className="photo-card min-w-0 min-h-0 m-0 rounded overflow-hidden d-block position-relative"
			onClick={onClick}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") onClick?.();
			}}
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
		>
			{photo ? (
				<img
					src={photo}
					alt={alt}
					className="d-block w-100 h-100 object-fit-cover"
				/>
			) : (
				<div
					className="d-block w-100 h-100 object-fit-cover fs-5"
					aria-label={alt}
				>
					<span>Your photo</span>
				</div>
			)}
			<div className="position-absolute end-0 bottom-0 start-0 p-3">
				<p className="home-card-kicker">Your space</p>
				<h2 className="fs-6">Make today yours.</h2>
			</div>
		</article>
	);
}

export default PhotoCard;
