import {useQuery} from '@tanstack/react-query';
import {useLocation, useNavigate, useMatch} from 'react-router-dom';
import {useState} from 'react';
import {fetchData, fetchStatus, queryClient} from '../utils/http.js';
import ViewFrame from '../components/adminConsole/ViewFrame.jsx';
import Section from '../components/Section.jsx';
import {useMutation} from '@tanstack/react-query';

function SchedulePage() {
	const modalMatch = useMatch('/grafik/:id');
	const navigate = useNavigate();
	const location = useLocation(); // fetch current path

	const [isModalOpen, setIsModalOpen] = useState(modalMatch);

	const {data: status} = useQuery({
		queryKey: ['authStatus'],
		queryFn: fetchStatus,
	});

	const {data, isError, error} = useQuery({
		// as id for later caching received data to not send the same request again where location.pathname is key
		queryKey: ['data', location.pathname],
		// definition of the code sending the actual request- must be returning the promise
		queryFn: () => fetchData('/grafik'),
		// only when location.pathname is set extra beyond admin panel:
		// enabled: location.pathname.includes('grafik'),
		// stopping unnecessary requests when jumping tabs
		staleTime: 10000,
		// how long tada is cached (default 5 mins)
		// gcTime:30000
	});

	const {
		mutate,
		isError: isMutateError,
		error: mutateError,
		reset,
	} = useMutation({
		mutationFn: async ({scheduleID, productName, productPrice}) =>
			await fetch(`/api/customer/grafik/book/${scheduleID}`, {
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

	const handleOpenModal = (row) => {
		const recordId = row.ID;
		setIsModalOpen(true);
		navigate(`${location.pathname}/${recordId}`, {state: {background: location}});
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		reset(); // resets mutation state and flags
		navigate(location.state?.background?.pathname || '/', {replace: true});
	};

	let content;

	if (isError) {
		if (error.code == 401) {
			navigate('/login');
			console.log(error.message);
		} else {
			window.alert(error.info?.message || 'Failed to fetch');
		}
	}
	if (data) {
		// console.clear();
		console.log(`✅ Data: `);
		console.log(data);

		const headers = data.totalHeaders; //.slice(1);
		content = (
			<table className='data-table'>
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
					{data.content.map((row, rowIndex) => (
						<tr
							className={`data-table__cells schedule active ${
								row.bookedByUser && status.isLoggedIn ? 'booked' : ''
							}`}
							key={rowIndex}>
							{headers.map((header, headerIndex) => {
								let value = row[header];
								if (typeof value === 'object' && value !== null) {
									value = Object.values(value);
								}

								if (header == '') {
									value = (
										<span
											onClick={
												!row.bookedByUser && status.isLoggedIn
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
											{status.isLoggedIn
												? row.bookedByUser
													? 'check'
													: 'shopping_bag_speed'
												: 'lock_person'}
										</span>
									);
								}
								return (
									<td
										onClick={() => handleOpenModal(row)}
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
				header={`Campy/Wydarzenia/Zajęcia`}
			/>
			{content}
			{isModalOpen && (
				<ViewFrame
					modifier='schedule'
					visited={isModalOpen}
					onClose={handleCloseModal}
					bookingOps={{onBook: mutate, isError: isMutateError, error: mutateError}}
				/>
			)}
		</div>
	);
}

export default SchedulePage;
