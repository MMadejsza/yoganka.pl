import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import ModalFrame from './WrapperModal.jsx';
import NewCustomerForm from './views/add-forms/NewCustomerForm.jsx';
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
        destComponent = <NewCustomerForm />;
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
      <nav className={`nav ${side}`}>
        <ul className='nav__list'>
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
                    {li.name}
                    <span
                      className={`${li.icon} nav__icon ${
                        isActive ? 'active' : ''
                      } material-symbols-rounded nav__icon`}
                    >
                      {li.icon}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {isModalOpen && (
        <ModalFrame visited={isModalOpen} onClose={handleCloseModal}>
          {pickDestination(location).comp}
        </ModalFrame>
      )}
    </aside>
  );
}

export default SideNav;
