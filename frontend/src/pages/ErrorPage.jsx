import Burger from '../components/nav/Burger.jsx';
import Nav from '../components/nav/Nav.jsx';
import Footer from '../components/Footer.jsx';
import FloatingPopUps from '../components/FloatingPopUps.jsx';

const options = [
	{
		label: 'a all users', // And their settings
		path: 'admin/show-all-users',
		method: 'GET',
	},
	// /admin/delete-user/:id
	{
		label: 'a all customers',
		path: 'admin/show-all-customers',
		method: 'GET',
	},
	// /admin/show-all-customers
	// /admin/edit-customer/:id
	// /admin/delete-customer/:id
	{
		label: 'a all customers phones',
		path: 'admin/show-all-customers-phones',
		method: 'GET',
	},
	// /admin/add-customer-phone
	// /admin/edit-customer-phone/:id
	// /admin/delete-customer-phone/:id

	{
		label: 'a schedule',
		path: 'admin/show-all-schedules',
		method: 'GET',
	},
	{
		label: 'a booked schedule records',
		path: 'admin/show-booked-schedules',
		method: 'GET',
	},
	// /admin/create-schedule
	// /admin/edit-schedule/:id
	// /admin/delete-schedule/:id

	{
		label: 'a all feedbacks',
		path: 'admin/show-all-participants-feedback',
		method: 'GET',
	},
	// /admin/delete-participant-feedback/:id
	{
		label: 'a all newsletters',
		path: 'admin/show-all-newsletters',
		method: 'GET',
	},
	// /admin/create-newsletter
	// /admin/edit-newsletter/:id
	// /admin/delete-newsletter/:id
	{
		label: 'a all newsletters subs',
		path: 'admin/show-all-subscribed-newsletters',
		method: 'GET',
	},
	// /admin/delete-subscribed-newsletter/:id
	{
		label: 'a all products',
		path: 'admin/show-all-products',
		method: 'GET',
	},
	// /admin/create-product
	// /admin/edit-product/:id
	// /admin/delete-product/:id
	{
		label: 'a all bookings',
		path: 'admin/show-all-bookings',
		method: 'GET',
	},
	// /admin/create-booking
	// /admin/edit-booking/:id
	// /admin/delete-booking/:id
	{
		label: 'a all invoices',
		path: 'admin/show-all-invoices',
		method: 'GET',
	},
	// /admin/create-invoice
	// /admin/edit-invoice/:id
	// /admin/delete-invoice/:id
];

function ErrorPage() {
	const handleSubmit = async (e, type) => {
		e.preventDefault();

		// Pobierz wybraną opcję
		const selectOption = e.target.querySelector('select');
		const selectedOption = selectOption.options[selectOption.selectedIndex];
		const val = selectedOption.value; // Wartość wybranej opcji
		const method = selectedOption.dataset.method; // Metoda wybranej opcji
		console.clear();
		console.log(`method ${method}`);

		const content = type === 'admin' ? 'application/json' : 'text/html';

		const requestOptions = {
			method: method,
			headers: {'Content-Type': content},
		};

		// Jeśli metoda nie jest GET, dodajemy body
		if (method !== 'GET') {
			requestOptions.body = type === 'admin' ? JSON.stringify({val}) : null;
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

	const handleDodaj = async (e) => {
		e.preventDefault();
		const requestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				name: 'product',
				type: 'sometype',
				location: 'somelocation',
				duration: 'someduration',
				price: 9.99,
				totalSpaces: 10,
				startDate: '2025-12-12',
			}),
		};
		try {
			const response = await fetch(`/api/admin/create-product`, requestOptions);
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
								value={option.path}
								data-method={option.method}>
								{option.label}
							</option>
						))}
					</select>
					<button type='submit'>Submit</button>
				</form>
				<form
					onSubmit={(e) => handleDodaj(e)}
					autoComplete='on'>
					<button type='submit'>Dodaj produkt</button>
				</form>
			</div>
			<Footer />
			<FloatingPopUps />
		</div>
	);
}

export default ErrorPage;
