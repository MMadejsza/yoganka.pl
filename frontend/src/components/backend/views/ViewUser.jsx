import { useLocation } from 'react-router-dom';
import DetailsListCustomer from './lists/DetailsListCustomer.jsx';
import DetailsListUser from './lists/DetailsListUser.jsx';
import DetailsListUserSettings from './lists/DetailsListUserSettings.jsx';

function ViewUser({ data, isUserAccountPage }) {
  const location = useLocation();
  const customerAccessed = location.pathname.includes('ustawienia');
  console.log('customerAccessed', customerAccessed);
  const adminAccessed = location.pathname.includes('admin-console');
  console.log('adminAccessed', adminAccessed);

  // const isUserSettings = location.pathname.includes('konto/ustawienia');

  // console.clear();
  console.log(
    `📝 user object from backend:
		`,
    data
  );
  console.log(
    `📝 isUserAccountPage:
		`,
    isUserAccountPage
  );

  const user = data.user || data.customer.User;
  const customer = data.customer || data.user.Customer;
  const isAdmin =
    data.user?.role == 'Admin' || data.customer?.User.role == 'Admin'; //|| data.user.User?.role == 'Admin';
  const name = customer
    ? `${customer.firstName} ${customer.lastName}`
    : user.email;

  return (
    <>
      {!isUserAccountPage && (
        <h2 className='modal__title dimmed'>
          {JSON.parse(user.profilePictureSrcSetJson)?.profile}
        </h2>
      )}
      {!isUserAccountPage && (
        <h1 className='modal__title'>
          {name} {isAdmin && '(Admin)'}
        </h1>
      )}
      {/* <div className='user-container__main-details modal-checklist'> */}

      {/* </div> */}
      {/* <div className='user-container__main-details modal-checklist'> */}
      <div className='generic-outer-wrapper'>
        <DetailsListUserSettings
          settingsData={user.UserPrefSetting}
          isUserAccountPage={isUserAccountPage}
          customerAccessed={customerAccessed}
          adminAccessed={adminAccessed}
        />
        {/* </div> */}
        {customer && (
          <DetailsListCustomer
            customerData={customer}
            isUserAccountPage={isUserAccountPage}
            customerAccessed={customerAccessed}
            adminAccessed={adminAccessed}
          />
        )}
        <DetailsListUser
          userData={user}
          customerView={false}
          isUserAccountPage={isUserAccountPage}
        />
      </div>
    </>
  );
}

export default ViewUser;
