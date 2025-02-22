import {useState} from 'react';
import {isEmail, isNotEmpty, hasMinLength, equalsToOtherValue} from '../../utils/validation.js';
import {useInput} from '../../hooks/useInput.js';
import InputLogin from './InputLogin.jsx';

function LoginFrom() {
	const [firstTime, setFirstTime] = useState(false);

	//using custom hook with extracting and reassigning its 'return' for particular inputs and assign validation methods from imported utils
	const {
		value: emailValue,
		handleChange: handleEmailChange,
		handleBlur: handleEmailBlur,
		hasError: emailHasError,
		handleReset: handleEmailReset,
	} = useInput('', (value) => isEmail(value) && isNotEmpty(value));

	const {
		value: passwordValue,
		handleChange: handlePasswordChange,
		handleBlur: handlePasswordBlur,
		hasError: passwordHasError,
		handleReset: handlePasswordReset,
	} = useInput('', (value) => hasMinLength(value, 8));

	const {
		value: confirmedPasswordValue,
		handleChange: handleConfirmedPasswordChange,
		handleBlur: handleConfirmedPasswordBlur,
		hasError: confirmedPasswordHasError,
		handleReset: handleConfirmedPasswordReset,
	} = useInput('', (value) => equalsToOtherValue(value, passwordValue));

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

		if (emailHasError || passwordHasError || confirmedPasswordHasError) {
			return;
		}

		const fd = new FormData(e.target);
		const data = Object.fromEntries(fd.entries());
		console.log(data);
		handleReset();

		// assign registration date
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

	return (
		<>
			<section className={formType}>
				<form
					action=''
					onSubmit={(e) => handleSubmit(e, formDataState)}
					className={`${formType}-form`}>
					<h1 className='form__title'>{title}</h1>
					<InputLogin
						formType={formType}
						type='email'
						id='email'
						name='email'
						label='Email'
						value={emailValue}
						onBlur={handleEmailBlur}
						onChange={handleEmailChange}
						placeholder='(Wyślemy link aktywacyjny)'
						autoComplete='email'
						required
						error={emailHasError && 'Podaj prawidłowy email razem z "@"'}
					/>
					<InputLogin
						formType={formType}
						type='password'
						id='password'
						name='password'
						label='Hasło'
						value={passwordValue}
						onBlur={handlePasswordBlur}
						onChange={handlePasswordChange}
						autoComplete='current-password'
						required
						error={passwordHasError && 'Hasło musi mieć min 8 znaków'}
					/>
					<InputLogin
						formType={formType}
						type='password'
						id='confirmedPassword'
						name='confirmedPassword'
						label='Powtórz hasło'
						value={confirmedPasswordValue}
						onBlur={handleConfirmedPasswordBlur}
						onChange={handleConfirmedPasswordChange}
						required
						error={confirmedPasswordHasError && 'Hasła nie są identyczne'}
					/>
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
					<button className={`form-action-btn modal__btn`}>{actionTitle}</button>
				</form>
			</section>
		</>
	);
}

export default LoginFrom;
