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
		const {name, value, type, checked} = e.target;
		// updating only necessary
		setFormData((prevState) => ({
			...prevState,
			[name]: type === 'checkbox' ? checked : value,
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
	const switchTitle = !formData.registration ? 'Zarejestruj się:' : 'Zaloguj się:';

	return (
		<>
			<section className={type}>
				<button
					className='form-switch-btn'
					onClick={handleFormSwitch}>
					{switchTitle}
				</button>

				<form
					action=''
					onSubmit={(e) => handleSubmit(e, formData)}
					className={`${type}-form`}>
					<h1>{title}</h1>
					<div className='input-pair'>
						<label htmlFor={`login`}>Login</label>
						<input
							type='text'
							name={`login`}
							placeholder='Unikatowy'
							className={`${type}-form__login-input`}
							onChange={handleChange}
						/>
					</div>
					<div className='input-pair'>
						<label htmlFor={`password`}>Hasło</label>
						<input
							type='password'
							name={`password`}
							className={`${type}-form__password-input`}
							onChange={handleChange}
						/>
					</div>
					<div className='input-pair'>
						<label htmlFor={`${type}-email`}>Email</label>
						<input
							type='email'
							name={`email`}
							placeholder='Do autoryzacji'
							className={`${type}-form__email-input`}
							onChange={handleChange}
						/>
					</div>
				</form>
				<button
					className={`${type}-btn'`}
					name={`${type}-btn'`}>
					{formData.registration ? 'Zarejestruj' : 'Zaloguj'}
				</button>
			</section>
		</>
	);
}

export default LoginFrom;
