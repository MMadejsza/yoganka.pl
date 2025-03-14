import {useState} from 'react';
import {useMutation, useQuery} from '@tanstack/react-query';
import {queryClient, fetchStatus} from '../../utils/http.js';
import {useInput} from '../../hooks/useInput.js';
import InputLogin from '../login/InputLogin.jsx';
import UserFeedbackBox from './FeedbackBox.jsx';
import {
	emailValidations,
	passwordValidations,
	getConfirmedPasswordValidations,
} from '../../utils/validation.js';

function NewUserForm({onClose}) {
	let initialFeedbackConfirmation;
	const [feedbackConfirmation, setFeedbackConfirmation] = useState(initialFeedbackConfirmation);

	const {data: status} = useQuery({
		queryKey: ['authStatus'],
		queryFn: fetchStatus,
	});

	let successMsg;
	const {mutate, isPending, isError, error} = useMutation({
		mutationFn: (formData) => {
			return fetch(`/api/admin-console/create-user`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'CSRF-Token': status.token,
				},
				body: JSON.stringify(formData),
				credentials: 'include', // include cookies
			}).then((response) => {
				return response.json().then((data) => {
					if (!response.ok) {
						// reject with backend data
						return Promise.reject(data);
					}
					return data;
				});
			});
		},
		onSuccess: (res) => {
			queryClient.invalidateQueries(['/admin-console/show-all-users']);
			if (res.confirmation || res.code == 200) {
				successMsg = res.message;
				setFeedbackConfirmation(1);
			} else {
				setFeedbackConfirmation(0);
			}
		},
		onError: (err) => {
			setFeedbackConfirmation(0);
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
		handleEmailReset();
		handlePasswordReset();
		handleConfirmedPasswordReset();
	};

	// Submit handling
	const handleSubmit = async (e) => {
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
		mutate(data);

		handleReset();
	};

	// Dynamically set descriptive names when switching from login in to registration
	const formLabels = {
		formType: 'login',
		title: 'Rejestracja konta',
		actionTitle: 'Zatwierdź',
	};

	// Extract values only
	const {formType, title, actionTitle} = formLabels;

	let form;
	let feedback = feedbackConfirmation !== undefined && (
		<UserFeedbackBox
			status={feedbackConfirmation}
			successMsg={successMsg}
			isPending={isPending}
			isError={isError}
			error={error}
			size='small'
		/>
	);

	form = (
		<form
			// action='/api/login-pass/login'
			method='POST'
			onSubmit={handleSubmit}
			className={`user-container__details-list modal-checklist__list`}>
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
				className='form-switch-btn modal__btn  modal__btn--secondary modal__btn--small'>
				<span className='material-symbols-rounded nav__icon'>restart_alt</span>
				Resetuj
			</button>
			<button
				type='submit'
				className={`form-action-btn modal__btn modal__btn--small`}>
				<span className='material-symbols-rounded nav__icon'>check</span> {actionTitle}
			</button>
		</form>
	);

	return (
		<>
			<section className={formType}>
				{form} {feedback}
			</section>
		</>
	);
}

export default NewUserForm;
