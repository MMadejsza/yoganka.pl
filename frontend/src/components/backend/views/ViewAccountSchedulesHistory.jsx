import { useLocation } from 'react-router-dom';
import { statsCalculatorForCustomer } from '../../../utils/statistics/statsCalculatorForCustomer.js';
import ModalTable from '../ModalTable.jsx';
import WrapperModalTable from '../WrapperModalTable.jsx';
import DetailsListCustomerStats from './lists/DetailsListCustomerStats.jsx';

function ViewAccountSchedulesHistory({ data }) {
  const location = useLocation();
  // console.clear();
  console.log(
    `📝 
        ViewAccountSchedulesHistory object from backend:`,
    data
  );

  const customerStats = statsCalculatorForCustomer(data);
  const content = customerStats.attendedSchedules
    .filter(record => {
      const scheduleDateTime = new Date(
        `${record.date}T${record.startTime}:00.000Z`
      );
      return scheduleDateTime < new Date();
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  // console.log(`✅ content: `, content);
  // console.log(`✅ keys: `, keys);
  // console.log(`✅ customerStats: `, customerStats);

  const stats = (
    //<div className='user-container schedules'>
    <DetailsListCustomerStats
      customerStats={customerStats}
      altTitle={''}
      userAccountPage={true}
    />
    //</div>
  );

  const headers = [
    'Id',
    'Data',
    'Dzień',
    'Godzina',
    'Typ',
    'Zajęcia',
    'Miejsce',
  ];

  const table = (
    <WrapperModalTable
      content={content}
      title={'Ukończone zajęcia'}
      noContentMsg={'ukończonych zajęć'}
    >
      <ModalTable
        headers={headers}
        keys={customerStats.recordsKeys}
        content={content}
        active={false}
        notToArchive={location.pathname.includes(`konto/zajecia`)}
      />
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
