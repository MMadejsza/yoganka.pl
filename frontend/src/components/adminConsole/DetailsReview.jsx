import {formatIsoDateTime} from '../../utils/productViewsUtils.js';

function DetailsReview({reviewData}) {
	return (
		<>
			<div className='user-container__main-details modal-checklist'>
				<ul className='user-container__details-list modal-checklist__list'>
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Data zgłoszenia:</p>
						<p className='user-container__section-record-content'>
							{formatIsoDateTime(reviewData.SubmissionDate)}
						</p>
					</li>
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Opóźnienie:</p>
						<p className='user-container__section-record-content'>{reviewData.Delay}</p>
					</li>
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Ocena:</p>
						<p className='user-container__section-record-content'>{`${reviewData.Rating}`}</p>
					</li>
					<li className='user-container__section-record modal-checklist__li'>
						<p className='user-container__section-record-label'>Treść:</p>
						<p className='user-container__section-record-content'>{reviewData.Text}</p>
					</li>
				</ul>
			</div>
		</>
	);
}

export default DetailsReview;
