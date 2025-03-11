import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import DetailsUser from './DetailsUser.jsx';
import DetailsUserSettings from './DetailsUserSettings.jsx';
import DetailsCustomer from './DetailsCustomer.jsx';

function ViewUser({data, isUserAccountPage, isEditing}) {
	// const location = useLocation();
	// const isUserSettings = location.pathname.includes('konto/ustawienia');
	const navigate = useNavigate();
	const [editingState, setEditingState] = useState(false);
	const handleStartEditing = () => {
		setEditingState(true);
		// navigate('/konto/ustawienia');
	};
	const handleCloseEditing = () => {
		setEditingState(false);
	};
	// console.clear();
	console.log(
		`📝 user object from backend:
		`,
		data,
	);
	console.log(
		`📝 isUserAccountPage:
		`,
		isUserAccountPage,
	);
	console.log(
		`📝 isEditing:
		`,
		isEditing,
	);
	const user = data.user || data.customer.User;
	const customer = data.customer || data.user.Customer;
	const isAdmin = data.user?.Role == 'Admin' || data.customer?.User.Role == 'Admin'; //|| data.user.User?.Role == 'Admin';
	const name = customer ? `${customer.FirstName} ${customer.LastName}` : user.Email;
	return (
		<>
			{!isUserAccountPage && (
				<h2 className='user-container__user-title modal__title dimmed'>
					{JSON.parse(user.ProfilePictureSrcSetJSON).profile}
				</h2>
			)}
			{!isUserAccountPage && (
				<h1 className='user-container__user-title modal__title'>
					{name} {isAdmin && '(Admin)'}
				</h1>
			)}
			<div className='user-container__main-details modal-checklist'>
				<DetailsUser
					userData={user}
					customerView={false}
					isUserAccountPage={isUserAccountPage}
				/>
			</div>
			<div className='user-container__main-details modal-checklist'>
				<DetailsUserSettings
					settingsData={user.UserPrefSetting}
					isUserAccountPage={isUserAccountPage}
					isEditing={editingState}
				/>
			</div>
			{customer && (
				<DetailsCustomer
					customerData={customer}
					isUserAccountPage={isUserAccountPage}
					isEditing={editingState}
				/>
			)}
			<div className='user-container__action'>
				<button
					className='modal__btn'
					onClick={editingState == false ? handleStartEditing : handleCloseEditing}>
					{editingState == false ? 'Edytuj' : 'Wróć'}
				</button>
			</div>
		</>
	);
}

export default ViewUser;
