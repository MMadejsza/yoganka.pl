import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import SymbolOrIcon from '../../../components/common/SymbolOrIcon.jsx';
import { useAuthStatus } from '../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../hooks/useFeedback.js';
import { useInput } from '../../../hooks/useInput.js';
import { mutateOnCreate } from '../../../utils/http.js';
import {
  passStartDateValidations,
  protectWordBreaks,
} from '../../../utils/validation.js';
import Input from '../../backend/Input.jsx';
import GenericListTagLi from '../../common/GenericListTagLi.jsx';
import FeedbackBox from '../FeedbackBox.jsx';
import StripeForm from '../StripeForm.jsx';
import NewCustomerFormForUser from './add-forms/NewCustomerFormForUser.jsx';
import DetailsListPassDefinition from './lists/DetailsListPassDefinition.jsx';
import TableCustomerPasses from './tables/TableCustomerPasses.jsx';
import TableProductPayments from './tables/TableProductPayments.jsx';

const logsGloballyOn = true;

function ViewPassDefinition({
  data,
  onClose,
  isAdminPanel,
  isPassPurchaseView,
}) {
  const { passDefinition } = data;
  const navigate = useNavigate();
  const { data: status } = useAuthStatus();
  const { isLoggedIn } = status;
  const isAdminViewEligible = status.user?.role === 'ADMIN' && isAdminPanel;
  // Double check correctness of the webhook - if everything went ok
  const [clientSecret, setClientSecret] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  if (logsGloballyOn) {
    console.log('ViewPassDefinition data', data);
    console.log('isAdminPanel', isAdminPanel);
    console.log(`status`, status);
    console.log('isAdminViewEligible', isAdminViewEligible);
  }

  const { feedback, updateFeedback, resetFeedback } = useFeedback({
    getRedirectTarget: result => (result.confirmation === 1 ? '/grafik' : null),
    onClose: onClose,
  });

  useEffect(() => {
    if (feedback.status === -1) {
      setClientSecret(''); // delete old secret
      setIsPaying(false); // hide stripe form
    }
  }, [feedback.status]);

  const [newCustomerDetails, setNewCustomerDetails] = useState({
    isFirstTimeBuyer: status.user?.role.toUpperCase() == 'USER',
  });
  const [isFillingTheForm, setIsFillingTheForm] = useState(false);

  if (logsGloballyOn) {
    console.log(`status.user?.role`, status.user?.role);
    console.log(`newCustomerDetails: `, newCustomerDetails);
  }

  const customerTheSamePasses = status.user?.Customer?.CustomerPasses?.filter(
    pass =>
      pass.PassDefinition.passDefId == passDefinition.passDefId &&
      (pass.status == 1 || pass.status == 0) &&
      new Date(pass.validUntil) > new Date()
  );
  let todayIso = new Date().toISOString().split('T')[0];
  let newPassSuggestedDate = todayIso;
  // chose the very next day after the expiration date of the same pass
  if (customerTheSamePasses && customerTheSamePasses.length > 0) {
    const latestSamePass = customerTheSamePasses.sort(
      (a, b) => new Date(b.validUntil) - new Date(a.validUntil)
    )[0];
    const latestExpiryDate = latestSamePass.validUntil;

    const nextDay = new Date(latestExpiryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    newPassSuggestedDate = nextDay.toISOString().split('T')[0];
  }

  const {
    value: dateValue,
    handleChange: handleDateChange,
    handleFocus: handleDateFocus,
    handleBlur: handleDateBlur,
    handleReset: handleDateReset,
    didEdit: dateDidEdit,
    isFocused: dateIsFocused,
    validationResults: dateValidationResults,
    hasError: dateHasError,
  } = useInput(
    newPassSuggestedDate,
    passStartDateValidations(newPassSuggestedDate)
  );
  const tosControl = useInput(false, [
    { rule: v => v === true, message: 'Musisz zaakceptować regulamin' },
  ]);

  const handleFormSave = details => {
    setNewCustomerDetails(details);
    setIsFillingTheForm(false);
  };

  const metadata = useMemo(
    () => ({
      type: 'pass',
      userId: status?.user?.userId,
      passDefId: passDefinition.passDefId,
      validFrom: dateValue,
      customerDetails: JSON.stringify(newCustomerDetails),
      tosAccepted: tosControl.value,
    }),
    [
      status.user?.userId,
      passDefinition.passDefId,
      dateValue,
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
      updateFeedback({ confirmation: -1, message: err.message });
      setIsPaying(false);
    },
  });

  const handleReturn = () => {
    setIsPaying(false);
  };

  const handlePayment = async () => {
    if (isPaying) {
      handleReturn();
    }

    if (logsGloballyOn) console.log('metadata', metadata);
    resetFeedback();
    createPaymentIntent.mutate();
  };

  const shouldShowFeedback =
    feedback.status === 1 || feedback.status === 0 || feedback.status === -1;

  const shouldShowBookBtn = !isFillingTheForm && !isAdminPanel && !dateHasError;
  const shouldDisableBookBtn = isFillingTheForm;

  const paymentBtn = isLoggedIn ? (
    <button
      onClick={
        !shouldDisableBookBtn || !createPaymentIntent.isLoading
          ? newCustomerDetails.isFirstTimeBuyer
            ? () => setIsFillingTheForm(true)
            : handlePayment
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
            : newCustomerDetails.isFirstTimeBuyer
            ? 'edit'
            : isPaying
            ? 'cycle'
            : 'shopping_bag'
        }
        extraClass={'icon--cta'}
      />
      {shouldDisableBookBtn
        ? isFillingTheForm
          ? 'Wypełnianie formularza'
          : ''
        : newCustomerDetails.isFirstTimeBuyer
        ? 'Uzupełnij dane osobowe'
        : !isPaying
        ? 'Kupuję'
        : 'Odśwież'}
    </button>
  ) : (
    // dynamic redirection back to schedule when logged in, in Login form useFeedback
    <button
      onClick={() =>
        navigate(`/login?redirect=/grafik/karnety/${passDefinition.passDefId}`)
      }
      className='book btn'
    >
      <SymbolOrIcon specifier={'login'} extraClass={'icon--cta'} />
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
      <Input
        embedded={false}
        formType={'login'}
        type='date'
        id='date'
        name='date'
        label='Data rozpoczęcia'
        value={dateValue}
        min={newPassSuggestedDate}
        onFocus={handleDateFocus}
        onBlur={handleDateBlur}
        onChange={handleDateChange}
        autoComplete='off'
        required
        validationResults={dateValidationResults}
        didEdit={dateDidEdit}
        classModifier={'table-form'}
        isFocused={dateIsFocused}
      />
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
    </>
  );

  return (
    <>
      <Helmet>
        <html lang='pl' />
        <title>{`${passDefinition.name} – Karnet Yoganka`}</title>
        <link
          rel='canonical'
          href={`https://yoganka.pl${window.location.pathname}`}
        />
        <meta
          name='robots'
          content={
            window.location.pathname.includes('admin') ||
            window.location.pathname.includes('/konto')
              ? 'noindex, follow'
              : 'index, follow'
          }
        />

        {/* Open Graph */}
        <meta
          property='og:title'
          content={`${passDefinition.name} – Karnet Yoganka`}
        />
        <meta
          property='og:description'
          content={
            passDefinition.description ||
            `${passDefinition.name} – szczegóły karnetu`
          }
        />
        <meta
          property='og:url'
          content={`https://yoganka.pl${window.location.pathname}`}
        />
        <meta property='og:type' content='product' />
        <meta property='og:image' content='/favicon_io/apple-touch-icon.png' />

        {/* Twitter */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta
          name='twitter:title'
          content={`${passDefinition.name} – Karnet Yoganka`}
        />
        <meta
          name='twitter:description'
          content={
            passDefinition.description ||
            `${passDefinition.name} – szczegóły karnetu`
          }
        />
        <meta name='twitter:image' content='/favicon_io/apple-touch-icon.png' />
      </Helmet>

      <h1 className='modal__title modal__title--view'>{`${protectWordBreaks(
        passDefinition.name
      )}`}</h1>
      {isAdminViewEligible && (
        <>
          <h2 className='modal__title modal__title--status'>{`Karnet (Id:${passDefinition.passDefId})`}</h2>
          <h3 className='modal__title modal__title--status'>
            <GenericListTagLi
              objectPair={{
                label: 'Aktywny: ',
                content: (
                  <SymbolOrIcon
                    specifier={
                      Number(passDefinition.status) === 1 ? 'check' : 'close'
                    }
                    classModifier={'in-title'}
                  />
                ),
              }}
              classModifier={'in-title'}
            />
          </h3>
        </>
      )}

      {/*//@ Pass Definition details */}
      <div className='generic-component-wrapper'>
        {!isFillingTheForm ? (
          <DetailsListPassDefinition
            passDefinition={passDefinition}
            userAccountPage={!isAdminViewEligible}
            isPassPurchaseView={isPassPurchaseView}
          />
        ) : (
          <NewCustomerFormForUser onSave={handleFormSave} />
        )}
        <footer className='modal__user-action'>
          {!isFillingTheForm &&
            !isAdminPanel &&
            feedback.confirmation != 1 &&
            prePaymentForm}
          {shouldShowFeedback && feedbackBox}

          {isPaying && !shouldShowFeedback && (
            <StripeForm
              status={status}
              clientSecret={clientSecret}
              onClose={onClose}
              updateFeedback={updateFeedback}
              resetFeedback={resetFeedback}
              tosControl={tosControl}
            />
          )}
          <>{shouldShowBookBtn && paymentBtn}</>
        </footer>
      </div>

      {isAdminViewEligible && (
        <>
          {/* //@ CustomerPasses table for this definition */}
          <TableCustomerPasses
            customerPasses={passDefinition.customerPasses}
            // keys={passDefinition.customerPassesKeys}
            shouldShowCustomerName={isAdminPanel}
            isPassDefView={true}
          />

          {/*//@ Payments table for this definition */}
          <TableProductPayments
            payments={passDefinition.payments}
            keys={passDefinition.paymentsKeys}
            type={'passDef'}
            isAdminPage={true}
          />
        </>
      )}
    </>
  );
}

export default ViewPassDefinition;
