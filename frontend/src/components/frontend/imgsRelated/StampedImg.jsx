import ImgDynamic from './ImgDynamic.jsx';
import Stamp from './Stamp.jsx';

function StampedImg({
  noStamp,
  modifier,
  placement,
  imgPaths,
  certPaths,
  ...props
}) {
  return (
    <aside
      className={`${placement}__img-container ${
        modifier ? `${placement}__img-container--${modifier}` : ''
      }`}
    >
      <ImgDynamic
        classy={placement}
        type={placement}
        srcSet={imgPaths}
        {...props}
      />
      {!noStamp && <Stamp placement='about' paths={certPaths} />}
    </aside>
  );
}

export default StampedImg;
