import {formatIsoDateTime, getWeekDay} from '../../utils/productViewsUtils.js';

function DetailsBooking({bookingData}) {
	const booking = bookingData;
	console.log(
		`📝
	    Schedule object from backend:`,
		bookingData,
	);

	return (
		<>
			<h2 className='user-container__section-title modal__title--day'>{`Szczegóły:`}</h2>
			<ul className='user-container__details-list modal-checklist__list'>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Data rezerwacji:</p>
					<p className='user-container__section-record-content'>
						{`${formatIsoDateTime(booking.Date)} ${getWeekDay(booking.Date)}`}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Kwota:</p>
					<p className='user-container__section-record-content'>{booking.AmountPaid}</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Metoda Płatności:</p>
					<p className='user-container__section-record-content'>
						{booking.PaymentMethod}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Status:</p>
					<p className='user-container__section-record-content'>{booking.Status}</p>
				</li>
			</ul>
		</>
	);
}

export default DetailsBooking;
