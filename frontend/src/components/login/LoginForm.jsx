import React, {useState} from 'react';
import MdSwitchWrapper from './MdSwitchWrapper';

function LoginFrom() {
	// Form state
	const initialState = {
		login: '',
		password: '',
		email: '',
		registration: false,
		// profilePicture: '', // URL
	};

	const [formData, setFormData] = useState(initialState);

	// Update on keystroke
	const handleChange = (e) => {
		// pulling out current inputs data
		const {id, value, type, checked} = e.target;
		// updating only necessary
		setFormData((prevState) => ({
			...prevState,
			[id]: type === 'checkbox' ? checked : value,
		}));

		console.log(formData.registration);
	};
	const handleFormSwitch = (e) => {
		e.preventDefault();
		setFormData((prevState) => ({
			...prevState,
			registration: !prevState.registration,
		}));
	};

	// Submit handling
	const handleSubmit = async (e, formData) => {
		// No reloading
		e.preventDefault();
		// call mutator
		mutate(formData);
		// reset state
		setFormData(initialState);

		// assign registration date
	};

	const type = formData.registration ? 'register' : 'login';
	const title = formData.registration ? 'Rejestracja:' : 'Logowanie:';
	const switchTitle = !formData.registration ? 'Zarejestruj się' : 'Zaloguj się';
	const actionTitle = formData.registration ? 'Zarejestruj się' : 'Zaloguj się';

	return (
		<>
			<section className={type}>
				<form
					action=''
					onSubmit={(e) => handleSubmit(e, formData)}
					className={`${type}-form`}>
					<h1>{title}</h1>
					<div className='input-pair'>
						<label htmlFor={`login`}>Login</label>
						<input
							type='text'
							id={`login`}
							placeholder='Unikatowy'
							className={`${type}-form__login-input`}
							onChange={handleChange}
							autoComplete='username'
						/>
					</div>
					<div className='input-pair'>
						<label htmlFor={`password`}>Hasło</label>
						<input
							type='password'
							id={`password`}
							className={`${type}-form__password-input`}
							onChange={handleChange}
							autoComplete='current-password'
						/>
					</div>
					<div className='input-pair'>
						<label htmlFor={`email`}>Email</label>
						<input
							type='email'
							id={`email`}
							placeholder='Do autoryzacji'
							className={`${type}-form__email-input`}
							onChange={handleChange}
							autoComplete='email'
						/>
					</div>
				</form>
				<button className={`modal__btn`}>{actionTitle}</button>
				<button
					className='form-switch-btn modal__btn'
					onClick={handleFormSwitch}>
					{switchTitle}
				</button>
			</section>
		</>
	);
}

export default LoginFrom;
