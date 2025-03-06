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
import ViewCustomerTotalSchedules from './ViewCustomerTotalSchedules.jsx';
import ViewCustomerTotalBookings from './ViewCustomerTotalBookings.jsx';

function ViewFrame({modifier, visited, onClose, bookingOps, userAccountPage, customer}) {
	const navigate = useNavigate();
	const params = useParams();
	const location = useLocation();
	const callPath = location.pathname;
	const isAdminPanel = location.pathname.includes('admin-console');
	const isUserSettings = location.pathname.includes('konto/ustawienia');
	const noFetchPaths = ['statystyki', 'zajecia', 'rezerwacje', 'faktury'];

	console.log('ViewFrame callPath: ', callPath);

	const {data, isPending, isError, error} = useQuery({
		queryKey: ['query', location.pathname],
		queryFn: ({signal}) => fetchItem(callPath, {signal}),
		staleTime: 0,
		refetchOnMount: true,
		enabled: !!params.id || location.pathname.includes('ustawienia'),
	});
	console.log('ViewFrame data: ', data);

	const effectiveData = noFetchPaths.some((pathPart) => location.pathname.includes(pathPart))
		? customer
		: data;

	const [editingState, setEditingState] = useState(false);

	const handleStartEditing = () => {
		setEditingState(true);
		navigate('/konto/ustawienia');
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
						isEditing={editingState}
					/>
				);
				// controller.recordEditor = <UserForm />;
				return controller;
			case 'customer':
				controller.recordDisplay = <ViewCustomer data={data} />;
				controller.recordEditor = '';
				return controller;
			case 'product':
				controller.recordDisplay = <ViewProduct data={data} />;
				controller.recordEditor = '';
				return controller;
			case 'schedule':
				controller.recordDisplay = (
					<ViewSchedule
						data={data}
						bookingOps={bookingOps}
						onClose={onClose}
						isModalOpen={visited}
					/>
				);
				controller.recordEditor = '';
				return controller;
			case 'booking':
				controller.recordDisplay = (
					<ViewBooking
						data={data}
						isUserAccountPage={false}
					/>
				);
				controller.recordEditor = '';
				return controller;
			case 'feedback':
				controller.recordDisplay = <ViewReview data={data} />;
				controller.recordEditor = '';
				return controller;
			case 'statistics':
				controller.recordDisplay = (
					<ViewCustomerStatistics
						data={customer}
						onClose={onClose}
						isModalOpen={visited}
					/>
				);
				controller.recordEditor = '';
				return controller;
			case 'customerSchedules':
				controller.recordDisplay = (
					<ViewCustomerTotalSchedules
						data={customer}
						onClose={onClose}
						isModalOpen={visited}
					/>
				);
				controller.recordEditor = '';
				return controller;
			case 'customerBookings':
				controller.recordDisplay = (
					<ViewCustomerTotalBookings
						data={customer}
						onClose={onClose}
						isModalOpen={visited}
					/>
				);
				controller.recordEditor = '';
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
				return controller;
			case 'settings':
				controller.recordDisplay = (
					<ViewUser
						data={data}
						isUserAccountPage={true}
						isEditing={editingState}
					/>
				);
				controller.recordEditor = '';
				return controller;
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
	if (effectiveData) {
		const {recordDisplay, recordEditor} = resolveModifier();
		dataDisplay = recordDisplay;
		dataEditor = recordEditor;
	}

	return (
		<ModalFrame
			visited={visited}
			onClose={onClose}>
			<div className='user-container modal__summary'>
				<div className='user-container__actions-block'>
					{(isAdminPanel || isUserSettings) && (
						<button
							className='user-container__action modal__btn'
							onClick={
								editingState == false ? handleStartEditing : handleCloseEditing
							}>
							{editingState == false ? 'Edytuj' : 'Wróć'}
						</button>
					)}
					{!editingState && isAdminPanel && (
						<button className='user-container__action modal__btn'>Usuń</button>
					)}
				</div>
				{dataDisplay}
			</div>
		</ModalFrame>
	);
}

export default ViewFrame;
