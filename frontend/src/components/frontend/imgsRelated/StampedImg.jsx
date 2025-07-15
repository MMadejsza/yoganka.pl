import SanityImage from './SanityImage.jsx';
import Stamp from './Stamp.jsx';

function StampedImg({ noStamp, modifier, placement, img, stamps }) {
  console.log(img, stamps);
  return (
    <aside
      className={`${placement}__img-container ${
        modifier ? `${placement}__img-container--${modifier}` : ''
      }`}
    >
      <SanityImage
        image={img}
        variant='stampedImg'
        className={`${placement}__img--portrait`}
      />
      {!noStamp && <Stamp placement='about' imgsArr={stamps} />}
    </aside>
  );
}

export default StampedImg;
