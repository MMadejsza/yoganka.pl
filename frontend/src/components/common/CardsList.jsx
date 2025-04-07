function CardsList({ content }) {
  const list = content.map((row, index) => {
    const cardTypeModifier = row.productType || row.paymentMethod || '';
    const cardId = row.rowId || '';
    const cardCircle = row.attended || `status`;
    const cardTitle = row.productName || row.product || '';
    const cardWeekDay = row.day || '';
    const cardDay = row.date.slice(8) || '';
    const cardYear = row.date.slice(0, 4) || '';
    const cardTime = row.startTime || '';
    const cardFooter = row.location || `status - time`;

    return (
      <div key={index} className='card'>
        <div className='card__date-time'>
          <div className='card__date--day-name'>{cardWeekDay}</div>
          <div className='card__date--day'>{cardDay}</div>
          <div className='card__date--year'>{cardYear}</div>
        </div>

        <div className='card__modifier'>{cardTypeModifier}</div>
        <div className='card__id'>{cardId}</div>

        <div className='card__title'>{cardTitle}</div>
        <div className='card__desc'>{cardTime}</div>

        <div className='card__status-circle'>{cardCircle}</div>

        <div className='card__footer'>{cardFooter}</div>
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
