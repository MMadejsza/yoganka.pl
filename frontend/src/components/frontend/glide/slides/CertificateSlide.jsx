function CertificateSlide({ slideData }) {
  const { name, instructor, duration, themes } = slideData;
  return (
    <li className='glide__slide'>
      <div className={`tile tile--xs`}>
        {name && (
          <h3>
            <strong className={`tile__date`}>{name}</strong>
          </h3>
        )}
        {instructor && <p className={`tile__desc`}>{instructor}</p>}
        {duration && <p className={`tile__desc`}>{duration}</p>}
        {themes?.length > 0 && (
          <p className={`tile__desc`}>
            <strong>{themes.join(' | ')}</strong>
          </p>
        )}
      </div>
    </li>
  );
}

export default CertificateSlide;
