import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { NavLink } from 'react-router-dom';
import ModalFrame from './ModalFrame.jsx';
import NewBookingForm from './NewBookingForm.jsx';
import NewCustomerForm from './NewCustomerForm.jsx';
import NewProductForm from './NewProductForm.jsx';
import NewUserForm from './NewUserForm.jsx';

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

      case path.includes('show-all-bookings'):
        destination = 'show-all-bookings/add-booking';
        destComponent = <NewBookingForm />;
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
