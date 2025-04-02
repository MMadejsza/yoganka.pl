function GenericListTagLi({ objectPair }) {
  return (
    <li className='generic-details__item user-container__section-record modal-checklist__li'>
      {objectPair.symbol && (
        <span className='material-symbols-rounded nav__icon'>
          {objectPair.symbol}
        </span>
      )}
      {objectPair.label && (
        <p className='generic-details__label user-container__section-record-label'>
          {objectPair.label}
        </p>
      )}
      <p className='generic-details__content user-container__section-record-content'>
        {objectPair.content}
      </p>
    </li>
  );
}
export default GenericListTagLi;
