import SanityImage from '../../imgsRelated/SanityImage.jsx';

function PhotoSlide({ slideData }) {
  const dynamicImg = (
    <SanityImage image={slideData} variant='gallery' className='tile__img' />
  );

  return <li className='glide__slide'>{dynamicImg}</li>;
}

export default PhotoSlide;
