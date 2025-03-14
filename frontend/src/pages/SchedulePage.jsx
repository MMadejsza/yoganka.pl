import {useQuery} from '@tanstack/react-query';
import {useLocation, useNavigate, useMatch} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {fetchData, fetchStatus, queryClient} from '../utils/http.js';
import ViewFrame from '../components/adminConsole/ViewFrame.jsx';
import Section from '../components/Section.jsx';
import {useMutation} from '@tanstack/react-query';
import ModalTable from '../components/adminConsole/ModalTable';

function SchedulePage() {
	const navigate = useNavigate();
	const location = useLocation(); // fetch current path

	const modalMatch = !!useMatch('/grafik/:id');
	const [isModalOpen, setIsModalOpen] = useState(modalMatch);
	const [isBookedSuccessfully, setIsBookedSuccessfully] = useState(false);

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
		mutate: book,
		isError: isBookError,
		error: bookError,
		reset,
	} = useMutation({
		mutationFn: async ({scheduleID, productName, productPrice, customerDetails}) =>
			await fetch(`/api/customer/grafik/book/${scheduleID}`, {
				method: 'POST',
				body: JSON.stringify({
					customerDetails: customerDetails || null,
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
						throw new Error(errorData.message || 'Błąd podczas rezerwacji');
					});
				}
				return response.json();
			}),
		onSuccess: (res) => {
			if (res.isNewCustomer) {
				queryClient.invalidateQueries(['authStatus']);
			}
			queryClient.invalidateQueries(['data', location.pathname]);
			setIsBookedSuccessfully(true);
		},
	});

	// To handle timeout for feedback box in the child viewSchedule + cleanup
	useEffect(() => {
		if (isBookedSuccessfully) {
			const timer = setTimeout(() => {
				reset();
				if (isModalOpen) handleCloseModal();
				navigate('/grafik');
				setIsBookedSuccessfully(false);
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [isBookedSuccessfully, reset, navigate]);

	const background = {
		pathname: location.pathname,
		search: location.search,
		hash: location.hash,
	};
	const handleOpenModal = (row) => {
		const recordId = row.ID;
		setIsModalOpen(true);
		navigate(`${location.pathname}/${recordId}`, {state: {background}});
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		reset(); // resets mutation state and flags
		navigate(-1);
	};

	if (isError) {
		if (error.code == 401) {
			navigate('/login');
			console.log(error.message);
		} else {
			window.alert(error.info?.message || 'Failed to fetch');
		}
	}

	let table;

	if (data) {
		// console.clear();
		console.log(`✅ Data: `);
		console.log(data);

		let content = data.content.sort((a, b) => {
			const dateA = new Date(a.Data.split('.').reverse().join('-'));
			const dateB = new Date(b.Data.split('.').reverse().join('-'));
			return dateA - dateB;
		});
		const headers = data.totalHeaders; //.slice(1);

		table = (
			<ModalTable
				headers={headers}
				keys={headers}
				content={content}
				active={true}
				status={status}
				onOpen={handleOpenModal}
				onQuickBook={book}
				// classModifier={classModifier}
			/>
		);
	}
	let viewFrame;
	if (data && status) {
		viewFrame = (
			<ViewFrame
				modifier='schedule'
				visited={isModalOpen}
				onClose={handleCloseModal}
				bookingOps={{
					onBook: book,
					isError: isBookError,
					error: bookError,
					confirmation: isBookedSuccessfully,
				}}
				role={status.role}
			/>
		);
	}

	return (
		<div className='admin-console'>
			<Section
				classy='admin-intro'
				header={`Wyjazdy | Wydarzenia | Online`}
			/>
			{table}
			{isModalOpen && viewFrame}
		</div>
	);
}

export default SchedulePage;
