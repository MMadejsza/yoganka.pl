function ReviewSlide({slideData}) {
	const {img, name, productName, review} = slideData;
	const leadingClass = 'certificates';
	return (
		<li className='glide__slide'>
			<div className={`tile ${leadingClass}__tile`}>
				{img && (
					<img
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
				{review && <p className={`${leadingClass}__review`}>{review}</p>}
			</div>
		</li>
	);
}

export default ReviewSlide;
