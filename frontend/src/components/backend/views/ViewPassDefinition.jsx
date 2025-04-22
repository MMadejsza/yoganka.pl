import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SymbolOrIcon from '../../../components/common/SymbolOrIcon.jsx';
import { useAuthStatus } from '../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../hooks/useFeedback.js';
import { useInput } from '../../../hooks/useInput.js';
import Input from '../../backend/Input.jsx';
import GenericListTagLi from '../../common/GenericListTagLi.jsx';
import FeedbackBox from '../FeedbackBox.jsx';
import NewCustomerFormForUser from './add-forms/NewCustomerFormForUser.jsx';
import DetailsListPassDefinition from './lists/DetailsListPassDefinition.jsx';
import TableCustomerPasses from './tables/TableCustomerPasses.jsx';
import TableProductPayments from './tables/TableProductPayments.jsx';

function ViewPassDefinition({
  data,
  onClose,
  isAdminPanel,
  isPassPurchaseView,
  paymentOps,
}) {
  console.log('ViewPassDefinition data', data);
  const { passDefinition } = data;
  console.log('isAdminPanel', isAdminPanel);
  const navigate = useNavigate();

  const { data: status } = useAuthStatus();
  const { isLoggedIn } = status;
  console.log(`status`, status);
  const isAdminViewEligible = status.role === 'ADMIN' && isAdminPanel;
  console.log('isAdminViewEligible', isAdminViewEligible);

  const { feedback, updateFeedback, resetFeedback } = useFeedback({
    getRedirectTarget: result =>
      result.confirmation === 1 ? '/grafik/karnety' : null,
    onClose: onClose,
  });

  // console.log(`status.role`, status.role);
  const [newCustomerDetails, setNewCustomerDetails] = useState({
    isFirstTimeBuyer: status.role == 'USER',
  });
  // console.log(`newCustomerDetails: `, newCustomerDetails);
  const [isFillingTheForm, setIsFillingTheForm] = useState(false);

  const customerTheSamePasses = status.user?.Customer?.CustomerPasses?.filter(
    pass => pass.PassDefinition.passDefId == passDefinition.passDefId
  );
  let newPassSuggestedDate;
  // chose the very next day after the expiration date of the same pass
  if (customerTheSamePasses && customerTheSamePasses.length > 0) {
    const latestExpiryDate = customerTheSamePasses.sort(
      (a, b) => new Date(b.validUntil) - new Date(a.validUntil)
    )[0].validUntil;

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
  } = useInput(newPassSuggestedDate || new Date().toISOString().split('T')[0]);

  const handleFormSave = details => {
    setNewCustomerDetails(details);
    setIsFillingTheForm(false);
  };

  const handlePayment = async () => {
    try {
      const res = await paymentOps.purchase.onBuy({
        customerDetails: newCustomerDetails || null,
        passDefId: passDefinition.passDefId,
        passDefinition,
        amountPaid: passDefinition.price,
        paymentMethod: 'Credit Card',
        paymentStatus: 'Completed',
        validFrom: dateValue,
      });
      updateFeedback(res);
      if (res.confirmation == 1) handleDateReset();
    } catch (err) {
      updateFeedback(err);
    }
  };

  const shouldShowFeedback =
    feedback.status === 1 || feedback.status === 0 || feedback.status === -1;

  const shouldShowBookBtn =
    // !paymentOps?.purchase?.isError &&
    !isFillingTheForm && !isAdminPanel && !dateHasError;
  const shouldDisableBookBtn = isFillingTheForm;

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
      <SymbolOrIcon
        specifier={
          shouldDisableBookBtn
            ? 'block'
            : newCustomerDetails.isFirstTimeBuyer
            ? 'edit'
            : 'shopping_bag'
        }
      />
      {shouldDisableBookBtn
        ? isFillingTheForm
          ? 'Wypełnianie formularza'
          : ''
        : newCustomerDetails.isFirstTimeBuyer
        ? 'Uzupełnij dane osobowe'
        : 'Kupuję'}
    </button>
  ) : (
    // dynamic redirection back to schedule when logged in, in Login form useFeedback
    <button
      onClick={() =>
        navigate(`/login?redirect=/grafik/karnety${passDefinition.passDefId}`)
      }
      className='book modal__btn'
    >
      <SymbolOrIcon specifier={'login'} />
      Zaloguj się w celu zakupu
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

  const dateInput = (
    <Input
      embedded={false}
      formType={'login'}
      type='date'
      id='date'
      name='date'
      label='Data rozpoczęcia (najszybsza możliwa wybrana domyślnie)'
      value={dateValue}
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
  );

  return (
    <>
      <h1 className='modal__title modal__title--view'>{`${passDefinition.name}`}</h1>
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
          {shouldShowFeedback && feedbackBox}
          {shouldShowBookBtn && dateInput}
          {shouldShowBookBtn && paymentBtn}
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
