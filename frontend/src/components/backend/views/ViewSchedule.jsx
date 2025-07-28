import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import SymbolOrIcon from '../../../components/common/SymbolOrIcon.jsx';
import { useAuthStatus } from '../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../hooks/useFeedback.js';
import { useInput } from '../../../hooks/useInput.js';
import { formatAllowedTypes } from '../../../utils/cardsAndTableUtils.jsx';
import {
  mutateOnCreate,
  mutateOnEdit,
  queryClient,
} from '../../../utils/http.js';
import { statsCalculatorForSchedule } from '../../../utils/statistics/statsCalculatorForSchedule.js';
import {
  hasValidPassFn,
  pickTheBestPassForSchedule,
} from '../../../utils/userCustomerUtils.js';
import Input from '../../backend/Input.jsx';
import FeedbackBox from '../FeedbackBox.jsx';
import StripeForm from '../StripeForm.jsx';
import NewCustomerFormForUser from './add-forms/NewCustomerFormForUser.jsx';
import DetailsListProduct from './lists/DetailsListProduct.jsx';
import DetailsListSchedule from './lists/DetailsListSchedule.jsx';
import DetailsListScheduleStats from './lists/DetailsListScheduleStats.jsx';
import TableAttendance from './tables/TableAttendance.jsx';
import TableProductPayments from './tables/TableProductPayments.jsx';
import TableProductReviews from './tables/TableProductReviews.jsx';

const logsGloballyOn = true;

