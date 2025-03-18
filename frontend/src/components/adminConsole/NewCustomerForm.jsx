import {useState} from 'react';
import {useMutation, useQuery} from '@tanstack/react-query';
import {queryClient, fetchData, fetchStatus} from '../../utils/http.js';
import {useInput} from '../../hooks/useInput.js';
import InputLogin from '../login/InputLogin.jsx';
import UserFeedbackBox from './FeedbackBox.jsx';
import * as val from '../../utils/validation.js';

function NewCustomerForm({onClose}) {
	let initialFeedbackConfirmation;
	const [feedbackConfirmation, setFeedbackConfirmation] = useState(initialFeedbackConfirmation);
	const [successMsg, setSuccessMsg] = useState(null);

	const {data: status} = useQuery({
		queryKey: ['authStatus'],
		queryFn: fetchStatus,
	});

	const {
		data: usersList,
		isError: isUsersError,
		error: usersError,
	} = useQuery({
		// as id for later caching received data to not send the same request again where location.pathname is key
		queryKey: ['data', '/admin-console/show-all-users'],
		// definition of the code sending the actual request- must be returning the promise
		queryFn: () => fetchData('/admin-console/show-all-users'),
		// only when location.pathname is set extra beyond admin panel:
	});

	const usersOptionsList = usersList?.content?.sort(
		(a, b) => new Date(b.Zarejestrowany) - new Date(a.Zarejestrowany),
	);
	console.log('usersOptionsList: ', usersOptionsList);

	const {mutate, isPending, isError, error} = useMutation({
		mutationFn: (formData) => {
			return fetch(`/api/admin-console/create-customer`, {
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
			queryClient.invalidateQueries(['/admin-console/show-all-customers']);
			if (res.confirmation || res.code == 200) {
				setFeedbackConfirmation(1);
				setSuccessMsg(res.message);
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
		value: userValue,
		handleChange: handleUserChange,
		handleFocus: handleUserFocus,
		handleBlur: handleUserBlur,
		handleReset: handleUserReset,
		didEdit: userDidEdit,
		isFocused: userIsFocused,
		validationResults: userValidationResults,
		hasError: userHasError,
	} = useInput('');
	const {
		value: customerTypeValue,
		handleChange: handleCustomerTypeChange,
		handleFocus: handleCustomerTypeFocus,
		handleBlur: handleCustomerTypeBlur,
		handleReset: handleCustomerTypeReset,
		didEdit: customerTypeDidEdit,
		isFocused: customerTypeIsFocused,
		validationResults: customerTypeValidationResults,
		hasError: customerTypeHasError,
	} = useInput('Indywidualny');
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
		value: loyaltyValue,
		handleChange: handleLoyaltyChange,
		handleFocus: handleLoyaltyFocus,
		handleBlur: handleLoyaltyBlur,
		handleReset: handleLoyaltyReset,
		didEdit: loyaltyDidEdit,
		isFocused: loyaltyIsFocused,
		validationResults: loyaltyValidationResults,
		hasError: loyaltyHasError,
	} = useInput(5);
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
		setFeedbackConfirmation(undefined);
		handleUserReset();
		handleLoyaltyReset();
		handleCustomerTypeReset();
		handleFirstNameReset();
		handleLastNameReset();
		handleDoBReset();
		handlePhoneReset();
		handleCMethodReset();
		handleNotesReset();
	};

	// Submit handling
	const handleSubmit = async (e) => {
		e.preventDefault(); // No reloading
		console.log('Submit triggered');

		if (
			phoneHasError ||
			cMethodHasError ||
			firstNameHasError ||
			lastNameHasError ||
			DoBHasError ||
			userHasError ||
			notesHasError ||
			customerTypeHasError ||
			loyaltyHasError
		) {
			return;
		}
		console.log('Submit passed errors');

		const fd = new FormData(e.target);
		const formDataObj = Object.fromEntries(fd.entries());
		console.log('sent data:', formDataObj);
		mutate(formDataObj);
		handleReset();
	};

	// Dynamically set descriptive names when switching from login in to registration
	const formLabels = {
		formType: 'login',
		title: 'Przypisanie nowego profilu uczestnika',
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

	form = usersList && (
		<form
			// action='/api/login-pass/login'
			method='POST'
			onSubmit={handleSubmit}
			className={`user-container__details-list modal-checklist__list`}>
			<h1 className='form__title'>{title}</h1>
			{/* names are for FormData and id for labels */}
			<InputLogin
				embedded={true}
				formType={formType}
				type='select'
				options={usersOptionsList.map((userObj) => ({
					label: `(ID: ${userObj.ID}) ${userObj['E-mail']}`,
					value: userObj.ID,
				}))}
				id='user'
				name='userID'
				label='Przypisz do konta:'
				value={userValue}
				onFocus={handleUserFocus}
				onBlur={handleUserBlur}
				onChange={handleUserChange}
				validationResults={userValidationResults}
				didEdit={userDidEdit}
				required
				isFocused={userIsFocused}
			/>
			<InputLogin
				embedded={true}
				formType={formType}
				type='select'
				options={[
					{label: 'Indywidualny', value: 'Indywidualny'},
					{label: 'B2B', value: 'Biznesowy'},
				]}
				id='customerType'
				name='customerType'
				label='Typ uczestnika:'
				value={customerTypeValue}
				onFocus={handleCustomerTypeFocus}
				onBlur={handleCustomerTypeBlur}
				onChange={handleCustomerTypeChange}
				required
				validationResults={customerTypeValidationResults}
				didEdit={customerTypeDidEdit}
				isFocused={customerTypeIsFocused}
			/>
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
				type='number'
				id='loyalty'
				name='loyalty'
				label='Lojalność:'
				min='0'
				max='10'
				value={loyaltyValue}
				onFocus={handleLoyaltyFocus}
				onBlur={handleLoyaltyBlur}
				onChange={handleLoyaltyChange}
				validationResults={loyaltyValidationResults}
				didEdit={loyaltyDidEdit}
				isFocused={loyaltyIsFocused}
			/>
			<InputLogin
				embedded={true}
				formType={formType}
				type='textarea'
				id='notes'
				name='notes'
				label='Notatka:'
				cols='40'
				rows='10'
				value={notesValue}
				onFocus={handleNotesFocus}
				onBlur={handleNotesBlur}
				onChange={handleNotesChange}
				validationResults={notesValidationResults}
				didEdit={notesDidEdit}
				isFocused={notesIsFocused}
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
			{/* <section className={formType}> */}
			<div className='user-container modal__summary'>
				{form} {feedback}
			</div>
			{/* </section> */}
		</>
	);
}

export default NewCustomerForm;
