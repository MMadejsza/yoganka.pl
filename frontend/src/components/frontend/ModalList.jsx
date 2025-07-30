import { protectWordBreaks } from '../../utils/validation.js';
import SymbolOrIcon from '../common/SymbolOrIcon';

function ModalList({ extraClass, listType, title, list }) {
  const icons = {
    included: 'fa-solid fa-check',
    excluded: 'fa-regular fa-hand-point-right',
    optional: 'fa-solid fa-plus',
    freeTime: 'fa-brands fa-pagelines',
  };

  const pickIconClass = item => {
    // if list is freeTime and has various icons inside
    if (listType === 'freeTime') {
      // pick either the one which you have to pay for or free
      return item.status === 'optional' ? icons.optional : icons.freeTime;
    }
    // if different list - pick accordingly
    return icons[listType] || icons.included;
  };

  const content = list?.map((item, index) => {
    // if simple list -> item == string otherwise list of objects from freeTime
    const activity =
      typeof item === 'string' ? protectWordBreaks(item) : item.activity;
    const iconClass =
      typeof item === 'string' ? icons[listType] : pickIconClass(item);

    return (
      <li key={index} className='checklist__li'>
        <SymbolOrIcon
          specifier={iconClass}
          type='ICON'
          extraClass={'modal__icon checklist__icon'}
          aria-hidden='true'
        />
        {activity}
      </li>
    );
  });

  const dynamicClass = `checklist__container checklist__container--${
    listType == 'freeTime' ? 'free-time' : listType
  }${extraClass ? ` checklist__container--${extraClass}` : ''}`;

  return (
    <>
      <section className={dynamicClass}>
        <h3 className='checklist__title'>{protectWordBreaks(title)}</h3>
        <ul className='checklist__list'>{content}</ul>
      </section>
    </>
  );
}

export default ModalList;
