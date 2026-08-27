function PhotoCard({ photo, alt = "Personal profile" }) {
	return (
		<article className="home-card photo-card">
			{photo ? (
				<img src={photo} alt={alt} />
			) : (
				<div className="photo-card-placeholder" aria-label={alt}>
					<span>Your photo</span>
				</div>
			)}
			<div className="photo-card-caption">
				<p className="home-card-kicker">Your space</p>
				<h2>Make today yours.</h2>
			</div>
		</article>
	);
}

export default PhotoCard;
