function DetailsProductSchedules({schedulesArray, spots, type}) {
	const table = (
		<>
			<h2 className='user-container__section-title modal__title--day'>Terminy:</h2>
			<ul className='schedules__records'>
				<li className='schedules__record schedules__record--header'>
					<div className='schedules__record-content'>ID</div>
					<div className='schedules__record-content'>Data</div>
					<div className='schedules__record-content'>Dzień</div>
					<div className='schedules__record-content'>Godzina</div>
					<div className='schedules__record-content'>Lokacja</div>
					<div className='schedules__record-content'>Frekwencja</div>
				</li>
				{schedulesArray.map((schedule, index) => (
					<li
						key={index}
						className='schedules__record'>
						<div className='schedules__record-content'>{schedule.ScheduleID}</div>
						<div className='schedules__record-content'>{schedule.Date}</div>
						<div className='schedules__record-content'>Dzień</div>
						<div className='schedules__record-content'>{schedule.StartTime}</div>
						<div className='schedules__record-content'>{schedule.Location}</div>
						<div className='schedules__record-content'>{`${
							schedule.Bookings.length
						}/${spots} (${Math.round(schedule.Bookings.length / spots) * 100}%)`}</div>
					</li>
				))}
			</ul>
		</>
	);
	const justAttendance = (
		<>
			<h2 className='user-container__section-title modal__title--day'>Frekwencja:</h2>
			<div className='schedules__record-content'>{`${
				schedulesArray[0].Bookings.length
			}/${spots} (${Math.round((schedulesArray[0].Bookings.length / spots) * 100)}%)`}</div>
		</>
	);
	const notPublished = (
		<>
			<h2 className='user-container__section-title modal__title--day'>Terminy:</h2>
			<div style={{fontWeight: 'bold', fontSize: '2rem'}}>Nie opublikowano</div>
		</>
	);
	return (
		<>
			{schedulesArray.length > 0
				? type === 'Camp' || type === 'Event'
					? justAttendance
					: table
				: notPublished}
		</>
	);
}

export default DetailsProductSchedules;
