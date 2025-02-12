import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import {useMutation} from '@tanstack/react-query';
import {create} from '../../utils/http.js';

const UserForm = ({closeModal}) => {
	const location = useLocation(); // fetch current path
	const navigate = useNavigate();
	const {mutate, isPending, isError, error} = useMutation({
		// definition of the code sending the actual request- must be returning the promise
		mutationFn: (data) => create(`/admin-console/add-user`, data),
		onSuccess: () => {
			closeModal();
		},
	});

	// Form state
	const initialState = {
		registrationDate: '',
		login: '',
		password: '',
		email: '',
		role: '',
		profilePicture: '', // URL
	};
	const [formData, setFormData] = useState(initialState);

	// Update on keystroke
	const handleChange = (e) => {
		// pulling out current inputs data
		const {name, value} = e.target;
		// updating only necessary
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
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
	};

	return (
		<>
			<form
				className='form'
				onSubmit={(e) => handleSubmit(e, formData)}>
				<h2 className='user-container__section-title modal__title'>Uzupełnij dane:</h2>
				<div className='form__input-set'>
					<label htmlFor='registrationDate'>Data rejestracji:</label>
					<input
						type='datetime-local'
						id='registrationDate'
						name='registrationDate'
						value={formData.registrationDate}
						onChange={handleChange}
						required
					/>
				</div>

				<div className='form__input-set'>
					<label htmlFor='login'>Login:</label>
					<input
						type='text'
						id='login'
						name='login'
						value={formData.login}
						onChange={handleChange}
						required
					/>
				</div>

				<div className='form__input-set'>
					<label htmlFor='password'>Hasło:</label>
					<input
						type='password'
						id='password'
						name='password'
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>

				<div className='form__input-set'>
					<label htmlFor='email'>Email:</label>
					<input
						type='text'
						id='email'
						name='email'
						value={formData.email}
						onChange={handleChange}
					/>
				</div>

				<div className='form__input-set'>
					<label htmlFor='role'>Rola:</label>
					<input
						type='text'
						id='role'
						name='role'
						value={formData.role}
						onChange={handleChange}
					/>
				</div>

				<div className='form__input-set'>
					<label htmlFor='profilePicture'>Link do zdjęcia profilowego:</label>
					<input
						type='text'
						id='profilePicture'
						name='profilePicture'
						value={formData.profilePicture}
						onChange={handleChange}
					/>
				</div>

				{!isPending ? (
					<button
						type='submit'
						className='user-container__action modal__btn'>
						Zatwierdź
					</button>
				) : (
					'📨 Sending...'
				)}
			</form>
			{isError && `❌ Failed to create an event -> ${error.info?.message}`}
		</>
	);
};

export default UserForm;
