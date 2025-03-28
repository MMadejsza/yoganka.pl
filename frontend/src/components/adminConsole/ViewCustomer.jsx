import { useLocation } from 'react-router-dom';
import DetailsCustomer from './DetailsCustomer.jsx';
import DetailsCustomerInvoices from './DetailsCustomerInvoices.jsx';
import DetailsCustomerReviews from './DetailsCustomerReviews.jsx';
import DetailsCustomerSchedules from './DetailsCustomerSchedules.jsx';
import DetailsCustomerStats from './DetailsCustomerStats.jsx';
import DetailsUser from './DetailsUser.jsx';
import DetailsUserSettings from './DetailsUserSettings.jsx';
import ViewCustomerTotalPayments from './ViewCustomerTotalPayments.jsx';

import { calculateStats } from '../../utils/customerViewsUtils.js';

function ViewCustomer({ data }) {
  const location = useLocation();
  const customerAccessed = location.pathname.includes('ustawienia');
  console.log('customerAccessed', customerAccessed);
  const adminAccessed = location.pathname.includes('admin-console');
  console.log('adminAccessed', adminAccessed);
  console.clear();
  console.log(
    `📝 
        customer object from backend:`,
    data
  );

  const user = data.customer.User;
  const customer = data.customer;
  const name = customer
    ? `${customer.FirstName} ${customer.LastName}`
    : user.Login;

  const customerStats = calculateStats(customer);
  const noInvoices = customerStats.invoices.length > 0 ? false : true;

  return (
    <>
      <h1 className='user-container__user-title modal__title'>{name}</h1>

      {/*//@ Personal-customer details */}
      <div className='user-container__main-details modal-checklist'>
        <DetailsCustomer
          customerData={customer}
          customerAccessed={customerAccessed}
          adminAccessed={adminAccessed}
        />
      </div>

      {/*//@ Personal-user details */}
      <div className='user-container__side-details modal-checklist'>
        <DetailsUser userData={user} customerView={true} />

        {user.UserPrefSetting && (
          <DetailsUserSettings
            settingsData={user.UserPrefSetting}
            customerAccessed={customerAccessed}
            adminAccessed={adminAccessed}
          />
        )}
      </div>

      {/*//@ Stats */}
      <div className='user-container__main-details user-container__side-details--schedules schedules modal-checklist'>
        <DetailsCustomerStats customerStats={customerStats} />
      </div>

      {/*//@ Schedules */}
      <div className='user-container__main-details user-container__side-details--schedules schedules modal-checklist'>
        <DetailsCustomerSchedules customerStats={customerStats} />
      </div>
      {/*//@ Reviews */}
      <div className='user-container__main-details user-container__side-details--schedules schedules modal-checklist'>
        <DetailsCustomerReviews reviews={customerStats.reviews} />
      </div>
      {/*//@ Payments */}
      <div className='user-container__main-details user-container__side-details--schedules schedules modal-checklist'>
        <ViewCustomerTotalPayments data={customer} />
      </div>

      {/*//@ Invoices */}
      <div
        className={`user-container__${
          noInvoices ? 'side' : 'main'
        }-details user-container__side-details--schedules schedules modal-checklist`}
      >
        <DetailsCustomerInvoices
          invoicesArray={customerStats.invoices}
          noInvoices={noInvoices}
        />
      </div>
    </>
  );
}

export default ViewCustomer;
