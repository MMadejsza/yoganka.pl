function DetailsProductStats({data, prodStats, placement}) {
	// console.clear();
	console.log(
		`📝 
        data object from DetailsProductStats:`,
		data,
	);
	console.log('stats:', prodStats);

	return (
		<>
			<h2 className='user-container__section-title modal__title--day'>
				{placement == 'schedule' ? 'Statystyki terminu:' : `Dotychczasowe statystyki:`}
			</h2>

			<ul className='user-container__details-list modal-checklist__list'>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Ilość edycji/klas:</p>
					<p className='user-container__section-record-content'>
						{prodStats.totalSchedulesAmount}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>
						Łączny czas odbytych zajęć:
					</p>
					<p className='user-container__section-record-content'>{prodStats.totalTime}</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Dochód:</p>
					<p className='user-container__section-record-content'>{prodStats.revenue}</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Mediana wieku:</p>
					<p className='user-container__section-record-content'>
						{prodStats.medianParticipantsAge} lat
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Liczba Uczestników:</p>
					<p className='user-container__section-record-content'>
						{prodStats.totalParticipantsAmount}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Śr. Uczestników/termin:</p>
					<p className='user-container__section-record-content'>
						{prodStats.avgParticipantsAmountPerSesh}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>
						Mediana Uczestników/termin:
					</p>
					<p className='user-container__section-record-content'>
						{prodStats.medianParticipantsAmountPerSesh}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Śr. frekwencja/termin:</p>
					<p className='user-container__section-record-content'>
						{prodStats.avgAttendancePercentagePerSesh}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>
						Mediana frekwencji/termin:
					</p>
					<p className='user-container__section-record-content'>
						{prodStats.medianAttendancePerSesh}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Średni % opinii/termin:</p>
					<p className='user-container__section-record-content'>
						{prodStats.avgReviewersPercentage}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Mediana % opinii/termin:</p>
					<p className='user-container__section-record-content'>
						{prodStats.medianReviewersPercentage}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Śr. ocena:</p>
					<p className='user-container__section-record-content'>
						{prodStats.avgFeedbackScore}
					</p>
				</li>
			</ul>
		</>
	);
}

export default DetailsProductStats;
