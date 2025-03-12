import {useQuery} from '@tanstack/react-query';
import {useLocation, useNavigate, useMatch} from 'react-router-dom';
import {useState} from 'react';
import {fetchData, fetchStatus} from '../utils/http.js';
import SideNav from '../components/adminConsole/SideNav.jsx';
import ViewFrame from '../components/adminConsole/ViewFrame.jsx';
import Section from '../components/Section.jsx';
import ModalTable from '../components/adminConsole/ModalTable.jsx';

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
		link: 'add-user',
	},
	// {
	// 	name: 'Edytuj',
	// 	icon: 'edit',
	// 	// link: '/wydarzenia',
	// },
	// {
	// 	name: 'Usuń',
	// 	icon: 'delete_forever',
	// 	link: '',
	// },
];
const allowedPaths = sideNavTabs.map((tab) => tab.link);

function AdminPage() {
	const modalMatch = useMatch('/admin-console/show-all-users/:id');
	const navigate = useNavigate();
	const location = useLocation(); // fetch current path
	const isAdminPage = location.pathname.includes('admin-console') ?? false;
	const isInactiveTable = ['invoices', 'newsletters', 'feedback'].some((path) =>
		location.pathname.includes(path),
	);
	const [isModalOpen, setIsModalOpen] = useState(modalMatch);

	const handleOpenModal = (row) => {
		const recordId = row.ID;
		setIsModalOpen(true);
		navigate(`${location.pathname}/${recordId}`, {state: {background: location}});
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		navigate(location.state?.background?.pathname || '/', {replace: true});
	};

	const pickModifier = (path) => {
		let modifier;
		switch (true) {
			case path.includes('show-all-users'):
				modifier = 'user';
				return modifier;
			case path.includes('show-all-customers'):
				modifier = 'customer';
				return modifier;
			case path.includes('show-all-products'):
				modifier = 'product';
				return modifier;
			case path.includes('show-all-schedules'):
				modifier = 'schedule';
				return modifier;
			case path.includes('show-all-bookings'):
				modifier = 'booking';
				return modifier;
			case path.includes('show-all-participants-feedback'):
				modifier = 'feedback';
				return modifier;

			default:
				return (modifier = '');
		}
	};
	const pickedModifier = pickModifier(location.pathname);

	const {data, isError, error} = useQuery({
		// as id for later caching received data to not send the same request again where location.pathname is key
		queryKey: ['data', location.pathname],
		// definition of the code sending the actual request- must be returning the promise
		queryFn: () => fetchData(location.pathname),
		// only when location.pathname is set extra beyond admin panel:
		enabled: allowedPaths.includes(location.pathname),
		// stopping unnecessary requests when jumping tabs
		staleTime: 10000,
		// how long tada is cached (default 5 mins)
		// gcTime:30000
	});

	const {data: status, isLoading: isStatusLoading} = useQuery({
		queryKey: ['authStatus'],
		queryFn: fetchStatus,
		cache: 'no-store',
	});

	if (isStatusLoading) {
		return <div>Loading...</div>;
	}

	let table;

	if (isError) {
		if (error.code == 401) {
			navigate('/login');
			console.log(error.message);
		} else {
			window.alert(error.info?.message || 'Failed to fetch');
		}
	}
	if (data && status?.role === 'ADMIN') {
		// console.clear();
		console.log(`✅ Data: `);
		console.log(data);
		table = (
			<ModalTable
				headers={data.totalHeaders}
				keys={data.totalHeaders}
				content={data.content}
				active={!isInactiveTable}
				onOpen={handleOpenModal}
				status={status}
				isAdminPage={isAdminPage}
			/>
		);
	}

	return (
		<div className='admin-console'>
			{status.role === 'ADMIN' && (
				<>
					<Section
						classy='admin-intro'
						header={`Admin Panel`}></Section>
					<SideNav menuSet={sideNavTabs} />
					<SideNav
						menuSet={sideNavActions}
						side='right'
					/>
				</>
			)}
			{table}
			{isModalOpen && (
				<ViewFrame
					modifier={pickedModifier}
					visited={isModalOpen}
					onClose={handleCloseModal}
				/>
			)}
		</div>
	);
}

export default AdminPage;
