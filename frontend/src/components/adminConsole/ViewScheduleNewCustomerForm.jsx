import {useNavigate, useLocation} from 'react-router-dom';
import {useQuery, useMutation} from '@tanstack/react-query';
import {queryClient, fetchItem, fetchStatus} from '../../utils/http.js';
import {useInput} from '../../hooks/useInput.js';
import InputLogin from '../login/InputLogin.jsx';
import * as val from '../../utils/validation.js';
function ViewScheduleNewCustomerForm() {
	const navigate = useNavigate();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const customerConfirmation = params.get('customerConfirmation');
	const minAge = () => {
		const today = new Date();
		const year = today.getFullYear() - 18;
		const month = (today.getMonth() + 1).toString().padStart(2, '0');
		const day = today.getDate().toString().padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	const {data: status} = useQuery({
		queryKey: ['authStatus'],
		queryFn: fetchStatus,
	});

	const {mutate, isPending, isError, error} = useMutation({
		mutationFn: (formData) => {
			return fetch('', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'CSRF-Token': status.token,
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
		onSuccess: (res) => {
			queryClient.invalidateQueries(['query', '/konto/ustawienia']);
			if (res.confirmation) {
				navigate('/konto/ustawienia?customerConfirmation=1');
			} else {
				navigate('/konto/ustawienia?customerConfirmation=0');
			}
		},
		onError: (error) => {
			window.alert(error.message);
		},
	});
	// Fallback to feed custom hooks when data isn't available
	// const phoneDefault = data?.customer.CustomerPhones[0]?.CustomerMobile || ' ';

	// const methodDefault = data?.customer.PreferredContactMethod || ' ';

	// using custom hook with extracting and reassigning its 'return' for particular inputs and assign validation methods from imported utils. Every inout has its won state now

	const {
		value: firstNameValue,
		handleChange: handleFirstNameChange,
		handleFocus: handleFirstNameFocus,
		handleBlur: handleFirstNameBlur,
		handleReset: handleFirstNameReset,
		didEdit: firstNameDidEdit,
		isFocused: firstNameIsFocused,
		validationResults: firstNameValidationResults,
		hasError: firstNameHasError,
	} = useInput('', val.firstNameValidations);
	const {
		value: lastNameValue,
		handleChange: handleLastNameChange,
		handleFocus: handleLastNameFocus,
		handleBlur: handleLastNameBlur,
		handleReset: handleLastNameReset,
		didEdit: lastNameDidEdit,
		isFocused: lastNameIsFocused,
		validationResults: lastNameValidationResults,
		hasError: lastNameHasError,
	} = useInput('', val.lastNameValidations);
	const {
		value: DoBValue,
		handleChange: handleDoBChange,
		handleFocus: handleDoBFocus,
		handleBlur: handleDoBBlur,
		handleReset: handleDoBReset,
		didEdit: DoBDidEdit,
		isFocused: DoBIsFocused,
		validationResults: DoBValidationResults,
		hasError: DoBHasError,
	} = useInput('', val.dobValidations);
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
	} = useInput(' ', val.phoneValidations);
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
	} = useInput('');
	const {
		value: referralSourceValue,
		handleChange: handleReferralSourceChange,
		handleFocus: handleReferralSourceFocus,
		handleBlur: handleReferralSourceBlur,
		handleReset: handleReferralSourceReset,
		didEdit: referralSourceDidEdit,
		isFocused: referralSourceIsFocused,
		validationResults: referralSourceValidationResults,
		hasError: referralSourceHasError,
	} = useInput('');
	const {
		value: notesValue,
		handleChange: handleNotesChange,
		handleFocus: handleNotesFocus,
		handleBlur: handleNotesBlur,
		handleReset: handleNotesReset,
		didEdit: notesDidEdit,
		isFocused: notesIsFocused,
		validationResults: notesValidationResults,
		hasError: notesHasError,
	} = useInput('', val.notesValidations);

	// Reset all te inputs
	const handleReset = () => {
		handleFirstNameReset();
		handleLastNameReset();
		handleDoBReset();
		handlePhoneReset();
		handleCMethodReset();
		handleReferralSourceReset();
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
		const formDataObj = Object.fromEntries(fd.entries());
		console.log('sent data:', formDataObj);
		mutate(formDataObj);
		handleReset();

		//! assign registration date
	};

	// Dynamically set descriptive names when switching from login in to registration
	const formLabels = {
		formType: 'newCustomer',
		title: '',
		actionTitle: 'Zatwierdź',
	};
	// Extract values only
	const {formType, title, actionTitle} = formLabels;

	let content;

	if (isPending) {
		content = 'Wysyłanie...';
	} else if (isError) {
		if (error.code == 401) {
			navigate('/login');
			console.log(error.message);
		} else {
			content = `Błąd: ${error}'`;
		}
	} else
		content = (
			<form
				action='/api/konto/ustawienia/update/uczestnik'
				method='POST'
				onSubmit={handleSubmit}
				className={`form user-container__details-list modal-checklist__list new-customer`}>
				<h1 className='form__title'>{title}</h1>
				{/* names are for FormData and id for labels */}
				<InputLogin
					embedded={true}
					formType={formType}
					type='text'
					id='firstName'
					name='firstName'
					label='Imię:*'
					value={firstNameValue}
					onFocus={handleFirstNameFocus}
					onBlur={handleFirstNameBlur}
					onChange={handleFirstNameChange}
					autoComplete='given-name'
					required
					validationResults={firstNameValidationResults}
					didEdit={firstNameDidEdit}
					isFocused={firstNameIsFocused}
				/>
				<InputLogin
					embedded={true}
					formType={formType}
					type='text'
					id='lastName'
					name='lastName'
					label='Nazwisko:*'
					value={lastNameValue}
					onFocus={handleLastNameFocus}
					onBlur={handleLastNameBlur}
					onChange={handleLastNameChange}
					autoComplete='family-name'
					required
					validationResults={lastNameValidationResults}
					didEdit={lastNameDidEdit}
					isFocused={lastNameIsFocused}
				/>
				<InputLogin
					embedded={true}
					formType={formType}
					type='date'
					id='DoB'
					name='DoB'
					label='Urodziny:*'
					value={DoBValue}
					max={minAge()}
					onFocus={handleDoBFocus}
					onBlur={handleDoBBlur}
					onChange={handleDoBChange}
					autoComplete='bday'
					required
					validationResults={DoBValidationResults}
					didEdit={DoBDidEdit}
					isFocused={DoBIsFocused}
				/>
				<InputLogin
					embedded={true}
					formType={formType}
					type='tel'
					id='phone'
					name='phone'
					label='Numer telefonu:*'
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
						{label: 'Telefon', value: 'Telefon'},
						{label: 'Email', value: 'Email'},
					]}
					id='cMethod'
					name='cMethod'
					label='Preferuję kontakt przez:'
					value={cMethodValue}
					onFocus={handleCMethodFocus}
					onBlur={handleCMethodBlur}
					onChange={handleCMethodChange}
					validationResults={cMethodValidationResults}
					didEdit={cMethodDidEdit}
					isFocused={cMethodIsFocused}
				/>
				<InputLogin
					embedded={true}
					formType={formType}
					type='select'
					options={[
						{label: 'Wyszukiwarka', value: 'Google'},
						{label: 'Instagram', value: 'Instagram'},
						{label: 'Facebook', value: 'Facebook'},
						{label: 'Znajomy', value: 'Znajomy'},
						{label: 'Miejscówka', value: 'Miejscówka'},
						{label: 'Praca', value: 'Email'},
					]}
					id='referralSource'
					name='referralSource'
					label='Źródło polecenia:'
					value={referralSourceValue}
					onFocus={handleReferralSourceFocus}
					onBlur={handleReferralSourceBlur}
					onChange={handleReferralSourceChange}
					validationResults={referralSourceValidationResults}
					didEdit={referralSourceDidEdit}
					isFocused={referralSourceIsFocused}
				/>
				{(referralSourceValue == 'Znajomy' ||
					referralSourceValue == 'Miejscówka' ||
					referralSourceValue == 'Praca') && (
					<InputLogin
						embedded={true}
						formType={formType}
						type='textarea'
						id='notes'
						name='notes'
						label='Odwdzięczamy się swoim partnerom - a dokładniej?  :)'
						value={notesValue}
						onFocus={handleNotesFocus}
						onBlur={handleNotesBlur}
						onChange={handleNotesChange}
						validationResults={notesValidationResults}
						didEdit={notesDidEdit}
						isFocused={notesIsFocused}
					/>
				)}

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
				{customerConfirmation == 1 ? (
					<div className='user-container__section-record modal-checklist__li confirmation'>
						Zmiany zatwierdzone
					</div>
				) : customerConfirmation == 0 ? (
					<div className='user-container__section-record modal-checklist__li dimmed'>
						Brak zmian
					</div>
				) : null}
			</form>
		);

	return <>{content}</>;
}

export default ViewScheduleNewCustomerForm;
