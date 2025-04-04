import GenericListTagLi from './GenericListTagLi.jsx';

// add orientation prop and map to css class schedule__summary
function GenericList({ title, details, className = '' }) {
  return (
    <>
      {title && (
        <h2 className='generic-details__title user-container__section-title modal__title--day'>
          {title}
        </h2>
      )}
      <div className={`generic-details ${className}`}>
        <ul className='generic-details__list user-container__details-list modal-checklist__list'>
          {details.map((item, index) => (
            <GenericListTagLi key={index} index={index} objectPair={item} />
          ))}
        </ul>
      </div>
    </>
  );
}

export default GenericList;
