function CertificateSlide({ slideData }) {
  const { name, instructor, duration, themes } = slideData;
  const leadingClass = 'certificates';
  return (
    <li className='glide__slide'>
      <div className={`tile ${leadingClass}__tile`}>
        {name && (
          <h3>
            <strong className={`${leadingClass}__name`}>{name}</strong>
          </h3>
        )}
        {instructor && (
          <p className={`${leadingClass}__school`}>{instructor}</p>
        )}
        {duration && <p className={`${leadingClass}__duration`}>{duration}</p>}
        {themes?.length > 0 && (
          <p className={`${leadingClass}__type`}>
            <strong>{themes.join(' | ')}</strong>
          </p>
        )}
      </div>
    </li>
  );
}

export default CertificateSlide;
