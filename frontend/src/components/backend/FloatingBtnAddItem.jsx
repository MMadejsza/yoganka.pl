import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import WrapperModal from './WrapperModal.jsx';
import NewCustomerFormForAdmin from './views/add-forms/NewCustomerFormForAdmin.jsx';
import NewPassDefinitionForm from './views/add-forms/NewPassDefinitionForm.jsx';
import NewPaymentForm from './views/add-forms/NewPaymentForm.jsx';
import NewProductForm from './views/add-forms/NewProductForm.jsx';
import NewUserForm from './views/add-forms/NewUserForm.jsx';

function FloatingBtnAddItem({}) {
  const navigate = useNavigate();
  const location = useLocation();

  const noCreateOptionPages = [
    'show-all-schedules',
    'show-all-bookings',
    'show-all-customer-passes',
    'show-all-invoices',
    'show-all-newsletters',
    'show-all-participants-feedback',
    'add',
  ];
  const shouldAllowCreation = !noCreateOptionPages.some(lockedPath =>
    location.pathname.includes(lockedPath)
  );

  // const isModalPath = location.pathname.includes('add-user');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = link => {
    setIsModalOpen(true);
    navigate(`/admin-console/${link}`, { state: { background: location } });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate(location.state?.background?.pathname, { replace: true });
  };

  const pickDestination = location => {
    let destination, destComponent;
    const path = location.pathname;
    switch (true) {
      case path.includes('show-all-users'):
        destination = 'show-all-users/add-user';
        destComponent = <NewUserForm />;
        break;

      case path.includes('show-all-customers'):
        destination = 'show-all-customers/add-customer';
        destComponent = <NewCustomerFormForAdmin />;
        break;

      case path.includes('show-all-products'):
        destination = 'show-all-products/add-product';
        destComponent = <NewProductForm />;
        break;

      case path.includes('show-all-schedules'):
        destination = 'show-all-schedules/add-schedule';
        destComponent = <NewUserForm />;
        break;

      case path.includes('show-all-payments'):
        destination = 'show-all-payments/add-payment';
        destComponent = <NewPaymentForm />;
        break;

      case path.includes('show-all-passes'):
        destination = 'show-all-passes/add-pass-definition';
        destComponent = <NewPassDefinitionForm />;
        break;
    }
    return { dest: destination, comp: destComponent };
  };

  return (
    <>
      {shouldAllowCreation && (
        <button
          onClick={e => {
            e.preventDefault();
            handleOpenModal(pickDestination(location).dest);
          }}
          className={`form-action-btn symbol-only-btn symbol-only-btn--floating`}
        >
          <span className='material-symbols-rounded nav__icon account'>
            add_circle
          </span>
        </button>
      )}
      {isModalOpen && (
        <WrapperModal visited={isModalOpen} onClose={handleCloseModal}>
          {pickDestination(location).comp}
        </WrapperModal>
      )}
    </>
  );
}

export default FloatingBtnAddItem;
