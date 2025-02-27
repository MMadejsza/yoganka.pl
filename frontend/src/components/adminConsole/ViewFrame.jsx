import React, {useState} from 'react';
import {useParams, useLocation} from 'react-router-dom';

import {fetchItem} from '../../utils/http.js';
import {useQuery} from '@tanstack/react-query';
import ModalFrame from './ModalFrame.jsx';
import ViewUser from './ViewUser.jsx';
import ViewCustomer from './ViewCustomer.jsx';
import UserForm from './UserForm.jsx';
import ViewProduct from './ViewProduct.jsx';
import ViewSchedule from './ViewSchedule.jsx';
import ViewBooking from './ViewBooking.jsx';
import ViewReview from './ViewReview.jsx';
import ViewUserTotalSchedules from './ViewUserTotalSchedules.jsx';

function ViewFrame({modifier, visited, onClose, bookingOps, userAccountPage, customer}) {
	const params = useParams();
	const location = useLocation();
	const callPath = location.pathname;

	console.log('ViewFrame callPath: ', callPath);

	const {data, isPending, isError, error} = useQuery({
		queryKey: ['query', location.pathname],
		queryFn: ({signal}) => fetchItem(callPath, {signal}),
		staleTime: 0,
		refetchOnMount: true,
		enabled: !!params.id || location.pathname.includes('ustawienia'),
	});
	console.log('ViewFrame data: ', data);
	const effectiveData = location.pathname.includes('ustawienia') ? data : customer;

	const [editingState, setEditingState] = useState(false);

	const handleStartEditing = () => {
		setEditingState(true);
	};
	const handleCloseEditing = () => {
		setEditingState(false);
	};
	const resolveModifier = () => {
		let controller = {};
		switch (modifier) {
			case 'user':
				controller.recordDisplay = <ViewUser data={data} />;
				controller.recordEditor = <UserForm />;
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
					/>
				);
				controller.recordEditor = '';
				return controller;
			case 'booking':
				controller.recordDisplay = <ViewBooking data={data} />;
				controller.recordEditor = '';
				return controller;
			case 'feedback':
				controller.recordDisplay = <ViewReview data={data} />;
				controller.recordEditor = '';
				return controller;
			case 'statistics':
				controller.recordDisplay = <ViewCustomerStatistics data={customer} />;
				controller.recordEditor = '';
				return controller;
			case 'customerSchedules':
				controller.recordDisplay = <ViewUserTotalSchedules data={customer} />;
				controller.recordEditor = '';
				return controller;
			case 'customerBookings':
				controller.recordDisplay = <ViewReview data={customer} />;
				controller.recordEditor = '';
				return controller;
			case 'invoices':
				controller.recordDisplay = <ViewReview data={customer} />;
				controller.recordEditor = '';
				return controller;
			case 'settings':
				controller.recordDisplay = (
					<ViewUser
						data={data}
						isUserAccountPage={true}
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
		dataDisplay = 'Error in UserDetails fetch...';
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
					<button
						className='user-container__action modal__btn'
						onClick={editingState == false ? handleStartEditing : handleCloseEditing}>
						{editingState == false ? 'Edytuj' : 'Wróć'}
					</button>
					{!editingState && !userAccountPage && (
						<button className='user-container__action modal__btn'>Usuń</button>
					)}
				</div>
				{editingState == false ? dataDisplay : dataEditor}
			</div>
		</ModalFrame>
	);
}

export default ViewFrame;
