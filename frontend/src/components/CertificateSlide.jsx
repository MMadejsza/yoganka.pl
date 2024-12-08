function CertificateSlide({slideData, leadingClass}) {
	return (
		<li className='glide__slide'>
			<div className={`tile ${leadingClass}__tile`}>
				{slideData.name && (
					<h3>
						<strong className={`${leadingClass}__name`}>{slideData.name}</strong>
					</h3>
				)}
				{slideData.instructor && (
					<p className={`${leadingClass}__school`}>{slideData.instructor}</p>
				)}
				{slideData.duration && (
					<p className={`${leadingClass}__duration`}>{slideData.duration}</p>
				)}
				{slideData.themes.length > 0 && (
					<p className={`${leadingClass}__type`}>
						<strong>{slideData.themes.join(' | ')}</strong>
					</p>
				)}
			</div>
		</li>
	);
}

export default CertificateSlide;
