import { statsCalculatorForCustomer } from '../../utils/statistics/statsCalculatorForCustomer.js';
import DetailsCustomerStats from './DetailsCustomerStats.jsx';
import ModalTable from './ModalTable';

function AccountSchedulesHistory({ data }) {
  // console.clear();
  console.log(
    `📝 
        AccountSchedulesHistory object from backend:`,
    data
  );

  const headers = [
    'ID',
    'Data',
    'Dzień',
    'Godzina',
    'Typ',
    'Zajęcia',
    'Miejsce',
  ];
  const customerStats = statsCalculatorForCustomer(data);
  const content = customerStats.records
    .filter(record => {
      const scheduleDateTime = new Date(`${record.date}T${record.time}:00`);
      return scheduleDateTime < new Date();
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  // console.log(`✅ content: `, content);
  // console.log(`✅ keys: `, keys);
  // console.log(`✅ customerStats: `, customerStats);

  let stats, table, tableTitle;
  stats = (
    <div className='user-container schedules'>
      <DetailsCustomerStats
        customerStats={customerStats}
        altTitle={''}
        userAccountPage={true}
      />
    </div>
  );

  tableTitle = (
    <h2 className='user-container__section-title'>Ukończone zajęcia:</h2>
  );

  table =
    content.length > 0 ? (
      <ModalTable
        headers={headers}
        keys={[
          'scheduleId',
          'date',
          'day',
          'startTime',
          'productType',
          'productName',
          'location',
        ]}
        content={content}
        active={false}
        // classModifier={classModifier}
      />
    ) : (
      <h2 className='user-container__section-title dimmed'>Brak</h2>
    );

  return (
    <>
      {/* <h1 className='user-container__user-title modal__title'>Historia zajęć</h1> */}
      {stats}
      {tableTitle}
      {table}
    </>
  );
}

export default AccountSchedulesHistory;
