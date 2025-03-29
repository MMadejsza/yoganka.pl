import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { useInput } from '../../hooks/useInput.js';
import { fetchData, queryClient } from '../../utils/http.js';
import * as val from '../../utils/validation.js';
import InputLogin from '../login/InputLogin.jsx';
import FeedbackBox from './FeedbackBox.jsx';

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
    a['Imię Nazwisko'].localeCompare(b['Imię Nazwisko'])
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
  } = useInput(1, val.paymentMethodValidations);

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
    actionTitle: '',
  };

  // Extract values only
  const { formType, title, actionTitle } = formLabels;
  const isSubmitDisabled = areErrors;

  const form = customersList && (
    <form onSubmit={handleSubmit} className={`table-form`}>
      <h1 className='form__title'>{title}</h1>
      {/* names are for FormData and id for labels */}
      <div className='table-form__content'>
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
        <div className='action-btns'>
          <button
            type='reset'
            onClick={handleReset}
            className='form-switch-btn modal__btn--secondary  table-form-btn'
          >
            <span className='material-symbols-rounded nav__icon'>
              restart_alt
            </span>
          </button>
          <button
            type='submit'
            className={`form-action-btn table-form-btn table-form-btn--submit`}
          >
            <span className='material-symbols-rounded nav__icon'>
              check
            </span>{' '}
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <>
      <div className='user-container modal__summary'>
        {form}
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
      </div>
    </>
  );
}

export default NewAttendanceForm;
