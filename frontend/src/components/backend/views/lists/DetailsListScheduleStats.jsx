import GenericList from '../../../common/GenericList.jsx';

function DetailsListScheduleStats({ data, scheduleStats }) {
  // console.clear();
  console.log(
    `📝 
        data object from DetailsListScheduleStats:`,
    data
  );
  console.log('stats:', scheduleStats);

  const title = 'Statystyki terminu:';
  const details = [
    { label: 'Dochód:', content: scheduleStats.revenue },
    {
      label: 'Liczba Uczestników:',
      content: scheduleStats.attendedBookingsCount,
    },
    {
      label: 'Mediana wieku:',
      content: `${scheduleStats.medianParticipantsAge} lat`,
    },
    { label: 'Frekwencja:', content: scheduleStats.avgAttendancePercentage },
    { label: '% opinii:', content: scheduleStats.avgReviewersPercentage },
    { label: 'Śr. ocena:', content: scheduleStats.avgFeedbackScore },
  ];

  return <GenericList title={title} details={details} />;
}

export default DetailsListScheduleStats;
