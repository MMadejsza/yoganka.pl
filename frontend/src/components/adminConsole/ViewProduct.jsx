import DetailsUser from './DetailsUser.jsx';

// import {calculateStats} from '../../utils/productViewsUtils.js';

function ViewProduct({data}) {
	console.clear();
	console.log(
		`📝 
        Product object from backend:`,
		data,
	);

	const user = data.customer.User;
	const customer = data.customer;
	const name = customer ? `${customer.FirstName} ${customer.LastName}` : user.Login;

	const customerStats = calculateStats(customer);
	const noInvoices = customerStats.invoices.length > 0 ? false : true;

	return (
		<>
			<h1 className='user-container__user-title modal__title'>{name}</h1>

			{/*//@ Personal-customer details */}
			<div className='user-container__main-details modal-checklist'>
				<DetailsCustomer customerData={customer} />
			</div>

			{/*//@ Personal-user details */}
			<div className='user-container__side-details modal-checklist'>
				<DetailsUser
					userData={user}
					customerView={true}
				/>

				{user.UserPrefSetting && (
					<DetailsUserSettings settingsData={user.UserPrefSetting} />
				)}
			</div>

			{/*//@ Schedules */}
			<div className='user-container__main-details user-container__side-details--schedules schedules modal-checklist'>
				<DetailsCustomerSchedulesAndStats customerStats={customerStats} />
			</div>

			{/*//@ Invoices */}
			<div
				className={`user-container__${
					noInvoices ? 'side' : 'main'
				}-details user-container__side-details--schedules schedules modal-checklist`}>
				<DetailsCustomerInvoices
					invoicesArray={customerStats.invoices}
					noInvoices={noInvoices}
				/>
			</div>
		</>
	);
}

export default ViewProduct;
