import SanityImage from '../frontend/imgsRelated/SanityImage.jsx';

function Logo({ type, data, placement, media, isActive }) {
  const file =
    type == 'writtenLogo'
      ? data.justSign.img
      : media == 'mobile'
      ? data.fullLogo.img
      : isActive
      ? data.justBody.imgActive
      : data.justBody.img;

  return (
    <SanityImage
      image={file}
      variant={type || 'logo'}
      className={`${placement}__logo`}
      containerClassName={`${placement}__logo-container`}
      alt='Yoganka - Logo'
    />
  );
}

export default Logo;
