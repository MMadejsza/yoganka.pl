import { useMutation, useQuery } from '@tanstack/react-query';
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
import WrapperForm from '../../../common/WrapperForm.jsx';
import FeedbackBox from '../../FeedbackBox.jsx';
import InputLogin from '../../InputLogin.jsx';

function NewPaymentForm() {
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
    data: productsList,
    isError: isProductsError,
    error: productsError,
  } = useQuery({
    // as id for later caching received data to not send the same request again where location.pathname is key
    queryKey: ['data', '/admin-console/show-all-products'],
    // definition of the code sending the actual request- must be returning the promise
    queryFn: () => fetchData('/admin-console/show-all-products'),
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
  } = useInput(1);
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

  const pickedProductID = productValue || null;
  const pickedCustomerID = customerValue || null;
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
    enabled: !!pickedProductID && !!pickedCustomerID,
  });

  const customersOptionsList = customersList?.content?.sort((a, b) =>
    a.customerFullName.localeCompare(b.customerFullName)
  );
  console.log('customersOptionsList: ', customersOptionsList);
  const productsOptionsList = productsList?.content?.sort((a, b) =>
    b.type.localeCompare(a.type)
  );
  console.log('productOptionsList: ', productsOptionsList);
  const schedulesOptionsList = schedulesList?.content?.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  console.log('schedulesOptionsList: ', schedulesOptionsList);

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
    handleProductReset();
    handleScheduleReset();
    handleAmountPaidReset();
    handlePaymentMethodReset();
  };

  // Submit handling
  const areErrors =
    amountPaidHasError ||
    paymentMethodHasError ||
    customerHasError ||
    productHasError ||
    scheduleHasError;
  const handleSubmit = async e => {
    e.preventDefault(); // No reloading
    console.log('Submit triggered');

    if (areErrors) {
      return;
    } else if (schedulesList?.length <= 0) {
      // updating feedback
      updateFeedback({
        status: -1,
        message: 'Pole termin nie może być puste.',
        warnings: null,
      });
    }
    console.log('Submit passed errors');

    const fd = new FormData(e.target);
    const formDataObj = Object.fromEntries(fd.entries());

    const selectedProduct = productsOptionsList.find(
      product => product.productId.toString() === formDataObj.productId
    );
    if (selectedProduct) {
      formDataObj.productName = `(ID: ${selectedProduct.productId}) ${selectedProduct.name}`;
      formDataObj.productPrice = selectedProduct.price;
    }

    console.log('sent data:', formDataObj);
    createPayment(formDataObj);
    handleReset();
  };

  // Dynamically set descriptive names when switching from login in to registration
  const formLabels = {
    formType: 'login',
    title: 'Rejestracja manualnej płatności',
    subTitle: `Płatność bezpośrednio za zajęcia automatycznie tworzy i przypisuje rezerwację`,
    note: `Pola mogą wymagać przeklinania w celu odświeżenia.`,
    actionTitle: 'Zatwierdź',
  };

  // Extract values only
  const { formType, title, note, subTitle, actionTitle } = formLabels;

  let isSubmitDisabled = !!areErrors;
  const form = productsList && customersList && (
    <WrapperForm
      title={title}
      subTitle={subTitle}
      note={note}
      onSubmit={handleSubmit}
      onReset={handleReset}
      submitLabel={actionTitle}
      resetLabel='Resetuj'
    >
      {/* names are for FormData and id for labels */}
      <InputLogin
        embedded={true}
        formType={formType}
        type='select'
        options={customersOptionsList.map(customerObj => ({
          key: customerObj.customerId,
          label: `(ID: ${customerObj.customerId}) ${customerObj.customerFullName}`,
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
      <InputLogin
        embedded={true}
        formType={formType}
        type='select'
        options={productsOptionsList.map(productObj => ({
          key: productObj.productId,
          label: `(ID: ${productObj.productId}) ${productObj.name}`,
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
      <InputLogin
        embedded={true}
        formType={formType}
        type='select'
        options={
          schedulesOptionsList?.length > 0
            ? schedulesOptionsList.map(scheduleObj => ({
                key: scheduleObj.scheduleId,
                label: `(ID: ${scheduleObj.scheduleId}) ${getWeekDay(
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
      <InputLogin
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
      <InputLogin
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
    </WrapperForm>
  );

  return (
    <>
      <div className='user-container modal__summary'>
        {form}
        {feedback.status !== undefined && (
          <FeedbackBox
            status={feedback.status}
            isPending={isCreatePaymentPending}
            isError={isCreatePaymentError}
            error={createPaymentError}
            successMsg={feedback.message}
            warnings={feedback.warnings}
            size='small'
          />
        )}
      </div>
    </>
  );
}

export default NewPaymentForm;
