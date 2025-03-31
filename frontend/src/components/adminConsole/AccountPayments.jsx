import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { calculateStats } from '../../utils/customerViewsUtils.js';
import ModalTable from './ModalTable.jsx';
import ViewFrame from './ViewFrame.jsx';

function AccountPayments({ data }) {
  // console.clear();
  console.log(
    `📝 
        AccountPayments object from backend:`,
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
    const recordId = row.paymentId;
    setIsModalOpen(true);
    navigate(`${location.pathname}/${recordId}`, { state: { background } });
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate(-1);
  };

  const customerStats = calculateStats(data);
  const content = customerStats.payments.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  // console.log(`✅ content: `, content);
  // console.log(`✅ keys: `, keys);
  // console.log(`✅ customerStats: `, customerStats);

  let table, tableTitle;
  tableTitle = (
    <h2 className='user-container__section-title'>Historia płatności:</h2>
  );
  table = (
    <ModalTable
      headers={[
        'ID',
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
  );

  return (
    <>
      {/* {tableTitle} */}
      {table}
      {isModalOpen && (
        <ViewFrame
          modifier='payment'
          visited={isModalOpen}
          onClose={handleCloseModal}
          userAccountPage={true}
        />
      )}
    </>
  );
}

export default AccountPayments;
