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
      <h1 className='modal__title'>{`Płatność (Id: ${
        payment.paymentId
      }${payment.performedBy == 'Admin' ? '- Manual by Admin' : ''})`}</h1>
      {!isUserAccountPage && (
        <h2 className=' modal__title'>{` ${customer.firstName} ${customer.lastName}`}</h2>
      )}

      {/*//@ Customer main details */}
      <div className='generic-outer-wrapper'>
        {!isUserAccountPage && (
          <DetailsListCustomer
            customerData={customer}
            isUserAccountPage={isUserAccountPage}
            customerAccessed={customerAccessed}
            adminAccessed={adminAccessed}
            isPaymentView={isPaymentView}
            classModifier='payment-view'
          />
        )}

        {/*//@ Payment main details */}
        <DetailsListPayment
          paymentData={payment}
          placement={'payment'}
          isUserAccountPage={isUserAccountPage}
        />
      </div>

      {/*//@ Schedules included */}
      <TableSchedules scheduleRecords={schedules} placement='payment' />
    </>
  );
}

export default ViewPayment;
