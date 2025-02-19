function DetailsProductSchedules({spots, type, stats}) {
	const notPublished = (
		<>
			<h2 className='user-container__section-title modal__title--day'>Terminy:</h2>
			<div style={{fontWeight: 'bold', fontSize: '2rem'}}>Nie opublikowano</div>
		</>
	);

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
				{stats.totalScheduleRecords.map((schedule, index) => {
					const attendancePercentage = Math.round(
						(schedule.bookingsNumber / spots) * 100,
					);
					return (
						<li
							key={index}
							className='schedules__record'>
							<div className='schedules__record-content'>{schedule.id}</div>
							<div className='schedules__record-content'>{schedule.date}</div>
							<div className='schedules__record-content'>Dzień</div>
							<div className='schedules__record-content'>{schedule.time}</div>
							<div className='schedules__record-content'>{schedule.location}</div>
							<div className='schedules__record-content'>{`${schedule.bookingsNumber}/${spots} (${attendancePercentage}%)`}</div>
						</li>
					);
				})}
			</ul>
		</>
	);

	return <>{stats.totalScheduleRecords.length > 0 ? table : notPublished}</>;
}

export default DetailsProductSchedules;
