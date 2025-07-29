import { useLocation, useNavigate } from 'react-router-dom';
import { statsCalculatorForCustomer } from '../../../utils/statistics/statsCalculatorForCustomer.js';
import CardsList from '../../backend/cards/CardsList.jsx';
import ViewsController from '../ViewsController.jsx';
import WrapperModalTable from '../WrapperModalTable.jsx';

function ViewAccountPayments({ data }) {
  // console.clear();
  console.log(
    `📝 
        ViewAccountPayments object from backend:`,
    data
  );

  let content, customerStats;
  if (data.customer) customerStats = statsCalculatorForCustomer(data.customer);
  content = customerStats?.payments.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const navigate = useNavigate();
  const location = useLocation();

  const background = {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  };
  const handleOpenModal = row => {
    const recordId = row.paymentId;
    navigate(`${location.pathname}/${recordId}`, { state: { background } });
  };
  const handleCloseModal = () => {
    navigate('/konto/platnosci');
  };

  // const tableInside = (
  //   <ModalTable
  //     headers={[
  //       'Id',
  //       'Data',
  //       'Produkt (Nr)',
  //       'Kwota całkowita',
  //       'Metoda płatności',
  //       'Status płatności',
  //     ]}
  //     keys={[
  //       'paymentId',
  //       'date',
  //       'product',
  //       'amountPaid',
  //       'paymentMethod',
  //       'paymentStatus',
  //     ]}
  //     content={content}
  //     active={true}
  //     onOpen={handleOpenModal}
  //   />
  // );

  const cards = (
    <CardsList content={content} active={true} onOpen={handleOpenModal} />
  );

  const table = (
    <WrapperModalTable
      content={content}
      title={'Historia płatności'}
      noContentMsg={'płatności'}
    >
      {cards}
    </WrapperModalTable>
  );

  return (
    <>
      {table}

      <ViewsController
        modifier='payment'
        onClose={handleCloseModal}
        userAccountPage={true}
      />
    </>
  );
}

export default ViewAccountPayments;
