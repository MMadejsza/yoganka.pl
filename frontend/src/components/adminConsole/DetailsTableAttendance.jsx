import ModalTable from './ModalTable';
function DetailsTableAttendance({type, stats, isAdminPage}) {
	let bookingsArray = stats.attendedBookings;

	const table = (
		<ModalTable
			headers={['', 'ID Ucz.', 'Data zapisania', , 'Uczestnik']}
			keys={['', 'customerID', 'timestamp', , 'customer']}
			content={bookingsArray}
			active={false}
			isAdminPage={isAdminPage}
			adminActions={true}
		/>
	);

	const commonTableModule = (
		<>
			<h2 className='user-container__section-title modal__title--day'>
				{`Obecność (${bookingsArray.length}):`}
			</h2>
			{table}
		</>
	);
	const eventCampTableModule = (
		<>
			<h2 className='user-container__section-title modal__title--day'>{`Obecność (${bookingsArray.length}):`}</h2>
			{table}
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

export default DetailsTableAttendance;
