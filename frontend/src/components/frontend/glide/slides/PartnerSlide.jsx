import SanityImage from '../../imgsRelated/SanityImage.jsx';

function PhotoSlide({ partnerData }) {
  return (
    <a href={partnerData.link} target='_blank' className={`partners__link`}>
      <SanityImage
        image={partnerData.logo}
        variant='partner'
        className='partners__image'
      />
    </a>
  );
}

export default PhotoSlide;
