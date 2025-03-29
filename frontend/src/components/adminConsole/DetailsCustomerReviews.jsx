import { getWeekDay } from '../../utils/dateTime.js';

import ModalTable from './ModalTable';

function DetailsCustomerReviews({ reviews, placement }) {
  const feedbackArray = reviews;
  console.log(`DetailsCustomerReviews feedbackArray `, feedbackArray);
  console.log(`DetailsCustomerReviews placement `, placement);

  let processedFeedbackArr = feedbackArray;
  let keys = ['id', 'date', 'product', 'schedule', 'rating', 'review', 'delay'];
  if (placement != 'reviews') {
    processedFeedbackArr = feedbackArray.map((feedback, index) => {
      return {
        id: feedback.id,
        date: feedback.date,
        product: feedback.product,
        schedule: feedback.schedule,
        rating: feedback.rating,
        review: feedback.review,
        delay: feedback.delay,
      };
    });
  } else {
    processedFeedbackArr = feedbackArray.map((feedback, index) => {
      return {
        id: feedback.FeedbackID,
        date: feedback.SubmissionDate,
        product: feedback.ScheduleRecord.Product.name,
        schedule: `(ID: ${feedback.ScheduleRecord.scheduleId}) ${
          feedback.ScheduleRecord.date
        }\n${getWeekDay(feedback.ScheduleRecord.date)}${feedback.ScheduleRecord.startTime}`,
        rating: feedback.Rating,
        review: feedback.Text,
        delay: feedback.Delay,
      };
    });
  }

  return (
    <>
      <h2 className='user-container__section-title modal__title--day'>
        {`${placement != 'reviews' ? 'Opinie:' : 'Inne opinie:'} (${
          processedFeedbackArr.length
        }):`}
      </h2>

      {feedbackArray.length > 0 ? (
        <ModalTable
          headers={[
            'ID',
            'Data wystawienia',
            'Produkt',
            'Termin',
            'Ocena',
            'Komentarz',
            'Opóźnienie',
          ]}
          keys={keys}
          content={processedFeedbackArr}
          active={false}
        />
      ) : (
        <h3 className='user-container__user-status modal__title'>Brak</h3>
      )}
    </>
  );
}

export default DetailsCustomerReviews;
