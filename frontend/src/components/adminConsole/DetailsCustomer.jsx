import {calculateAge} from '../../utils/customerViewsUtils.js';

function DetailsCustomer({customerData, isUserAccountPage}) {
	console.log('customerData', customerData);
	const title = isUserAccountPage
		? `Dane kontaktowe:`
		: `Dane klienta (ID ${customerData.CustomerID}):`;
	return (
		<>
			<div className='user-container__main-details modal-checklist'>
				<h2 className='user-container__section-title modal__title--day'>{title}</h2>
				<ul className='user-container__details-list modal-checklist__list'>
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Numer telefonu:</p>
						{customerData.CustomerPhones.map((phone, index) => (
							<p
								className='user-container__section-record-content'
								key={index}>
								{phone.CustomerMobile}
							</p>
						))}
					</li>
					{!isUserAccountPage && (
						<>
							<li className='user-container__section-record modal-checklist__li'>
								<p className='user-container__section-record-label'>Typ:</p>
								<p className='user-container__section-record-content'>{`${customerData.CustomerType}`}</p>
							</li>
							<li className='user-container__section-record modal-checklist__li'>
								<p className='user-container__section-record-label'>Wiek:</p>
								<p className='user-container__section-record-content'>{`${calculateAge(
									customerData.DoB,
								)}   |  (${customerData.DoB})`}</p>
							</li>
							<li className='user-container__section-record modal-checklist__li'>
								<p className='user-container__section-record-label'>Z polecenia:</p>
								<p className='user-container__section-record-content'>
									{customerData.ReferralSource}
								</p>
							</li>
						</>
					)}
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Kontaktuj się przez:</p>
						<p className='user-container__section-record-content'>
							{customerData.PreferredContactMethod}
						</p>
					</li>
					{!isUserAccountPage && (
						<>
							<li className='user-container__section-record modal-checklist__li'>
								<p className='user-container__section-record-label'>Notatki:</p>
								<p className='user-container__section-record-content'>
									{customerData.Notes}
								</p>
							</li>
							<li className='user-container__section-record modal-checklist__li'>
								<p className='user-container__section-record-label'>Lojalność:</p>
								<p className='user-container__section-record-content'>
									{customerData.Loyalty}
								</p>
							</li>{' '}
						</>
					)}
				</ul>
			</div>
		</>
	);
}

export default DetailsCustomer;
