import ImgDynamic from '../imgsRelated/ImgDynamic.jsx';

function PhotoSlide({ slideData, photoNo, isMobile, past }) {
  const imgPaths = [
    {
      path: `${past == true ? slideData.pastGalleryPath : slideData.galleryPath}/480_${
        slideData.fileName
      }_${photoNo}.jpg`,
      size: '480w',
    },
    {
      path: `${past == true ? slideData.pastGalleryPath : slideData.galleryPath}/768_${
        slideData.fileName
      }_${photoNo}.jpg`,
      size: '768w',
    },
    {
      path: `${past == true ? slideData.pastGalleryPath : slideData.galleryPath}/1024_${
        slideData.fileName
      }_${photoNo}.jpg`,
      size: '1024w',
    },
    {
      path: `${past == true ? slideData.pastGalleryPath : slideData.galleryPath}/1400_${
        slideData.fileName
      }_${photoNo}.jpg`,
      size: '1400w',
    },
    {
      path: `${past == true ? slideData.pastGalleryPath : slideData.galleryPath}/1600_${
        slideData.fileName
      }_${photoNo}.jpg`,
      size: '1600w',
    },
  ];
  const dynamicImg = (
    <ImgDynamic
      classy={`
		tile__img tile__img--modal-slider`}
      srcSet={imgPaths}
      sizes={`
			(max-width: 480px) 100vw,
			(max-width: 768px) 100vw,
			(max-width: 1024px) 90vw,
			(max-width: 1200px) 80vw,
			1200px
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
