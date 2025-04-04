import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { statsCalculatorForCustomer } from '../../../../utils/statistics/statsCalculatorForCustomer.js';
import ModalTable from '../../ModalTable.jsx';
import ViewsController from '../../ViewsController.jsx';
import WrapperModalTable from '../../WrapperModalTable.jsx';

function TableCustomerTotalPayments({ data }) {
  // console.clear();
  console.log(
    `📝 
        TableCustomerTotalPayments object from backend:`,
    data
  );
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const background = {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  };
  const handleOpenModal = row => {
    const recordId = row.id;
    setIsModalOpen(true);
    navigate(`${location.pathname}/${recordId}`, { state: { background } });
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate(-1);
  };

  const customerStats = statsCalculatorForCustomer(data);
  const content = customerStats.payments.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  // console.log(`✅ content: `, content);
  // console.log(`✅ keys: `, keys);
  // console.log(`✅ customerStats: `, customerStats);

  const headers = [
    'Id',
    'Data',
    'Zajęcia',
    'Kwota całkowita',
    'Metoda',
    'Status',
  ];
  const keys = [
    'paymentId',
    'date',
    'product',
    'amountPaid',
    'paymentMethod',
    'paymentStatus',
  ];
  const table = (
    <WrapperModalTable
      content={content}
      title={'Historia płatności '}
      noContentMsg={'płatności'}
    >
      <ModalTable
        headers={headers}
        keys={keys}
        content={content}
        active={false}
        onOpen={handleOpenModal}
      />
    </WrapperModalTable>
  );

  return (
    <>
      {table}
      {isModalOpen && (
        <ViewsController
          modifier='payment'
          visited={isModalOpen}
          onClose={handleCloseModal}
          userAccountPage={true}
          minRightsPrefix='/customer'
        />
      )}
    </>
  );
}

export default TableCustomerTotalPayments;
