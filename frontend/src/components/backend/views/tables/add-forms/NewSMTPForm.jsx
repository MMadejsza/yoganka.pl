import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useAuthStatus } from '../../../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../../../hooks/useFeedback.js';
import { useInput } from '../../../../../hooks/useInput.js';
import { queryClient } from '../../../../../utils/http.js';
import FeedbackBox from '../../../FeedbackBox.jsx';
import Input from '../../../Input.jsx';
import WrapperForm from '../../../WrapperForm.jsx';

function NewSMTPForm() {
  const params = useParams();
  const { data: status } = useAuthStatus();
  const { feedback, updateFeedback, resetFeedback } = useFeedback();

  const {
    value: emailValue,
    handleChange: handleEmailChange,
    handleFocus: handleEmailFocus,
    handleBlur: handleEmailBlur,
    handleReset: handleEmailReset,
    didEdit: emailDidEdit,
    isFocused: emailIsFocused,
    validationResults: emailValidationResults,
    hasError: emailHasError,
  } = useInput('');

  const hostInput = useInput('ssl0.ovh.net');
  const portInput = useInput(587);

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

  const {
    value: passwordValue,
    handleChange: handlePasswordChange,
    handleFocus: handlePasswordFocus,
    handleBlur: handlePasswordBlur,
    handleReset: handlePasswordReset,
    didEdit: passwordDidEdit,
    isFocused: passwordIsFocused,
    validationResults: passwordValidationResults,
    hasError: passwordHasError,
  } = useInput('');

  // Reset all te inputs
  const handleReset = () => {
    resetFeedback();

    hostInput.handleReset();
    portInput.handleReset();
    handleEmailReset();
    handlePasswordReset();
  };

  // Submit handling
  const areErrors =
    passwordHasError ||
    emailHasError ||
    hostInput.hasError ||
    portInput.hasError;
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

  const form = (
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
        type='text'
        id='host'
        name='host'
        label='Host:*'
        value={hostInput.value}
        onFocus={hostInput.handleFocus}
        onBlur={hostInput.handleBlur}
        onChange={hostInput.handleChange}
        validationResults={hostInput.validationResults}
        didEdit={hostInput.didEdit}
        required
        classModifier={'table-form'}
        isFocused={hostInput.isFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='number'
        id='port'
        name='port'
        label='Port:*'
        value={portInput.value}
        onFocus={portInput.handleFocus}
        onBlur={portInput.handleBlur}
        onChange={portInput.handleChange}
        validationResults={portInput.validationResults}
        didEdit={portInput.didEdit}
        required
        classModifier={'table-form'}
        isFocused={portInput.isFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='email'
        id='email'
        name='email'
        label='Email:*'
        value={emailValue}
        onFocus={handleEmailFocus}
        onBlur={handleEmailBlur}
        onChange={handleEmailChange}
        validationResults={emailValidationResults}
        didEdit={emailDidEdit}
        required
        classModifier={'table-form'}
        isFocused={emailIsFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='password'
        id='password'
        name='password'
        label='Hasło:*'
        value={passwordValue}
        onFocus={handlePasswordFocus}
        onBlur={handlePasswordBlur}
        onChange={handlePasswordChange}
        required
        validationResults={passwordValidationResults}
        didEdit={passwordDidEdit}
        classModifier={'table-form'}
        isFocused={passwordIsFocused}
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

export default NewSMTPForm;
