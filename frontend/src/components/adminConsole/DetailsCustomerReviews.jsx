import {getWeekDay} from '../../utils/customerViewsUtils.js';

function DetailsCustomerReviews({reviews, placement}) {
	const feedbackArray = reviews;
	console.log(`DetailsCustomerReviews feedbackArray `, feedbackArray);

	const table = (
		<>
			<h2 className='user-container__section-title modal__title--day'>
				{`${placement != 'reviews' ? 'Opinie:' : 'Inne opinie:'} (${
					feedbackArray.length
				}):`}
			</h2>

			<ul className='schedules__records'>
				<li className='schedules__record schedules__record--header'>
					<div className='schedules__record-content'>ID</div>
					<div className='schedules__record-content'>Data wystawienia</div>
					<div className='schedules__record-content'>Produkt</div>
					<div className='schedules__record-content'>Termin</div>
					<div className='schedules__record-content'>Ocena</div>
					<div className='schedules__record-content'>Komentarz</div>
					<div className='schedules__record-content'>Opóźnienie</div>
				</li>
				{feedbackArray.length > 0
					? feedbackArray.map((feedback, index) => {
							let id;
							let date;
							let product;
							let schedule;
							let rating;
							let review;
							let delay;
							if (placement != 'reviews') {
								id = feedback.id;
								date = feedback.date;
								product = feedback.product;
								schedule = feedback.schedule;
								rating = feedback.rating;
								review = feedback.review;
								delay = feedback.delay;
							} else {
								id = feedback.FeedbackID;
								date = feedback.SubmissionDate;
								product = feedback.ScheduleRecord.Product.Name;
								schedule = `
							(ID: ${feedback.ScheduleRecord.ScheduleID})
							${feedback.ScheduleRecord.Date}
							${getWeekDay(feedback.ScheduleRecord.Date)}
							${feedback.ScheduleRecord.StartTime}
							`;
								rating = feedback.Rating;
								review = feedback.Text;
								delay = feedback.Delay;
							}
							const isoDate = date.slice(0, 10);

							return (
								<li
									key={index}
									className='schedules__record'>
									<div className='schedules__record-content'>{id}</div>
									<div className='schedules__record-content'>{isoDate}</div>
									<div className='schedules__record-content'>{product}</div>
									<div className='schedules__record-content'>{schedule}</div>

									<div className='schedules__record-content'>{rating}</div>
									<div className='schedules__record-content'>{review}</div>
									<div className='schedules__record-content'>{delay}</div>
								</li>
							);
					  })
					: 'Brak innych opinii uczestnika'}
			</ul>
		</>
	);

	return <>{table}</>;
}

export default DetailsCustomerReviews;
