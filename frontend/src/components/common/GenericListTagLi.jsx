import SymbolOrIcon from './SymbolOrIcon.jsx';

function GenericListTagLi({ extraClass, objectPair, classModifier, isNotes }) {
  const { label, content, status = null, symbol = null } = objectPair;

  let liContent = objectPair.content;

  return content ? (
    <li
      className={`generic-details__item ${
        classModifier ? `generic-details__item--${classModifier}` : ''
      } modal-checklist__li ${status === 0 ? 'dimmed' : ''} ${
        extraClass ?? ''
      }`}
    >
      {symbol && <SymbolOrIcon specifier={symbol} />}
      {label && (
        <p
          className={`generic-details__label ${
            classModifier ? `generic-details__label--${classModifier}` : ''
          } ${extraClass ?? ''}`}
        >
          {label}
        </p>
      )}
      <p
        className={`generic-details__content ${
          classModifier ? `generic-details__content--${classModifier}` : ''
        }  ${isNotes ? `generic-details__content--notes` : ''} ${
          objectPair.status === 0 ? 'dimmed' : ''
        } ${extraClass ?? ''}`}
      >
        {liContent}
      </p>
    </li>
  ) : null;
}

export default GenericListTagLi;
