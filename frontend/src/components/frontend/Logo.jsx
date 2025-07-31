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
      className={`logo${placement ? ` logo--${placement}` : ''}`}
      containerClassName={`logo-container${
        placement ? ` logo-container--${placement}` : ''
      }`}
      alt='Yoganka - Logo'
      title='Yoganka - Logo'
    />
  );
}

export default Logo;
