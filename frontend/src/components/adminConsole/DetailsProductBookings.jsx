import ModalTable from './ModalTable';
function DetailsProductBookings({type, stats}) {
	let bookingsArray;
	let cancelledBookingsArr;
	if (stats.attendedBookings) {
		bookingsArray = stats.attendedBookings;
	} else {
		bookingsArray = stats.bookings.filter((b) => b.attended === 1);
		cancelledBookingsArr = stats.bookings.filter((b) => b.attended === 0);
	}

	const table = (
		<ModalTable
			headers={['ID', 'Data rezerwacji', 'Uczestnik', 'Zadatek', 'Metoda płatności']}
			keys={['id', 'date', 'customer', 'value', 'method']}
			content={bookingsArray}
			active={false}
		/>
	);
	const cancelledTable = cancelledBookingsArr?.length > 0 && (
		<>
			<h2 className='user-container__section-title modal__title--day'>
				{`Anulowane rezerwacje (${cancelledBookingsArr.length}):`}
			</h2>
			<ModalTable
				headers={['ID', 'Data rezerwacji', 'Uczestnik', 'Zadatek', 'Metoda płatności']}
				keys={['id', 'date', 'customer', 'value', 'method']}
				content={cancelledBookingsArr}
				active={false}
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
