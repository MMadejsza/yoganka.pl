import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useMutation, useQuery} from '@tanstack/react-query';
import ModalTable from './ModalTable';
import UserFeedbackBox from './FeedbackBox.jsx';
import {queryClient, fetchStatus} from '../../utils/http.js';

function DetailsProductBookings({type, stats, isAdminPage}) {
	console.log('\n✅✅✅DetailsProductBookings:');
	console.log('\nisAdminPage:', isAdminPage);

	let params = useParams();
	let bookingsArray = stats.totalBookings || stats.bookings;
	let cancelledBookingsArr = bookingsArray.filter((b) => b.Attendance == false);

	let initialFeedbackConfirmation;
	const [feedbackConfirmation, setFeedbackConfirmation] = useState(initialFeedbackConfirmation);
	const [successMsg, setSuccessMsg] = useState(null);

	const {data: status} = useQuery({
		queryKey: ['authStatus'],
		queryFn: fetchStatus,
	});

	const {
		mutate: restore,
		isPending: restoreIsPending,
		isError: restoreIsError,
		error: restoreError,
	} = useMutation({
		mutationFn: (formData) => {
			return fetch(`/api/admin-console/mark-present`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'CSRF-Token': status.token,
				},
				body: JSON.stringify(formData),
				credentials: 'include', // include cookies
			}).then((response) => {
				return response.json().then((data) => {
					if (!response.ok) {
						// reject with backend data
						return Promise.reject(data);
					}
					return data;
				});
			});
		},
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
			isPending={restoreIsPending}
			isError={restoreIsError}
			error={restoreError}
			size='small'
		/>
	);

	const table = (
		<ModalTable
			headers={['ID', 'Data rezerwacji', 'Uczestnik', 'Zadatek', 'Metoda płatności']}
			keys={['BookingID', 'Date', 'Customer', 'AmountPaid', 'PaymentMethod']}
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
				keys={['BookingID', 'Date', 'Customer', 'AmountPaid', 'PaymentMethod', '']}
				content={cancelledBookingsArr}
				active={false}
				isAdminPage={isAdminPage}
				adminActions={true}
				onQuickAction={[{symbol: 'restore', method: restore}]}
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
