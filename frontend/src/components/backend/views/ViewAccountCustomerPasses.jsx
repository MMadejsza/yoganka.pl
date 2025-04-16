import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ViewsController from '../ViewsController.jsx';
import TableCustomerPasses from './tables/TableCustomerPasses.jsx';

function ViewAccountCustomerPasses({ data }) {
  console.log('ViewAccountCustomerPasses data', data);
  let cp;
  if (data.customer) cp = data.customer.customerPasses;

  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const background = {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  };

  const handleOpenModal = row => {
    const recordId = row.rowId;
    setIsModalOpen(true);
    navigate(`${location.pathname}/${recordId}`, { state: { background } });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/konto/karnety');
  };

  const keys = [
    'customerPassId',
    'passName',
    'purchaseDate',
    'validFrom',
    'validUntil',
    'usesLeft',
    'status',
  ];

  // @ CustomerPasses table for this definition
  const table = (
    <TableCustomerPasses
      customerPasses={cp}
      shouldShowPassName={true}
      isActive={true}
      onOpen={handleOpenModal}
    />
  );

  return (
    <>
      {table}
      {isModalOpen && (
        <ViewsController
          modifier='customerPass'
          visited={isModalOpen}
          onClose={handleCloseModal}
          userAccountPage={true}
        />
      )}
    </>
  );
}

export default ViewAccountCustomerPasses;
