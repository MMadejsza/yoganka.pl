import React, {useState} from 'react';
import {useLocation} from 'react-router-dom';
import DetailsUser from './DetailsUser.jsx';
import DetailsUserSettings from './DetailsUserSettings.jsx';
import DetailsCustomer from './DetailsCustomer.jsx';

function ViewUser({data, isUserAccountPage}) {
	const location = useLocation();
	const customerAccessed = location.pathname.includes('ustawienia');
	console.log('customerAccessed', customerAccessed);
	const adminAccessed = location.pathname.includes('admin-console');
	console.log('adminAccessed', adminAccessed);

	// const isUserSettings = location.pathname.includes('konto/ustawienia');

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

	const user = data.user || data.customer.User;
	const customer = data.customer || data.user.Customer;
	const isAdmin = data.user?.Role == 'Admin' || data.customer?.User.Role == 'Admin'; //|| data.user.User?.Role == 'Admin';
	const name = customer ? `${customer.FirstName} ${customer.LastName}` : user.Email;

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
					customerAccessed={customerAccessed}
					adminAccessed={adminAccessed}
				/>
			</div>
			{customer && (
				<DetailsCustomer
					customerData={customer}
					isUserAccountPage={isUserAccountPage}
					customerAccessed={customerAccessed}
					adminAccessed={adminAccessed}
				/>
			)}
		</>
	);
}

export default ViewUser;
