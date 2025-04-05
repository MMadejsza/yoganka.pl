import { statsCalculatorForCustomer } from '../../../../utils/statistics/statsCalculatorForCustomer.js';
import DetailsListCustomerStats from '../../lists/DetailsListCustomerStats.jsx';
import ModalTable from '../../ModalTable.jsx';
import WrapperModalTable from '../../WrapperModalTable.jsx';

function TableCustomerTotalSchedules({ data }) {
  // console.clear();
  console.log(
    `📝 
        ViewUserTotalSchedules object from backend:`,
    data
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
  const keys = [
    'scheduleId',
    'date',
    'day',
    'startTime',
    'productType',
    'productName',
    'location',
  ];
  const customerStats = statsCalculatorForCustomer(data);
  const content = customerStats.attendedSchedules.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  // console.log(`✅ content: `, content);
  // console.log(`✅ keys: `, keys);
  // console.log(`✅ customerStats: `, customerStats);

  const stats = (
    // <div className='user-container schedules'>
    <DetailsListCustomerStats
      customerStats={customerStats}
      altTitle={'W liczbach:'}
      userAccountPage={true}
    />
    // </div>
  );

  const table = (
    <WrapperModalTable
      content={content}
      title={'Historia zajęć'}
      noContentMsg={'zajęć'}
    >
      <ModalTable
        headers={headers}
        keys={keys}
        content={content}
        active={false}
        // classModifier={classModifier}
      />{' '}
    </WrapperModalTable>
  );

  return (
    <>
      {stats}
      {table}
    </>
  );
}

export default TableCustomerTotalSchedules;
