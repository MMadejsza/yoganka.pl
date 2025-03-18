import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useMutation, useQuery} from '@tanstack/react-query';
import UserFeedbackBox from './FeedbackBox.jsx';
import ModalTable from './ModalTable';
import NewAttendanceForm from './NewAttendanceForm';
import {queryClient, fetchStatus} from '../../utils/http.js';

function DetailsTableAttendance({type, stats, isAdminPage}) {
	console.log('\n✅✅✅DetailsTableAttendance:');
	let bookingsArray = stats.attendedBookings;
	let params = useParams();
	const [isFormVisible, setIsFormVisible] = useState();
	let initialFeedbackConfirmation;
	const [feedbackConfirmation, setFeedbackConfirmation] = useState(initialFeedbackConfirmation);
	const [deleteWarningTriggered, setDeleteWarningTriggered] = useState(false);
	const [successMsg, setSuccessMsg] = useState(null);
	const [deleteWarnings, setDeleteWarnings] = useState(null);

	const {data: status} = useQuery({
		queryKey: ['authStatus'],
		queryFn: fetchStatus,
	});

	const {
		mutate: markAbsent,
		isPending: markAbsentIsPending,
		isError: markAbsentIsError,
		error: markAbsentError,
	} = useMutation({
		mutationFn: (formData) => {
			setDeleteWarningTriggered(false);
			return fetch(`/api/admin-console/mark-absent`, {
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

	const {
		mutate: deleteAttendanceRecord,
		isPending: deleteAttendanceRecordIsPending,
		isError: deleteAttendanceRecordIsError,
		error: deleteAttendanceRecordError,
	} = useMutation({
		mutationFn: (formData) => {
			setDeleteWarningTriggered(false);
			return fetch(`/api/admin-console/delete-attendance-record`, {
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

	const handleDelete = (params) => {
		if (!deleteWarningTriggered) {
			setDeleteWarnings([
				'Rekordu wliczanego do statystyk w systemie. Nie powinno być potrzeby tego robić. Skontaktuj się z IT lub kliknij jeszcze raz w ciągu 5s w celu potwierdzenia.',
			]);
			setDeleteWarningTriggered(true);
		} else {
			deleteAttendanceRecord(params);
			setDeleteWarnings(null);
		}
	};

	const table = (
		<ModalTable
			headers={['ID Ucz.', 'Data zapisania', , 'Uczestnik', '']}
			keys={['customerID', 'timestamp', , 'customer', '']}
			content={bookingsArray}
			active={false}
			isAdminPage={isAdminPage}
			adminActions={true}
			onQuickAction={[
				{symbol: 'delete_forever', method: handleDelete},
				{symbol: 'person_remove', method: markAbsent},
			]}
		/>
	);
	let feedback = (feedbackConfirmation !== undefined || deleteWarningTriggered) && (
		<UserFeedbackBox
			warnings={deleteWarnings}
			status={feedbackConfirmation}
			successMsg={successMsg}
			isPending={deleteAttendanceRecordIsPending || markAbsentIsPending}
			isError={deleteAttendanceRecordIsError || markAbsentIsError}
			error={deleteAttendanceRecordError || markAbsentError}
			size='small'
		/>
	);

	const form = <NewAttendanceForm />;

	return (
		<>
			<h2 className='user-container__section-title modal__title--day admin-action'>
				{`Obecność (${bookingsArray.length})`}
				{/* <button
					onClick={(e) => {
						e.preventDefault;
						setIsFormVisible(!isFormVisible);
					}}
					className={`form-action-btn table-form-btn table-form-btn--submit`}>
					<span className='material-symbols-rounded nav__icon nav__icon--side account'>
						{!isFormVisible ? 'add_circle' : 'undo'}
					</span>
				</button> */}
			</h2>
			{feedback}
			{isFormVisible && form}
			{table}
		</>
	);
}

export default DetailsTableAttendance;
