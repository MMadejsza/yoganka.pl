import GenericListTagLi from '../../common/GenericListTagLi.jsx';
import DetailsListCustomer from './lists/DetailsListCustomer.jsx';
import DetailsListCustomerPass from './lists/DetailsListCustomerPass.jsx';
import DetailsListPassDefinition from './lists/DetailsListPassDefinition.jsx';
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
  const attendance = (
    <span
      className={`material-symbols-rounded nav__icon nav__icon--attendance`}
    >
      {booking.attendance ? 'tick' : 'close'}
    </span>
  );

  return (
    <>
      <h1 className='modal__title modal__title--view'>{`Rezerwacja (Id:${booking.bookingId})`}</h1>

      <h2 className='modal__title modal__title--status'>{`${product.name}`}</h2>

      <h3 className='modal__title modal__title--status'>
        <GenericListTagLi
          objectPair={{
            label: 'Obecność: ',
            content: (
              <span
                className={`material-symbols-rounded nav__icon nav__icon--in-title`}
              >
                {booking.attendance ? 'check' : 'close'}
              </span>
            ),
          }}
          classModifier={'in-title'}
          //   extraClass={item.extraClass ?? ''}
        />
      </h3>

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

        {/*//@ Pass main details */}
        {data.booking.CustomerPass && (
          <>
            <DetailsListPassDefinition
              passDefinition={data.booking.CustomerPass.PassDefinition}
              placement={'booking'}
              isUserAccountPage={false}
            />
            <DetailsListCustomerPass
              customerPass={data.booking.CustomerPass}
              placement={'booking'}
              isUserAccountPage={false}
            />
          </>
        )}
      </div>
    </>
  );
}

export default ViewBooking;
