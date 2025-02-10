import {useQuery} from '@tanstack/react-query';
import {useLocation} from 'react-router-dom';
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
	{name: 'Użytkownicy', icon: 'group', link: '/admin-console/show-all-users'},
	{name: 'Klienci', icon: 'sentiment_satisfied', link: '/admin-console/show-all-customers'},
	{name: 'Produkty', icon: 'inventory', link: '/admin-console/show-all-products'},
	{name: 'Grafik', icon: 'calendar_month', link: '/admin-console/show-all-schedules'},
	{name: `Booking'i`, icon: 'event_available', link: '/admin-console/show-all-bookings'},
	{name: `Faktury`, icon: 'receipt_long', link: '/admin-console/show-all-invoices'},
	{name: `Newsletter'y`, icon: 'contact_mail', link: '/admin-console/show-all-newsletters'},
	{name: `Opinie`, icon: 'reviews', link: '/admin-console/show-all-participants-feedback'},
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
	const location = useLocation(); // fetch current path

	const {data, isPending, isError, error} = useQuery({
		// as id for later caching received data to not send the same request again where location.pathname is key
		queryKey: ['data', location.pathname],
		// definition of the code sending the actual request- must be returning the promise
		queryFn: () => fetchData(location.pathname),
		// only when location.pathname is set extra beyond admin panel:
		enabled: location.pathname != '/admin-console',
		// stopping unnecessary requests when jumping tabs
		staleTime: 10000,
		// how long tada is cached (default 5 mins)
		// gcTime:30000
	});

	let content;

	if (isError) {
		window.alert(error.info?.message || 'Failed to fetch');
	}
	if (data) {
		console.clear();
		console.log(`✅ Data: `);
		console.log(data);
		content = (
			<table className='data-table'>
				<thead className='data-table__headers'>
					<tr>
						{data.totalHeaders.map((header, index) => (
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
							{data.totalHeaders.map((header, headerIndex) => {
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
			<SideNav
				menuSet={sideNavTabs}
				// ref={link}
				// onTabClick={handleTabClick}
			/>
			<SideNav
				menuSet={sideNavActions}
				side='right'
			/>
			{content}
		</div>
	);
}

export default AdminPage;
