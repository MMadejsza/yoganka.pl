import DetailsCustomer from './DetailsCustomer.jsx';
import DetailsBooking from './DetailsBooking.jsx';
import DetailsProductSchedules from './DetailsProductSchedules.jsx';
import DetailsProductStats from './DetailsProductStats.jsx';
import DetailsProductBookings from './DetailsProductBookings.jsx';
import DetailsProductReviews from './DetailsProductReviews.jsx';
import {calculateProductStats} from '../../utils/productViewsUtils.js';

// import {calculateStats} from '../../utils/productViewsUtils.js';

function ViewBooking({data, isUserAccountPage}) {
	// console.clear();
	console.log(
		`📝
	    ViewBooking object from backend:`,
		data,
	);
	const {booking} = data;
	const {Customer: customer} = booking;
	const {ScheduleRecords: schedules} = booking;

	return (
		<>
			<h1 className='user-container__user-title modal__title'>{`Rezerwacja (ID:${booking.BookingID})`}</h1>
			<h2 className='user-container__user-title modal__title'>{` ${customer.FirstName} ${customer.LastName}`}</h2>

			{/*//@ Customer main details */}
			<div className='user-container__main-details modal-checklist'>
				<DetailsCustomer
					customerData={customer}
					isUserAccountPage={isUserAccountPage}
				/>
			</div>
			{/*//@ Booking main details */}
			<div className='user-container__main-details modal-checklist'>
				<DetailsBooking
					bookingData={booking}
					placement={'booking'}
					isUserAccountPage={isUserAccountPage}
				/>
			</div>

			{/*//@ Schedules included */}
			<div className='user-container__main-details  schedules modal-checklist'>
				<DetailsProductSchedules
					scheduleRecords={schedules}
					placement='booking'
				/>
			</div>
		</>
	);
}

export default ViewBooking;
