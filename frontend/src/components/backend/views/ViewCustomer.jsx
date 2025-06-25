import { useLocation } from 'react-router-dom';
import { statsCalculatorForCustomer } from '../../../utils/statistics/statsCalculatorForCustomer.js';
import DetailsListCustomer from './lists/DetailsListCustomer.jsx';
import DetailsListCustomerStats from './lists/DetailsListCustomerStats.jsx';
import DetailsListUser from './lists/DetailsListUser.jsx';
import DetailsListUserSettings from './lists/DetailsListUserSettings.jsx';
import TableCustomerInvoices from './tables/TableCustomerInvoices.jsx';
import TableCustomerPasses from './tables/TableCustomerPasses.jsx';
import TableCustomerReviews from './tables/TableCustomerReviews.jsx';
import TableCustomerSchedules from './tables/TableCustomerSchedules.jsx';
import TableCustomerTotalPayments from './tables/TableCustomerTotalPayments.jsx';

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
      <h1 className='modal__title modal__title--view'>{name}</h1>

      {/*//@ Personal-customer details */}
      <div className='generic-outer-wrapper'>
        <DetailsListCustomer
          customerData={customer}
          customerAccessed={customerAccessed}
          adminAccessed={adminAccessed}
        />

        {user.UserPrefSetting && (
          <DetailsListUserSettings
            settingsData={user.UserPrefSetting}
            customerAccessed={customerAccessed}
            adminAccessed={adminAccessed}
            userId={user.userId}
          />
        )}

        {/*//@ Personal-user details */}
        <DetailsListUser userData={user} customerView={true} />

        {/*//@ Stats */}
        <DetailsListCustomerStats customerStats={customerStats} />
      </div>

      {/*//@ Customer passes  */}
      <TableCustomerPasses
        customerPasses={customer.CustomerPasses}
        shouldShowPassName={true}
        // keys={customer.customerPassesKeys}
      />

      {/*//@ Schedules */}
      <TableCustomerSchedules
        customerStats={customerStats}
        classModifier='admin-view'
      />

      {/*//@ Reviews */}
      <TableCustomerReviews reviews={customerStats.reviews} />

      {/*//@ Payments */}
      <TableCustomerTotalPayments data={customer} />
      {/* </div> */}

      {/*//@ Invoices */}
      <div
        className={`user-container__${
          noInvoices ? 'side' : 'main'
        }-details user-container__side-details--schedules schedules modal-checklist`}
      >
        <TableCustomerInvoices
          invoicesArray={customerStats.invoices}
          noInvoices={noInvoices}
        />
      </div>
    </>
  );
}

export default ViewCustomer;
