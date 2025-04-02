function ModalList({ extraClass, listType, data }) {
  const icons = {
    included: 'fa-solid fa-check modal__icon modal-checklist__icon',
    excluded:
      'fa-regular fa-hand-point-right modal__icon modal-checklist__icon',
    optional: 'fa-solid fa-plus modal__icon modal-checklist__icon',
    freeTime: 'fa-brands fa-pagelines modal__icon modal-checklist__icon',
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

  const content = data.list.map((item, index) => {
    // if simple list -> item == string otherwise list of objects from freeTime
    const activity = typeof item === 'string' ? item : item.activity;
    const iconClass =
      typeof item === 'string' ? icons[listType] : pickIconClass(item);

    return (
      <li key={index} className='modal-checklist__li'>
        <i className={iconClass} aria-hidden='true'></i>
        {activity}
      </li>
    );
  });

  const dynamicClass = `modal-checklist modal-checklist--${
    listType == 'freeTime' ? 'free-time' : listType
  } ${extraClass ? `modal-checklist--${extraClass}` : ''}`;

  return (
    <>
      <section className={dynamicClass}>
        <h3 className='modal-checklist__title'>{data.title}</h3>
        <ul className='modal-checklist__list'>{content}</ul>
      </section>
    </>
  );
}

export default ModalList;
