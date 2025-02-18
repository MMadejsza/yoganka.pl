function DetailsCustomerSchedulesAndStats({customerStats}) {
	const campsNumber = customerStats.schedulesAmount.breakdown.camps;
	const eventsNumber = customerStats.schedulesAmount.breakdown.events;
	const classesNumber = customerStats.schedulesAmount.breakdown.classes;
	const onlineNumber = customerStats.schedulesAmount.breakdown.online;
	return (
		<>
			{/*PODSUMOWANIE Kasa total, terminy total, campy/eventy/clasy total, godziny total  */}
			<h2 className='user-container__section-title modal__title--day'>Statystyki:</h2>
			<ul className='schedules__summary'>
				<li className='schedules__summary-datum'>
					<div className='schedules__summary-label'>Całkowity dochód:</div>
					<div className='schedules__summary-content'>{customerStats.revenue}</div>
				</li>
				<li className='schedules__summary-datum'>
					<div className='schedules__summary-label'>Ilość terminów:</div>
					<div className='schedules__summary-content'>
						{customerStats.schedulesAmount.total}
					</div>
				</li>
				<li className='schedules__summary-datum'>
					<div className='schedules__summary-label'>Campy/Eventy/Zajęcia/Online:</div>
					<div className='schedules__summary-content'>{`${campsNumber}/${eventsNumber}/${classesNumber}/${onlineNumber}`}</div>
				</li>
				<li className='schedules__summary-datum'>
					<div className='schedules__summary-label'>Ilość godzin yogi:</div>
					<div className='schedules__summary-content'>{customerStats.totalHours}</div>
				</li>
			</ul>
			<h2 className='user-container__section-title modal__title--day'>
				Zarezerwowane terminy:
			</h2>
			{/*REKORDY data godzina miejsce typ productNazwa  */}
			<ul className='schedules__records'>
				<li className='schedules__record schedules__record--header'>
					<div className='schedules__record-content'>ID</div>
					<div className='schedules__record-content'>Data</div>
					<div className='schedules__record-content'>Godzina</div>
					<div className='schedules__record-content'>Lokacja</div>
					<div className='schedules__record-content'>Typ</div>
					<div className='schedules__record-content'>Nazwa</div>
				</li>
				{customerStats.records.map((record, index) => (
					<li
						key={index}
						className='schedules__record'>
						<div className='schedules__record-content'>{record.id}</div>
						<div className='schedules__record-content'>{record.date}</div>
						<div className='schedules__record-content'>{record.time}</div>
						<div className='schedules__record-content'>{record.location}</div>
						<div className='schedules__record-content'>{record.type}</div>
						<div className='schedules__record-content'>{record.name}</div>
					</li>
				))}
			</ul>
		</>
	);
}

export default DetailsCustomerSchedulesAndStats;
