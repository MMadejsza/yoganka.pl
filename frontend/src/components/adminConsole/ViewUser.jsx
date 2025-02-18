import DetailsUser from './DetailsUser.jsx';
import DetailsCustomer from './DetailsCustomer.jsx';
import DetailsUserSettings from './DetailsUserSettings.jsx';

function ViewUser({data}) {
	console.log(
		`📝 
        user object from backend:`,
		data,
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
				/>
				{user.UserPrefSetting && (
					<DetailsUserSettings settingsData={user.UserPrefSetting} />
				)}
			</div>
			{customer && (
				<div className='user-container__side-details modal-checklist'>
					<DetailsCustomer customerData={customer} />
				</div>
			)}
		</>
	);
}

export default ViewUser;
