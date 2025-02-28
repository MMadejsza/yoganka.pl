function DetailsCustomerStats({customerStats, altTitle, userAccountPage}) {
	const campsNumber = customerStats.schedulesAmount.breakdown.camps;
	const eventsNumber = customerStats.schedulesAmount.breakdown.events;
	const classesNumber = customerStats.schedulesAmount.breakdown.classes;
	const onlineNumber = customerStats.schedulesAmount.breakdown.online;

	return (
		<>
			{/*PODSUMOWANIE Kasa total, terminy total, campy/eventy/clasy total, godziny total  */}
			<h2 className='user-container__section-title '>{altTitle ?? 'Statystyki:'}</h2>
			<ul className='schedules__summary'>
				{!userAccountPage && (
					<li className='schedules__summary-datum'>
						<div className='schedules__summary-label'>Całkowity dochód:</div>
						<div className='schedules__summary-content'>{customerStats.revenue}</div>
					</li>
				)}
				<li className='schedules__summary-datum'>
					<div className='schedules__summary-label'>Ilość odbytych zajęć:</div>
					<div className='schedules__summary-content'>
						{customerStats.schedulesAmount.total}
					</div>
				</li>
				<li className='schedules__summary-datum'>
					<div className='schedules__summary-label'>Campy/Eventy/Online:</div>
					<div className='schedules__summary-content'>{`${campsNumber}/${eventsNumber}/${onlineNumber}`}</div>
				</li>
				<li className='schedules__summary-datum'>
					<div className='schedules__summary-label'>Ilość godzin yogi:</div>
					<div className='schedules__summary-content'>{customerStats.totalHours}</div>
				</li>
			</ul>
		</>
	);
}

export default DetailsCustomerStats;
