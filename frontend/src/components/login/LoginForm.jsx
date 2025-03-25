import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { useInput } from '../../hooks/useInput.js';
import {
  mutateOnLoginOrSignup,
  mutateOnNewPassword,
  queryClient,
} from '../../utils/http.js';

import FeedbackBox from '../adminConsole/FeedbackBox.jsx';
import InputLogin from './InputLogin.jsx';

import {
  emailValidations,
  getConfirmedPasswordValidations,
  passwordValidations,
} from '../../utils/validation.js';

function LoginFrom() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [firstTime, setFirstTime] = useState(false); // state to switch between registration and login in term of labels and http request method
  const [resetPassword, setResetPassword] = useState(false);

  const handleClose = () => {
    if (firstTime) {
      setFirstTime(false);
    }
  };

  // passing a function to determine redirect target based on the result in the hook (updateFEedback(result)).
  const { feedback, updateFeedback, resetFeedback } = useFeedback({
    getRedirectTarget: result => {
      // if success:
      if (result.confirmation === 1) {
        if (
          result.type === 'signup' &&
          (result.code === 303 || result.code === 200)
        ) {
          setFirstTime(!firstTime);
          return ''; // no redirect - the same url
        }
        if (result.type === 'login') {
          if (!location.pathname.includes('login/')) return -1;
          return '/'; // after login go back
        }
      }
      // if error
      return null;
    },
    onClose: handleClose,
  });

  // check if eventually given in URL token is valid
  const {
    data: tokenValidity,
    isLoading: isTokenLoading,
    isError: isTokenError,
    error: tokenError,
  } = useQuery({
    queryKey: ['editPasswordToken', params.token],
    queryFn: async () => {
      const res = await fetch(
        `/api/login-pass/password-token/${params.token}`,
        {
          credentials: 'include',
        }
      );
      const data = await res.json();
      console.log('Response in queryFn:', res.status, data);
      if (!res.ok || data.confirmation === -1) {
        updateFeedback(data);
        throw data;
      }
      return data;
    },
    enabled: !!params.token,
    retry: false,
    staleTime: 0,
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ formData, modifier }) =>
      mutateOnLoginOrSignup(status, formData, `/api/login-pass/${modifier}`),

    onSuccess: res => {
      queryClient.invalidateQueries(['authStatus']);
      updateFeedback(res);
      if (res.type == 'new-password') navigate('/login');
    },
    onError: err => {
      updateFeedback(err);
    },
  });

  const {
    mutate: setNewPassword,
    isPending: isNewPasswordPending,
    isError: isNewPasswordError,
    error: newPasswordError,
  } = useMutation({
    mutationFn: ({ formData }) =>
      mutateOnNewPassword(
        status,
        formData,
        `/api/login-pass/new-password/${params.token}`
      ),

    onSuccess: res => {
      queryClient.invalidateQueries(['authStatus']);
      updateFeedback(res);
      navigate('/login');
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

  const { data: status, isLoading: isStatusLoading } = useAuthStatus();
  if (isStatusLoading || !status?.token) {
    return <p>Ładowanie formularza logowania...</p>;
  }
  if (params.token && isTokenLoading) {
    return <p>Weryfikacja tokenu...</p>;
  }

  // Decide ig http request is Get or Post
  const handleFormSwitch = e => {
    if (e) e.preventDefault(); // No reloading
    resetFeedback();
    setResetPassword(!resetPassword);
    setFirstTime(!firstTime);
  };

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
    if (!status?.token) {
      console.warn(
        'Błąd autentykcji sesji. Przeładuj stronę i spróbuj ponownie.'
      );
      return;
    }
    console.log('Submit triggered');
    resetFeedback();

    if (resetPassword) {
      if (emailHasError) return;
    } else {
      if (
        (!params.token && emailHasError) ||
        passwordHasError ||
        ((firstTime || params.token) && confirmedPasswordHasError)
      ) {
        return;
      }
    }
    console.log('Submit passed errors');

    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());

    data.date = new Date().toISOString();
    console.log('sent data:', data);

    if (params.token) {
      // handleFormSwitch(e);
      data.userID = tokenValidity.userID;
      setNewPassword({ formData: data });
    } else if (resetPassword) {
      handleFormSwitch(e);
      mutate({ formData: data, modifier: 'reset' });
    } else if (firstTime) {
      mutate({ formData: data, modifier: 'signup' });
    } else {
      mutate({ formData: data, modifier: 'login' });
    }

    handleReset();
  };

  // Dynamically set descriptive names when switching from login in to registration or reset password
  const formLabels = {
    formType: 'login',
    title: 'Logowanie',
    switchTitle: 'Zarejestruj się',
    resetPassTitle: 'Resetuj hasło',
    actionTitle: 'Zaloguj się',
  };
  if (firstTime) {
    formLabels.formType = 'register';
    formLabels.title = 'Rejestracja:';
    formLabels.switchTitle = 'Zaloguj się';
    formLabels.resetPassTitle = 'Resetuj hasło';
    formLabels.actionTitle = 'Zarejestruj się';
  }
  if (resetPassword) {
    formLabels.formType = 'register';
    formLabels.title = 'Resetowanie hasła:';
    formLabels.switchTitle = 'Zaloguj się';
    formLabels.resetPassTitle = 'Resetuj hasło';
    formLabels.actionTitle = 'Resetuj hasło';
  }
  if (params.token) {
    formLabels.formType = 'register';
    formLabels.title = 'Nowe hasło:';
    formLabels.switchTitle = 'Zaloguj się';
    formLabels.resetPassTitle = 'Resetuj hasło';
    formLabels.actionTitle = 'Zatwierdź';
  }
  // Extract values only
  const { formType, title, switchTitle, actionTitle, resetPassTitle } =
    formLabels;

  let content;
  let userIsEditing =
    confirmedPasswordIsFocused ||
    emailIsFocused ||
    passwordIsFocused ||
    confirmedPasswordDidEdit ||
    emailDidEdit ||
    passwordDidEdit;

  console.log('feedback:', feedback);
  console.log('userIsEditing:', userIsEditing);
  if (isPending || isNewPasswordPending) {
    content = 'Wysyłanie...';
  } else
    content = (
      <section className={formType}>
        <form onSubmit={handleSubmit} className={`${formType}-form`}>
          <h1 className='form__title'>{title}</h1>
          {/* names are for FormData and id for labels */}
          {!params.token && (
            <InputLogin
              formType={formType}
              type='email'
              id='email'
              name='email'
              label='Email'
              value={emailValue}
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
              onChange={handleEmailChange}
              placeholder={`${firstTime && !resetPassword ? '(Wyślemy link aktywacyjny)' : ''}`}
              autoComplete='email'
              required
              validationResults={emailValidationResults}
              didEdit={emailDidEdit}
              isFocused={emailIsFocused}
              isLogin={!firstTime && !params.token}
            />
          )}

          {!resetPassword && (
            <>
              <InputLogin
                formType={formType}
                type='password'
                id='password'
                name='password'
                label='Hasło'
                value={passwordValue}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                onChange={handlePasswordChange}
                autoComplete='current-password'
                required
                validationResults={passwordValidationResults}
                didEdit={passwordDidEdit}
                isFocused={passwordIsFocused}
                isLogin={!firstTime && !params.token}
              />

              {(firstTime || params.token) && (
                <InputLogin
                  formType={formType}
                  type='password'
                  id='confirmedPassword'
                  name='confirmedPassword'
                  label='Powtórz hasło'
                  value={confirmedPasswordValue}
                  onFocus={handleConfirmedPasswordFocus}
                  onBlur={handleConfirmedPasswordBlur}
                  onChange={handleConfirmedPasswordChange}
                  required
                  validationResults={confirmedPasswordValidationResults}
                  didEdit={confirmedPasswordDidEdit}
                  isFocused={confirmedPasswordIsFocused}
                  isLogin={!firstTime && !params.token}
                />
              )}
            </>
          )}

          {!userIsEditing && feedback.status !== undefined && (
            <FeedbackBox
              status={feedback.status}
              isPending={isPending || isNewPasswordPending || isTokenLoading}
              isError={isError || isNewPasswordError || isTokenError}
              error={error || newPasswordError || tokenError}
              successMsg={feedback.message}
              warnings={feedback.warnings}
              size='small'
            />
          )}

          <button
            type='reset'
            onClick={handleReset}
            className='form-switch-btn modal__btn  modal__btn--secondary'
          >
            Resetuj formularz
          </button>
          {!params.token && (
            <>
              {!resetPassword && (
                <button
                  type='button'
                  onClick={handleFormSwitch}
                  className='form-switch-btn modal__btn modal__btn--secondary'
                >
                  {resetPassTitle}
                </button>
              )}
              <button
                type='button'
                className='modal__btn modal__btn--secondary'
                onClick={handleFormSwitch}
              >
                {switchTitle}
              </button>
            </>
          )}

          <button type='submit' className={`form-action-btn modal__btn`}>
            {actionTitle}
          </button>
        </form>
      </section>
    );

  return <>{content}</>;
}

export default LoginFrom;
