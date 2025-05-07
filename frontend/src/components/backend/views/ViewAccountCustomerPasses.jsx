import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CardsList from '../../backend/CardsList.jsx';
import ViewsController from '../ViewsController.jsx';
import WrapperModalTable from '../WrapperModalTable.jsx';
import TableCustomerPasses from './tables/TableCustomerPasses.jsx';

function ViewAccountCustomerPasses({ data }) {
  console.log('ViewAccountCustomerPasses data', data);
  let cp;
  if (data.customer)
    cp = data.customer.customerPasses.sort((a, b) => {
      const aStatusInt = Number(a) || -1;
      const bStatusInt = Number(b) || -1;

      if (aStatusInt !== bStatusInt) {
        return bStatusInt - aStatusInt;
      }

      // getTime to get ms
      const timeA = a.validUntil ? new Date(a.validUntil).getTime() : Infinity;
      const timeB = b.validUntil ? new Date(b.validUntil).getTime() : Infinity;

      return timeA - timeB;
    });

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
  const cards = (
    <WrapperModalTable
      content={cp}
      title={'Wszystkie zakupione karnety'}
      noContentMsg={'zakupionych karnetów'}
    >
      <CardsList content={cp} active={true} onOpen={handleOpenModal} />;
    </WrapperModalTable>
  );

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
      {/* {table} */}
      {cards}
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
