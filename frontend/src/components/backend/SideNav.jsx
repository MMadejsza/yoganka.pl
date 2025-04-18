import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import WrapperModal from './WrapperModal.jsx';
import NewCustomerFormForAdmin from './views/add-forms/NewCustomerFormForAdmin.jsx';
import NewPassDefinitionForm from './views/add-forms/NewPassDefinitionForm.jsx';
import NewPaymentForm from './views/add-forms/NewPaymentForm.jsx';
import NewProductForm from './views/add-forms/NewProductForm.jsx';
import NewUserForm from './views/add-forms/NewUserForm.jsx';

function SideNav({ menuSet, side, type, onclose }) {
  const navigate = useNavigate();
  const location = useLocation();

  // const isModalPath = location.pathname.includes('add-user');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleOpenModal = link => {
    setIsModalOpen(true);
    navigate(`/admin-console/${link}`, { state: { background: location } });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate(location.state?.background?.pathname, { replace: true });
  };
  return (
    <aside className='side-nav'>
      <nav className={`nav${side ? ` ${side}` : ''}`}>
        <ul className='nav__list'>
          <ul className='nav__list nav__list--bottom'>
            {menuSet.map(li => (
              <li key={li.name} className='nav__item nav__item--bottom'>
                <NavLink
                  to={li.link}
                  onClick={e => {
                    if (type == 'action') {
                      e.preventDefault();
                      handleOpenModal(pickDestination(location).dest);
                    }
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'nav__link nav__link--bottom active'
                      : 'nav__link nav__link--bottom'
                  }
                >
                  {({ isActive }) => (
                    <span className='nav__content nav__content--bottom'>
                      {li.name}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          {menuSet.map(li => (
            <li key={li.name} className='nav__item'>
              <NavLink
                to={li.link}
                onClick={e => {
                  if (type == 'action') {
                    e.preventDefault();
                    handleOpenModal(pickDestination(location).dest);
                  }
                }}
                className={({ isActive }) =>
                  isActive ? 'nav__link active' : 'nav__link'
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`${li.symbol} nav__icon ${
                        isActive ? 'active' : ''
                      } material-symbols-rounded nav__icon`}
                    >
                      {li.symbol}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {isModalOpen && (
        <WrapperModal visited={isModalOpen} onClose={handleCloseModal}>
          {pickDestination(location).comp}
        </WrapperModal>
      )}
    </aside>
  );
}

export default SideNav;
