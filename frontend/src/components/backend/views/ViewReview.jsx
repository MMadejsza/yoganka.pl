import DetailsListCustomer from './lists/DetailsListCustomer.jsx';
import DetailsListProduct from './lists/DetailsListProduct.jsx';
import DetailsListReview from './lists/DetailsListReview.jsx';
import DetailsListSchedule from './lists/DetailsListSchedule.jsx';
import TableCustomerReviews from './tables/TableCustomerReviews.jsx';

function ViewFeedback({ data }) {
  const { review } = data;
  const { otherReviews } = data;
  const { Customer: customer } = review;
  const { ScheduleRecord: schedule } = review;
  const { Product: product } = schedule;
  const type = product.type;
  console.clear();
  console.log(type);
  console.log(
    `📝
	    Review object from backend:`,
    data
  );

  return (
    <>
      <h1 className='user-container__user-title modal__title'>{`Opinia (Id:${review.feedbackId})`}</h1>
      <h3 className='user-container__user-status modal__title'>{` ${customer.firstName} ${customer.lastName} ->> ${product.name}`}</h3>

      {/*//@ Review main details */}
      <div className='user-container__main-details modal-checklist'>
        <DetailsListReview reviewData={review} />
      </div>

      {/*//@ Product details */}
      <div className='user-container__main-details modal-checklist'>
        <DetailsListProduct data={product} placement={'reviews'} />
        {/*//@ Schedule details */}
        {type !== 'Camp' && type !== 'Event' && (
          <DetailsListSchedule data={schedule} />
        )}
      </div>

      {/*//@ Customer details */}
      <div className='user-container__main-details   modal-checklist'>
        <DetailsListCustomer customerData={customer} />
      </div>

      {/*//@ Another customers.feedbacks */}
      <div className='user-container__main-details  schedules modal-checklist'>
        <TableCustomerReviews reviews={otherReviews} placement='reviews' />
      </div>
    </>
  );
}

export default ViewFeedback;
