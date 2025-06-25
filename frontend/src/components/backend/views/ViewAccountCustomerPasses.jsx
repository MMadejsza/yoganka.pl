import { useLocation, useNavigate } from 'react-router-dom';
import { useHandleStripeRedirect } from '../../../hooks/useHandleStripeRedirect.js';
import CardsList from '../../backend/cards/CardsList.jsx';
import ViewsController from '../ViewsController.jsx';
import WrapperModalTable from '../WrapperModalTable.jsx';
import TableCustomerPasses from './tables/TableCustomerPasses.jsx';

function ViewAccountCustomerPasses({ data }) {
  console.log('ViewAccountCustomerPasses data', data);

  const navigate = useNavigate();
  const location = useLocation();
  useHandleStripeRedirect();

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

  const background = {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  };

  const handleOpenModal = row => {
    const recordId = row.rowId;
    const modalPath = `${location.pathname}/${recordId}`;
    navigate(modalPath, { state: { background } });
  };

  const handleCloseModal = () => {
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

      <ViewsController
        modifier='customerPass'
        onClose={handleCloseModal}
        userAccountPage={true}
        customer={data.customer}
      />
    </>
  );
}

export default ViewAccountCustomerPasses;
