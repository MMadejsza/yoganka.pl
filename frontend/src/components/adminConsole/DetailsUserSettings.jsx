function DetailsUserSettings({settingsData}) {
	return (
		<>
			<h2 className='user-container__section-title modal__title--day'>
				{`Ustawienia strony (ID ${settingsData.UserPrefID}):`}
			</h2>
			<ul className='user-container__details-list modal-checklist__list'>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Pozycja:</p>
					<p className='user-container__section-record-content'>
						{settingsData.Handedness == 'Left' ? 'Leworęczny' : 'Praworęczny'}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Rozmiar czcionki:</p>
					<p className='user-container__section-record-content'>
						{settingsData.FontSize}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Powiadomienia:</p>
					<p className='user-container__section-record-content'>
						{settingsData.Notifications ? 'On' : 'Off'}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Animacje:</p>
					<p className='user-container__section-record-content'>
						{settingsData.Animation ? 'On' : 'Off'}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Motyw:</p>
					<p className='user-container__section-record-content'>
						{settingsData.Theme == 'Dark' ? 'Ciemny' : 'Standardowy'}
					</p>
				</li>
			</ul>
		</>
	);
}

export default DetailsUserSettings;
