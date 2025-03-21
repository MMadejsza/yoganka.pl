import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useMutation} from '@tanstack/react-query';
import ModalTable from './ModalTable';
import NewProductScheduleForm from './NewProductScheduleForm';
import UserFeedbackBox from './FeedbackBox.jsx';
import {queryClient, mutateOnDelete} from '../../utils/http.js';
import {useFeedback} from '../../hooks/useFeedback';
import {getWeekDay} from '../../utils/dateTime.js';

function DetailsProductSchedules({scheduleRecords, placement, status}) {
	let params = useParams();
	const [isFormVisible, setIsFormVisible] = useState();
	const [deleteWarningTriggered, setDeleteWarningTriggered] = useState(false);

	const {feedback, updateFeedback} = useFeedback();

	const {
		mutate: deleteScheduleRecord,
		isPending: deleteScheduleRecordIsPending,
		isError: deleteScheduleRecordIsError,
		error: deleteScheduleRecordError,
		reset,
	} = useMutation({
		mutationFn: (formDataObj) =>
			mutateOnDelete(
				status,
				formDataObj,
				`/api/admin-console/delete-schedule/${formDataObj.deleteScheduleID}`,
			),

		onSuccess: (res) => {
			queryClient.invalidateQueries([`/admin-console/show-all-products/${params.id}`]);

			updateFeedback(res);
		},
		onError: (err) => {
			updateFeedback(err);
		},
	});

	const handleDelete = (params) => {
		console.log(params);
		reset();
		if (!deleteWarningTriggered && !params.isDisabled) {
			updateFeedback({
				confirmation: 0,
				message: '',
				warnings: [
					'Wszystkich powiązanych opinii',
					'Wszystkich powiązanych z terminem obecności, a więc wpłynie na statystyki zajęć i użytkowników',
					'(nie ma potrzeby usuwania terminu)',
				],
			});
			setDeleteWarningTriggered(true);
		} else {
			deleteScheduleRecord(params);
		}
	};

	const notPublished = (
		<>
			<div style={{fontWeight: 'bold', fontSize: '2rem'}}>Nie opublikowano</div>
		</>
	);

	let processedScheduleRecordsArr = scheduleRecords;
	let headers = ['ID', 'Dzień', 'Data', 'Godzina', 'Lokacja', 'Frekwencja', ''];
	let keys = ['id', 'day', 'date', 'time', 'location', 'attendance', ''];
	let form;

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
			{feedback && (
				<UserFeedbackBox
					warnings={feedback.warnings}
					status={feedback.status}
					successMsg={feedback.message}
					isPending={deleteScheduleRecordIsPending}
					isError={deleteScheduleRecordIsError}
					error={deleteScheduleRecordError}
					size='small'
				/>
			)}
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
					onQuickAction={[{symbol: 'delete', method: handleDelete}]}
				/>
			) : (
				notPublished
			)}
		</>
	);
}

export default DetailsProductSchedules;
