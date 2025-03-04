import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useMutation, useQuery} from '@tanstack/react-query';
import {queryClient, fetchStatus} from '../../utils/http.js';
import {useInput} from '../../hooks/useInput.js';
import InputLogin from './InputLogin.jsx';
import {
	emailValidations,
	passwordValidations,
	getConfirmedPasswordValidations,
} from '../../utils/validation.js';

function LoginFrom() {
	const navigate = useNavigate();

	const [firstTime, setFirstTime] = useState(false); // state to switch between registration and login in term of labels and http request method

	const {data: status} = useQuery({
		queryKey: ['authStatus'],
		queryFn: fetchStatus,
	});

	const {mutate, isPending, isError, error} = useMutation({
		mutationFn: ({formData, modifier}) => {
			return fetch(`/api/login-pass/${modifier}`, {
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
			queryClient.invalidateQueries(['authStatus']);
			if (res.type == 'signup' && (res.code == 303 || res.code == 200)) {
				navigate('/login');
				setFirstTime(!firstTime);
				console.log(res);
			}
			navigate(-1);
		},
		onError: () => {
			if (error.code == 404) {
				navigate('/login');
				if (error.type != 'login') {
					setFirstTime(!firstTime);
				}
				console.log(error);
			}
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
		setFirstTime(!firstTime);
	};

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
	let errorMsg;
	let userIsEditing =
		confirmedPasswordIsFocused ||
		emailIsFocused ||
		passwordIsFocused ||
		confirmedPasswordDidEdit ||
		emailDidEdit ||
		passwordDidEdit;

	if (isError) {
		errorMsg = <div className='feedback-box feedback-box--error'>{error.message}</div>;
	}
	if (isPending) {
		content = 'Wysyłanie...';
	} else
		content = (
			<section className={formType}>
				<form
					// action='/api/login-pass/login'
					method='POST'
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

					{!userIsEditing && errorMsg}

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
