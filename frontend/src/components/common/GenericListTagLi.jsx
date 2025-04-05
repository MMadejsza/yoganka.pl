function GenericListTagLi({ objectPair, classModifier, isNotes }) {
  const { label, content, status = null, symbol = null } = objectPair;

  return content ? (
    <li
      className={`generic-details__item ${classModifier ? `generic-details__item--${classModifier}` : ''} modal-checklist__li ${status === 0 ? 'dimmed' : ''}`}
    >
      {symbol && (
        <span className='material-symbols-rounded nav__icon'>{symbol}</span>
      )}
      {label && (
        <p
          className={`generic-details__label ${classModifier ? `generic-details__label--${classModifier}` : ''}`}
        >
          {label}
        </p>
      )}
      <p
        className={`generic-details__content ${classModifier ? `generic-details__content--${classModifier}` : ''}  ${isNotes ? `generic-details__content--notes` : ''} ${objectPair.status === 0 ? 'dimmed' : ''}`}
      >
        {objectPair.content}
      </p>
    </li>
  ) : null;
}

export default GenericListTagLi;
