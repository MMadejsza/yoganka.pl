import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useAuthStatus } from '../../../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../../../hooks/useFeedback.js';
import { useInput } from '../../../../../hooks/useInput.js';
import { fetchData, queryClient } from '../../../../../utils/http.js';
import WrapperForm from '../../../../common/WrapperForm.jsx';
import FeedbackBox from '../../../FeedbackBox.jsx';
import InputLogin from '../../../InputLogin.jsx';

function NewAttendanceForm() {
  const params = useParams();
  const { data: status } = useAuthStatus();
  const { feedback, updateFeedback, resetFeedback } = useFeedback();

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
  } = useInput(1);

  const customersOptionsList = customersList?.content?.sort((a, b) =>
    a.customerFullName.localeCompare(b.customerFullName)
  );
  console.log('customersOptionsList: ', customersOptionsList);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: formData => {
      return fetch(`/api/admin-console/add-attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': status.token,
        },
        body: JSON.stringify(formData),
        credentials: 'include', // include cookies
      }).then(response => {
        return response.json().then(data => {
          if (!response.ok) {
            // reject with backend data
            return Promise.reject(data);
          }
          return data;
        });
      });
    },
    onSuccess: res => {
      queryClient.invalidateQueries([
        `/admin-console/show-all-schedules/${params.id}`,
      ]);

      updateFeedback(res);
    },
    onError: err => {
      updateFeedback(err);
    },
  });

  // using custom hook with extracting and reassigning its 'return' for particular inputs and assign validation methods from imported utils. Every inout has its won state now

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
    handlePaymentMethodReset();
  };

  // Submit handling
  const areErrors = paymentMethodHasError || customerHasError;
  const handleSubmit = async e => {
    e.preventDefault(); // No reloading
    console.log('Submit triggered');

    if (areErrors) {
      return;
    }
    console.log('Submit passed errors');

    const fd = new FormData(e.target);
    const formDataObj = Object.fromEntries(fd.entries());

    console.log('sent data:', formDataObj);
    mutate(formDataObj);
    handleReset();
  };

  // Dynamically set descriptive names when switching from login in to registration
  const formLabels = {
    formType: 'login',
    title: '',
  };

  // Extract values only
  const { formType, title } = formLabels;

  const form = customersList && (
    <WrapperForm
      title={title}
      onSubmit={handleSubmit}
      onReset={handleReset}
      isTableRowLike={true}
    >
      {/* 'names' are for FormData and 'id's for labels */}
      <InputLogin
        embedded={true}
        formType={formType}
        type='select'
        options={customersOptionsList.map(customerObj => ({
          key: customerObj.ID,
          label: `(ID: ${customerObj.ID}) ${customerObj['Imię Nazwisko']}`,
          value: customerObj.ID,
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
        options={[
          { label: 'Membership (future)', value: 1 },
          { label: 'Balance (future)', value: 2 },
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
      {feedback.status !== undefined && (
        <FeedbackBox
          status={feedback.status}
          successMsg={feedback.message}
          warnings={feedback.warnings}
          isPending
          isError
          error
          size='small'
        />
      )}
      {form}
    </>
  );
}

export default NewAttendanceForm;
