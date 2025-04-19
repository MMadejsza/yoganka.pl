import SymbolOrIcon from './SymbolOrIcon.jsx';

function CardsList({ content }) {
  const monthMap = {
    '01': 'Styczeń',
    '02': 'Luty',
    '03': 'Marzec',
    '04': 'Kwiecień',
    '05': 'Maj',
    '06': 'Czerwiec',
    '07': 'Lipiec',
    '08': 'Sierpień',
    '09': 'Wrzesień',
    10: 'Październik',
    11: 'Listopad',
    12: 'Grudzień',
  };

  const list = content.map((row, index) => {
    const durationRaw = row.productDuration.split(':').slice(0, 2);
    const durationHH = String(Number(durationRaw[0]));
    const durationMM = String(Number(durationRaw[1]));
    const duration =
      durationMM != '0'
        ? ` (${durationHH}h ${durationMM}min)`
        : ` (${durationHH}h)`;

    const dateParts = row.date.split('.'); // [2025, 04, 19]
    const day = dateParts[0];
    const month = dateParts[1];
    const year = dateParts[2];
    const monthName = monthMap[month] || '';

    const cardTypeModifier = row.productType || row.paymentMethod || '';
    const cardId = row.rowId || '';
    const cardCircle = row.attended || `status`;
    const cardTitle = row.productName || row.product || '';
    const cardWeekDay = row.day || '';
    const cardDay = day || '';
    const cardYear = `${monthName} ${year}` || '';
    const cardTime = row.startTime || '';
    const cardFooter = row.location || `status - time`;

    return (
      <div key={index} className='card'>
        <div className='card__date'>
          <div className='card__date--day-name'>{cardWeekDay}</div>
          <div className='card__date--day'>{cardDay}</div>
          <div className='card__date--year'>{cardYear}</div>
        </div>

        <div className='card__modifier'>
          <SymbolOrIcon specifier='category' classModifier={'secondary'} />
          <span className='card__single-content'>{cardTypeModifier}</span>
        </div>

        <div className='card__id'>
          <SymbolOrIcon specifier='badge' classModifier={'secondary'} />
          <span className='card__single-content'>{cardId}</span>
        </div>

        <div className='card__title'>
          <SymbolOrIcon specifier='self_improvement' />
          <span className='card__single-content'>{cardTitle}</span>
        </div>

        <div className='card__desc'>
          <SymbolOrIcon specifier='schedule' />
          <span className='card__single-content'>
            {cardTime}
            <span className='card__single-content--secondary'>{duration}</span>
          </span>
        </div>

        <div className='card__status-circle'>
          <span className='card__single-content'>{cardCircle}</span>
        </div>

        <div className='card__footer'>
          <SymbolOrIcon specifier='location_on' />
          <span className='card__single-content'>{cardFooter}</span>
        </div>
      </div>
      //   <div key={index} className='card'>
      //     <div className='card__left-section'>
      //       <div className='card__date'>
      //         <div className='card__date--day-name'>{cardWeekDay}</div>
      //         <div className='card__date--day'>{cardDay}</div>
      //         <div className='card__date--year'>{cardYear}</div>
      //       </div>
      //     </div>
      //     <div className='card__right-section'>
      //       <div className='card__top'>
      //         <div className='card__modifier'>{cardTypeModifier}</div>
      //         <div className='card__id'>{cardId}</div>
      //       </div>
      //       <div className='card__body'>
      //         <div className='card__body-section'>
      //           <div className='card__title'>{cardTitle}</div>
      //           <div className='card__desc'>{cardTime}</div>
      //         </div>
      //         <div className='card__body-section'>
      //           <div className='card__status-circle'>{cardCircle}</div>
      //         </div>
      //       </div>
      //       <div className='card__footer'>{cardFooter}</div>
      //     </div>
      //   </div>
    );
  });

  return (
    <>
      <div className='cards-container'>{list}</div>
    </>
  );
}

export default CardsList;
