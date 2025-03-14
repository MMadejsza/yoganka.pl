import ModalTable from './ModalTable';
function DetailsProductBookings({type, stats, isAdminPage}) {
	let bookingsArray = stats.totalBookings || stats.bookings;
	let cancelledBookingsArr = bookingsArray.filter((b) => b.Attendance == false);

	const table = (
		<ModalTable
			headers={['ID', 'Data rezerwacji', 'Uczestnik', 'Zadatek', 'Metoda płatności']}
			keys={['BookingID', 'Date', 'Customer', 'AmountPaid', 'PaymentMethod']}
			content={bookingsArray}
			active={false}
		/>
	);
	const cancelledTable = cancelledBookingsArr?.length > 0 && (
		<>
			<h2 className='user-container__section-title modal__title--day'>
				{`Rezerwacje anulowanych obecności (${cancelledBookingsArr.length}):`}
			</h2>
			<ModalTable
				headers={['ID', 'Data rezerwacji', 'Uczestnik', 'Zadatek', 'Metoda płatności']}
				keys={['BookingID', 'Date', 'Customer', 'AmountPaid', 'PaymentMethod']}
				content={cancelledBookingsArr}
				active={false}
				isAdminPage={isAdminPage}
				adminActions={true}
			/>
		</>
	);
	const commonTableModule = (
		<>
			<h2 className='user-container__section-title modal__title--day'>
				{`Wszystkie rezerwacje (${bookingsArray.length}):`}
			</h2>
			{table}
			{cancelledTable}
		</>
	);
	const eventCampTableModule = (
		<>
			<h2 className='user-container__section-title modal__title--day'>{`Rezerwacje (${bookingsArray.length}):`}</h2>
			{table}
			{cancelledTable}
		</>
	);
	return (
		<>
			{bookingsArray.length > 0
				? type === 'Camp' || type === 'Event'
					? eventCampTableModule
					: commonTableModule
				: ''}
		</>
	);
}

export default DetailsProductBookings;
