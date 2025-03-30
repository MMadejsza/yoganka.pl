function DetailsScheduleStats({ data, scheduleStats }) {
  // console.clear();
  console.log(
    `📝 
        data object from DetailsScheduleStats:`,
    data
  );
  console.log('stats:', scheduleStats);

  return (
    <>
      <h2 className='user-container__section-title modal__title--day'>
        Statystyki terminu:
      </h2>

      <ul className='user-container__details-list modal-checklist__list'>
        <li className='user-container__section-record modal-checklist__li'>
          <p className='user-container__section-record-label'>Dochód:</p>
          <p className='user-container__section-record-content'>
            {scheduleStats.revenue}
          </p>
        </li>
        <li className='user-container__section-record modal-checklist__li'>
          <p className='user-container__section-record-label'>
            Liczba Uczestników:
          </p>
          <p className='user-container__section-record-content'>
            {scheduleStats.attendedBookingsCount}
          </p>
        </li>
        <li className='user-container__section-record modal-checklist__li'>
          <p className='user-container__section-record-label'>Mediana wieku:</p>
          <p className='user-container__section-record-content'>
            {scheduleStats.medianParticipantsAge} lat
          </p>
        </li>

        <li className='user-container__section-record modal-checklist__li'>
          <p className='user-container__section-record-label'>Frekwencja:</p>
          <p className='user-container__section-record-content'>
            {scheduleStats.avgAttendancePercentage}
          </p>
        </li>
        <li className='user-container__section-record modal-checklist__li'>
          <p className='user-container__section-record-label'>% opinii:</p>
          <p className='user-container__section-record-content'>
            {scheduleStats.avgReviewersPercentage}
          </p>
        </li>

        <li className='user-container__section-record modal-checklist__li'>
          <p className='user-container__section-record-label'>Śr. ocena:</p>
          <p className='user-container__section-record-content'>
            {scheduleStats.avgFeedbackScore}
          </p>
        </li>
      </ul>
    </>
  );
}

export default DetailsScheduleStats;
