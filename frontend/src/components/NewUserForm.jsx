import React, {useState} from 'react';
import {useLocation} from 'react-router-dom';

import {useMutation} from '@tanstack/react-query';
import {create} from '../utils/http.js';

const UserForm = () => {
	const location = useLocation(); // fetch current path
	const {mutate} = useMutation({
		// definition of the code sending the actual request- must be returning the promise
		mutationFn: (data) => create(`/admin-console//add-user`, data),
	});

	// Form state
	const [formData, setFormData] = useState({
		registrationDate: '',
		login: '',
		password: '',
		email: '',
		role: '',
		profilePicture: '', // URL
	});

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
	};

	return (
		<form onSubmit={(e) => handleSubmit(e, formData)}>
			<div>
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

			<div>
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

			<div>
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

			<div>
				<label htmlFor='email'>Email:</label>
				<input
					type='text'
					id='email'
					name='email'
					value={formData.email}
					onChange={handleChange}
				/>
			</div>

			<div>
				<label htmlFor='role'>Rola:</label>
				<input
					type='text'
					id='role'
					name='role'
					value={formData.role}
					onChange={handleChange}
				/>
			</div>

			<div>
				<label htmlFor='profilePicture'>Link do zdjęcia profilowego:</label>
				<input
					type='text'
					id='profilePicture'
					name='profilePicture'
					value={formData.profilePicture}
					onChange={handleChange}
				/>
			</div>

			<button type='submit'>Zapisz</button>
		</form>
	);
};

export default UserForm;
