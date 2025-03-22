import DetailsCustomer from './DetailsCustomer.jsx';
import DetailsCustomerReviews from './DetailsCustomerReviews.jsx';
import DetailsProduct from './DetailsProduct.jsx';
import DetailsReview from './DetailsReview.jsx';
import DetailsSchedule from './DetailsSchedule.jsx';

function ViewFeedback({ data }) {
  const { review } = data;
  const { otherReviews } = data;
  const { Customer: customer } = review;
  const { ScheduleRecord: schedule } = review;
  const { Product: product } = schedule;
  const type = product.Type;
  console.clear();
  console.log(type);
  console.log(
    `📝
	    Review object from backend:`,
    data
  );

  return (
    <>
      <h1 className='user-container__user-title modal__title'>{`Opinia (ID:${review.FeedbackID})`}</h1>
      <h3 className='user-container__user-status modal__title'>{` ${customer.FirstName} ${customer.LastName} ->> ${product.Name}`}</h3>

      {/*//@ Review main details */}
      <div className='user-container__main-details modal-checklist'>
        <DetailsReview reviewData={review} />
      </div>

      {/*//@ Product details */}
      <div className='user-container__main-details modal-checklist'>
        <DetailsProduct data={product} placement={'reviews'} />
        {/*//@ Schedule details */}
        {type !== 'Camp' && type !== 'Event' && (
          <DetailsSchedule data={schedule} />
        )}
      </div>

      {/*//@ Customer details */}
      <div className='user-container__main-details   modal-checklist'>
        <DetailsCustomer customerData={customer} />
      </div>

      {/*//@ Another customers.feedbacks */}
      <div className='user-container__main-details  schedules modal-checklist'>
        <DetailsCustomerReviews reviews={otherReviews} placement='reviews' />
      </div>
    </>
  );
}

export default ViewFeedback;
