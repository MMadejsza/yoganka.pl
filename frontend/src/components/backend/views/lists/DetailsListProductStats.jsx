import GenericList from '../../../common/GenericList.jsx';

function DetailsListProductStats({ data, prodStats, placement }) {
  // console.clear();
  console.log(
    `📝 
        data object from DetailsListProductStats:`,
    data
  );
  console.log('stats:', prodStats);

  const title =
    placement === 'schedule'
      ? 'Statystyki terminu:'
      : 'Dotychczasowe statystyki:';

  const details = [
    { label: 'Ilość edycji/klas:', content: prodStats.totalSchedulesAmount },
    { label: 'Łączny czas odbytych zajęć:', content: prodStats.totalTime },
    { label: 'Dochód:', content: prodStats.revenue },
    {
      label: 'Mediana wieku:',
      content: `${prodStats.medianParticipantsAge} lat`,
    },
    {
      label: 'Liczba Uczestników:',
      content: prodStats.totalParticipantsAmount,
    },
    {
      label: 'Śr. Uczestników/termin:',
      content: prodStats.avgParticipantsAmountPerSesh,
    },
    {
      label: 'Mediana Uczestników/termin:',
      content: prodStats.medianParticipantsAmountPerSesh,
    },
    {
      label: 'Śr. frekwencja/termin:',
      content: prodStats.avgAttendancePercentagePerSesh,
    },
    {
      label: 'Mediana frekwencji/termin:',
      content: prodStats.medianAttendancePerSesh,
    },
    {
      label: 'Śr. % opinii/termin:',
      content: prodStats.avgReviewersPercentage,
    },
    {
      label: 'Mediana % opinii/termin:',
      content: prodStats.medianReviewersPercentage,
    },
    { label: 'Śr. ocena:', content: prodStats.avgFeedbackScore },
  ];

  return <GenericList title={title} details={details} />;
}

export default DetailsListProductStats;
