import { useLocation, useNavigate } from 'react-router-dom';

import SymbolOrIcon from '../common/SymbolOrIcon.jsx';
import NewCustomerFormForAdmin from './views/add-forms/NewCustomerFormForAdmin.jsx';
import NewLegalDocumentForm from './views/add-forms/NewLegalDocumentForm.jsx';
import NewPassDefinitionForm from './views/add-forms/NewPassDefinitionForm.jsx';
import NewPaymentForm from './views/add-forms/NewPaymentForm.jsx';
import NewProductForm from './views/add-forms/NewProductForm.jsx';
import NewUserForm from './views/add-forms/NewUserForm.jsx';
import WrapperModal from './WrapperModal.jsx';

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
      case path.includes('show-all-tos-versions'):
        destination = 'show-all-tos-versions/add-tos-version';
        destComponent = <NewLegalDocumentForm docType='tos' />;
        break;
      case path.includes('show-all-gdpr-versions'):
        destination = 'show-all-gdpr-versions/add-gdpr-version';
        destComponent = <NewLegalDocumentForm docType='gdpr' />;
        break;
    }
    return { dest: destination, comp: destComponent };
  };
  const picked = pickDestination(location);

  const handleOpenModal = link => {
    navigate(`/admin-console/${link}`, { state: { background: location } });
  };

  const handleCloseModal = () => {
    const base = `/admin-console/${picked.dest}`;
    const parent = base.split('/').slice(0, -1).join('/');

    navigate(parent, { replace: true });
  };
  const fullModalPath = `/admin-console/${picked.dest}`;
  const isOnModalPath = location.pathname.includes(picked.dest);

  return (
    <>
      {shouldAllowCreation && (
        <button
          onClick={e => {
            e.preventDefault();
            handleOpenModal(picked.dest);
          }}
          className={`form-action-btn symbol-only-btn symbol-only-btn--floating`}
        >
          <SymbolOrIcon specifier={'add_circle'} />
        </button>
      )}

      <WrapperModal
        visited={isOnModalPath}
        basePath={fullModalPath}
        onClose={handleCloseModal}
      >
        {picked.comp}
      </WrapperModal>
    </>
  );
}

export default FloatingBtnAddItem;
