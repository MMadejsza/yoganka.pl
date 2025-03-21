import {useState} from 'react';
// import {useNavigate} from 'react-router-dom';
import {useMutation} from '@tanstack/react-query';
import {queryClient, mutateOnLoginOrSignup} from '../../utils/http.js';
import {useInput} from '../../hooks/useInput.js';
import {useAuthStatus} from '../../hooks/useAuthStatus.js';
import {useFeedback} from '../../hooks/useFeedback.js';
import InputLogin from './InputLogin.jsx';
import UserFeedbackBox from '../adminConsole/FeedbackBox.jsx';

import {
	emailValidations,
	passwordValidations,
	getConfirmedPasswordValidations,
} from '../../utils/validation.js';

function LoginFrom() {
	const [firstTime, setFirstTime] = useState(false); // state to switch between registration and login in term of labels and http request method

	const handleClose = () => {
		if (firstTime) {
			setFirstTime(false);
		}
	};

	// passing a function to determine redirect target based on the result in the hook (updateFEedback(result)).
	const {feedback, updateFeedback, resetFeedback} = useFeedback({
		getRedirectTarget: (result) => {
			// if success:
			if (result.confirmation === 1) {
				if (result.type === 'signup' && (result.code === 303 || result.code === 200)) {
					setFirstTime(!firstTime);
					return ''; // no redirect - the same url
				}
				if (result.type === 'login') {
					return -1; // after login go back
				}
			}
			// if error
			return null;
		},
		onClose: handleClose,
	});

	const {data: status} = useAuthStatus();

	const {mutate, isPending, isError, error} = useMutation({
		mutationFn: ({formData, modifier}) =>
			mutateOnLoginOrSignup(status, formData, `/api/login-pass/${modifier}`),

		onSuccess: (res) => {
			queryClient.invalidateQueries(['authStatus']);

			updateFeedback(res);
		},
		onError: (err) => {
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

	// Decide ig http request is Get or Post
	const handleFormSwitch = (e) => {
		e.preventDefault(); // No reloading
		resetFeedback();
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
	const handleSubmit = async (e) => {
		e.preventDefault(); // No reloading
		// console.log('Submit triggered');
		resetFeedback();

		if (emailHasError || passwordHasError || (firstTime && confirmedPasswordHasError)) {
			return;
		}
		console.log('Submit passed errors');

		const fd = new FormData(e.target);
		const data = Object.fromEntries(fd.entries());
		data.date = new Date().toISOString();
		console.log('sent data:', data);
		if (firstTime) {
			mutate({formData: data, modifier: 'signup'});
		} else {
			mutate({formData: data, modifier: 'login'});
		}
		handleReset();
	};

	// Dynamically set descriptive names when switching from login in to registration
	const formLabels = {
		formType: 'login',
		title: 'Logowanie',
		switchTitle: 'Zarejestruj się',
		actionTitle: 'Zaloguj się',
	};
	if (firstTime) {
		formLabels.formType = 'register';
		formLabels.title = 'Rejestracja:';
		formLabels.switchTitle = 'Zaloguj się';
		formLabels.actionTitle = 'Zarejestruj się';
	}
	// Extract values only
	const {formType, title, switchTitle, actionTitle} = formLabels;

	let content;
	let userIsEditing =
		confirmedPasswordIsFocused ||
		emailIsFocused ||
		passwordIsFocused ||
		confirmedPasswordDidEdit ||
		emailDidEdit ||
		passwordDidEdit;

	if (isPending) {
		content = 'Wysyłanie...';
	} else
		content = (
			<section className={formType}>
				<form
					onSubmit={handleSubmit}
					className={`${formType}-form`}>
					<h1 className='form__title'>{title}</h1>
					{/* names are for FormData and id for labels */}
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
						placeholder={`${firstTime ? '(Wyślemy link aktywacyjny)' : ''}`}
						autoComplete='email'
						required
						validationResults={emailValidationResults}
						didEdit={emailDidEdit}
						isFocused={emailIsFocused}
						isLogin={!firstTime}
					/>
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
						isLogin={!firstTime}
					/>
					{firstTime && (
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
							isLogin={!firstTime}
						/>
					)}

					{!userIsEditing && feedback.status !== undefined && (
						<UserFeedbackBox
							status={feedback.status}
							isPending={isPending}
							isError={isError}
							error={error}
							successMsg={feedback.message}
							warnings={feedback.warnings}
							size='small'
						/>
					)}

					<button
						type='reset'
						onClick={handleReset}
						className='form-switch-btn modal__btn  modal__btn--secondary'>
						Resetuj formularz
					</button>
					<button
						type='button'
						className='modal__btn modal__btn--secondary'
						onClick={handleFormSwitch}>
						{switchTitle}
					</button>
					<button
						type='submit'
						className={`form-action-btn modal__btn`}>
						{actionTitle}
					</button>
				</form>
			</section>
		);

	return <>{content}</>;
}

export default LoginFrom;
