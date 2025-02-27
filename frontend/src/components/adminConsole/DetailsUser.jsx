function DetailsUser({userData, customerView, isUserAccountPage}) {
	console.log(isUserAccountPage);
	const title = isUserAccountPage ? `Dane konta:` : `Dane użytkownika (ID ${userData.UserID}):`;
	return (
		<>
			<h2 className='user-container__section-title modal__title--day'>{title}</h2>

			<ul className='user-container__details-list modal-checklist__list'>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Utworzono:</p>
					<p className='user-container__section-record-content'>
						{userData.RegistrationDate}
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
					<p className='user-container__section-record-label'>Hasło:</p>
					<button
						type='button'
						className='modal__btn modal__btn--secondary modal__btn--password modal__btn--password-change'>
						Zmień hasło
					</button>
					<button
						type='button'
						className='modal__btn modal__btn--secondary modal__btn--password modal__btn--password-reset'>
						Resetuj hasło
					</button>
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
