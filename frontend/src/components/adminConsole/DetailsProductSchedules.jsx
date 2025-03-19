import React, {useState} from 'react';

import {getWeekDay} from '../../utils/dateTime.js';
import ModalTable from './ModalTable';
import NewProductScheduleForm from './NewProductScheduleForm';

function DetailsProductSchedules({scheduleRecords, placement, status}) {
	const [isFormVisible, setIsFormVisible] = useState();

	const notPublished = (
		<>
			<div style={{fontWeight: 'bold', fontSize: '2rem'}}>Nie opublikowano</div>
		</>
	);

	let processedScheduleRecordsArr = scheduleRecords;
	let headers = ['ID', 'Dzień', 'Data', 'Godzina', 'Lokacja', 'Frekwencja', 'Akcje'];
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
				/>
			) : (
				notPublished
			)}
		</>
	);
}

export default DetailsProductSchedules;
