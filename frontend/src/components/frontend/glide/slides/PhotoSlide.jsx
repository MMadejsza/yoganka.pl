import SanityImage from '../../imgsRelated/SanityImage.jsx';

function PhotoSlide({ slideData, isMobile }) {
  const dynamicImg = (
    <SanityImage image={slideData} variant='gallery' className='tile__img' />
  );

  // return isMobile ? (
  //   <li className='glide__slide'>{dynamicImg}</li>
  // ) : (
  //   <div className='item glide__slide'>{dynamicImg}</div>
  // );
  return <li className='glide__slide'>{dynamicImg}</li>;

  // <div className='item glide__slide'>{dynamicImg}</div>
}

export default PhotoSlide;
