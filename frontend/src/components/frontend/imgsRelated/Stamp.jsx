import SanityImage from './SanityImage.jsx';

function Stamp({ placement, imgsArr }) {
  return (
    <div className={`${placement}__certificates`}>
      {imgsArr.map((img, index) => (
        <SanityImage
          key={index}
          image={img}
          variant='stamp'
          className={`stamp`}
        />
      ))}
    </div>
  );
}

export default Stamp;
