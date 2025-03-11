import React, {useState} from 'react';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import {fetchItem} from '../../utils/http.js';
import {useQuery} from '@tanstack/react-query';
import ModalFrame from './ModalFrame.jsx';
import ViewUser from './ViewUser.jsx';
import ViewCustomer from './ViewCustomer.jsx';
import ViewProduct from './ViewProduct.jsx';
import ViewSchedule from './ViewSchedule.jsx';
import ViewBooking from './ViewBooking.jsx';
import ViewReview from './ViewReview.jsx';

function ViewFrame({modifier, visited, onClose, bookingOps, userAccountPage, customer, role}) {
	const navigate = useNavigate();
	const params = useParams();
	const location = useLocation();
	const callPath = location.pathname;
	const isAdminPanel = location.pathname.includes('admin-console');
	const isUserSettings = location.pathname.includes('konto/ustawienia');
	const isCustomerQuery = location.pathname.includes('konto/rezerwacje') ? '/customer' : '';
	const minRightsPrefix = role == 'ADMIN' ? 'admin-console' : '';
	const noFetchPaths = ['statystyki', 'zajecia', 'rezerwacje', 'faktury'];

	console.log('ViewFrame callPath: ', callPath);
	console.log('ViewFrame isCustomerQuery: ', isCustomerQuery);

	console.log('✅ role', role);

	const {data, isPending, isError, error} = useQuery({
		queryKey: ['query', location.pathname],
		queryFn: ({signal}) => fetchItem(callPath, {signal}, isCustomerQuery || minRightsPrefix),
		staleTime: 0,
		refetchOnMount: true,
		enabled: !!params.id || location.pathname.includes('ustawienia'),
	});
	if (data) {
		console.log('ViewFrame data: ', data);
	}
	const effectiveData = noFetchPaths.some((pathPart) =>
		location.pathname.split('/').pop().includes(pathPart),
	)
		? customer
		: data;

	const [editingState, setEditingState] = useState(false);

	const handleStartEditing = () => {
		setEditingState(true);
		// navigate('/konto/ustawienia');
	};
	const handleCloseEditing = () => {
		setEditingState(false);
	};

	const resolveModifier = () => {
		let controller = {};
		switch (modifier) {
			case 'user':
				controller.recordDisplay = (
					<ViewUser
						data={data}
						isUserAccountPage={location.pathname.includes('ustawienia') ?? false}
					/>
				);
				controller.deleteBtnTitle = 'Konto';
				controller.warnings = [
					'Powiązanego profilu uczestnika',
					'Wszystkich powiązanych rezerwacji',
					'Wszystkich powiązanych faktur',
					'Wszystkich zarezerwowanych terminów',
					'Wszystkich powiązanych opinii',
					"oraz newsletter'ów",
				];
				// controller.recordEditor = <UserForm />;
				return controller;
			case 'customer':
				controller.recordDisplay = <ViewCustomer data={data} />;
				controller.recordEditor = '';
				controller.deleteBtnTitle = 'Profil Uczestnika';
				controller.warnings = [
					'Wszystkich powiązanych rezerwacji',
					'Wszystkich powiązanych faktur',
					'Wszystkich zarezerwowanych terminów',
					'Wszystkich powiązanych opinii',
				];
				return controller;
			case 'product':
				controller.recordDisplay = <ViewProduct data={data} />;
				controller.recordEditor = '';
				controller.deleteBtnTitle = 'Produkt';
				controller.warnings = [
					'Wszystkich powiązanych terminów',
					'Wszystkich powiązanych opinii',
				];
				return controller;
			case 'schedule':
				controller.recordDisplay = (
					<ViewSchedule
						data={data}
						bookingOps={bookingOps}
						onClose={onClose}
						isModalOpen={visited}
						isAdminPanel={isAdminPanel}
					/>
				);
				controller.recordEditor = '';
				controller.deleteBtnTitle = 'Termin';
				controller.warnings = [
					'Wszystkich powiązanych opinii',
					'Wszystkich powiązanych obecności a więc wpłynie na statystyki zajęć i użytkowników',
					'(nie ma potrzeby usuwania terminu)',
				];
				return controller;
			case 'booking':
				controller.recordDisplay = (
					<ViewBooking
						data={data}
						isUserAccountPage={userAccountPage}
						onClose={onClose}
						isModalOpen={visited}
					/>
				);
				controller.recordEditor = '';
				controller.warnings = [
					'Wszystkich powiązanych faktur',
					'Wszystkich powiązanych obecności a więc wpłynie na statystyki zajęć i użytkowników',
				];
				return controller;

			case 'invoices':
				controller.recordDisplay = (
					<ViewReview
						data={customer}
						onClose={onClose}
						isModalOpen={visited}
					/>
				);
				controller.recordEditor = '';
				controller.deleteBtnTitle = 'Fakturę';
				controller.warnings = '';
				return controller;
			// case 'settings':
			// 	controller.recordDisplay = (
			// 		<ViewUser
			// 			data={data}
			// 			isUserAccountPage={true}
			// 		/>
			// 	);
			// 	controller.recordEditor = '';
			// 	return controller;
			// case 'feedback':
			// 	controller.recordDisplay = <ViewReview data={data} />;
			// 	controller.recordEditor = '';
			// 	controller.deleteBtnTitle = '';
			// 	return controller;
			// case 'statistics':
			// 	controller.recordDisplay = (
			// 		<ViewCustomerStatistics
			// 			data={customer}
			// 			onClose={onClose}
			// 			isModalOpen={visited}
			// 		/>
			// 	);
			// 	controller.recordEditor = '';
			// 	controller.deleteBtnTitle = '';
			// 	return controller;
			// case 'customerSchedules':
			// 	controller.recordDisplay = (
			// 		<ViewCustomerTotalSchedules
			// 			data={customer}
			// 			onClose={onClose}
			// 			isModalOpen={visited}
			// 		/>
			// 	);
			// 	controller.recordEditor = '';
			// 	return controller;
			// case 'customerBookings':
			// 	controller.recordDisplay = (
			// 		<ViewCustomerTotalBookings
			// 			data={customer}
			// 			onClose={onClose}
			// 			isModalOpen={visited}
			// 		/>
			// 	);
			// 	controller.recordEditor = '';
			// 	return controller;

			default:
				break;
		}
	};

	let dataDisplay;
	let dataEditor;

	if (isPending) {
		dataDisplay = 'Loading...';
	}
	if (isError) {
		if (error.code == 401) {
			navigate('/login');
		} else {
			console.log(error, error.code, error.message);
			dataDisplay = 'Error in UserDetails fetch...';
		}
	}

	console.log(`ViewFrame customer: `, customer);
	let deleteTitle;
	if (effectiveData) {
		const {recordDisplay, recordEditor, deleteBtnTitle} = resolveModifier();
		dataDisplay = recordDisplay;
		dataEditor = recordEditor;
		deleteTitle = deleteBtnTitle;
	}

	return (
		<ModalFrame
			visited={visited}
			onClose={onClose}>
			<div className='user-container modal__summary'>
				{dataDisplay}
				<div className='user-container__actions-block'>
					{/* {(isAdminPanel || isUserSettings) && (
						<button
							className='user-container__action modal__btn'
							onClick={
								editingState == false ? handleStartEditing : handleCloseEditing
							}>
							{editingState == false ? 'Edytuj' : 'Wróć'}
						</button>
					)} */}
					{!editingState && isAdminPanel && (
						<button className='user-container__action modal__btn modal__btn--small modal__btn--small-danger'>
							Usuń {deleteTitle}
						</button>
					)}
				</div>
			</div>
		</ModalFrame>
	);
}

export default ViewFrame;
