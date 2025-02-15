import React, {useState} from 'react';
import {useParams} from 'react-router-dom';

import {fetchItem} from '../../utils/http.js';
import {calculateAge} from '../../utils/age.js';
import {useQuery} from '@tanstack/react-query';
import ModalFrame from './ModalFrame';
import UserForm from './UserForm.jsx';

function UserDetails({visited, onClose}) {
	const params = useParams();

	const {data, isPending, isError, error} = useQuery({
		queryKey: ['user', params.id],
		queryFn: ({signal}) => fetchItem({signal, id: params.id}),
		staleTime: 0,
		refetchOnMount: true,
		enabled: !!params.id,
	});
	const [editingState, setEditingState] = useState(false);

	const handleStartEditing = () => {
		setEditingState(true);
	};
	const handleCloseEditing = () => {
		setEditingState(false);
	};
	let dataDisplay;

	if (isPending) {
		dataDisplay = 'Loading...';
	}
	if (isError) {
		dataDisplay = 'Error in UserDetails fetch...';
	}
	if (data) {
		const {user} = data;
		const customer = user.Customer;
		// console.log(`data query:`, user);
		console.log(`customer:`, customer);
		dataDisplay = (
			<>
				<h1 className='user-container__user-title modal__title'>
					{customer ? `${customer.FirstName} ${customer.LastName}` : user.Login}
				</h1>
				<div className='user-container__main-details modal-checklist'>
					<h2 className='user-container__section-title modal__title--day'>
						Dane użytkownika:
					</h2>
					<ul className='user-container__details-list modal-checklist__list'>
						<li className='user-container__section-record modal-checklist__li'>
							<p className='user-container__section-record-label'>ID:</p>
							<p className='user-container__section-record-content'>{user.UserID}</p>
						</li>
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
								<p className='user-container__section-record-content'>
									{user.Role}
								</p>
							</li>
						)}
						{!customer && (
							<li className='user-container__section-record modal-checklist__li'>
								<p className='user-container__section-record-label'>Aktywność:</p>
								<p className='user-container__section-record-content'>
									Brak zakupów
								</p>
							</li>
						)}
						<li className='user-container__section-record modal-checklist__li'>
							<p className='user-container__section-record-label'>Zarejestrowany:</p>
							<p className='user-container__section-record-content'>
								{user.RegistrationDate}
							</p>
						</li>
					</ul>
				</div>
				{customer && (
					<div className='user-container__side-details modal-checklist'>
						<h2 className='user-container__section-title modal__title--day'>
							Dane klienta:
						</h2>
						<ul className='user-container__details-list modal-checklist__list'>
							<li className='user-container__section-record modal-checklist__li'>
								<p className='user-container__section-record-label'>ID:</p>
								<p className='user-container__section-record-content'>
									{customer.CustomerID}
								</p>
							</li>
							<li className='user-container__section-record modal-checklist__li'>
								<p className='user-container__section-record-label'>
									Imię/Nazwisko
								</p>
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
								<p className='user-container__section-record-label'>
									Preferencje dot. kontaktu:
								</p>
								<p className='user-container__section-record-content'>
									{customer.PreferredContactMethod}
								</p>
							</li>
							<li className='user-container__section-record modal-checklist__li'>
								<p className='user-container__section-record-label'>Notatki:</p>
								<p className='user-container__section-record-content'>
									{customer.Notes}
								</p>
							</li>
							<li className='user-container__section-record modal-checklist__li'>
								<p className='user-container__section-record-label'>Lojalność:</p>
								<p className='user-container__section-record-content'>
									{customer.Loyalty}
								</p>
							</li>
						</ul>
					</div>
				)}
			</>
		);
	}

	return (
		<ModalFrame
			visited={visited}
			onClose={onClose}>
			<div className='user-container modal__summary'>
				<div className='user-container__actions-block'>
					<button
						className='user-container__action modal__btn'
						onClick={editingState == false ? handleStartEditing : handleCloseEditing}>
						{editingState == false ? 'Edytuj' : 'Wróć'}
					</button>
					{!editingState && (
						<button className='user-container__action modal__btn'>Usuń</button>
					)}
				</div>
				{editingState == false ? dataDisplay : <UserForm />}
			</div>
		</ModalFrame>
	);
}

export default UserDetails;
