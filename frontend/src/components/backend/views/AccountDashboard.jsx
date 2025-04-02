import { useState } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import { statsCalculatorForCustomer } from '../../../utils/statistics/statsCalculatorForCustomer.js';
import ModalTable from '../ModalTable.jsx';
import ViewFrame from '../ViewsController.jsx';
import DetailsCustomerStats from './lists/DetailsCustomerStats.jsx';

function AccountDashboard({ data, queryStatus }) {
  const today = new Date();
  const navigate = useNavigate();
  const location = useLocation(); // fetch current path
  const matchPayments = useMatch('/konto/rezerwacje/:id');
  const [isModalOpen, setIsModalOpen] = useState(matchPayments);

  const background = {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  };

  const handleOpenScheduleModal = row => {
    setIsModalOpen(true);
    navigate(`grafik/${row.scheduleId}`, { state: { background } });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate(-1);
  };

  // console.clear();
  console.log(`✅ Data: `);
  console.log(data);

  let name, customer, stats, customerStats, statsBlock, tableTitle, table;

  if (data.customer) {
    const customer = data.customer;
    name = `${customer.firstName} ${customer.lastName}`;
    customerStats = statsCalculatorForCustomer(data.customer);
    const headers = [
      'Id',
      'Data',
      'Dzień',
      'Godzina',
      'Typ',
      'Zajęcia',
      'Miejsce',
    ];
    const content = customerStats.records;
    const contentUpcoming = content.filter(
      schedule =>
        new Date(`${schedule.date}T${schedule.startTime}:00.000Z`) >= today
    );

    // console.log(`✅ contentUpcoming: `, contentUpcoming);
    // console.log(`✅ content: `, content);
    // console.log(`✅ keys: `, keys);
    console.log(`✅ customerStats: `, customerStats);

    statsBlock = (
      <div className='user-container schedules'>
        <DetailsCustomerStats
          customerStats={customerStats}
          altTitle={''}
          userAccountPage={true}
        />
      </div>
    );

    tableTitle = (
      <h2 className='user-container__section-title'>{`Nadchodzące zajęcia (${contentUpcoming.length})`}</h2>
    );

    table =
      contentUpcoming && contentUpcoming.length > 0 ? (
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
          content={contentUpcoming}
          active={true}
          onOpen={handleOpenScheduleModal}
          // classModifier={classModifier}
        />
      ) : (
        <div
          className='dimmed'
          style={{ fontSize: '2rem', marginBottom: '3re m' }}
        >
          Brak nowych rezerwacji
        </div>
      );
  } else {
    stats = (
      <h2 className='user-container__section-title dimmed'>
        Brak statystyk do wyświetlenia
      </h2>
    );
    table = (
      <h2 className='user-container__section-title dimmed'>Brak rezerwacji</h2>
    );
  }

  if (queryStatus.isError) {
    console.log(queryStatus.error.code);
    if (error.code == 401) {
      navigate('/login');
      console.log(queryStatus.error.message);
    } else {
      window.alert(
        queryStatus.error.info?.message ||
          'Błąd serwera - pobieranie danych uczestnika przerwane'
      );
    }
  }
  return (
    <>
      {statsBlock}
      {tableTitle}
      {table}
      {isModalOpen && (
        <ViewFrame
          modifier='schedule'
          visited={isModalOpen}
          onClose={handleCloseModal}
          userAccountPage={true}
          customer={customer}
        />
      )}
    </>
  );
}

export default AccountDashboard;
