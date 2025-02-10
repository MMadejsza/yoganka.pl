import {useQuery} from '@tanstack/react-query';
import {fetchData} from '../utils/http.js';
import SideNav from '../components/SideNav.jsx';
import Section from '../components/Section.jsx';

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
const sideNavTabs = [
	{
		name: 'Użytkownicy',
		icon: 'group',
		link: '',
	},
	{
		name: 'Klienci',
		icon: 'sentiment_satisfied',
		// link: '/wydarzenia',
	},
	{
		name: 'Produkty',
		icon: 'inventory',
		link: '',
	},
	{
		name: 'Grafik',
		icon: 'calendar_month',
		link: '',
	},
	{
		name: `Booking'i`,
		icon: 'event_available',
		link: '',
	},
	{
		name: `Faktury`,
		icon: 'receipt_long',
		link: '',
	},
	{
		name: `Newsletter'y`,
		icon: 'contact_mail',
		link: '',
	},
	{
		name: `Opinie`,
		icon: 'reviews',
		link: '',
	},
];
const sideNavActions = [
	{
		name: 'Dodaj',
		icon: 'add_circle',
		link: '',
	},
	{
		name: 'Edytuj',
		icon: 'edit',
		// link: '/wydarzenia',
	},
	{
		name: 'Usuń',
		icon: 'delete_forever',
		link: '',
	},
];

function AdminPage() {
	// const handleSubmit = async (e, type) => {
	// 	e.preventDefault();

	// 	// Pobierz wybraną opcję
	// 	const selectOption = e.target.querySelector('select');
	// 	const selectedOption = selectOption.options[selectOption.selectedIndex];
	// 	const val = selectedOption.value; // Wartość wybranej opcji
	// 	const method = selectedOption.dataset.method; // Metoda wybranej opcji
	// 	console.clear();
	// 	console.log(`method ${method}`);

	// 	const content = type === 'admin-console' ? 'application/json' : 'text/html';

	// 	const requestOptions = {
	// 		method: method,
	// 		headers: {'Content-Type': content},
	// 	};

	// 	// Jeśli metoda nie jest GET, dodajemy body
	// 	if (method !== 'GET') {
	// 		requestOptions.body = type === 'admin-console' ? JSON.stringify({val}) : null;
	// 	}

	// 	try {
	// 		const response = await fetch(`/api/${val}`, requestOptions);

	// 		console.log('📄 Response:', response);

	// 		const contentType = response.headers.get('Content-Type');

	// 		if (contentType && contentType.includes('application/json')) {
	// 			const data = await response.json();
	// 			console.log(`✅ ${val} JSON resp:`, data);
	// 		} else {
	// 			const text = await response.text();
	// 			console.log('📄 HTML Response:', text);

	// 			document.body.innerHTML = text;
	// 		}
	// 	} catch (error) {
	// 		console.error('Error:', error);
	// 	}
	// };

	// const scheduleRecord = {
	// 	productID: 10,
	// 	date: '2024-02-09',
	// 	startTime: '12:00:00',
	// 	location: 'Some location',
	// };
	// const product = {
	// 	name: 'product',
	// 	type: 'sometype',
	// 	location: 'somelocation',
	// 	duration: 'someduration',
	// 	price: 9.99,
	// 	totalSpaces: 10,
	// 	startDate: '2025-12-12',
	// };

	// const handleDodaj = async (e, obiekt, path) => {
	// 	e.preventDefault();
	// 	const requestOptions = {
	// 		method: 'POST',
	// 		headers: {'Content-Type': 'application/json'},
	// 		body: JSON.stringify(obiekt),
	// 	};
	// 	try {
	// 		const response = await fetch(`/api/admin-console/${path}`, requestOptions);
	// 	} catch (error) {
	// 		console.error('Error:', error);
	// 	}
	// };
	const todayRaw = new Date();
	const today = todayRaw.toISOString().split('T')[0]; // "YYYY-MM-DD"

	// underneath sends http request and gives us data and loading state and errors as well
	const {data, isPending, isError, error} = useQuery({
		// as id for later caching received data to not send the same request again
		queryKey: ['users'],
		// definition of the code sending the actual request- must be returning the promise
		queryFn: fetchData,
	});

	let content;

	if (isError) {
		window.alert(error.info?.message || 'Failed to fetch');
	}
	if (data) {
		console.log(`✅ Data: `);
		console.log(data);
		content = (
			<table className='data-table'>
				<thead className='data-table__headers'>
					<tr>
						{data.headers.map((header, index) => (
							<th
								className='data-table__single-header'
								key={index}>
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.content.map((row, rowIndex) => (
						<tr
							className='data-table__cells'
							key={rowIndex}>
							{data.headers.map((header, headerIndex) => {
								let value = row[header];
								if (typeof value === 'object' && value !== null) {
									value = Object.values(value);
								}
								return (
									<td
										className='data-table__single-cell'
										key={headerIndex}>
										{value || '-'}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		);
	}

	return (
		<div className='admin-console'>
			<Section
				classy='admin-intro'
				header={`Admin Panel`}></Section>
			<SideNav menuSet={sideNavTabs} />
			<SideNav
				menuSet={sideNavActions}
				side='right'
			/>
			{content}
		</div>
	);
}

export default AdminPage;
