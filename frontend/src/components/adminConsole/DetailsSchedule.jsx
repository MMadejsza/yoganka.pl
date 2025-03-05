import {durationToSeconds, secondsToDuration, getWeekDay} from '../../utils/customerViewsUtils.js';

function DetailsSchedule({data, userAccessed}) {
	// console.log(
	// 	`📝
	//     Schedule object from backend:`,
	// 	data,
	// );
	const schedule = data;
	const product = data.Product;
	const totalSeconds = durationToSeconds(product.Duration);
	const splitDuration =
		product.Type == 'Camp'
			? secondsToDuration(totalSeconds)
			: secondsToDuration(totalSeconds, 'hours');
	const formattedDuration = `${
		splitDuration.days != '0' && splitDuration.days ? splitDuration.days + ' dni' : ''
	} ${splitDuration.hours != '0' ? splitDuration.hours + ' h' : ''} ${
		splitDuration.minutes != '0' ? splitDuration.minutes + ' minut' : ''
	}`;

	return (
		<>
			<h2 className='user-container__section-title modal__title--day'>{`Szczegóły terminu:`}</h2>
			<ul className='user-container__details-list modal-checklist__list'>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>ID:</p>
					<p className='user-container__section-record-content'>{schedule.ScheduleID}</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Uczestnicy:</p>
					<p className='user-container__section-record-content'>
						{`${userAccessed && schedule.BookedSchedules} / ${schedule.Capacity}`}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Data:</p>
					<p className='user-container__section-record-content'>
						{`${getWeekDay(schedule.Date)} (${schedule.Date})`}
					</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Godzina:</p>
					<p className='user-container__section-record-content'>{schedule.StartTime}</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Długość:</p>
					<p className='user-container__section-record-content'>{`${formattedDuration}`}</p>
				</li>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Miejsce:</p>
					<p className='user-container__section-record-content'>{schedule.Location}</p>
				</li>
			</ul>
		</>
	);
}

export default DetailsSchedule;
