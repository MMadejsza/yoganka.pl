import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { statsCalculatorForCustomer } from '../../../utils/statistics/statsCalculatorForCustomer.js';
import ModalTable from '../ModalTable.jsx';
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
  if (data.customer) customerStats = statsCalculatorForCustomer(data);
  content = customerStats?.payments.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  // console.log(`✅ content: `, content);
  // console.log(`✅ keys: `, keys);
  // console.log(`✅ customerStats: `, customerStats);

  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const background = {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  };
  const handleOpenModal = row => {
    const recordId = row.paymentId;
    setIsModalOpen(true);
    navigate(`${location.pathname}/${recordId}`, { state: { background } });
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate(-1);
  };

  const table = (
    <WrapperModalTable
      content={content}
      title={'Historia płatności'}
      noContentMsg={'płatności'}
    >
      <ModalTable
        headers={[
          'Id',
          'Data',
          'Zajęcia',
          'Kwota całkowita',
          'Metoda płatności',
          'Status płatności',
        ]}
        keys={[
          'paymentId',
          'date',
          'product',
          'amountPaid',
          'paymentMethod',
          'paymentStatus',
        ]}
        content={content}
        active={true}
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
        />
      )}
    </>
  );
}

export default ViewAccountPayments;