function ViewSchedule({ data, paymentOps, onClose, isAdminPanel }) {
  const location = useLocation();
  const navigate = useNavigate();
  const userAccountPage = location.pathname.includes('konto');
  const { schedule } = data;
  const { scheduleId } = schedule;
  const { Product: product } = schedule;
  const [isPaying, setIsPaying] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const { data: status } = useAuthStatus();
  const { isLoggedIn } = status;
  const hasValidPass = hasValidPassFn(status, schedule);
  const [newCustomerDetails, setNewCustomerDetails] = useState({
    isFirstTimeBuyer: status.user?.role.toUpperCase() == 'USER',
  });
  const [isFillingTheForm, setIsFillingTheForm] = useState(false);
  const [bookingCancelled, setBookingCancelled] = useState(false);
  const userAccessed = status.user?.role != 'ADMIN';
  let scheduleStats = null;

  if (!userAccessed && isAdminPanel)
    scheduleStats = statsCalculatorForSchedule(product, schedule);
  if (logsGloballyOn) {
    console.log(
      `📝
	    Schedule object from backend:`,
      data
    );
    console.log(`status.user?.role`, status.user?.role);
    console.log(`newCustomerDetails: `, newCustomerDetails);
    console.log(`status`, status);
    // console.log(`ViewSchedule hasValidPass`, hasValidPass);
  }

  const { feedback, updateFeedback, resetFeedback } = useFeedback({
    getRedirectTarget: result =>
      result.confirmation === 1
        ? `${userAccountPage ? '/konto' : '/grafik'}`
        : null,
    onClose: onClose,
  });

  // CLEANUP: kill timer if modal unmounts (like after forward/back or close)
  useEffect(() => {
    if (feedback.status === -1) {
      setClientSecret(''); // delete old secret
      setIsPaying(false); // hide stripe form
    }
  }, [feedback.status]);

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

  const handleCancellation = () => {
    cancel();
    setBookingCancelled(true);
  };

  const paymentSelectOptions = [
    { label: 'Płatność bezpośrednia', value: 'gateway' },
  ];
  const bestPasses =
    pickTheBestPassForSchedule(status.user?.Customer?.CustomerPasses, schedule)
      ?.allSorted || [];
  const bestPassesFormatted = bestPasses?.map(p => {
    const fDate = p.validUntil ? p.validUntil.slice(0, 10) : '';
    const fTypes = p.PassDefinition.allowedProductTypes
      ? formatAllowedTypes(p.PassDefinition.allowedProductTypes)
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

  const tosControl = useInput(false, [
    { rule: v => v === true, message: 'Musisz zaakceptować regulamin' },
  ]);

  const handleFormSave = details => {
    setNewCustomerDetails(details);
    setIsFillingTheForm(false);
  };

  const metadata = useMemo(
    () => ({
      type: 'booking',
      userId: status?.user?.userId,
      scheduleId: schedule.scheduleId,
      chosenCustomerPassId: paymentMethodValue,
      customerDetails: JSON.stringify(newCustomerDetails),
      tosAccepted: tosControl.value,
    }),
    [
      status.user?.userId,
      schedule.scheduleId,
      newCustomerDetails, // or better: list its individual fields
      tosControl.value,
    ]
  );

  const createPaymentIntent = useMutation({
    mutationFn: () =>
      mutateOnCreate(status, { metadata }, `/api/stripe/create-payment-intent`),
    onSuccess: data => {
      setClientSecret(data.clientSecret);
      // dopiero teraz włącz prawdziwy formularz
      setIsPaying(true);
    },
    onError: err => {
      updateFeedback({
        confirmation: -1,
        message:
          err.message || '❌ Coś poszło nie tak. Spróbuj ponownie później.',
      });
      setIsPaying(false);
    },
  });

  const handleReturn = () => {
    setIsPaying(false);
  };

  // Wrapper for paymentOps.onBook, updating feedback
  const handleBooking = async () => {
    // if stripe form is visible:
    if (isPaying) {
      handleReturn();
    }

    if (paymentMethodValue === 'gateway' && !schedule.wasUserReserved) {
      resetFeedback();
      createPaymentIntent.mutate();
      return;
    }

    // Standard booking logic (no Stripe)
    try {
      const res = await paymentOps.booking.onBook({
        customerDetails: newCustomerDetails || null,
        scheduleId: schedule.scheduleId,
        product: product.name,
        status: 1,
        paymentStatus: 1,
        amountPaid: 0,
        amountDue: 0,
        chosenCustomerPassId: paymentMethodValue,
        paymentMethod: `Pass (Nr: ${paymentMethodValue})`,
      });
      updateFeedback(res);
      if (res.confirmation == 1) {
        queryClient.invalidateQueries(['data', '/grafik']);
        handlePaymentMethodReset();
      }
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
    !isFillingTheForm &&
    !isAdminPanel &&
    !bookingCancelled;
  const isFull = schedule.full;
  const shouldDisableBookBtn =
    (isFull && shouldShowBookBtn && !isAdminPanel) || isFillingTheForm;

  const paymentBtn = isLoggedIn ? (
    <button
      onClick={
        !shouldDisableBookBtn || !createPaymentIntent.isLoading
          ? newCustomerDetails.isFirstTimeBuyer
            ? () => setIsFillingTheForm(true)
            : handleBooking
          : null
      }
      className={`book btn ${
        (shouldDisableBookBtn || createPaymentIntent.isLoading) && 'disabled'
      }`}
    >
      <SymbolOrIcon
        specifier={
          shouldDisableBookBtn
            ? 'block'
            : schedule.wasUserReserved
            ? 'restore'
            : newCustomerDetails.isFirstTimeBuyer
            ? 'edit'
            : isPaying
            ? 'cycle'
            : 'shopping_bag'
        }
      />
      {shouldDisableBookBtn
        ? isFillingTheForm
          ? 'Wypełnianie formularza'
          : 'Brak Miejsc'
        : schedule.wasUserReserved
        ? 'Wróć na zajęcia'
        : newCustomerDetails.isFirstTimeBuyer
        ? 'Uzupełnij dane osobowe'
        : !isPaying
        ? hasValidPass && paymentMethodValue != 'gateway'
          ? 'Rezerwuję'
          : 'Kupuję'
        : 'Odśwież'}
    </button>
  ) : (
    // dynamic redirection back to schedule when logged in, in Login form useFeedback
    <button
      onClick={() => navigate(`/login?redirect=/grafik/${schedule.scheduleId}`)}
      className='book btn'
    >
      <SymbolOrIcon specifier={'login'} />
      Zaloguj się
    </button>
  );

  const feedbackBox =
    feedback.status !== undefined ? (
      <FeedbackBox
        onCloseFeedback={resetFeedback}
        warnings={feedback.warnings}
        status={feedback.status}
        successMsg={feedback.message}
        isPending={false}
        error={feedback.status === -1 ? { message: feedback.message } : null}
        size='small'
      />
    ) : null;

  const prePaymentForm = (
    <>
      {paymentSelectOptions.length > 1 && (
        <Input
          embedded={false}
          formType={'login'}
          type='select'
          options={paymentSelectOptions}
          id='paymentMethod'
          name='paymentMethod'
          label='Metoda płatności'
          value={paymentMethodValue}
          required
          onFocus={handlePaymentMethodFocus}
          onBlur={handlePaymentMethodBlur}
          onChange={handlePaymentMethodChange}
          validationResults={paymentMethodValidationResults}
          didEdit={paymentMethodDidEdit}
          isFocused={paymentMethodIsFocused}
          classModifier={'payment-method'}
        />
      )}
      {paymentMethodValue == 'gateway' && (
        <Input
          required
          embedded={true}
          formType={'policy'}
          type='checkbox'
          id='tos'
          name='tos'
          label={
            <>
              Akceptuję{' '}
              <a
                href='/polityka-firmy/regulamin'
                target='_blank'
                rel='noopener noreferrer'
              >
                regulamin
              </a>{' '}
              *
            </>
          }
          value={tosControl.value}
          checked={tosControl.value}
          onFocus={tosControl.handleFocus}
          onBlur={tosControl.handleBlur}
          onChange={tosControl.handleChange}
          validationResults={tosControl.validationResults}
          didEdit={tosControl.didEdit}
          isFocused={tosControl.isFocused}
          classModifier={'tos'}
        />
      )}
    </>
  );

  return (
    <>
      <Helmet>
        <html lang='pl' />
        <title>{`${product.name} – Zajęcia Yoganka`}</title>
        <link
          rel='canonical'
          href={`https://yoganka.pl${window.location.pathname}`}
        />
        <meta
          name='robots'
          content={
            isAdminPanel || window.location.pathname.includes('/konto')
              ? 'noindex, follow'
              : 'index, follow'
          }
        />

        {/* Open Graph */}
        <meta
          property='og:title'
          content={`${product.name} – Zajęcia Yoganka`}
        />
        <meta
          property='og:description'
          content={product.description || `${product.name} – szczegóły zajęć`}
        />
        <meta
          property='og:url'
          content={`https://yoganka.pl${window.location.pathname}`}
        />
        <meta property='og:type' content='event' />
        <meta property='og:image' content='/favicon_io/apple-touch-icon.png' />

        {/* Twitter */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta
          name='twitter:title'
          content={`${product.name} – Zajęcia Yoganka`}
        />
        <meta
          name='twitter:description'
          content={product.description || `${product.name} – szczegóły zajęć`}
        />
        <meta name='twitter:image' content='/favicon_io/apple-touch-icon.png' />
      </Helmet>

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
            shouldToggleFrom={!schedule.full}
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
          feedback.status != 1 &&
          prePaymentForm}
        {shouldShowCancelBtn && (
          <button onClick={handleCancellation} className='book btn btn--cancel'>
            <SymbolOrIcon specifier={'sentiment_dissatisfied'} />
            Rezygnuję...
          </button>
        )}

        {isPaying && !shouldShowFeedback && (
          <StripeForm
            status={status}
            clientSecret={clientSecret}
            onClose={onClose}
            updateFeedback={updateFeedback}
            resetFeedback={resetFeedback}
            type='booking'
            tosControl={tosControl}
          />
        )}
        {shouldShowBookBtn && !shouldShowCancelBtn && paymentBtn}
      </footer>
    </>
  );
}

export default ViewSchedule;
