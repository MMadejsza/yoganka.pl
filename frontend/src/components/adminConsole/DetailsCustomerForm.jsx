import {useNavigate} from 'react-router-dom';
import {useQuery, useMutation} from '@tanstack/react-query';
import {queryClient, fetchItem} from '../../utils/http.js';
import {useInput} from '../../hooks/useInput.js';
import InputLogin from '../login/InputLogin.jsx';
import {phoneValidations} from '../../utils/validation.js';
function DetailsUserSettingsForm() {
	const navigate = useNavigate();

	const {
		data,
		isLoading: isCustomerLoading,
		isError: isCustomerError,
	} = useQuery({
		queryKey: ['formFilling', 'editCustomer'],
		queryFn: ({signal}) => fetchItem('/konto/ustawienia/get-customer', {signal}),
		staleTime: 0,
		refetchOnMount: true,
		enabled: location.pathname.includes('ustawienia'),
	});
	const {mutate, isPending, isError, error} = useMutation({
		mutationFn: (formData) => {
			return fetch('/api/konto/ustawienia/update/uczestnik', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
				credentials: 'include', // include cookies
			}).then((response) => {
				if (!response.ok) {
					throw new Error('Błąd');
				}
				return response.json();
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['settings']);
			navigate('/konto/ustawienia');
		},
		onError: (error) => {
			window.alert(error.message);
		},
	});
	// Fallback to feed custom hooks when data isn't available
	const phoneDefault = data?.customer.CustomerPhones[0].CustomerMobile || ' ';

	const methodDefault = data?.customer.PreferredContactMethod || ' ';

	// using custom hook with extracting and reassigning its 'return' for particular inputs and assign validation methods from imported utils. Every inout has its won state now
	const {
		value: phoneValue,
		handleChange: handlePhoneChange,
		handleFocus: handlePhoneFocus,
		handleBlur: handlePhoneBlur,
		handleReset: handlePhoneReset,
		didEdit: phoneDidEdit,
		isFocused: phoneIsFocused,
		validationResults: phoneValidationResults,
		hasError: phoneHasError,
	} = useInput(phoneDefault, phoneValidations);

	const {
		value: cMethodValue,
		handleChange: handleCMethodChange,
		handleFocus: handleCMethodFocus,
		handleBlur: handleCMethodBlur,
		handleReset: handleCMethodReset,
		didEdit: cMethodDidEdit,
		isFocused: cMethodIsFocused,
		validationResults: cMethodValidationResults,
		hasError: cMethodHasError,
	} = useInput(methodDefault);

	if (isCustomerLoading) return <div>Ładowanie...</div>;
	if (isCustomerError) return <div>Błąd ładowania ustawień.</div>;
	console.log(data);
	console.log(methodDefault);

	// Reset all te inputs
	const handleReset = () => {
		handlePhoneReset();
		handleCMethodReset();
	};

	// Submit handling
	const handleSubmit = async (e) => {
		e.preventDefault(); // No reloading
		console.log('Submit triggered');

		if (phoneHasError || cMethodHasError) {
			return;
		}
		console.log('Submit passed errors');

		const fd = new FormData(e.target);
		console.log('sent data:', fd);
		mutate(fd);
		handleReset();

		//! assign registration date
	};

	// Dynamically set descriptive names when switching from login in to registration
	const formLabels = {
		formType: 'settings',
		title: '',
		actionTitle: 'Zatwierdź',
	};
	// Extract values only
	const {formType, title, actionTitle} = formLabels;

	let content;

	if (isPending) {
		content = 'Wysyłanie...';
	} else if (isError) {
		content = `Błąd: ${error}'`;
	} else
		content = (
			<form
				action='/api/konto/ustawienia/update/customer'
				method='POST'
				onSubmit={handleSubmit}
				className={`user-container__details-list modal-checklist__list`}>
				<h1 className='form__title'>{title}</h1>
				{/* names are for FormData and id for labels */}
				<InputLogin
					embedded={true}
					formType={formType}
					type='tel'
					id='phone'
					name='phone'
					label='Numer telefonu:'
					value={phoneValue}
					onFocus={handlePhoneFocus}
					onBlur={handlePhoneBlur}
					onChange={handlePhoneChange}
					autoComplete='phone'
					required
					validationResults={phoneValidationResults}
					didEdit={phoneDidEdit}
					isFocused={phoneIsFocused}
				/>
				<InputLogin
					embedded={true}
					formType={formType}
					type='select'
					options={[
						{label: 'Telefon', value: 'telefon'},
						{label: 'Email', value: 'email'},
					]}
					id='cMethod'
					name='cMethod'
					label='Kontaktuj się przez:'
					value={cMethodValue}
					onFocus={handleCMethodFocus}
					onBlur={handleCMethodBlur}
					onChange={handleCMethodChange}
					validationResults={cMethodValidationResults}
					didEdit={cMethodDidEdit}
					isFocused={cMethodIsFocused}
				/>

				<button
					type='reset'
					onClick={handleReset}
					className='form-switch-btn modal__btn  modal__btn--secondary modal__btn--small'>
					Resetuj
				</button>
				<button
					type='submit'
					className={`form-action-btn modal__btn modal__btn--small`}>
					{actionTitle}
				</button>
			</form>
		);

	return <>{content}</>;
}

export default DetailsUserSettingsForm;
