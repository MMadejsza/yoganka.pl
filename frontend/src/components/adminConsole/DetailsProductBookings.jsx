import ModalTable from './ModalTable';
function DetailsProductBookings({type, stats}) {
	const bookingsArray = stats.totalBookings;
	const totalBookings = bookingsArray.length;

	const table = (
		<>
			<ModalTable
				headers={['ID', 'Data rezerwacji', 'Uczestnik', 'Zadatek', 'Metoda płatności']}
				keys={['id', 'date', 'customer', 'value', 'method']}
				content={bookingsArray}
				active={false}
			/>
		</>
	);
	const commonTableModule = (
		<>
			<h2 className='user-container__section-title modal__title--day'>
				{`Wszystkie rezerwacje (${totalBookings}):`}
			</h2>
			{table}
		</>
	);
	const eventCampTableModule = (
		<>
			<h2 className='user-container__section-title modal__title--day'>{`Rezerwacje (${totalBookings}):`}</h2>
			{table}
		</>
	);
	return (
		<>
			{stats.totalScheduleRecords.length > 0
				? type === 'Camp' || type === 'Event'
					? eventCampTableModule
					: commonTableModule
				: ''}
		</>
	);
}

export default DetailsProductBookings;
