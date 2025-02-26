import {getWeekDay} from '../../utils/productViewsUtils.js';
import ModalTable from './ModalTable';

function DetailsProductSchedules({spots, scheduleRecords, placement}) {
	const notPublished = (
		<>
			<h2 className='user-container__section-title modal__title--day'>Terminy:</h2>
			<div style={{fontWeight: 'bold', fontSize: '2rem'}}>Nie opublikowano</div>
		</>
	);

	let processedScheduleRecordsArr = scheduleRecords;
	let headers = ['ID', 'Data', 'Dzień', 'Godzina', 'Lokacja', 'Frekwencja'];
	let keys = ['id', 'date', 'day', 'time', 'location', 'attendance'];

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
			const attendancePercentage = Math.round((schedule.bookingsNumber / spots) * 100);
			return {
				id: schedule.ScheduleID,
				date: schedule.Date,
				day: getWeekDay(schedule.Date),
				time: schedule.StartTime,
				location: schedule.Location,
				attendance: `${schedule.bookingsNumber}/${spots} (${attendancePercentage}%)`,
			};
		});
	}

	return (
		<>
			<h2 className='user-container__section-title modal__title--day'>Terminy:</h2>
			{scheduleRecords.length > 0 ? (
				<ModalTable
					headers={headers}
					keys={keys}
					content={processedScheduleRecordsArr}
					active={false}
				/>
			) : (
				notPublished
			)}
		</>
	);
}

export default DetailsProductSchedules;
