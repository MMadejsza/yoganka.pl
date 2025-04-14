import { useState } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import { statsCalculatorForCustomer } from '../../../utils/statistics/statsCalculatorForCustomer.js';
import CardsList from '../../common/CardsList.jsx';
import ModalTable from '../ModalTable.jsx';
import ViewsController from '../ViewsController.jsx';
import WrapperModalTable from '../WrapperModalTable.jsx';

function ViewAccountDashboard({ data, queryStatus }) {
  const today = new Date();
  const navigate = useNavigate();
  const location = useLocation(); // fetch current path
  const match = useMatch('/konto/grafik/:id');
  const [isModalOpen, setIsModalOpen] = useState(match);

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
    navigate('/konto');
  };

  // console.clear();
  console.log(`✅ Data: `);
  console.log(data);

  let name, customer, customerStats, statsBlock, contentUpcoming;
  const headers = [
    'Id',
    'Data',
    'Dzień',
    'Godzina',
    'Typ',
    'Zajęcia',
    'Miejsce',
  ];
  if (data.customer) {
    customer = data.customer;
    name = `${customer.firstName} ${customer.lastName}`;
    customerStats = statsCalculatorForCustomer(data.customer);

    const content = customerStats.attendedSchedules;
    contentUpcoming = content.filter(
      schedule =>
        new Date(`${schedule.date}T${schedule.startTime}:00.000Z`) >= today
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

  const cards = <CardsList content={contentUpcoming} />;

  const table = (
    <WrapperModalTable
      content={contentUpcoming}
      title={'Nadchodząca Yoga'}
      noContentMsg={'nowych rezerwacji'}
    >
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
        classModifier={'user-account'}
      />
    </WrapperModalTable>
  );
  return (
    <>
      {statsBlock}
      {/* {cards} */}
      {table}
      {isModalOpen && (
        <ViewsController
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

export default ViewAccountDashboard;
