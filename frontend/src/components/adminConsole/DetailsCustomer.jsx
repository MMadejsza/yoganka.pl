import {calculateAge} from '../../utils/age.js';

function DetailsCustomer({data}) {
	const {
		customer,
		customer: {User: user},
	} = data;
	// const customer = data;
	// console.log(`data query:`, user);
	console.log(
		`📝 
        customer object from backend:`,
		customer,
	);
	return (
		<>
			<h1 className='user-container__user-title modal__title'>
				{`${customer.FirstName} ${customer.LastName}`}
			</h1>
			<div className='user-container__main-details modal-checklist'>
				<h2 className='user-container__section-title modal__title--day'>
					{`Dane klienta (ID ${customer.CustomerID}):`}
				</h2>
				<ul className='user-container__details-list modal-checklist__list'>
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Imię/Nazwisko</p>
						<p className='user-container__section-record-content'>{`${customer.FirstName} ${customer.LastName}`}</p>
					</li>
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Typ:</p>
						<p className='user-container__section-record-content'>{`${customer.CustomerType}`}</p>
					</li>
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Wiek:</p>
						<p className='user-container__section-record-content'>{`${calculateAge(
							customer.DoB,
						)}   |  (${customer.DoB})`}</p>
					</li>
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Z polecenia:</p>
						<p className='user-container__section-record-content'>
							{customer.ReferralSource}
						</p>
					</li>
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Kontakt przez:</p>
						<p className='user-container__section-record-content'>
							{customer.PreferredContactMethod}
						</p>
					</li>
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Notatki:</p>
						<p className='user-container__section-record-content'>{customer.Notes}</p>
					</li>
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Lojalność:</p>
						<p className='user-container__section-record-content'>{customer.Loyalty}</p>
					</li>
				</ul>
			</div>
			<div className='user-container__side-details modal-checklist'>
				<h2 className='user-container__section-title modal__title--day'>
					{`Dane użytkownika (ID ${user.UserID}):`}
				</h2>

				<ul className='user-container__details-list modal-checklist__list'>
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Login:</p>
						<p className='user-container__section-record-content'>{user.Login}</p>
					</li>
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Kod Hasła:</p>
						<p className='user-container__section-record-content'>
							{user.PasswordHash}
						</p>
					</li>
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Email:</p>
						<p className='user-container__section-record-content'>{user.Email}</p>
					</li>
					{user.Role == 'Admin' && (
						<li className='user-container__section-record modal-checklist__li'>
							<p className='user-container__section-record-label'>Typ:</p>
							<p className='user-container__section-record-content'>{user.Role}</p>
						</li>
					)}
					{!customer && (
						<li className='user-container__section-record modal-checklist__li'>
							<p className='user-container__section-record-label'>Aktywność:</p>
							<p className='user-container__section-record-content'>Brak zakupów</p>
						</li>
					)}
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Zarejestrowany:</p>
						<p className='user-container__section-record-content'>
							{user.RegistrationDate}
						</p>
					</li>
				</ul>
				{user.UserPrefSetting && (
					<>
						<h2 className='user-container__section-title modal__title--day'>
							{`Ustawienia strony (ID ${user.UserPrefSetting.UserPrefID}):`}
						</h2>
						<ul className='user-container__details-list modal-checklist__list'>
							<li className='user-container__section-record modal-checklist__li'>
								<p className='user-container__section-record-label'>Pozycja:</p>
								<p className='user-container__section-record-content'>
									{user.Handedness == 'Left' ? 'Leworęczny' : 'Praworęczny'}
								</p>
							</li>
							<li className='user-container__section-record modal-checklist__li'>
								<p className='user-container__section-record-label'>
									Rozmiar czcionki:
								</p>
								<p className='user-container__section-record-content'>
									{user.UserPrefSetting.FontSize}
								</p>
							</li>
							<li className='user-container__section-record modal-checklist__li'>
								<p className='user-container__section-record-label'>
									Powiadomienia:
								</p>
								<p className='user-container__section-record-content'>
									{user.UserPrefSetting.Notifications ? 'On' : 'Off'}
								</p>
							</li>
							<li className='user-container__section-record modal-checklist__li'>
								<p className='user-container__section-record-label'>Animacje:</p>
								<p className='user-container__section-record-content'>
									{user.UserPrefSetting.Animation ? 'On' : 'Off'}
								</p>
							</li>
							<li className='user-container__section-record modal-checklist__li'>
								<p className='user-container__section-record-label'>Motyw:</p>
								<p className='user-container__section-record-content'>
									{user.UserPrefSetting.Theme == 'Dark'
										? 'Ciemny'
										: 'Standardowy'}
								</p>
							</li>
						</ul>
					</>
				)}
			</div>
		</>
	);
}

export default DetailsCustomer;
