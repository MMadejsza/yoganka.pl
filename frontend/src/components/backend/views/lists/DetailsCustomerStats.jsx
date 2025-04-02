import GenericList from '../../../common/GenericList.jsx';
function DetailsCustomerStats({ customerStats, altTitle, userAccountPage }) {
  const campsNumber = customerStats.schedulesAmount.breakdown.camps;
  const eventsNumber = customerStats.schedulesAmount.breakdown.events;
  const classesNumber = customerStats.schedulesAmount.breakdown.classes;
  const onlineNumber = customerStats.schedulesAmount.breakdown.online;

  const title = altTitle || 'Statystyki:';
  const details = [
    {
      label: 'Ilość ukończonych zajęć:',
      content: customerStats.schedulesAmount.total,
    },
    {
      label: 'Wyjazdy/Wydarzenia/Online:',
      content: `${campsNumber}/${eventsNumber}/${onlineNumber}`,
    },
    { label: 'Ilość godzin yogi:', content: customerStats.totalHours },
  ];

  if (!userAccountPage) {
    details.unshift({
      label: 'Całkowity dochód:',
      content: customerStats.revenue,
    });
  }

  return <GenericList title={title} details={details} />;
}

export default DetailsCustomerStats;
