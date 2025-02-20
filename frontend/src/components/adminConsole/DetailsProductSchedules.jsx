import {getWeekDay} from '../../utils/productViewsUtils.js';
function DetailsProductSchedules({spots, scheduleRecords, placement}) {
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
					{placement == 'booking' && (
						<div className='schedules__record-content'>Produkt</div>
					)}
					<div className='schedules__record-content'>Data</div>
					<div className='schedules__record-content'>Dzień</div>
					<div className='schedules__record-content'>Godzina</div>
					<div className='schedules__record-content'>Lokacja</div>
					{placement != 'booking' && (
						<div className='schedules__record-content'>Frekwencja</div>
					)}
				</li>
				{scheduleRecords.map((schedule, index) => {
					const attendancePercentage = Math.round(
						(schedule.bookingsNumber / spots) * 100,
					);

					return (
						<li
							key={index}
							className='schedules__record'>
							<div className='schedules__record-content'>{schedule.ScheduleID}</div>
							{placement == 'booking' && (
								<div className='schedules__record-content'>
									{schedule.Product.Name}
								</div>
							)}
							<div className='schedules__record-content'>{schedule.Date}</div>
							<div className='schedules__record-content'>
								{getWeekDay(schedule.Date)}
							</div>
							<div className='schedules__record-content'>{schedule.StartTime}</div>
							<div className='schedules__record-content'>{schedule.Location}</div>
							{placement != 'booking' && (
								<div className='schedules__record-content'>{`${schedule.bookingsNumber}/${spots} (${attendancePercentage}%)`}</div>
							)}
						</li>
					);
				})}
			</ul>
		</>
	);

	return <>{scheduleRecords.length > 0 ? table : notPublished}</>;
}

export default DetailsProductSchedules;
