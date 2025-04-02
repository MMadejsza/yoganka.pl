import { useMutation } from '@tanstack/react-query';
import { useAuthStatus } from '../../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../../hooks/useFeedback.js';
import { useInput } from '../../../../hooks/useInput.js';
import { mutateOnCreate, queryClient } from '../../../../utils/http.js';
import {
  emailValidations,
  getConfirmedPasswordValidations,
  passwordValidations,
} from '../../../../utils/validation.js';
import FeedbackBox from '../../FeedbackBox.jsx';
import InputLogin from '../../InputLogin.jsx';

function NewUserForm() {
  const { feedback, updateFeedback, resetFeedback } = useFeedback();
  const { data: status } = useAuthStatus();

  const {
    mutate: createUser,
    isPending: isCreateUserPending,
    isError: isCreateUserError,
    error: createUserError,
  } = useMutation({
    mutationFn: formDataObj =>
      mutateOnCreate(status, formDataObj, `/api/admin-console/create-user`),

    onSuccess: res => {
      queryClient.invalidateQueries(['/admin-console/show-all-users']);
      updateFeedback(res);
    },
    onError: err => {
      updateFeedback(err);
    },
  });

  // using custom hook with extracting and reassigning its 'return' for particular inputs and assign validation methods from imported utils. Every inout has its won state now
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
  } = useInput('', emailValidations);

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
  } = useInput('', passwordValidations);

  const {
    value: confirmedPasswordValue,
    handleChange: handleConfirmedPasswordChange,
    handleFocus: handleConfirmedPasswordFocus,
    handleBlur: handleConfirmedPasswordBlur,
    handleReset: handleConfirmedPasswordReset,
    didEdit: confirmedPasswordDidEdit,
    isFocused: confirmedPasswordIsFocused,
    validationResults: confirmedPasswordValidationResults,
    hasError: confirmedPasswordHasError,
  } = useInput('', getConfirmedPasswordValidations(passwordValue));

  // Reset all te inputs
  const handleReset = () => {
    resetFeedback();

    handleEmailReset();
    handlePasswordReset();
    handleConfirmedPasswordReset();
  };

  // Submit handling
  const handleSubmit = async e => {
    e.preventDefault(); // No reloading
    console.log('Submit triggered');

    if (emailHasError || passwordHasError || confirmedPasswordHasError) {
      return;
    }
    console.log('Submit passed errors');

    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    data.date = new Date().toISOString();
    console.log('sent data:', data);
    createUser(data);

    handleReset();
  };

  // Dynamically set descriptive names when switching from login in to registration
  const formLabels = {
    formType: 'login',
    title: 'Rejestracja konta',
    actionTitle: 'Zatwierdź',
  };

  // Extract values only
  const { formType, title, actionTitle } = formLabels;

  const form = (
    <form
      onSubmit={handleSubmit}
      className={`user-container__details-list modal-checklist__list`}
    >
      <h1 className='form__title'>{title}</h1>
      {/* names are for FormData and id for labels */}
      <InputLogin
        embedded={false}
        formType={formType}
        type='email'
        id='email'
        name='email'
        label='Email'
        value={emailValue}
        onFocus={handleEmailFocus}
        onBlur={handleEmailBlur}
        onChange={handleEmailChange}
        autoComplete='off'
        required
        validationResults={emailValidationResults}
        didEdit={emailDidEdit}
        isFocused={emailIsFocused}
      />
      <InputLogin
        embedded={false}
        formType={formType}
        type='password'
        id='password'
        name='password'
        label='Hasło'
        value={passwordValue}
        autoComplete='off'
        onFocus={handlePasswordFocus}
        onBlur={handlePasswordBlur}
        onChange={handlePasswordChange}
        required
        validationResults={passwordValidationResults}
        didEdit={passwordDidEdit}
        isFocused={passwordIsFocused}
      />

      <InputLogin
        embedded={false}
        formType={formType}
        type='password'
        id='confirmedPassword'
        name='confirmedPassword'
        label='Powtórz hasło'
        value={confirmedPasswordValue}
        autoComplete='off'
        onFocus={handleConfirmedPasswordFocus}
        onBlur={handleConfirmedPasswordBlur}
        onChange={handleConfirmedPasswordChange}
        required
        validationResults={confirmedPasswordValidationResults}
        didEdit={confirmedPasswordDidEdit}
        isFocused={confirmedPasswordIsFocused}
      />

      <button
        type='reset'
        onClick={handleReset}
        className='form-switch-btn modal__btn  modal__btn--secondary modal__btn--small'
      >
        <span className='material-symbols-rounded nav__icon'>restart_alt</span>
        Resetuj
      </button>
      <button
        type='submit'
        className={`form-action-btn modal__btn modal__btn--small`}
      >
        <span className='material-symbols-rounded nav__icon'>check</span>{' '}
        {actionTitle}
      </button>
    </form>
  );

  return (
    <>
      <section className={formType}>
        {form}
        {feedback.status !== undefined && (
          <FeedbackBox
            status={feedback.status}
            isPending={isCreateUserPending}
            isError={isCreateUserError}
            error={createUserError}
            successMsg={feedback.message}
            warnings={feedback.warnings}
            size='small'
          />
        )}
      </section>
    </>
  );
}

export default NewUserForm;
