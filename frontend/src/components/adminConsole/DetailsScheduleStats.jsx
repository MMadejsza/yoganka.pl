function DetailsScheduleStats({data, prodStats}) {
	// console.clear();
	console.log(
		`📝 
        data object from DetailsScheduleStats:`,
		data,
	);
	console.log('stats:', prodStats);

	return (
		<>
			<h2 className='user-container__section-title modal__title--day'>Statystyki terminu:</h2>

			<ul className='user-container__details-list modal-checklist__list'>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Dochód:</p>
					<p className='user-container__section-record-content'>{prodStats.revenue}</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Liczba Uczestników:</p>
					<p className='user-container__section-record-content'>
						{prodStats.totalParticipantsAmount}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Mediana wieku:</p>
					<p className='user-container__section-record-content'>
						{prodStats.medianParticipantsAge} lat
					</p>
				</li>

				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Frekwencja:</p>
					<p className='user-container__section-record-content'>
						{prodStats.avgAttendancePercentage}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>% opinii:</p>
					<p className='user-container__section-record-content'>
						{prodStats.avgReviewersPercentage}
					</p>
				</li>

				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Średnia ocena:</p>
					<p className='user-container__section-record-content'>
						{prodStats.avgFeedbackScore}
					</p>
				</li>
			</ul>
		</>
	);
}

export default DetailsScheduleStats;
