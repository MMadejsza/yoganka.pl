function DetailsProductBookings({type, stats}) {
	const bookingsArray = stats.totalBookings;
	const totalBookings = bookingsArray.length;

	const tableContent = (
		<>
			<ul className='schedules__records'>
				<li className='schedules__record schedules__record--header'>
					<div className='schedules__record-content'>ID</div>
					<div className='schedules__record-content'>Data rezerwacji</div>
					<div className='schedules__record-content'>Uczestnik</div>
					<div className='schedules__record-content'>Zadatek</div>
					<div className='schedules__record-content'>Metoda płatności</div>
				</li>
				{bookingsArray.map((booking, index) => {
					const isoDate = new Date(booking.date).toISOString().slice(0, 10);
					return (
						<li
							key={index}
							className='schedules__record'>
							<div className='schedules__record-content'>{booking.id}</div>
							<div className='schedules__record-content'>{isoDate}</div>
							<div className='schedules__record-content'>{booking.customer}</div>
							<div className='schedules__record-content'>{booking.value}</div>
							<div className='schedules__record-content'>{booking.method}</div>
						</li>
					);
				})}
			</ul>
		</>
	);
	const commonTable = (
		<>
			<h2 className='user-container__section-title modal__title--day'>
				{`Wszystkie rezerwacje (${totalBookings}):`}
			</h2>
			{tableContent}
		</>
	);
	const eventCampTable = (
		<>
			<h2 className='user-container__section-title modal__title--day'>{`Rezerwacje (${totalBookings}):`}</h2>
			{tableContent}
		</>
	);
	return (
		<>
			{stats.totalScheduleRecords.length > 0
				? type === 'Camp' || type === 'Event'
					? eventCampTable
					: commonTable
				: ''}
		</>
	);
}

export default DetailsProductBookings;
