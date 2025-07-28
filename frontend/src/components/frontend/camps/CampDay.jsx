function CampDay({ dayData }) {
  // console.log(dayData);
  const { day, entries } = dayData;
  return (
    <>
      <h4 className='modal__title--day'>
        {day !== 'combo' ? day : dayData.comboLabel}
      </h4>
      <ul className='checklist__list'>
        {entries.map((entry, index) => {
          return (
            <li key={index} className='checklist__li'>
              <div>{entry.time}</div>
              <div>{entry.activity}</div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default CampDay;
