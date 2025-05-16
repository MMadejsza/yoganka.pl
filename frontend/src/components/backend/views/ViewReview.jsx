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
      <h1 className='modal__title modal__title--view'>{`Opinia (Id:${review.feedbackId})`}</h1>
      <h3 className='modal__title modal__title--status'>{` ${customer.firstName} ${customer.lastName} ->> ${product.name}`}</h3>

      {/*//@ Review main details */}
      <DetailsListReview reviewData={review} />

      {/*//@ Product details */}
      <DetailsListProduct data={product} placement={'reviews'} />

      {/*//@ Schedule details */}
      {type !== 'Camp' && type !== 'Event' && (
        <DetailsListSchedule data={schedule} />
      )}

      {/*//@ Customer details */}
      <DetailsListCustomer customerData={customer} />

      {/*//@ Another customers.feedbacks */}
      <TableCustomerReviews reviews={otherReviews} placement='reviews' />
    </>
  );
}

export default ViewFeedback;
