import { useLocation } from 'react-router-dom';
import { statsCalculatorForCustomer } from '../../../utils/statistics/statsCalculatorForCustomer.js';
import CardsList from '../../backend/cards/CardsList.jsx';
import WrapperModalTable from '../WrapperModalTable.jsx';
import DetailsListCustomerStats from './lists/DetailsListCustomerStats.jsx';

function ViewAccountSchedulesHistory({ data }) {
  // console.clear();
  console.log(
    `📝 
    ViewAccountSchedulesHistory object from backend:`,
    data
  );
  const location = useLocation();
  let content, customerStats;
  if (data.customer) customerStats = statsCalculatorForCustomer(data.customer);
  content = customerStats?.attendedSchedules
    .filter(record => {
      const scheduleDateTime = new Date(
        `${record.date}T${record.startTime}.000Z`
      );
      return scheduleDateTime < new Date();
    })
    .sort(
      (a, b) =>
        new Date(`${b.date}T${b.startTime}.000Z`) -
        new Date(`${a.date}T${a.startTime}.000Z`)
    );

  const stats = data.customer ? (
    <DetailsListCustomerStats
      customerStats={customerStats}
      altTitle={''}
      userAccountPage={true}
    />
  ) : null;

  const headers = [
    'Id',
    'Data',
    'Dzień',
    'Godzina',
    'Typ',
    'Zajęcia',
    'Miejsce',
  ];

  const cards = (
    <CardsList content={content} active={false} notToArchive={true} />
  );

  const table = (
    <WrapperModalTable
      content={content}
      title={'Ukończone zajęcia'}
      noContentMsg={'ukończonych zajęć'}
    >
      {cards}
    </WrapperModalTable>
  );

  return (
    <>
      {stats}
      {table}
    </>
  );
}

export default ViewAccountSchedulesHistory;
