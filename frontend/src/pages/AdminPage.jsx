import Burger from '../components/nav/Burger.jsx';
import Nav from '../components/nav/Nav.jsx';
import Footer from '../components/Footer.jsx';
import FloatingPopUps from '../components/FloatingPopUps.jsx';

const options = [
	{
		label: 'a all users', // And their settings
		path: 'admin-console/show-all-users',
		method: 'GET',
	},
	{
		label: 'a all user settings',
		path: 'admin-console/show-all-users-settings',
		method: 'GET',
	},
	// /admin-console/delete-user/:id
	{
		label: 'a all customers',
		path: 'admin-console/show-all-customers',
		method: 'GET',
	},
	// /admin-console/edit-customer/:id
	// /admin-console/delete-customer/:id
	{
		label: 'a all customers phones',
		path: 'admin-console/show-all-customers-phones',
		method: 'GET',
	},
	// /admin-console/edit-customer-phone/:id
	// /admin-console/delete-customer-phone/:id

	{
		label: 'a schedule',
		path: 'admin-console/show-all-schedules',
		method: 'GET',
	},
	{
		label: 'a booked schedule records',
		path: 'admin-console/show-booked-schedules',
		method: 'GET',
	},
	// /admin-console/edit-schedule/:id
	// /admin-console/delete-schedule/:id

	{
		label: 'a all feedbacks',
		path: 'admin-console/show-all-participants-feedback',
		method: 'GET',
	},
	// /admin-console/delete-participant-feedback/:id
	{
		label: 'a all newsletters',
		path: 'admin-console/show-all-newsletters',
		method: 'GET',
	},
	// /admin-console/edit-newsletter/:id
	// /admin-console/delete-newsletter/:id
	{
		label: 'a all newsletters subs',
		path: 'admin-console/show-all-subscribed-newsletters',
		method: 'GET',
	},
	// /admin-console/delete-subscribed-newsletter/:id
	{
		label: 'a all products',
		path: 'admin-console/show-all-products',
		method: 'GET',
	},
	// /admin-console/edit-product/:id
	// /admin-console/delete-product/:id
	{
		label: 'a all bookings',
		path: 'admin-console/show-all-bookings',
		method: 'GET',
	},
	// /admin-console/edit-booking/:id
	// /admin-console/delete-booking/:id
	{
		label: 'a all invoices',
		path: 'admin-console/show-all-invoices',
		method: 'GET',
	},
	// /admin-console/edit-invoice/:id
	// /admin-console/delete-invoice/:id
];

function ErrorPage() {
	const todayRaw = new Date();
	const today = todayRaw.toISOString().split('T')[0]; // "YYYY-MM-DD"
	const handleSubmit = async (e, type) => {
		e.preventDefault();

		// Pobierz wybraną opcję
		const selectOption = e.target.querySelector('select');
		const selectedOption = selectOption.options[selectOption.selectedIndex];
		const val = selectedOption.value; // Wartość wybranej opcji
		const method = selectedOption.dataset.method; // Metoda wybranej opcji
		console.clear();
		console.log(`method ${method}`);

		const content = type === 'admin-console' ? 'application/json' : 'text/html';

		const requestOptions = {
			method: method,
			headers: {'Content-Type': content},
		};

		// Jeśli metoda nie jest GET, dodajemy body
		if (method !== 'GET') {
			requestOptions.body = type === 'admin-console' ? JSON.stringify({val}) : null;
		}

		try {
			const response = await fetch(`/api/${val}`, requestOptions);

			console.log('📄 Response:', response);

			const contentType = response.headers.get('Content-Type');

			if (contentType && contentType.includes('application/json')) {
				const data = await response.json();
				console.log(`✅ ${val} JSON resp:`, data);
			} else {
				const text = await response.text();
				console.log('📄 HTML Response:', text);

				document.body.innerHTML = text;
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const scheduleRecord = {
		productID: 10,
		date: '2024-02-09',
		startTime: '12:00:00',
		location: 'Some location',
	};

	const product = {
		name: 'product',
		type: 'sometype',
		location: 'somelocation',
		duration: 'someduration',
		price: 9.99,
		totalSpaces: 10,
		startDate: '2025-12-12',
	};
	const handleDodaj = async (e, obiekt, path) => {
		e.preventDefault();
		const requestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(obiekt),
		};
		try {
			const response = await fetch(`/api/admin-console/${path}`, requestOptions);
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
					onSubmit={(e) => handleSubmit(e, 'admin-console')}
					style={{marginTop: '10rem'}}
					autoComplete='on'>
					<select
						name='selectOption'
						style={{border: '1px solid black', marginTop: '1rem'}}>
						{options.map((option, index) => (
							<option
								key={index}
								value={option.path}
								data-method={option.method}>
								{option.label}
							</option>
						))}
					</select>
					<button type='submit'>Submit</button>
				</form>
				<form
					onSubmit={(e) => handleDodaj(e, product, 'create-product')}
					autoComplete='on'>
					<button type='submit'>Dodaj produkt</button>
				</form>
				<form
					onSubmit={(e) => handleDodaj(e, user, 'create-user')}
					autoComplete='on'>
					<button type='submit'>Dodaj usera</button>
				</form>
				<form
					onSubmit={(e) => handleDodaj(e, scheduleRecord, 'create-schedule-record')}
					autoComplete='on'>
					<button type='submit'>Dodaj schedule</button>
				</form>
			</div>
			<Footer />
			<FloatingPopUps />
		</div>
	);
}

export default ErrorPage;
