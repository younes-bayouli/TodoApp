function PhotoCard({ photo, alt = "Personal profile", onClick }) {
	return (
		<article
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
				/>
			) : (
				<div
					aria-label={alt}
				>
					<span>Your photo</span>
				</div>
			)}
			<div>
				<p>Your space</p>
				<h2>Make today yours.</h2>
			</div>
		</article>
	);
}

export default PhotoCard;
