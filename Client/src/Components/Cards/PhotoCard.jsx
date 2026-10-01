import Card from "../Composite/Card";

function PhotoCard({ photo, alt = "Personal profile", onClick }) {
	return (
		<Card name="card-photo" padding="none">
			<article
				onClick={onClick}
				onKeyDown={(event) => {
					if (event.key === "Enter" || event.key === " ") onClick?.();
				}}
				role={onClick ? "button" : undefined}
				tabIndex={onClick ? 0 : undefined}
				className="w-100 h-100 position-relative"
			>
				{photo ? (
					<img
						src={photo}
						alt={alt}
						className="w-100 h-100 object-fit-cover d-block"
					/>
				) : (
					<></>
				)}
				<div className="photo-card-caption">
					<p>Your space</p>
					<h2>Make today yours.</h2>
				</div>
			</article>
		</Card>
	);
}

export default PhotoCard;
