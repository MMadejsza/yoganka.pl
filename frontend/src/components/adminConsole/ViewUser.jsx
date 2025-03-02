import DetailsUser from './DetailsUser.jsx';
import DetailsCustomer from './DetailsCustomer.jsx';
import DetailsUserSettings from './DetailsUserSettings.jsx';

function ViewUser({data, isUserAccountPage, isEditing}) {
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
	const isAdmin = data.user.Role == 'Admin'; //|| data.user.User?.Role == 'Admin';
	const name = customer ? `${customer.FirstName} ${customer.LastName}` : user.Email;
	return (
		<>
			<h1 className='user-container__user-title modal__title'>
				{name} {isAdmin && '(Admin)'}
			</h1>
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
					isEditing={isEditing}
				/>
			</div>
			{customer && (
				<div
					className={`user-container__${
						isUserAccountPage ? 'main' : 'side'
					}-details modal-checklist`}>
					<DetailsCustomer
						customerData={customer}
						isUserAccountPage={isUserAccountPage}
						isEditing={isEditing}
					/>
				</div>
			)}
		</>
	);
}

export default ViewUser;
