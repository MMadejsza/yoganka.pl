import DetailsListCustomer from './lists/DetailsListCustomer.jsx';
import DetailsListPayment from './lists/DetailsListPayment.jsx';
import DetailsListSchedule from './lists/DetailsListSchedule.jsx';

function ViewBooking({ data }) {
  console.log('ViewBooking data', data);
  const { booking } = data;
  const { Customer: customer } = booking;
  const { ScheduleRecord: schedule } = booking;
  const { Product: product } = schedule;
  const type = product.type;
  console.clear();
  console.log(type);
  console.log(
    `📝
	    Booking ViewBooking object from backend:`,
    data
  );

  return (
    <>
      <h1 className='modal__title modal__title--view'>{`Rezerwacja (Id:${booking.bookingId})`}</h1>

      <h2 className='modal__title modal__title--status'>{`${product.name}`}</h2>

      <div className='generic-outer-wrapper'>
        {/*//@ Schedule details */}
        <DetailsListSchedule data={schedule} />

        {/*//@ Customer details */}
        <DetailsListCustomer
          customerData={customer}
          isPaymentView={true} //to not show edit btn
        />

        {/*//@ Payment main details */}
        {data.booking.Payment && (
          <DetailsListPayment
            paymentData={data.booking.Payment}
            placement={'booking'}
            isUserAccountPage={false}
          />
        )}
      </div>
    </>
  );
}

export default ViewBooking;
