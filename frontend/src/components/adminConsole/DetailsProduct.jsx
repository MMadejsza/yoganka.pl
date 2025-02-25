import {durationToSeconds, secondsToDuration} from '../../utils/customerViewsUtils.js';

function DetailsProduct({data, placement, userAccessed}) {
	console.log(
		`📝 
        product object from backend:`,
		data,
	);
	const product = data;
	const totalSeconds = durationToSeconds(product.Duration);
	const splitDuration = secondsToDuration(totalSeconds);
	const formattedDuration = `${splitDuration.days != '00' ? splitDuration.days + ' dni' : ''} ${
		splitDuration.hours != '00' ? splitDuration.hours + ' godzin' : ''
	} ${splitDuration.minutes != '00' ? splitDuration.minutes + ' minut' : ''}`;
	return (
		<>
			<h2 className='user-container__section-title modal__title--day'>{`Szczegóły zajęć:`}</h2>

			<ul className='user-container__details-list modal-checklist__list'>
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Typ:</p>
					<p className='user-container__section-record-content'>{product.Type}</p>
				</li>
				{placement == 'schedule' && !userAccessed && (
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Nazwa:</p>
						<p className='user-container__section-record-content'>{product.Name}</p>
					</li>
				)}
				{placement != 'schedule' && (
					<>
						<li className='user-container__section-record modal-checklist__li'>
							<p className='user-container__section-record-label'>
								{product.Type == 'Camp' || product.Type == 'Event'
									? 'Data:'
									: 'Wdrożony:'}
							</p>
							<p className='user-container__section-record-content'>
								{product.StartDate}
							</p>
						</li>
						<li className='user-container__section-record modal-checklist__li'>
							<p className='user-container__section-record-label'>Lokacja:</p>
							<p className='user-container__section-record-content'>
								{product.Location}
							</p>
						</li>

						<li className='user-container__section-record modal-checklist__li'>
							<p className='user-container__section-record-label'>Czas trwania:</p>
							<p className='user-container__section-record-content'>
								{formattedDuration}
							</p>
						</li>
					</>
				)}
				{!userAccessed && (
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Miejsc:</p>
						<p className='user-container__section-record-content'>
							{product.TotalSpaces}
						</p>
					</li>
				)}
				<li className='user-container__section-record modal-checklist__li'>
					<p className='user-container__section-record-label'>Zadatek:</p>
					<p className='user-container__section-record-content'>{product.Price}zł</p>
				</li>
			</ul>
		</>
	);
}

export default DetailsProduct;
