import React, {useState} from 'react';
import {useLocation} from 'react-router-dom';
import DetailsUser from './DetailsUser.jsx';
import DetailsUserSettings from './DetailsUserSettings.jsx';
import DetailsCustomer from './DetailsCustomer.jsx';

function ViewUser({data, isUserAccountPage, isEditing}) {
	const location = useLocation();
	// const isUserSettings = location.pathname.includes('konto/ustawienia');
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
	const customerAccessed = location.pathname.includes('ustawienia');
	console.log('customerAccessed', customerAccessed);
	const adminAccessed = location.pathname.includes('admin-console/show-all-users/');
	console.log('adminAccessed', adminAccessed);

	return (
		<>
			{!isUserAccountPage && (
				<h2 className='user-container__user-title modal__title dimmed'>
					{JSON.parse(user.ProfilePictureSrcSetJSON)?.profile}
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
					customerAccessed={customerAccessed}
					adminAccessed={adminAccessed}
				/>
			</div>
			{customer && (
				<DetailsCustomer
					customerData={customer}
					isUserAccountPage={isUserAccountPage}
					isEditing={editingState}
					customerAccessed={customerAccessed}
					adminAccessed={adminAccessed}
				/>
			)}
			<div className='user-container__action'>
				<button
					className='modal__btn'
					onClick={editingState == false ? handleStartEditing : handleCloseEditing}>
					{editingState == false ? (
						<>
							<span className='material-symbols-rounded nav__icon'>edit</span> Edytuj
						</>
					) : (
						<>
							<span className='material-symbols-rounded nav__icon'>undo</span> Wróć
						</>
					)}
				</button>
			</div>
		</>
	);
}

export default ViewUser;
