import SymbolOrIcon from '../common/SymbolOrIcon';

function CampGlance({ glance }) {
  const symbols = {
    area: 'location_on',
    accommodation: 'hotel',
    capacity: 'groups',
    price: 'sell',
    travel: 'local_taxi',
  };

  const renderItemsList = data => {
    return Object.entries(data)
      .filter(([key, text]) => key != 'title' && text)
      .map(([key, text], index) => (
        <li key={index} className='checklist__li checklist__li--at-glance'>
          <SymbolOrIcon specifier={symbols[key]} extraClass={'modal__icon'} />
          {text}
        </li>
      ));
  };

  return (
    <>
      {glance.title && <h3 className='modal__title'>{glance.title}</h3>}
      <ul className='checklist__list checklist__list--at-glance'>
        {renderItemsList(glance)}
      </ul>
    </>
  );
}

export default CampGlance;
