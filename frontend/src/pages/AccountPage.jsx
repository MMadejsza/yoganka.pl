import {useQuery, useMutation} from '@tanstack/react-query';
import {useLocation, useNavigate, useMatch} from 'react-router-dom';
import {useState} from 'react';
import {fetchItem} from '../utils/http.js';
import {calculateStats} from '../utils/customerViewsUtils.js';
import ViewFrame from '../components/adminConsole/ViewFrame.jsx';
import UserTabs from '../components/adminConsole/UserTabs.jsx';
import Section from '../components/Section.jsx';
import DetailsCustomerStats from '../components/adminConsole/DetailsCustomerStats.jsx';
import {queryClient, fetchStatus} from '../utils/http.js';

function AccountPage() {
	// console.log(`✅ AccountPAge: `);
	const modalMatch = useMatch('/konto/ustawienia');
	const navigate = useNavigate();
	const location = useLocation(); // fetch current path
	const today = new Date().toISOString().split('T')[0];

	const {data: status} = useQuery({
		queryKey: ['authStatus'],
		queryFn: fetchStatus,
	});

	const {data, isPending, isError, error} = useQuery({
		queryKey: ['account'],
		queryFn: ({signal}) => fetchItem('/account', {signal}),
		staleTime: 0,
		refetchOnMount: true,
	});

	const {
		mutate,
		isError: isMutateError,
		error: mutateError,
		reset,
	} = useMutation({
		mutationFn: async ({scheduleID, productName, productPrice}) =>
			await fetch(`/api/grafik/book/${scheduleID}`, {
				method: 'POST',
				body: JSON.stringify({
					schedule: scheduleID,
					date: new Date().toISOString().split('T')[0],
					product: productName,
					status: 'Paid',
					amountPaid: productPrice,
					amountDue: 0,
					paymentMethod: 'Credit Card',
					paymentStatus: 'Completed',
				}),
				headers: {
					'Content-Type': 'application/json',
					'CSRF-Token': status.token,
				},
				credentials: 'include',
			}).then((response) => {
				if (!response.ok) {
					return response.json().then((errorData) => {
						throw new Error(errorData.error || 'Błąd podczas rezerwacji');
					});
				}
				return response.json();
			}),
		onSuccess: () => {
			queryClient.invalidateQueries(['data', location.pathname]);
			navigate('/grafik');
		},
	});

	const [isModalOpen, setIsModalOpen] = useState(modalMatch);

	const handleOpenModal = (extraPath) => {
		setIsModalOpen(true);
		navigate(`${extraPath}`, {state: {background: location}});
	};

	const handleOpenScheduleModal = (id) => {
		setIsModalOpen(true);
		navigate(`grafik/${id}`, {state: {background: location}});
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		navigate(location.state?.background?.pathname || '/konto', {replace: true});
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

			console.log(`✅ contentUpcoming: `, contentUpcoming);
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
					<table className='data-table data-table--user'>
						<thead className='data-table__headers'>
							<tr>
								{headers.map((header, index) => (
									<th
										className='data-table__single-header'
										key={index}>
										{header}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{contentUpcoming.map((row, rowIndex) => (
								<tr
									className={`data-table__cells data-table__cells--user active ${
										row.bookedByUser && data.isLoggedIn ? 'booked' : ''
									}`}
									key={rowIndex}>
									{keys.map((key, headerIndex) => {
										let value = row[key];
										if (typeof value === 'object' && value !== null) {
											value = Object.values(value);
										}
										return (
											<td
												onClick={() => handleOpenScheduleModal(row.id)}
												className='data-table__single-cell data-table__single-cell--user'
												key={headerIndex}>
												{value || '-'}
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
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
