import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../hooks/useFeedback.js';
import GenericListTagLi from '../../common/GenericListTagLi.jsx';
import FeedbackBox from '../FeedbackBox.jsx';
import NewCustomerFormForUser from './add-forms/NewCustomerFormForUser.jsx';
import DetailsListPassDefinition from './lists/DetailsListPassDefinition.jsx';
import TableCustomerPasses from './tables/TableCustomerPasses.jsx';
import TableProductPayments from './tables/TableProductPayments.jsx';

function ViewPassDefinition({
  data,
  role,
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

  const { feedback, updateFeedback } = useFeedback({
    getRedirectTarget: result => (result.confirmation === 1 ? '/konto' : null),
    onClose: onClose,
  });

  // console.log(`status.role`, status.role);
  const [newCustomerDetails, setNewCustomerDetails] = useState({
    isFirstTimeBuyer: status.role == 'USER',
  });
  // console.log(`newCustomerDetails: `, newCustomerDetails);
  const [isFillingTheForm, setIsFillingTheForm] = useState(false);

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
      });
      updateFeedback(res);
    } catch (err) {
      updateFeedback(err);
    }
  };

  const shouldShowFeedback =
    feedback.status === 1 || feedback.status === 0 || feedback.status === -1;

  const shouldShowBookBtn =
    !paymentOps?.purchase?.isError && !isFillingTheForm && !isAdminPanel;
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
      <span className='material-symbols-rounded nav__icon'>
        {shouldDisableBookBtn
          ? 'block'
          : newCustomerDetails.isFirstTimeBuyer
            ? 'edit'
            : 'shopping_bag'}
      </span>
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
      <span className='material-symbols-rounded nav__icon'>login</span>
      Zaloguj się w celu zakupu
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
      <h1 className='modal__title modal__title--view'>{`${passDefinition.name}`}</h1>
      {isAdminViewEligible && (
        <>
          <h2 className='modal__title modal__title--status'>{`Karnet (Id:${passDefinition.passDefId})`}</h2>
          <h3 className='modal__title modal__title--status'>
            <GenericListTagLi
              objectPair={{
                label: 'Aktywny: ',
                content: (
                  <span
                    className={`material-symbols-rounded nav__icon nav__icon--in-title`}
                  >
                    {passDefinition.status ? 'check' : 'close'}
                  </span>
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
      </div>

      {isAdminViewEligible && (
        <>
          {/* //@ CustomerPasses table for this definition */}
          <TableCustomerPasses
            customerPasses={passDefinition.customerPasses}
            keys={passDefinition.customerPassesKeys}
            isAdminPage={true}
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

      <footer className='modal__user-action'>
        {shouldShowFeedback
          ? feedbackBox
          : shouldShowBookBtn
            ? paymentBtn
            : null}
      </footer>
    </>
  );
}

export default ViewPassDefinition;
