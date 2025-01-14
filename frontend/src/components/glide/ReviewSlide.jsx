function ReviewSlide({slideData}) {
	const {img, name, productName, review} = slideData;
	const leadingClass = 'reviews';
	return (
		<li className='glide__slide'>
			<div className={`tile ${leadingClass}__tile`}>
				{img && (
					<img
						className={`${leadingClass}__img tile__img`}
						src={img}
						alt={`${name} profile photo`}
					/>
				)}
				{name && (
					<h3>
						<strong className={`${leadingClass}__name`}>{name}</strong>
					</h3>
				)}
				{productName && <p className={`${leadingClass}__productName`}>{productName}</p>}
				{review && <p className={`${leadingClass}__review`}>{`"${review}"`}</p>}
			</div>
		</li>
	);
}

export default ReviewSlide;
