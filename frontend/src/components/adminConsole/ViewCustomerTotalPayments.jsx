import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { calculateStats } from '../../utils/customerViewsUtils.js';
import ModalTable from './ModalTable.jsx';
import ViewFrame from './ViewFrame.jsx';

function ViewCustomerTotalPayments({ data }) {
  // console.clear();
  console.log(
    `📝 
        ViewCustomerTotalPayments object from backend:`,
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

  const customerStats = calculateStats(data);
  const content = customerStats.payments.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  // console.log(`✅ content: `, content);
  // console.log(`✅ keys: `, keys);
  // console.log(`✅ customerStats: `, customerStats);

  let table;
  table = (
    <ModalTable
      headers={['ID', 'Data', 'Zajęcia', 'Kwota całkowita', 'Metoda', 'Status']}
      keys={['id', 'date', 'classes', 'totalValue', 'method', 'status']}
      content={content}
      active={false}
      onOpen={handleOpenModal}
    />
  );

  return (
    <>
      <h2 className='user-container__section-title modal__title--day'>{`Historia płatności (${customerStats.payments.length}):`}</h2>

      {table}
      {isModalOpen && (
        <ViewFrame
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

export default ViewCustomerTotalPayments;
