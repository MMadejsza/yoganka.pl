import GenericListTagLi from './GenericListTagLi.jsx';

// add orientation prop and map to css class schedule__summary
function GenericList({ title, details, classModifier = '' }) {
  return (
    <>
      <div
        className={`generic-details ${classModifier ? `generic-details--${classModifier}` : ''}`}
      >
        {title && (
          <h2
            className={`generic-details__title ${classModifier ? `generic-details__title--${classModifier}` : ''} modal__title--day`}
          >
            {title}
          </h2>
        )}
        <ul
          className={`generic-details__list  ${classModifier ? `generic-details__list--${classModifier}` : ''} modal-checklist__list`}
        >
          {details.map((item, index) => (
            <GenericListTagLi
              key={index}
              index={index}
              objectPair={item}
              classModifier={classModifier}
              extraClass={item.extraClass ?? ''}
              isNotes={item.label == 'Notatki:'}
            />
          ))}
        </ul>
      </div>
    </>
  );
}

export default GenericList;
