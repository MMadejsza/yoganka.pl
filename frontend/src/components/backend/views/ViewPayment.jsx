import { useLocation } from 'react-router-dom';
import { getWeekDay } from '../../../utils/dateTime.js';
import DetailsListCustomer from './lists/DetailsListCustomer.jsx';
import DetailsListPayment from './lists/DetailsListPayment.jsx';
import TableSchedules from './tables/TableSchedules.jsx';

function ViewPayment({ data, isUserAccountPage }) {
  const location = useLocation();
  const customerAccessed = location.pathname.includes('ustawienia');
  console.log('customerAccessed', customerAccessed);
  const adminAccessed = location.pathname.includes('admin-console');
  const isPaymentView = location.pathname.includes('show-all-payments');
  console.log('adminAccessed', adminAccessed);
  // console.clear();
  console.log(
    `📝
	    ViewPayment object from backend:`,
    data
  );
  const { payment } = data;
  const { Customer: customer } = payment;
  const schedules = payment.Bookings.map(booking => {
    return {
      ...booking.ScheduleRecord,
      productName: `${booking.ScheduleRecord.Product.name} (sId: ${booking.ScheduleRecord.scheduleId})`,
      productPrice: booking.ScheduleRecord.Product.price,
      day: getWeekDay(booking.ScheduleRecord.date),
      location: booking.ScheduleRecord.location,
    };
  });
  console.log(`ViewPayment schedules`, schedules);
  return (
    <>
      <h1 className='user-container__user-title modal__title'>{`Płatność (Id: ${
        payment.paymentId
      }${payment.performedBy == 'Admin' ? '- Manual by Admin' : ''})`}</h1>
      {!isUserAccountPage && (
        <h2 className='user-container__user-title modal__title'>{` ${customer.firstName} ${customer.lastName}`}</h2>
      )}

      {/*//@ Customer main details */}
      {!isUserAccountPage && (
        <div className='user-container__main-details modal-checklist'>
          <DetailsListCustomer
            customerData={customer}
            isUserAccountPage={isUserAccountPage}
            customerAccessed={customerAccessed}
            adminAccessed={adminAccessed}
            isPaymentView={isPaymentView}
          />
        </div>
      )}

      {/*//@ Payment main details */}
      <div className='user-container__main-details modal-checklist modal-checklist--payment'>
        <DetailsListPayment
          paymentData={payment}
          placement={'payment'}
          isUserAccountPage={isUserAccountPage}
        />
      </div>

      {/*//@ Schedules included */}
      <div className='user-container__main-details  schedules modal-checklist'>
        <TableSchedules scheduleRecords={schedules} placement='payment' />
      </div>
    </>
  );
}

export default ViewPayment;
