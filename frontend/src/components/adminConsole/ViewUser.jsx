import DetailsUser from './DetailsUser.jsx';
import DetailsCustomer from './DetailsCustomer.jsx';
import DetailsUserSettings from './DetailsUserSettings.jsx';

function ViewUser({data, isUserAccountPage}) {
	console.clear();
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
	const name = customer ? `${customer.FirstName} ${customer.LastName}` : user.Login;
	return (
		<>
			<h1 className='user-container__user-title modal__title'>{name}</h1>
			<div className='user-container__main-details modal-checklist'>
				<DetailsUser
					userData={user}
					customerView={false}
					isUserAccountPage={isUserAccountPage}
				/>
				{user.UserPrefSetting && (
					<DetailsUserSettings
						settingsData={user.UserPrefSetting}
						isUserAccountPage={isUserAccountPage}
					/>
				)}
			</div>
			{customer && (
				<div
					className={`user-container__${
						isUserAccountPage ? 'main' : 'side'
					}-details modal-checklist`}>
					<DetailsCustomer
						customerData={customer}
						isUserAccountPage={isUserAccountPage}
					/>
				</div>
			)}
		</>
	);
}

export default ViewUser;
