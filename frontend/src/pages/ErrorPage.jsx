import Burger from '../components/nav/Burger.jsx';
import Nav from '../components/nav/Nav.jsx';
import Footer from '../components/Footer.jsx';
import FloatingPopUps from '../components/FloatingPopUps.jsx';

const options = [
	{
		label: 'a all users', // And their settings
		path: 'admin/show-all-users',
	},
	{
		label: 'a all customers',
		path: 'admin/show-all-customers',
	},
	// /admin/show-all-customers
	// /admin/edit-customer/:id
	// /admin/delete-customer/:id

	{
		label: 'a schedule',
		path: 'admin/show-all-schedules',
	},
	// /admin/create-schedule
	// /admin/edit-schedule/:id
	// /admin/delete-schedule/:id

	// /admin/show-all-customers-phones
	// /admin/add-customer-phone
	// /admin/edit-customer-phone/:id
	// /admin/delete-customer-phone/:id

	{
		label: 'a all feedbacks',
		path: 'admin/show-all-participants-feedback',
	},
	// /admin/delete-participant-feedback/:id
	{
		label: 'a all newsletters',
		path: 'admin/show-all-products',
	},
	// 	/admin/show-all-newsletters
	// /admin/create-newsletter
	// /admin/edit-newsletter/:id
	// /admin/delete-newsletter/:id
	{
		label: 'a all newsletters subs',
		path: 'admin/show-all-subscribed-newsletters',
	},
	// /admin/delete-subscribed-newsletter/:id
	{
		label: 'a all products',
		path: 'admin/show-all-products',
	},
	// /admin/create-product
	// /admin/edit-product/:id
	// /admin/delete-product/:id

	// /admin/show-all-bookings
	// /admin/create-booking
	// /admin/edit-booking/:id
	// /admin/delete-booking/:id

	// /admin/show-all-invoices
	// /admin/create-invoice
	// /admin/edit-invoice/:id
	// /admin/delete-invoice/:id
];

function ErrorPage() {
	const handleSubmit = async (e, type) => {
		e.preventDefault();
		const val = e.target.selectOption.value;
		const content = type == 'admin' ? 'application/json' : 'text/html';
		try {
			const response = await fetch(`/api/${val}`, {
				method: 'POST',
				headers: {'Content-Type': content},
				body: type == 'admin' ? JSON.stringify({val}) : null,
			});
			console.log('Response:', response);

			const contentType = response.headers.get('Content-Type');

			if (contentType && contentType.includes('application/json')) {
				const data = await response.json();
				console.log('✅ JSON Response:', data);
			} else {
				const text = await response.text();
				console.log('📄 HTML Response:', text);

				document.body.innerHTML = text;
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	return (
		<div className='wrapper'>
			<Burger />
			<Nav />
			<div className='error'>
				<h1 className='error__title'>Ups... Nie mamy takiej strony :)</h1>
				<form
					onSubmit={(e) => handleSubmit(e, 'admin')}
					style={{marginTop: '10rem'}}
					autoComplete='on'>
					<select
						name='selectOption'
						style={{border: '1px solid black', marginTop: '1rem'}}>
						{options.map((option, index) => (
							<option
								key={index}
								value={option.path}>
								{option.label}
							</option>
						))}
					</select>
					<button type='submit'>Submit</button>
				</form>
				;
			</div>
			<Footer />
			<FloatingPopUps />
		</div>
	);
}

export default ErrorPage;
