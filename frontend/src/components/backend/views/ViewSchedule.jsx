import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pickTheBestPassForSchedule } from '../../../../../backend/utils/controllersUtils.js';
import { useAuthStatus } from '../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../hooks/useFeedback.js';
import { useInput } from '../../../hooks/useInput.js';
import { mutateOnEdit, queryClient } from '../../../utils/http.js';
import { statsCalculatorForSchedule } from '../../../utils/statistics/statsCalculatorForSchedule.js';
import { hasValidPassFn } from '../../../utils/userCustomerUtils.js';
import Input from '../../backend/Input.jsx';
import FeedbackBox from '../FeedbackBox.jsx';
import NewCustomerFormForUser from './add-forms/NewCustomerFormForUser.jsx';
import DetailsListProduct from './lists/DetailsListProduct.jsx';
import DetailsListSchedule from './lists/DetailsListSchedule.jsx';
import DetailsListScheduleStats from './lists/DetailsListScheduleStats.jsx';
import TableAttendance from './tables/TableAttendance.jsx';
import TableProductPayments from './tables/TableProductPayments.jsx';
import TableProductReviews from './tables/TableProductReviews.jsx';

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
  const hasValidPass = hasValidPassFn(status, schedule);
  // console.log(`ViewSchedule hasValidPass`, hasValidPass);

  const { feedback, updateFeedback, resetFeedback } = useFeedback({
    getRedirectTarget: result =>
      result.confirmation === 1
        ? `${userAccountPage ? '/konto' : '/grafik'}`
        : null,
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
  const [bookingCancelled, setBookingCancelled] = useState(false);

  const { isLoggedIn } = status;
  const userAccessed = status.role != 'ADMIN';
  let scheduleStats = null;
  if (!userAccessed && isAdminPanel)
    scheduleStats = statsCalculatorForSchedule(product, schedule);

  const handleCancellation = () => {
    cancel();
    setBookingCancelled(true);
  };

  const paymentSelectOptions = [
    { label: 'Płatność bezpośrednia (bramka płatnicza)', value: 'gateway' },
  ];
  const bestPasses =
    pickTheBestPassForSchedule(status.user?.Customer?.CustomerPasses, schedule)
      ?.allSorted || [];
  const bestPassesFormatted = bestPasses?.map(p => {
    const fDate = p.validUntil ? p.validUntil.slice(0, 10) : '';
    const fTypes = p.PassDefinition.allowedProductTypes
      ? JSON.parse(p.PassDefinition.allowedProductTypes).join(', ')
      : '';
    const expiryDate = fDate ? `Do: ${fDate},` : '';
    const usesLeft = p.usesLeft ? `Pozostałe wejścia: ${p.usesLeft},` : '';
    const types = fTypes ? `Na: ${fTypes}` : '';

    return {
      label: `${p.PassDefinition.name} (${expiryDate} ${usesLeft} ${types})`,
      value: p.customerPassId,
    };
  });
  paymentSelectOptions.unshift(...bestPassesFormatted);

  const {
    value: paymentMethodValue,
    handleChange: handlePaymentMethodChange,
    handleFocus: handlePaymentMethodFocus,
    handleBlur: handlePaymentMethodBlur,
    handleReset: handlePaymentMethodReset,
    didEdit: paymentMethodDidEdit,
    isFocused: paymentMethodIsFocused,
    validationResults: paymentMethodValidationResults,
    hasError: paymentMethodHasError,
  } = useInput(paymentSelectOptions[0].value);

  const handleFormSave = details => {
    setNewCustomerDetails(details);
    setIsFillingTheForm(false);
  };

  // Wrapper for paymentOps.onBook, updating feedback
  const handleBooking = async () => {
    try {
      const res = await paymentOps.booking.onBook({
        customerDetails: newCustomerDetails || null,
        scheduleId: schedule.scheduleId,
        product: product.name,
        status: 'Paid',
        amountPaid: product.price,
        amountDue: 0,
        chosenCustomerPassId: paymentMethodValue,
        paymentMethod: 'Credit Card',
        paymentStatus: 'Completed',
      });
      updateFeedback(res);
      if (res.confirmation == 1) handlePaymentMethodReset();
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
    !shouldShowFeedback &&
    !bookingCancelled;

  const shouldShowBookBtn =
    !shouldShowCancelBtn &&
    !isArchived &&
    !schedule.isUserGoing &&
    // !paymentOps?.booking?.isError &&
    !isFillingTheForm &&
    !isAdminPanel &&
    !bookingCancelled;
  const isFull = schedule.full;
  const shouldDisableBookBtn =
    (isFull && shouldShowBookBtn && !isAdminPanel) || isFillingTheForm;

  const paymentBtn = isLoggedIn ? (
    <button
      onClick={
        !shouldDisableBookBtn
          ? newCustomerDetails.isFirstTimeBuyer
            ? () => setIsFillingTheForm(true)
            : handleBooking
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
        : hasValidPass
        ? 'Rezerwuję'
        : 'Kupuję'}
    </button>
  ) : (
    // dynamic redirection back to schedule when logged in, in Login form useFeedback
    <button
      onClick={() => navigate(`/login?redirect=/grafik/${schedule.scheduleId}`)}
      className='book modal__btn'
    >
      <span className='material-symbols-rounded nav__icon'>login</span>
      Zaloguj się w celu rezerwacji
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
        onCloseFeedback={resetFeedback}
      />
    ) : null;

  const passSelect = (
    <Input
      embedded={false}
      formType={'login'}
      type='select'
      options={paymentSelectOptions}
      id='paymentMethod'
      name='paymentMethod'
      label='Metoda płatności (domyślnie najkorzystniejszy karnet)'
      value={paymentMethodValue}
      required
      onFocus={handlePaymentMethodFocus}
      onBlur={handlePaymentMethodBlur}
      onChange={handlePaymentMethodChange}
      validationResults={paymentMethodValidationResults}
      didEdit={paymentMethodDidEdit}
      isFocused={paymentMethodIsFocused}
    />
  );

  return (
    <>
      {userAccessed ? (
        <>
          <h1 className='modal__title modal__title--view'>{`${product.name}`}</h1>
        </>
      ) : (
        <>
          <h1 className='modal__title modal__title--view'>{`Termin (Id:${schedule.scheduleId})`}</h1>
          <h1 className='modal__title modal__title--status'>{`Dla: "${product.name} (Id:${product.productId})"`}</h1>
        </>
      )}

      {/*//@ Schedule main details */}
      <div className='generic-outer-wrapper'>
        {!isFillingTheForm ? (
          <>
            <div className='generic-component-wrapper'>
              <DetailsListSchedule
                data={schedule}
                placement={'scheduleView'}
                isAdminPanel={isAdminPanel}
              />
            </div>

            {/*//@ Product main details */}
            <DetailsListProduct
              data={product}
              placement={'scheduleView'}
              userAccessed={userAccessed}
            />
          </>
        ) : (
          <NewCustomerFormForUser onSave={handleFormSave} />
        )}
        {/*//@ Product stats */}
        {!userAccessed && isAdminPanel && (
          <DetailsListScheduleStats
            data={product}
            scheduleStats={scheduleStats}
          />
        )}
      </div>
      {!userAccessed && isAdminPanel && (
        <>
          {/*//@ all payments if not event/camp? */}
          <TableAttendance
            allBookings={scheduleStats}
            type={product.type}
            status={status}
            isAdminPage={isAdminPanel}
            shouldToggleFrom={true}
          />
          <TableProductPayments
            payments={scheduleStats.totalPayments}
            type={product.type}
            status={status}
            isAdminPage={isAdminPanel}
          />

          {/*//@ Feedback */}
          <TableProductReviews stats={scheduleStats} status={status} />
        </>
      )}

      <footer className='modal__user-action'>
        {shouldShowFeedback && feedbackBox}
        {shouldShowBookBtn &&
          !shouldShowCancelBtn &&
          !schedule.wasUserReserved &&
          passSelect}
        {shouldShowBookBtn && !shouldShowCancelBtn && paymentBtn}
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
      </footer>
    </>
  );
}

export default ViewSchedule;
