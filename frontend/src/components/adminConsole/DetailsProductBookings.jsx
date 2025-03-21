import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useMutation} from '@tanstack/react-query';
import {useAuthStatus} from '../../hooks/useAuthStatus.js';
import ModalTable from './ModalTable';
import UserFeedbackBox from './FeedbackBox.jsx';
import {queryClient, mutateOnEdit} from '../../utils/http.js';

function DetailsProductBookings({type, stats, isAdminPage}) {
	console.log('\n✅✅✅DetailsProductBookings:');
	console.log('\nisAdminPage:', isAdminPage);

	let params = useParams();
	let bookingsArray = stats.totalBookings || stats.bookings;
	let cancelledBookingsArr = bookingsArray.filter((b) => b.Attendance == false);

	let initialFeedbackConfirmation;
	const [feedbackConfirmation, setFeedbackConfirmation] = useState(initialFeedbackConfirmation);
	const [successMsg, setSuccessMsg] = useState(null);

	const {data: status} = useAuthStatus();

	const {
		mutate: markPresent,
		isPending: markPresentIsPending,
		isError: markPresentIsError,
		error: markPresentError,
	} = useMutation({
		mutationFn: (formDataObj) =>
			mutateOnEdit(status, formDataObj, `/api/admin-console/edit-mark-present`),

		onSuccess: (res) => {
			queryClient.invalidateQueries([`/admin-console/show-all-schedules/${params.id}`]);
			console.log('res', res);

			if (res.confirmation || res.code == 200) {
				setSuccessMsg(res.message);
				setFeedbackConfirmation(1);
			} else {
				setFeedbackConfirmation(0);
			}
		},
		onError: (err) => {
			setFeedbackConfirmation(0);
		},
	});

	let feedback = feedbackConfirmation !== undefined && (
		<UserFeedbackBox
			status={feedbackConfirmation}
			successMsg={successMsg}
			isPending={markPresentIsPending}
			isError={markPresentIsError}
			error={markPresentError}
			size='small'
		/>
	);

	const table = (
		<ModalTable
			headers={['ID', 'Data rezerwacji', 'Uczestnik', 'Zadatek', 'Metoda płatności']}
			keys={['BookingID', 'Date', 'customer', 'AmountPaid', 'PaymentMethod']}
			content={bookingsArray}
			active={false}
		/>
	);
	const cancelledTable = cancelledBookingsArr?.length > 0 && (
		<>
			<h2 className='user-container__section-title modal__title--day'>
				{`Rezerwacje anulowanych obecności (${cancelledBookingsArr.length}):`}
			</h2>
			{feedback}
			<ModalTable
				headers={['ID', 'Data rezerwacji', 'Uczestnik', 'Zadatek', 'Metoda płatności', '']}
				keys={['BookingID', 'Date', 'customer', 'AmountPaid', 'PaymentMethod', '']}
				content={cancelledBookingsArr}
				active={false}
				isAdminPage={isAdminPage}
				adminActions={true}
				onQuickAction={[{symbol: 'restore', method: markPresent}]}
			/>
		</>
	);

	const title = type === 'Camp' || type === 'Event' ? 'Rezerwacje' : 'Wszystkie rezerwacje';
	return (
		<>
			<h2 className='user-container__section-title modal__title--day'>
				{`${title} (${bookingsArray.length}):`}
			</h2>
			{table}
			{cancelledTable}
		</>
	);
}

export default DetailsProductBookings;
