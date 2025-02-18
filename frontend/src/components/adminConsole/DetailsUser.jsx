function DetailsUser({userData, customerView}) {
	return (
		<>
			<h2 className='user-container__section-title modal__title--day'>
				{`Dane użytkownika (ID ${userData.UserID}):`}
			</h2>

			<ul className='user-container__details-list modal-checklist__list'>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Login:</p>
					<p className='user-container__section-record-content'>{userData.Login}</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Kod Hasła:</p>
					<p className='user-container__section-record-content'>
						{userData.PasswordHash}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Email:</p>
					<p className='user-container__section-record-content'>{userData.Email}</p>
				</li>
				{userData.Role == 'Admin' && (
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Typ:</p>
						<p className='user-container__section-record-content'>{userData.Role}</p>
					</li>
				)}
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Zarejestrowany:</p>
					<p className='user-container__section-record-content'>
						{userData.RegistrationDate}
					</p>
				</li>
				{!customerView && !userData.Customer && (
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Aktywność:</p>
						<p className='user-container__section-record-content'>Brak zakupów</p>
					</li>
				)}
			</ul>
		</>
	);
}

export default DetailsUser;
