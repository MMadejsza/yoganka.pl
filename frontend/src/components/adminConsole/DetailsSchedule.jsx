import {durationToSeconds, secondsToDuration, getWeekDay} from '../../utils/customerViewsUtils.js';

function DetailsSchedule({data}) {
	// console.log(
	// 	`📝
	//     Schedule object from backend:`,
	// 	data,
	// );
	const schedule = data;
	const product = data.Product;
	const totalSeconds = durationToSeconds(product.Duration);
	const splitDuration = secondsToDuration(totalSeconds);
	const formattedDuration = `${splitDuration.days != '00' ? splitDuration.days + ' dni' : ''} ${
		splitDuration.hours != '00' ? splitDuration.hours + ' godzin' : ''
	} ${splitDuration.minutes != '00' ? splitDuration.minutes + ' minut' : ''}`;
	return (
		<>
			<h2 className='user-container__section-title modal__title--day'>{`Szczegóły:`}</h2>
			<ul className='user-container__details-list modal-checklist__list'>
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
					<p className='user-container__section-record-content'>{`${formattedDuration} (${product.Type})`}</p>
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
