import ModalFrame from './ModalFrame';
import React, {useState} from 'react';
import UserForm from './UserForm.jsx';

function UserDetails({visited, onClose}) {
	const [editingState, setEditingState] = useState(false);
	const handleStartEditing = () => {
		setEditingState(true);
	};
	const handleCloseEditing = () => {
		setEditingState(false);
	};
	const dataDisplay = (
		<>
			<h1 className='user-container__user-title modal__title'>Name</h1>
			<div className='user-container__main-details modal-checklist'>
				<h2 className='user-container__section-title modal__title--day'>User Details</h2>
				<ul className='user-container__side-details-list modal-checklist__list'>
					<div className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>label:</p>
						<p className='user-container__section-record-content'>content</p>
					</div>
					<div className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>label:</p>
						<p className='user-container__section-record-content'>content</p>
					</div>
					<div className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>label:</p>
						<p className='user-container__section-record-content'>content</p>
					</div>
					<div className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>label:</p>
						<p className='user-container__section-record-content'>content</p>
					</div>
				</ul>
			</div>
			<div className='user-container__side-details modal-checklist'>
				<h2 className='user-container__section-title modal__title--day'>
					If Customer Details
				</h2>
				<ul className='user-container__side-details-list modal-checklist__list'>
					<div className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>label:</p>
						<p className='user-container__section-record-content'>content</p>
					</div>
					<div className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>label:</p>
						<p className='user-container__section-record-content'>content</p>
					</div>
					<div className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>label:</p>
						<p className='user-container__section-record-content'>content</p>
					</div>
					<div className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>label:</p>
						<p className='user-container__section-record-content'>content</p>
					</div>
				</ul>
			</div>
		</>
	);

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
					<button
						className='user-container__action modal__btn'
						onClick={'a'}>
						Usuń
					</button>
				</div>
				{editingState == false ? dataDisplay : <UserForm />}
			</div>
		</ModalFrame>
	);
}

export default UserDetails;
