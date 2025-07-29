import SanityImage from '../../imgsRelated/SanityImage.jsx';

function PartnerSlide({ partnerData }) {
  return (
    <li className='glide__slide'>
      <a href={partnerData.link} target='_blank' className={`partners__link`}>
        <SanityImage
          image={partnerData.logo}
          variant='partner'
          className='partners__image'
        />
      </a>
    </li>
  );
}

export default PartnerSlide;
