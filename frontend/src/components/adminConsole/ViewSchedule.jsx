import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { mutateOnEdit, queryClient } from '../../utils/http.js';
import { statsCalculatorForSchedule } from '../../utils/statistics/statsCalculatorForSchedule.js';
import DetailsProduct from './DetailsProduct.jsx';
import DetailsProductPayments from './DetailsProductPayments.jsx';
import DetailsProductReviews from './DetailsProductReviews.jsx';
import DetailsSchedule from './DetailsSchedule.jsx';
import DetailsScheduleStats from './DetailsScheduleStats.jsx';
import DetailsTableAttendance from './DetailsTableAttendance.jsx';
import FeedbackBox from './FeedbackBox.jsx';
import ViewScheduleNewCustomerForm from './ViewScheduleNewCustomerForm.jsx';

function ViewSchedule({ data, paymentOps, onClose, isAdminPanel }) {
  // console.clear();
  console.log(
    `📝
	    Schedule object from backend:`,
    data
  );
  const location = useLocation();
  const navigate = useNavigate();
  const userAccountPage = location.pathname.includes('konto');
  const { schedule } = data;
  const { scheduleId } = schedule;
  const { Product: product } = schedule;

  const { data: status } = useAuthStatus();
  console.log(`status`, status);

  const { feedback, updateFeedback } = useFeedback({
    getRedirectTarget: result => (result.confirmation === 1 ? '/konto' : null),
    onClose: onClose,
  });

  const { mutate: cancel } = useMutation({
    mutationFn: formDataObj =>
      mutateOnEdit(
        status,
        formDataObj,
        `/api/customer/edit-mark-absent/${scheduleId}`
      ),

    onSuccess: res => {
      queryClient.invalidateQueries(['data', '/grafik']);
      queryClient.invalidateQueries(['account']);
      updateFeedback(res);
    },
    onError: err => {
      updateFeedback(err);
    },
  });

  // console.log(`status.role`, status.role);
  const [newCustomerDetails, setNewCustomerDetails] = useState({
    isFirstTimeBuyer: status.role == 'USER',
  });
  // console.log(`newCustomerDetails: `, newCustomerDetails);
  const [isFillingTheForm, setIsFillingTheForm] = useState(false);

  const { isLoggedIn } = status;
  const userAccessed = status.role != 'ADMIN';
  let scheduleStats = null;
  if (!userAccessed && isAdminPanel)
    scheduleStats = statsCalculatorForSchedule(product, schedule);

  const handleCancellation = () => {
    cancel();
  };
  const handleFormSave = details => {
    setNewCustomerDetails(details);
    setIsFillingTheForm(false);
  };

  // Wrapper for paymentOps.onBook, updating feedback
  const handlePayment = async () => {
    try {
      const res = await paymentOps.onBook({
        customerDetails: newCustomerDetails || null,
        schedule: schedule.scheduleId,
        product: product.name,
        status: 'Paid',
        amountPaid: product.price,
        amountDue: 0,
        paymentMethod: 'Credit Card',
        paymentStatus: 'Completed',
      });
      updateFeedback(res);
    } catch (err) {
      updateFeedback(err);
    }
  };

  const today = new Date();
  const scheduleDateTime = new Date(
    `${schedule.date}T${schedule.startTime}:00`
  );
  const isArchived = scheduleDateTime < today;
  const shouldShowFeedback =
    feedback.status === 1 || feedback.status === 0 || feedback.status === -1;
  const shouldShowCancelBtn =
    status?.isLoggedIn &&
    schedule.isUserGoing &&
    userAccountPage &&
    !shouldShowFeedback;
  const shouldShowBookBtn =
    !isArchived &&
    !schedule.isUserGoing &&
    !paymentOps?.isError &&
    !isFillingTheForm;
  const isFull = schedule.full;
  const shouldDisableBookBtn =
    (isFull && shouldShowBookBtn) || isFillingTheForm;

  const paymentBtn = isLoggedIn ? (
    <button
      onClick={
        !shouldDisableBookBtn
          ? newCustomerDetails.isFirstTimeBuyer
            ? () => setIsFillingTheForm(true)
            : handlePayment
          : null
      }
      className={`book modal__btn ${shouldDisableBookBtn && 'disabled'}`}
    >
      <span className='material-symbols-rounded nav__icon'>
        {shouldDisableBookBtn
          ? 'block'
          : schedule.wasUserReserved
            ? 'restore'
            : newCustomerDetails.isFirstTimeBuyer
              ? 'edit'
              : 'shopping_bag'}
      </span>
      {shouldDisableBookBtn
        ? isFillingTheForm
          ? 'Wypełnianie formularza'
          : 'Brak Miejsc'
        : schedule.wasUserReserved
          ? 'Wróć na zajęcia'
          : newCustomerDetails.isFirstTimeBuyer
            ? 'Uzupełnij dane osobowe'
            : 'Rezerwuj'}
    </button>
  ) : (
    // dynamic redirection back to schedule when logged in, in Login form useFeedback
    <button
      onClick={() => navigate(`/login?redirect=/grafik/${schedule.scheduleId}`)}
      className='book modal__btn'
    >
      <span className='material-symbols-rounded nav__icon'>login</span>
      Zaloguj się
    </button>
  );

  const feedbackBox =
    feedback.status !== undefined ? (
      <FeedbackBox
        warnings={feedback.warnings}
        status={feedback.status}
        successMsg={feedback.message}
        isPending={false}
        error={feedback.status === -1 ? { message: feedback.message } : null}
        size='small'
        redirectTarget={feedback.redirectTarget}
        onClose={onClose}
      />
    ) : null;

  return (
    <>
      {userAccessed ? (
        <>
          <h1 className='user-container__user-title modal__title'>{`${product.name}`}</h1>
        </>
      ) : (
        <>
          <h1 className='user-container__user-title modal__title'>{`Termin (ID:${schedule.scheduleId})`}</h1>
          <h1 className='user-container__user-status modal__title'>{`Dla: "${product.name} (ID:${product.productId})"`}</h1>
        </>
      )}

      {/*//@ Schedule main details */}
      {!isFillingTheForm ? (
        <>
          <div className='user-container__main-details modal-checklist'>
            <DetailsSchedule
              data={schedule}
              placement={'scheduleView'}
              isAdminPanel={isAdminPanel}
            />
          </div>
          {/*//@ Product main details */}
          <div className='user-container__side-details modal-checklist'>
            <DetailsProduct
              data={product}
              placement={'scheduleView'}
              userAccessed={userAccessed}
            />
          </div>
        </>
      ) : (
        <ViewScheduleNewCustomerForm onSave={handleFormSave} />
      )}

      {/*//@ Product stats */}
      {!userAccessed && isAdminPanel && (
        <>
          <div className='user-container__main-details modal-checklist'>
            <DetailsScheduleStats
              data={product}
              scheduleStats={scheduleStats}
            />
          </div>

          {/*//@ all payments if not event/camp? */}

          <div className='user-container__main-details  schedules modal-checklist'>
            <DetailsTableAttendance
              stats={scheduleStats}
              type={product.type}
              isAdminPage={isAdminPanel}
            />
          </div>
          <div className='user-container__main-details  schedules modal-checklist'>
            <DetailsProductPayments
              stats={scheduleStats}
              type={product.type}
              isAdminPage={isAdminPanel}
            />
          </div>

          {/*//@ Feedback */}

          <div className='user-container__main-details  schedules modal-checklist'>
            <DetailsProductReviews stats={scheduleStats} />
          </div>
        </>
      )}

      {shouldShowFeedback ? feedbackBox : shouldShowBookBtn ? paymentBtn : null}

      {shouldShowCancelBtn && (
        <button
          onClick={handleCancellation}
          className='book modal__btn modal__btn--cancel'
        >
          <span className='material-symbols-rounded nav__icon'>
            sentiment_dissatisfied
          </span>
          Daj znać, że nie przyjdziesz...
        </button>
      )}
    </>
  );
}

export default ViewSchedule;
