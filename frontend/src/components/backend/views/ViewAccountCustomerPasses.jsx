import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TableCustomerPasses from './tables/TableCustomerPasses.jsx';

function ViewAccountCustomerPasses({ data }) {
  console.log('ViewPassDefinition data', data);
  const { CustomerPasses: cp } = data;

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

  const keys = [
    'customerPassId',
    'customerFullName',
    'passName',
    'purchaseDate',
    'validFrom',
    'validUntil',
    'usesLeft',
    'status',
  ];

  // @ CustomerPasses table for this definition
  const table = (
    <TableCustomerPasses customerPasses={cp} keys={keys} isAdminPage={true} />
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

export default ViewAccountCustomerPasses;
