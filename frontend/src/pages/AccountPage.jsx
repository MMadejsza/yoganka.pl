import {useQuery} from '@tanstack/react-query';
import {useLocation, useNavigate, useMatch} from 'react-router-dom';
import {useState} from 'react';
import {fetchItem} from '../utils/http.js';
import {calculateStats} from '../utils/customerViewsUtils.js';
import ViewFrame from '../components/adminConsole/ViewFrame.jsx';
import UserTabs from '../components/adminConsole/UserTabs.jsx';
import Section from '../components/Section.jsx';
import DetailsCustomerStats from '../components/adminConsole/DetailsCustomerStats.jsx';
import ModalTable from '../components/adminConsole/ModalTable';

function AccountPage() {
	// console.log(`✅ AccountPAge: `);
	const modalMatch = useMatch('/konto/ustawienia');
	const navigate = useNavigate();
	const location = useLocation(); // fetch current path
	const today = new Date().toISOString().split('T')[0];

	const [isModalOpen, setIsModalOpen] = useState(modalMatch);

	const {data, isError, error} = useQuery({
		queryKey: ['account'],
		queryFn: ({signal}) => fetchItem('/account', {signal}),
		staleTime: 0,
		refetchOnMount: true,
	});

	const handleOpenModal = (extraPath) => {
		setIsModalOpen(true);
		navigate(`${extraPath}`, {state: {background: location}});
	};

	const handleOpenScheduleModal = (row) => {
		setIsModalOpen(true);
		navigate(`grafik/${row.id}`, {state: {background: location}});
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		navigate(-1);
	};

	const pickModifier = (path) => {
		let modifier;
		switch (true) {
			case path.includes('grafik'):
				modifier = 'schedule';
				return modifier;
			case path.includes('statystyki'):
				modifier = 'statistics';
				return modifier;
			case path.includes('zajecia'):
				modifier = 'customerSchedules';
				return modifier;
			case path.includes('rezerwacje'):
				modifier = 'customerBookings';
				return modifier;
			case path.includes('faktury'):
				modifier = 'invoices';
				return modifier;
			case path.includes('ustawienia'):
				modifier = 'settings';
				return modifier;

			default:
				return (modifier = '');
		}
	};
	const pickedModifier = pickModifier(location.pathname);

	if (isError) {
		console.log(error.code);
		if (error.code == 401) {
			navigate('/login');
			console.log(error.message);
		} else {
			window.alert(
				error.info?.message || 'Błąd serwera - pobieranie danych uczestnika przerwane',
			);
		}
	}

	let user, customer, userTabs, name, stats, tableTitle, table, customerStats;
	if (data) {
		userTabs = (
			<UserTabs
				onOpen={handleOpenModal}
				person={data}
			/>
		);
		// console.clear();
		console.log(`✅ Data: `);
		console.log(data);
		if (data.customer) {
			customer = data.customer;
			name = `${customer.FirstName} ${customer.LastName}`;
			customerStats = calculateStats(data.customer);
			const headers = ['ID', 'Data', 'Dzień', 'Godzina', 'Typ', 'Zajęcia', 'Miejsce'];
			const content = customerStats.records;
			const contentUpcoming = content.filter((schedule) => schedule.date >= today);

			// console.log(`✅ contentUpcoming: `, contentUpcoming);
			const keys = customerStats.recordsKeys.splice(1);
			// console.log(`✅ content: `, content);
			// console.log(`✅ keys: `, keys);
			console.log(`✅ customerStats: `, customerStats);

			stats = (
				<div className='user-container schedules'>
					<DetailsCustomerStats
						customerStats={customerStats}
						altTitle={'Moja przygoda z jogą:'}
						userAccountPage={true}
					/>
				</div>
			);

			tableTitle = <h2 className='user-container__section-title'>Nadchodzące zajęcia:</h2>;

			table =
				contentUpcoming && contentUpcoming.length > 0 ? (
					<ModalTable
						headers={headers}
						keys={['id', 'date', 'day', 'time', 'type', 'name', 'location']}
						content={contentUpcoming}
						active={true}
						onOpen={handleOpenScheduleModal}
						// classModifier={classModifier}
					/>
				) : (
					<div
						className='dimmed'
						style={{fontSize: '2rem', marginBottom: '3rem'}}>
						Brak nowych rezerwacji
					</div>
				);
		} else {
			user = data.user;
			name = user.Email;
			stats = (
				<h2 className='user-container__section-title dimmed'>
					Brak statystyk do wyświetlenia
				</h2>
			);
			table = <h2 className='user-container__section-title dimmed'>Brak rezerwacji</h2>;
		}
	}

	return (
		<div className='admin-console'>
			<Section
				classy='admin-intro'
				header={name}
			/>
			{userTabs}
			{stats}
			{tableTitle}
			{table}
			{isModalOpen && (
				<ViewFrame
					modifier={pickedModifier}
					visited={isModalOpen}
					onClose={handleCloseModal}
					userAccountPage={true}
					customer={customer}
				/>
			)}
		</div>
	);
}

export default AccountPage;
