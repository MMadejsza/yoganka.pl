function DetailsProductReviews({stats}) {
	const feedbackArray = stats.reviews;

	const table = (
		<>
			<h2 className='user-container__section-title modal__title--day'>
				{`Opinie (${feedbackArray.length}):`}
			</h2>

			<ul className='schedules__records'>
				<li className='schedules__record schedules__record--header'>
					<div className='schedules__record-content'>ID</div>
					<div className='schedules__record-content'>Data wystawienia</div>
					<div className='schedules__record-content'>Uczestnik</div>
					<div className='schedules__record-content'>Ocena</div>
					<div className='schedules__record-content'>Komentarz</div>
					<div className='schedules__record-content'>Opóźnienie</div>
				</li>
				{feedbackArray.map((feedback, index) => {
					const isoDate = feedback.date.slice(0, 10);
					return (
						<li
							key={index}
							className='schedules__record'>
							<div className='schedules__record-content'>{feedback.id}</div>
							<div className='schedules__record-content'>{isoDate}</div>
							<div className='schedules__record-content'>{feedback.customer}</div>
							<div className='schedules__record-content'>{feedback.rating}</div>
							<div className='schedules__record-content'>{feedback.review}</div>
							<div className='schedules__record-content'>{feedback.delay}</div>
						</li>
					);
				})}
			</ul>
		</>
	);

	return <>{table}</>;
}

export default DetailsProductReviews;
