import {useQuery, useMutation} from '@tanstack/react-query';
import {useLocation, useNavigate, useMatch} from 'react-router-dom';
import {useState} from 'react';
import {fetchItem} from '../utils/http.js';
import {calculateStats} from '../utils/customerViewsUtils.js';
import ViewFrame from '../components/adminConsole/ViewFrame.jsx';
import UserTabs from '../components/adminConsole/UserTabs.jsx';
import Section from '../components/Section.jsx';
import DetailsCustomerStats from '../components/adminConsole/DetailsCustomerStats.jsx';

function AccountPage() {
	console.log(`✅ AccountPAge: `);
	const modalMatch = useMatch('/konto/ustawienia');
	const navigate = useNavigate();
	const location = useLocation(); // fetch current path

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

	const handleOpenModal = (row) => {
		const recordId = row.ID;
		setIsModalOpen(true);
		navigate(`${location.pathname}/${recordId}`, {state: {background: location}});
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
			case path.includes('dane-uczestnika'):
				modifier = 'customer';
				return modifier;
			case path.includes('statystyki'):
				modifier = 'feedback';
				return modifier;
			case path.includes('rezerwacje'):
				modifier = 'product';
				return modifier;
			case path.includes('platnosci'):
				modifier = 'schedule';
				return modifier;
			case path.includes('faktury'):
				modifier = 'booking';
				return modifier;
			case path.includes('ustawienia'):
				modifier = 'user';
				return modifier;

			default:
				return (modifier = '');
		}
	};
	const pickedModifier = pickModifier(location.pathname);

	if (isError) {
		window.alert(
			error.info?.message || 'Błąd serwera - pobieranie danych uczestnika przerwane',
		);
	}

	let user, customer;
	let name;
	let stats;
	let tableTitle;
	let table;

	if (data) {
		// console.clear();
		console.log(`✅ Data: `);
		console.log(data);
		if (data.customer) {
			customer = data.customer;
			name = `${customer.FirstName} ${customer.LastName}`;
			const customerStats = calculateStats(data.customer);
			const headers = ['', 'ID', 'Data', 'Dzień', 'Godzina', 'Typ', 'Zajęcia', 'Miejsce'];
			const content = customerStats.records;
			const keys = customerStats.recordsKeys;
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

			tableTitle = (
				<h2 className='user-container__section-title modal__title--day'>
					Nadchodzące zajęcia:
				</h2>
			);

			table = (
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
						{content.map((row, rowIndex) => (
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

									if (key == '') {
										value = (
											<span
												onClick={
													!row.bookedByUser
														? (e) => {
																e.stopPropagation();
																mutate({
																	scheduleID: row['ID'],
																	productName: row['Nazwa'],
																	productPrice: row['Zadatek'],
																});
														  }
														: null
												}
												className='material-symbols-rounded nav__icon nav__icon--side account'>
												check
											</span>
										);
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
			);
		} else {
			user = data.user;
			name = user.Login;
			table = (
				<h2 className='user-container__section-title modal__title--day'>Brak rezerwacji</h2>
			);
		}
	}

	return (
		<div className='admin-console'>
			<Section
				classy='admin-intro'
				header={name}
			/>

			<UserTabs />

			{stats}
			{tableTitle}
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

export default AccountPage;
