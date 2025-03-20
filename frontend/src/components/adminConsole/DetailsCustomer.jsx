import React, {useState} from 'react';
import DetailsCustomerForm from './DetailsCustomerForm.jsx';
import {calculateAge} from '../../utils/customerViewsUtils.js';

function DetailsCustomer({customerData, isUserAccountPage, customerAccessed, adminAccessed}) {
	console.log('customerData', customerData);
	const title = isUserAccountPage
		? `Dane kontaktowe:`
		: `Uczestnik (ID ${customerData.CustomerID}):`;

	const [isEditing, setIsEditing] = useState(false);
	const handleStartEditing = () => {
		setIsEditing(true);
		// navigate('/konto/ustawienia');
	};
	const handleCloseEditing = () => {
		setIsEditing(false);
	};

	let content = isEditing ? (
		<DetailsCustomerForm
			customerData={customerData}
			customerAccessed={customerAccessed}
			adminAccessed={adminAccessed}
		/>
	) : (
		<ul className='user-container__details-list modal-checklist__list'>
			<li className='user-container__section-record modal-checklist__li'>
				<p className='user-container__section-record-label'>Numer telefonu:</p>
				<p className='user-container__section-record-content'>{customerData.Phone}</p>
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
	);
	return (
		<>
			<div className='user-container__main-details modal-checklist'>
				<h2 className='user-container__section-title modal__title--day'>{title}</h2>
				{content}

				<div className='user-container__action'>
					<button
						className='modal__btn'
						onClick={isEditing == false ? handleStartEditing : handleCloseEditing}>
						{isEditing == false ? (
							<>
								<span className='material-symbols-rounded nav__icon'>edit</span>{' '}
								Edytuj
							</>
						) : (
							<>
								<span className='material-symbols-rounded nav__icon'>undo</span>{' '}
								Wróć
							</>
						)}
					</button>
				</div>
			</div>
		</>
	);
}

export default DetailsCustomer;
