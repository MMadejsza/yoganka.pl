import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStatus } from '../../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../../hooks/useFeedback.js';
import { useInput } from '../../../../hooks/useInput.js';
import { getWeekDay } from '../../../../utils/dateTime.js';
import {
  fetchData,
  mutateOnCreate,
  queryClient,
} from '../../../../utils/http.js';
import * as val from '../../../../utils/validation.js';
import WrapperForm from '../../../backend/WrapperForm.jsx';
import FeedbackBox from '../../FeedbackBox.jsx';
import Input from '../../Input.jsx';

function NewPaymentForm() {
  const debugLogsTurnedOn = false;
  const { feedback, updateFeedback, resetFeedback } = useFeedback();
  const { data: status } = useAuthStatus();

  const {
    data: customersList,
    isError: isCustomersError,
    error: customersError,
  } = useQuery({
    // as id for later caching received data to not send the same request again where location.pathname is key
    queryKey: ['data', '/admin-console/show-all-customers'],
    // definition of the code sending the actual request- must be returning the promise
    queryFn: () => fetchData('/admin-console/show-all-customers'),
    // only when location.pathname is set extra beyond admin panel:
  });

  const {
    value: customerValue,
    handleChange: handleCustomerChange,
    handleFocus: handleCustomerFocus,
    handleBlur: handleCustomerBlur,
    handleReset: handleCustomerReset,
    didEdit: customerDidEdit,
    isFocused: customerIsFocused,
    validationResults: customerValidationResults,
    hasError: customerHasError,
  } = useInput('');

  const {
    value: transactionTypeValue,
    handleChange: handleTransactionTypeChange,
    handleFocus: handleTransactionTypeFocus,
    handleBlur: handleTransactionTypeBlur,
    handleReset: handleTransactionTypeReset,
    didEdit: transactionTypeDidEdit,
    isFocused: transactionTypeIsFocused,
    validationResults: transactionTypeValidationResults,
    hasError: transactionTypeHasError,
  } = useInput('pass');

  const {
    data: productsList,
    isError: isProductsError,
    error: productsError,
  } = useQuery({
    // as id for later caching received data to not send the same request again where location.pathname is key
    queryKey: ['data', '/admin-console/show-all-products'],
    // definition of the code sending the actual request- must be returning the promise
    queryFn: () => fetchData('/admin-console/show-all-products'),
    // only when location.pathname is set extra beyond admin panel:
    enabled: transactionTypeValue === 'classes',
  });

  const {
    value: productValue,
    handleChange: handleProductChange,
    handleFocus: handleProductFocus,
    handleBlur: handleProductBlur,
    handleReset: handleProductReset,
    didEdit: productDidEdit,
    isFocused: productIsFocused,
    validationResults: productValidationResults,
    hasError: productHasError,
  } = useInput('');

  const pickedCustomerID = customerValue || null;
  const pickedProductID = productValue || null;

  const {
    data: schedulesList,
    isPending: isSchedulesListPending,
    isError: isSchedulesError,
    error: schedulesError,
  } = useQuery({
    // as id for later caching received data to not send the same request again where location.pathname is key
    queryKey: [
      'data',
      `/admin-console/show-product-schedules/${pickedProductID}/${pickedCustomerID}`,
    ],
    // definition of the code sending the actual request- must be returning the promise
    queryFn: () =>
      fetchData(
        `/admin-console/show-product-schedules/${pickedProductID}/${pickedCustomerID}`
      ),
    // only when location.pathname is set extra beyond admin panel:
    enabled:
      !!pickedProductID &&
      !!pickedCustomerID &&
      transactionTypeValue === 'classes',
  });

  const {
    mutate: createPayment,
    isPending: isCreatePaymentPending,
    isError: isCreatePaymentError,
    error: createPaymentError,
  } = useMutation({
    mutationFn: formDataObj =>
      mutateOnCreate(status, formDataObj, `/api/admin-console/create-payment`),

    onSuccess: res => {
      queryClient.invalidateQueries(['/admin-console/show-all-payments']);
      // updating feedback
      updateFeedback(res);
    },
    onError: err => {
      // updating feedback
      updateFeedback(err);
    },
  });

  // using custom hook with extracting and reassigning its 'return' for particular inputs and assign validation methods from imported utils. Every inout has its won state now

  const {
    data: passesList,
    isError: isPassesError,
    error: passesError,
  } = useQuery({
    queryKey: ['data', '/admin-console/show-all-passes'],
    queryFn: () => fetchData('/admin-console/show-all-passes'),
    enabled: transactionTypeValue === 'pass',
  });

  // Nowy hook do obsługi wyboru karnetu – używany tylko, gdy wybrano "pass"
  const {
    value: passValue,
    handleChange: handlePassChange,
    handleFocus: handlePassFocus,
    handleBlur: handlePassBlur,
    handleReset: handlePassReset,
    didEdit: passDidEdit,
    isFocused: passIsFocused,
    validationResults: passValidationResults,
    hasError: passHasError,
  } = useInput('');

  const customerTheSamePasses = Array.isArray(
    passesList?.formattedCustomerPasses
  )
    ? passesList.formattedCustomerPasses.filter(
        pass => String(pass.passDefId) === String(passValue)
      )
    : [];
  let newPassSuggestedDate;
  // chose the very next day after the expiration date of the same pass
  if (customerTheSamePasses && customerTheSamePasses.length > 0) {
    const latestExpiryDate = customerTheSamePasses.sort(
      (a, b) => new Date(b.validUntil) - new Date(a.validUntil)
    )[0].validUntil;
    if (debugLogsTurnedOn) console.log(customerTheSamePasses);
    if (debugLogsTurnedOn) console.log(latestExpiryDate);

    const nextDay = new Date(latestExpiryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    newPassSuggestedDate = nextDay.toISOString().split('T')[0];
  }

  const {
    value: StartDateValue,
    handleChange: handleStartDateChange,
    handleFocus: handleStartDateFocus,
    handleBlur: handleStartDateBlur,
    handleReset: handleStartDateReset,
    didEdit: StartDateDidEdit,
    isFocused: StartDateIsFocused,
    validationResults: StartDateValidationResults,
    hasError: StartDateHasError,
  } = useInput(passValue ? newPassSuggestedDate : '');

  useEffect(() => {
    if (passValue && newPassSuggestedDate) {
      handleStartDateChange({
        target: { value: newPassSuggestedDate },
      });
    }
  }, [passValue, newPassSuggestedDate]);
  if (debugLogsTurnedOn)
    console.log('newPassSuggestedDate:', newPassSuggestedDate);
  if (debugLogsTurnedOn) console.log('StartDateValue:', StartDateValue);
  const {
    value: scheduleValue,
    handleChange: handleScheduleChange,
    handleFocus: handleScheduleFocus,
    handleBlur: handleScheduleBlur,
    handleReset: handleScheduleReset,
    didEdit: scheduleDidEdit,
    isFocused: scheduleIsFocused,
    validationResults: scheduleValidationResults,
    hasError: scheduleHasError,
  } = useInput('');
  const {
    value: amountPaidValue,
    handleChange: handleAmountPaidChange,
    handleFocus: handleAmountPaidFocus,
    handleBlur: handleAmountPaidBlur,
    handleReset: handleAmountPaidReset,
    didEdit: amountPaidDidEdit,
    isFocused: amountPaidIsFocused,
    validationResults: amountPaidValidationResults,
    hasError: amountPaidHasError,
  } = useInput('', val.amountPaidValidations);
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
  } = useInput(1);

  // Reset all te inputs
  const handleReset = () => {
    resetFeedback();

    handleCustomerReset();
    handleTransactionTypeReset();
    handleProductReset();
    handleScheduleReset();
    handleAmountPaidReset();
    handlePaymentMethodReset();
    handlePassReset();
    handleStartDateReset();
  };

  // Submit handling
  const areErrors =
    amountPaidHasError ||
    paymentMethodHasError ||
    customerHasError ||
    (transactionTypeValue === 'classes'
      ? productHasError || scheduleHasError
      : passHasError);
  const handleSubmit = async e => {
    e.preventDefault(); // No reloading
    if (debugLogsTurnedOn) console.log('Submit triggered');

    if (areErrors) {
      return;
    }

    if (
      transactionTypeValue === 'classes' &&
      (!schedulesList || schedulesList?.content?.length <= 0)
    ) {
      updateFeedback({
        status: -1,
        message: 'Pole terminu nie może być puste.',
        warnings: null,
      });
      return;
    }
    if (
      transactionTypeValue === 'pass' &&
      (!passesList || passesList?.content?.length <= 0)
    ) {
      updateFeedback({
        status: -1,
        message: 'Brak dostępnych karnetów.',
        warnings: null,
      });
      return;
    }
    if (debugLogsTurnedOn) console.log('Submit passed errors');

    const fd = new FormData(e.target);
    const formDataObj = Object.fromEntries(fd.entries());
    formDataObj.transactionType = transactionTypeValue;

    if (transactionTypeValue === 'classes') {
      const selectedProduct = productsList?.content?.find(
        product => product.productId.toString() === formDataObj.productId
      );
      if (selectedProduct) {
        formDataObj.productName = `(Id: ${selectedProduct.productId}) ${selectedProduct.name}`;
        formDataObj.productPrice = selectedProduct.price;
      }
    } else if (transactionTypeValue === 'pass') {
      const selectedPass = passesList?.content?.find(
        pass => pass.passDefId.toString() === formDataObj.passDefId
      );
      if (selectedPass) {
        if (debugLogsTurnedOn) console.log('selectedPass', selectedPass);
        formDataObj.passName = `${selectedPass.name} (Id: ${selectedPass.passDefId}) na ~${selectedPass.validityDays}`;
        formDataObj.passPrice = selectedPass.price;
      }
    }

    if (debugLogsTurnedOn) console.log('sent data:', formDataObj);
    createPayment(formDataObj);
    if (feedback.confirmation == 1) handleReset();
  };

  // Dynamically set descriptive names when switching from login in to registration
  const formLabels = {
    formType: 'login',
    title: 'Rejestracja manualnej płatności',
    subTitle: `Płatność bezpośrednio za zajęcia, automatycznie tworzy i przypisuje rezerwację`,
    note: `Pola mogą wymagać przeklikania w celu odświeżenia.`,
    actionTitle: 'Zatwierdź',
  };

  // Extract values only
  const { formType, title, note, subTitle, actionTitle } = formLabels;

  const customersOptionsList =
    customersList?.content?.sort((a, b) =>
      a.customerFullName.localeCompare(b.customerFullName)
    ) || [];
  const productsOptionsList =
    productsList?.content?.sort((a, b) => b.type.localeCompare(a.type)) || [];
  const schedulesOptionsList =
    schedulesList?.content?.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    ) || [];
  const passesOptionsList =
    passesList?.content?.sort((a, b) => a.name.localeCompare(b.name)) || [];

  const form = customersList && (
    <WrapperForm
      title={''}
      subTitle={subTitle}
      note={note}
      onSubmit={handleSubmit}
      onReset={handleReset}
      submitLabel={actionTitle}
      resetLabel='Resetuj'
    >
      {/* names are for FormData and id for labels */}
      <Input
        embedded={true}
        formType={formType}
        type='select'
        options={customersOptionsList.map(customerObj => ({
          key: customerObj.customerId,
          label: `(Id: ${customerObj.customerId}) ${customerObj.customerFullName}`,
          value: customerObj.customerId,
        }))}
        id='customer'
        name='customerId'
        label='Uczestnik:*'
        value={customerValue}
        onFocus={handleCustomerFocus}
        onBlur={handleCustomerBlur}
        onChange={handleCustomerChange}
        validationResults={customerValidationResults}
        didEdit={customerDidEdit}
        required
        isFocused={customerIsFocused}
      />

      <Input
        embedded={true}
        formType={formType}
        type='radio'
        id='transactionType' // id as group name (look into input component)
        label='Płatność za:'
        value={transactionTypeValue}
        onChange={handleTransactionTypeChange}
        options={[
          { label: 'Zajęcia', value: 'classes' },
          { label: 'Karnet', value: 'pass' },
        ]}
      />

      {transactionTypeValue === 'classes' ? (
        <>
          <Input
            embedded={true}
            formType={formType}
            type='select'
            options={productsOptionsList?.map(productObj => ({
              key: productObj.productId,
              label: `(Id: ${productObj.productId}) ${productObj.name}`,
              value: productObj.productId,
            }))}
            id='productId'
            name='productId'
            label='Zajęcia:*'
            value={productValue}
            onFocus={handleProductFocus}
            onBlur={handleProductBlur}
            onChange={handleProductChange}
            required
            validationResults={productValidationResults}
            didEdit={productDidEdit}
            isFocused={productIsFocused}
          />

          <Input
            embedded={true}
            formType={formType}
            type='select'
            options={
              schedulesOptionsList?.length > 0
                ? schedulesOptionsList.map(scheduleObj => ({
                    key: scheduleObj.scheduleId,
                    label: `(Id: ${scheduleObj.scheduleId}) ${getWeekDay(
                      scheduleObj.date
                    )} ${scheduleObj.date} ${scheduleObj.startTime}`,
                    value: scheduleObj.scheduleId,
                  }))
                : [
                    {
                      label: 'Uczestnik już rezerwował wszystkie terminy',
                      value: '',
                    },
                  ]
            }
            id='scheduleId'
            name='scheduleId'
            label='Termin:*'
            value={scheduleValue}
            onFocus={handleScheduleFocus}
            onBlur={handleScheduleBlur}
            onChange={handleScheduleChange}
            required
            validationResults={scheduleValidationResults}
            didEdit={scheduleDidEdit}
            isFocused={scheduleIsFocused}
          />
        </>
      ) : (
        <>
          <Input
            embedded={true}
            formType={formType}
            type='select'
            options={
              passesOptionsList?.length > 0
                ? passesOptionsList.map(passObj => ({
                    key: passObj.passDefId,
                    label: `${passObj.name} (Id: ${passObj.passDefId} - na ~${passObj.validityDays}) `,
                    value: passObj.passDefId,
                  }))
                : [
                    {
                      label: 'Brak dostępnych karnetów',
                      value: '',
                    },
                  ]
            }
            id='passDefId'
            name='passDefId'
            label='Karnet:*'
            value={passValue}
            onFocus={handlePassFocus}
            onBlur={handlePassBlur}
            onChange={handlePassChange}
            required
            validationResults={passValidationResults}
            didEdit={passDidEdit}
            isFocused={passIsFocused}
          />
          <Input
            embedded={true}
            formType={formType}
            type='date'
            id='startDate'
            name='passStartDate'
            label='Data rozpoczęcia: *'
            value={StartDateValue}
            onFocus={handleStartDateFocus}
            onBlur={handleStartDateBlur}
            onChange={handleStartDateChange}
            autoComplete='off'
            required
            validationResults={StartDateValidationResults}
            didEdit={StartDateDidEdit}
            isFocused={StartDateIsFocused}
          />
        </>
      )}
      <Input
        embedded={true}
        formType={formType}
        type='decimal'
        id='amountPaid'
        name='amountPaid'
        label='Zapłacono:*'
        placeholder='zł'
        value={amountPaidValue}
        onFocus={handleAmountPaidFocus}
        onBlur={handleAmountPaidBlur}
        onChange={handleAmountPaidChange}
        required
        validationResults={amountPaidValidationResults}
        didEdit={amountPaidDidEdit}
        isFocused={amountPaidIsFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='select'
        options={[
          { label: 'Gotówka', value: 1 },
          { label: 'BLIK', value: 2 },
          { label: 'Przelew', value: 3 },
        ]}
        id='paymentMethod'
        name='paymentMethod'
        label='Metoda płatności:*'
        value={paymentMethodValue}
        onFocus={handlePaymentMethodFocus}
        onBlur={handlePaymentMethodBlur}
        onChange={handlePaymentMethodChange}
        required
        validationResults={paymentMethodValidationResults}
        didEdit={paymentMethodDidEdit}
        isFocused={paymentMethodIsFocused}
      />

      {feedback.status !== undefined && (
        <FeedbackBox
          onCloseFeedback={resetFeedback}
          status={feedback.status}
          isPending={isCreatePaymentPending}
          isError={isCreatePaymentError}
          error={createPaymentError}
          successMsg={feedback.message}
          warnings={feedback.warnings}
          size='small'
        />
      )}
    </WrapperForm>
  );

  return (
    <>
      <h1 className='modal__title modal__title--view'>{title}</h1>
      {form}
    </>
  );
}

export default NewPaymentForm;
