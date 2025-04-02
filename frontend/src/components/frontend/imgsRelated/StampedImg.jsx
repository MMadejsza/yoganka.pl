import ImgDynamic from './ImgDynamic.jsx';
import Stamp from './Stamp.jsx';

function StampedImg({ placement, imgPaths, certPaths, ...props }) {
  return (
    <aside className={`${placement}__img-container`}>
      <ImgDynamic
        classy={placement}
        type={placement}
        srcSet={imgPaths}
        {...props}
      />
      <Stamp placement='about' paths={certPaths} />
    </aside>
  );
}

export default StampedImg;
