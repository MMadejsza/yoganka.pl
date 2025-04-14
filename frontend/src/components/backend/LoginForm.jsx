import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import * as msgs from '../../../../backend/utils/resMessagesUtils.js';
import { useAuthStatus } from '../../hooks/useAuthStatus.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { useInput } from '../../hooks/useInput.js';
import {
  mutateOnLoginOrSignup,
  mutateOnNewPassword,
  queryClient,
} from '../../utils/http.js';
import {
  emailValidations,
  getConfirmedPasswordValidations,
  passwordValidations,
} from '../../utils/validation.js';
import WrapperForm from '../backend/WrapperForm.jsx';
import FeedbackBox from './FeedbackBox.jsx';
import Input from './Input.jsx';

function LoginFrom({ successMsg, errorMsg }) {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verified = searchParams.get('verified');
  const redirectParam = searchParams.get('redirect');
  const location = useLocation();
  const [firstTime, setFirstTime] = useState(false); // state to switch between registration and login in term of labels and http request method
  const [resetPassword, setResetPassword] = useState(false);
  const [feedbackUpdated, setFeedbackUpdated] = useState(false); //to flag confirmation message after account activation and stop useEffect from constant checking

  // call back to avoid overwriting at each render and infinite loop with confirmation of activating email
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
          setFirstTime(!true);
          // return '/'; // no redirect - the same url
          return null;
        }
        if (result.type === 'login') {
          return redirectParam ? redirectParam : '/'; // after login go back to given site in param or main page
        }
      }
      // if error
      return null;
    },
    onClose: handleClose,
  });

  useEffect(() => {
    console.log(
      'Feedback effect: verified =',
      verified,
      'feedbackUpdated =',
      feedbackUpdated
    );
    if (!feedbackUpdated && (verified === '1' || verified === '0')) {
      if (verified === '1') {
        updateFeedback({
          confirmation: 1,
          message: msgs.emailVerified,
        });
      } else if (verified === '0') {
        updateFeedback({
          confirmation: -1,
          message: msgs.emailNotVerified,
        });
      }
      setFeedbackUpdated(true);
    }
  }, [verified, updateFeedback, feedbackUpdated, navigate]);

  // check if eventually given in URL token is valid
  const {
    data: tokenValidity,
    isLoading: isTokenLoading,
    isError: isTokenError,
    error: tokenError,
  } = useQuery({
    queryKey: [`edit-passwordToken`, params.token],
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

  // Decide if http request is Get or Post
  const switchToSignupOrLogin = () => {
    resetFeedback();
    if (resetPassword) {
      setFirstTime(false);
    } else {
      setFirstTime(prev => !prev);
    }
    setResetPassword(false);
  };

  const switchToResetPassword = () => {
    resetFeedback();
    setFirstTime(false);
    setResetPassword(prev => !prev);
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

    if (params.token) {
      if (confirmedPasswordHasError || passwordHasError) return;
    } else if (resetPassword) {
      if (emailHasError) return;
    } else if (firstTime) {
      if (emailHasError || passwordHasError || confirmedPasswordHasError)
        return;
    } else {
      if (emailHasError || passwordHasError) return;
    }

    console.log('Submit passed errors');

    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());

    data.date = new Date().toISOString();
    console.log('sent data:', data);

    if (params.token) {
      // new password
      data.userId = tokenValidity.userId;
      setNewPassword({ formData: data });
    } else if (resetPassword) {
      // reset password
      mutate({ formData: data, modifier: 'reset' });
    } else if (firstTime) {
      // register
      mutate({ formData: data, modifier: 'signup' });
    } else {
      // login
      mutate({ formData: data, modifier: 'login' });
    }
  };

  // Dynamically set descriptive names when switching from login in to registration or reset password
  const formLabels = {
    formType: 'login-page',
    title: 'Logowanie',
    switchTitle: 'Zarejestruj się',
    resetPassTitle: 'Resetuj hasło',
    actionTitle: 'Zaloguj się',
  };
  if (params.token) {
    formLabels.title = 'Nowe hasło:';
    formLabels.switchTitle = 'Zaloguj się';
    formLabels.resetPassTitle = 'Resetuj hasło';
    formLabels.actionTitle = 'Zatwierdź';
  } else if (resetPassword) {
    formLabels.title = 'Resetowanie hasła:';
    formLabels.switchTitle = 'Zaloguj się';
    formLabels.resetPassTitle = 'Resetuj hasło';
    formLabels.actionTitle = 'Resetuj hasło';
  } else if (firstTime) {
    formLabels.title = 'Rejestracja:';
    formLabels.switchTitle = 'Zaloguj się';
    formLabels.resetPassTitle = 'Resetuj hasło';
    formLabels.actionTitle = 'Zarejestruj się';
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

  const resetPassBtn = !resetPassword && (
    <button
      key={1}
      type='button'
      onClick={switchToResetPassword}
      className='form-switch-btn modal__btn modal__btn--secondary'
    >
      {resetPassTitle}
    </button>
  );

  const extraBtns = !params.token && [
    resetPassBtn,

    <button
      key={2}
      type='button'
      className='modal__btn modal__btn--secondary'
      onClick={switchToSignupOrLogin}
    >
      {switchTitle}
    </button>,
  ];

  if (isPending || isNewPasswordPending) {
    content = 'Wysyłanie...';
  } else
    content = (
      // <section className={formType}>
      <WrapperForm
        title={title}
        onSubmit={handleSubmit}
        onReset={handleReset}
        submitLabel={actionTitle}
        resetLabel='Resetuj formularz'
        classModifier='login-page'
        extraButtons={extraBtns}
      >
        {!params.token && (
          <Input
            embedded={true}
            classModifier={'login-page'}
            formType={formType}
            type='email'
            id='email'
            name='email'
            label='Email'
            value={emailValue}
            onFocus={handleEmailFocus}
            onBlur={handleEmailBlur}
            onChange={handleEmailChange}
            placeholder={`${
              firstTime && !resetPassword ? '(Wyślemy link aktywacyjny)' : ''
            }`}
            autoComplete='email'
            required
            validationResults={emailValidationResults}
            didEdit={emailDidEdit}
            isFocused={emailIsFocused}
            isLogin={!firstTime && !params.token}
          />
        )}

        {(!resetPassword || firstTime) && (
          <>
            <Input
              classModifier={'login-page'}
              embedded={true}
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
              <Input
                classModifier={'login-page'}
                embedded={true}
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

        {feedback.status !== undefined && (
          // {!userIsEditing && feedback.status !== undefined && (
          <FeedbackBox
            onCloseFeedback={resetFeedback}
            status={feedback.status}
            isPending={isPending || isNewPasswordPending || isTokenLoading}
            isError={isError || isNewPasswordError || isTokenError}
            error={errorMsg || error || newPasswordError || tokenError}
            successMsg={successMsg || feedback.message}
            warnings={feedback.warnings}
            size='small'
          />
        )}
      </WrapperForm>
      // </section>
    );

  return (
    <>
      <main className='login-box'>{content}</main>
    </>
  );
}

export default LoginFrom;
