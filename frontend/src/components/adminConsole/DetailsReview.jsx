import { formatIsoDateTime } from '../../utils/dateTime.js';

function DetailsReview({ reviewData }) {
  return (
    <>
      <div className='user-container__main-details modal-checklist'>
        <ul className='user-container__details-list modal-checklist__list'>
          <li className='user-container__section-record modal-checklist__li'>
            <p className='user-container__section-record-label'>
              Data zgłoszenia:
            </p>
            <p className='user-container__section-record-content'>
              {formatIsoDateTime(reviewData.submissionDate)}
            </p>
          </li>
          <li className='user-container__section-record modal-checklist__li'>
            <p className='user-container__section-record-label'>Opóźnienie:</p>
            <p className='user-container__section-record-content'>
              {reviewData.delay}
            </p>
          </li>
          <li className='user-container__section-record modal-checklist__li'>
            <p className='user-container__section-record-label'>Ocena:</p>
            <p className='user-container__section-record-content'>{`${reviewData.rating}`}</p>
          </li>
          <li className='user-container__section-record modal-checklist__li'>
            <p className='user-container__section-record-label'>Treść:</p>
            <p className='user-container__section-record-content'>
              {reviewData.text}
            </p>
          </li>
        </ul>
      </div>
    </>
  );
}

export default DetailsReview;
