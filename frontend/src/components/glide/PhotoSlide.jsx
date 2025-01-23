import ImgDynamic from '../imgsRelated/ImgDynamic.jsx';

function PhotoSlide({slideData, photoNo, isMobile}) {
	const imgPaths = [
		{path: `${slideData.galleryPath}/480_${slideData.fileName}_${photoNo}.jpg`, size: '480w'},
		{path: `${slideData.galleryPath}/768_${slideData.fileName}_${photoNo}.jpg`, size: '768w'},
		{path: `${slideData.galleryPath}/1024_${slideData.fileName}_${photoNo}.jpg`, size: '1024w'},
		{path: `${slideData.galleryPath}/1400_${slideData.fileName}_${photoNo}.jpg`, size: '1400w'},
		{path: `${slideData.galleryPath}/1600_${slideData.fileName}_${photoNo}.jpg`, size: '1600w'},
	];
	const dynamicImg = (
		<ImgDynamic
			classy={`
		tile__img tile__img--modal-slider`}
			srcSet={imgPaths}
			sizes={`
			(max-width: 768px) 480px,
			(max-width: 1024px) and (orientation: portrait) 1024px,
			(max-width: 1200px) 1400px,
			1600px
	`}
			alt='Galeria Wyjazdu'
		/>
	);

	return isMobile ? (
		<li className='glide__slide'>{dynamicImg}</li>
	) : (
		<div className='item glide__slide'>{dynamicImg}</div>
	);
}

export default PhotoSlide;
