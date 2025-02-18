import {calculateAge} from '../../utils/customerViewsUtils.js';

function DetailsCustomer({customerData}) {
	return (
		<>
			<div className='user-container__main-details modal-checklist'>
				<h2 className='user-container__section-title modal__title--day'>
					{`Dane klienta (ID ${customerData.CustomerID}):`}
				</h2>
				<ul className='user-container__details-list modal-checklist__list'>
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
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Kontakt przez:</p>
						<p className='user-container__section-record-content'>
							{customerData.PreferredContactMethod}
						</p>
					</li>
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
					</li>
				</ul>
			</div>
		</>
	);
}

export default DetailsCustomer;
