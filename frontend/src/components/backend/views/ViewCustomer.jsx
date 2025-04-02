import { useLocation } from 'react-router-dom';
import { statsCalculatorForCustomer } from '../../../utils/statistics/statsCalculatorForCustomer.js';
import DetailsListCustomer from './lists/DetailsListCustomer.jsx';
import DetailsListCustomerStats from './lists/DetailsListCustomerStats.jsx';
import DetailsListUser from './lists/DetailsListUser.jsx';
import DetailsListUserSettings from './lists/DetailsListUserSettings.jsx';
import DetailsCustomerInvoices from './tables/ViewCustomerInvoices.jsx';
import DetailsCustomerReviews from './tables/ViewCustomerReviews.jsx';
import DetailsCustomerSchedules from './tables/ViewCustomerSchedules.jsx';
import ViewCustomerTotalPayments from './tables/ViewCustomerTotalPayments.jsx';

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
    ? `${customer.firstName} ${customer.lastName}`
    : user.Login;

  const customerStats = statsCalculatorForCustomer(customer);
  const noInvoices = customerStats.invoices.length > 0 ? false : true;

  return (
    <>
      <h1 className='user-container__user-title modal__title'>{name}</h1>

      {/*//@ Personal-customer details */}
      <div className='user-container__main-details modal-checklist'>
        <DetailsListCustomer
          customerData={customer}
          customerAccessed={customerAccessed}
          adminAccessed={adminAccessed}
        />
      </div>

      {/*//@ Personal-user details */}
      <div className='user-container__side-details modal-checklist'>
        <DetailsListUser userData={user} customerView={true} />

        {user.UserPrefSetting && (
          <DetailsListUserSettings
            settingsData={user.UserPrefSetting}
            customerAccessed={customerAccessed}
            adminAccessed={adminAccessed}
          />
        )}
      </div>

      {/*//@ Stats */}
      <div className='user-container__main-details user-container__side-details--schedules schedules modal-checklist'>
        <DetailsListCustomerStats customerStats={customerStats} />
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
