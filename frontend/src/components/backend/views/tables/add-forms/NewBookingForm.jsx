import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react'; // to avoid infinite loop with passing [] to useInput
import { useParams } from 'react-router-dom';
import { useAuthStatus } from '../../../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../../../hooks/useFeedback.js';
import { useInput } from '../../../../../hooks/useInput.js';
import { fetchData, queryClient } from '../../../../../utils/http.js';
import WrapperForm from '../../../../backend/WrapperForm.jsx';
import FeedbackBox from '../../../FeedbackBox.jsx';
import Input from '../../../Input.jsx';

function NewBookingForm() {
  const params = useParams();
  const { data: status } = useAuthStatus();
  const { feedback, updateFeedback, resetFeedback } = useFeedback();

  const {
    data: customersList,
    isError: isCustomersError,
    error: customersError,
  } = useQuery({
    // as id for later caching received data to not send the same request again where location.pathname is key
    queryKey: [
      'data',
      `/admin-console/show-all-customers-with-eligible-passes/${params.id}`,
    ],
    // definition of the code sending the actual request- must be returning the promise
    queryFn: () =>
      fetchData(
        `/admin-console/show-all-customers-with-eligible-passes/${params.id}`
      ),
    // only when location.pathname is set extra beyond admin panel:
  });

  console.log('customersList', customersList);
  const customersOptionsList = customersList?.content
    ? customersList.content.sort((a, b) => a.lastName.localeCompare(b.lastName))
    : [];
  const formattedCustomersOptionsList = customersOptionsList?.map(
    customerObj => ({
      key: customerObj.customerId,
      label: `(${customerObj.customerId}) ${customerObj.firstName} ${customerObj.lastName}`,
      value: customerObj.customerId,
    })
  );

  const defaultCustomer = useMemo(
    () => formattedCustomersOptionsList[0],
    [formattedCustomersOptionsList]
  );
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
  } = useInput(defaultCustomer ? defaultCustomer.value : '');

  console.log('customersOptionsList: ', customersOptionsList);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: formData => {
      return fetch(`/api/admin-console/create-booking-with-pass/${params.id}`, {
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

  const customerIdPicked = customerValue;
  const {
    value: customerPassValue,
    handleChange: handleCustomerPassChange,
    handleFocus: handleCustomerPassFocus,
    handleBlur: handleCustomerPassBlur,
    handleReset: handleCustomerPassReset,
    didEdit: customerPassDidEdit,
    isFocused: customerPassIsFocused,
    validationResults: customerPassValidationResults,
    hasError: customerPassHasError,
  } = useInput('');

  const selectedCustomer = customersOptionsList.find(
    cust => cust.customerId == customerIdPicked
  );
  const formattedEligiblePasses =
    selectedCustomer && selectedCustomer.eligiblePasses
      ? selectedCustomer.eligiblePasses.map(elPass => ({
          key: elPass.customerPassId,
          label: `(${elPass.customerPassId}) ${elPass.PassDefinition.name}`,
          value: elPass.customerPassId,
        }))
      : [];

  console.log('formattedEligiblePasses', formattedEligiblePasses);

  // Reset all te inputs
  const handleReset = () => {
    resetFeedback();

    handleCustomerReset();
    handleCustomerPassReset();
  };

  // Submit handling
  const areErrors = customerPassHasError || customerHasError;
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
    if (feedback.confirmation == 1) handleReset();
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
      <Input
        embedded={true}
        formType={formType}
        type='select'
        options={formattedCustomersOptionsList}
        id='customerId'
        name='customerId'
        label='Uczestnik:*'
        value={customerValue}
        onFocus={handleCustomerFocus}
        onBlur={handleCustomerBlur}
        onChange={handleCustomerChange}
        validationResults={customerValidationResults}
        didEdit={customerDidEdit}
        required
        classModifier={'table-form'}
        isFocused={customerIsFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='select'
        options={formattedEligiblePasses}
        id='customerPassId'
        name='customerPassId'
        label='Ważny karnet:*'
        value={customerPassValue}
        onFocus={handleCustomerPassFocus}
        onBlur={handleCustomerPassBlur}
        onChange={handleCustomerPassChange}
        required
        validationResults={customerPassValidationResults}
        didEdit={customerPassDidEdit}
        classModifier={'table-form'}
        isFocused={customerPassIsFocused}
      />
    </WrapperForm>
  );

  return (
    <>
      {feedback.status !== undefined && (
        <FeedbackBox
          onCloseFeedback={resetFeedback}
          status={feedback.status}
          successMsg={feedback.message}
          warnings={feedback.warnings}
          isPending={isPending}
          isError={isError}
          error={error}
          size='small'
        />
      )}
      {form}
    </>
  );
}

export default NewBookingForm;
