import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useMutation} from '@tanstack/react-query';
import ModalTable from './ModalTable';
import NewProductScheduleForm from './NewProductScheduleForm';
import UserFeedbackBox from './FeedbackBox.jsx';
import {queryClient} from '../../utils/http.js';
import {getWeekDay} from '../../utils/dateTime.js';

function DetailsProductSchedules({scheduleRecords, placement, status}) {
	let params = useParams();
	const [isFormVisible, setIsFormVisible] = useState();
	const [deleteWarningTriggered, setDeleteWarningTriggered] = useState(false);
	const [successMsg, setSuccessMsg] = useState(null);
	const [deleteWarnings, setDeleteWarnings] = useState(null);
	const notPublished = (
		<>
			<div style={{fontWeight: 'bold', fontSize: '2rem'}}>Nie opublikowano</div>
		</>
	);
	let initialFeedbackConfirmation;
	const [feedbackConfirmation, setFeedbackConfirmation] = useState(initialFeedbackConfirmation);
	let processedScheduleRecordsArr = scheduleRecords;
	let headers = ['ID', 'Dzień', 'Data', 'Godzina', 'Lokacja', 'Frekwencja', 'Akcje'];
	let keys = ['id', 'day', 'date', 'time', 'location', 'attendance', ''];
	let form;
	let feedback;

	const {
		mutate: deleteScheduleRecord,
		isPending: deleteScheduleRecordIsPending,
		isError: deleteScheduleRecordIsError,
		error: deleteScheduleRecordError,
		reset,
	} = useMutation({
		mutationFn: (formData) => {
			setDeleteWarningTriggered(false);
			return fetch(`/api/admin-console/delete-schedule/${formData.deleteScheduleID}`, {
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
			queryClient.invalidateQueries([`/admin-console/show-all-products/${params.id}`]);
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
		console.log(params);
		reset();
		if (!deleteWarningTriggered && !params.isDisabled) {
			setDeleteWarnings([
				'Wszystkich powiązanych opinii',
				'Wszystkich powiązanych z terminem obecności, a więc wpłynie na statystyki zajęć i użytkowników',
				'(nie ma potrzeby usuwania terminu)',
			]);
			setDeleteWarningTriggered(true);
		} else {
			deleteScheduleRecord(params);
			setDeleteWarnings(null);
		}
	};

	if (placement == 'booking') {
		headers = ['ID', 'Produkt', 'Data', 'Dzień', 'Godzina', 'Lokacja', 'Zadatek'];
		keys = ['id', 'product', 'date', 'day', 'time', 'location', 'price'];
		processedScheduleRecordsArr = scheduleRecords.map((schedule) => {
			return {
				id: schedule.ScheduleID,
				product: schedule.Product.Name,
				date: schedule.Date,
				day: getWeekDay(schedule.Date),
				time: schedule.StartTime,
				location: schedule.Location,
				price: schedule.Product.Price,
			};
		});
	} else {
		processedScheduleRecordsArr = scheduleRecords.map((schedule) => {
			return {
				id: schedule.ScheduleID,
				date: schedule.Date,
				day: getWeekDay(schedule.Date),
				time: schedule.StartTime,
				location: schedule.Location,
				attendance: `${schedule.participants}/${schedule.capacity} (${schedule.attendance}%)`,
				attendanceCount: schedule.attendance,
				isActionDisabled: schedule.participants > 0 || new Date(schedule.Date) < new Date(),
			};
		});

		form = <NewProductScheduleForm />;
		feedback = (feedbackConfirmation !== undefined || deleteWarningTriggered) && (
			<UserFeedbackBox
				warnings={deleteWarnings}
				status={feedbackConfirmation}
				successMsg={successMsg}
				isPending={deleteScheduleRecordIsPending}
				isError={deleteScheduleRecordIsError}
				error={deleteScheduleRecordError}
				size='small'
			/>
		);
	}

	return (
		<>
			<h2 className='user-container__section-title modal__title--day admin-action '>
				Terminy
				{placement != 'booking' && (
					<button
						onClick={(e) => {
							e.preventDefault;
							setIsFormVisible(!isFormVisible);
						}}
						className={`form-action-btn table-form-btn table-form-btn--submit`}>
						<span className='material-symbols-rounded nav__icon nav__icon--side account'>
							{!isFormVisible ? 'add_circle' : 'undo'}
						</span>
					</button>
				)}
			</h2>
			{feedback}
			{isFormVisible && form}
			{scheduleRecords.length > 0 ? (
				<ModalTable
					headers={headers}
					keys={keys}
					content={processedScheduleRecordsArr}
					active={false}
					status={status}
					isAdminPage={true}
					adminActions={true}
					onQuickAction={[{symbol: 'delete_forever', method: handleDelete}]}
				/>
			) : (
				notPublished
			)}
		</>
	);
}

export default DetailsProductSchedules;
