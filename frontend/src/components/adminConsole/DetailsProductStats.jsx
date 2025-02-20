function DetailsProductStats({data, prodStats, placement}) {
	console.clear();
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
				{placement != 'schedule' && (
					<>
						<li className='user-container__section-record modal-checklist__li'>
							<p className='user-container__section-record-label'>
								Ilość edycji/klas:
							</p>
							<p className='user-container__section-record-content'>
								{prodStats.totalSchedulesAmount}
							</p>
						</li>

						<li className='user-container__section-record modal-checklist__li'>
							<p className='user-container__section-record-label'>
								Łączny czas odbytych zajęć:
							</p>
							<p className='user-container__section-record-content'>
								{prodStats.totalTime}
							</p>
						</li>
					</>
				)}
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Dochód:</p>
					<p className='user-container__section-record-content'>{prodStats.revenue}</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>
						Liczba Uczestników/Rezerwacji:
					</p>
					<p className='user-container__section-record-content'>
						{prodStats.totalParticipantsAmount}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Moda wieku:</p>
					<p className='user-container__section-record-content'>
						{prodStats.modeParticipantsAge} lat
					</p>
				</li>
				{placement != 'schedule' && (
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>
							Średnia liczba uczestników:
						</p>
						<p className='user-container__section-record-content'>
							{prodStats.avgParticipantsAmount}
						</p>
					</li>
				)}
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>
						{placement == 'schedule' ? 'Frekwencja:' : 'Średnia frekwencja:'}
					</p>
					<p className='user-container__section-record-content'>
						{prodStats.avgAttendancePercentage}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>
						{placement == 'schedule' ? '% opinii:' : 'Średni % opinii:'}
					</p>
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

export default DetailsProductStats;
