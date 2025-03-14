import {useState} from 'react';
import {useMutation, useQuery} from '@tanstack/react-query';
import {queryClient, fetchStatus} from '../../utils/http.js';
import {useInput} from '../../hooks/useInput.js';
import InputLogin from '../login/InputLogin.jsx';
import FeedbackBox from './FeedbackBox.jsx';
import * as val from '../../utils/validation.js';

function NewProductForm({onClose}) {
	let initialFeedbackConfirmation;
	const [feedbackConfirmation, setFeedbackConfirmation] = useState(initialFeedbackConfirmation);

	const {data: status} = useQuery({
		queryKey: ['authStatus'],
		queryFn: fetchStatus,
	});

	let successMsg;
	const {mutate, isPending, isError, error} = useMutation({
		mutationFn: (formData) => {
			return fetch(`/api/admin-console/create-product`, {
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
			queryClient.invalidateQueries(['/admin-console/show-all-products']);
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
		value: nameValue,
		handleChange: handleNameChange,
		handleFocus: handleNameFocus,
		handleBlur: handleNameBlur,
		handleReset: handleNameReset,
		didEdit: nameDidEdit,
		isFocused: nameIsFocused,
		validationResults: nameValidationResults,
		hasError: nameHasError,
	} = useInput('');
	const {
		value: productTypeValue,
		handleChange: handleProductTypeChange,
		handleFocus: handleProductTypeFocus,
		handleBlur: handleProductTypeBlur,
		handleReset: handleProductTypeReset,
		didEdit: productTypeDidEdit,
		isFocused: productTypeIsFocused,
		validationResults: productTypeValidationResults,
		hasError: productTypeHasError,
	} = useInput('Online');
	const {
		value: locationValue,
		handleChange: handleLocationChange,
		handleFocus: handleLocationFocus,
		handleBlur: handleLocationBlur,
		handleReset: handleLocationReset,
		didEdit: locationDidEdit,
		isFocused: locationIsFocused,
		validationResults: locationValidationResults,
		hasError: locationHasError,
	} = useInput('', val.locationValidations);
	const {
		value: durationValue,
		handleChange: handleDurationChange,
		handleFocus: handleDurationFocus,
		handleBlur: handleDurationBlur,
		handleReset: handleDurationReset,
		didEdit: durationDidEdit,
		isFocused: durationIsFocused,
		validationResults: durationValidationResults,
		hasError: durationHasError,
	} = useInput(1, val.durationValidations);
	const {
		value: StartDateValue,
		handleChange: handleStartDateChange,
		handleFocus: handleStartDateFocus,
		handleBlur: handleStartDateBlur,
		handleReset: handleStartDateReset,
		didEdit: StartDateDidEdit,
		isFocused: StartDateIsFocused,
		validationResults: StartDateValidationResults,
		hasError: StartDateHasError,
	} = useInput('');
	const {
		value: priceValue,
		handleChange: handlePriceChange,
		handleFocus: handlePriceFocus,
		handleBlur: handlePriceBlur,
		handleReset: handlePriceReset,
		didEdit: priceDidEdit,
		isFocused: priceIsFocused,
		validationResults: priceValidationResults,
		hasError: priceHasError,
	} = useInput(' ', val.priceValidations);
	const {
		value: statusValue,
		handleChange: handleStatusChange,
		handleFocus: handleStatusFocus,
		handleBlur: handleStatusBlur,
		handleReset: handleStatusReset,
		didEdit: statusDidEdit,
		isFocused: statusIsFocused,
		validationResults: statusValidationResults,
		hasError: statusHasError,
	} = useInput('Aktywny');

	// Reset all te inputs
	const handleReset = () => {
		setFeedbackConfirmation(undefined);
		handleNameReset();
		handleProductTypeReset();
		handleLocationReset();
		handleDurationReset();
		handleStartDateReset();
		handlePriceReset();
		handleStatusReset();
	};

	// Submit handling
	const handleSubmit = async (e) => {
		e.preventDefault(); // No reloading
		console.log('Submit triggered');

		if (
			priceHasError ||
			statusHasError ||
			locationHasError ||
			durationHasError ||
			StartDateHasError ||
			nameHasError ||
			productTypeHasError
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
		title: 'Dodanie zajęć do systemu',
		actionTitle: 'Zatwierdź',
	};

	// Extract values only
	const {formType, title, actionTitle} = formLabels;

	let form;
	let feedback = feedbackConfirmation !== undefined && (
		<FeedbackBox
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

			<InputLogin
				embedded={true}
				formType={formType}
				type='text'
				id='name'
				name='name'
				label='Nazwa w systemie: *'
				value={nameValue}
				onFocus={handleNameFocus}
				onBlur={handleNameBlur}
				onChange={handleNameChange}
				autoComplete='off'
				required
				validationResults={nameValidationResults}
				didEdit={nameDidEdit}
				isFocused={nameIsFocused}
			/>

			<InputLogin
				embedded={true}
				formType={formType}
				type='select'
				options={[
					{label: 'Online', value: 'Online'},
					{label: 'Camp', value: 'Camp'},
					{label: 'Event', value: 'Event'},
					{label: 'Class', value: 'Class'},
				]}
				id='productType'
				name='productType'
				label='Typ zajęć: *'
				value={productTypeValue}
				required
				onFocus={handleProductTypeFocus}
				onBlur={handleProductTypeBlur}
				onChange={handleProductTypeChange}
				validationResults={productTypeValidationResults}
				didEdit={productTypeDidEdit}
				isFocused={productTypeIsFocused}
			/>

			<InputLogin
				embedded={true}
				formType={formType}
				type='date'
				id='StartDate'
				name='StartDate'
				label='Data rozpoczęcia: *'
				value={StartDateValue}
				onFocus={handleStartDateFocus}
				onBlur={handleStartDateBlur}
				onChange={handleStartDateChange}
				autoComplete='off'
				required
				validationResults={StartDateValidationResults}
				didEdit={StartDateDidEdit}
				isFocused={StartDateIsFocused}
			/>
			<InputLogin
				embedded={true}
				formType={formType}
				type='number'
				id='duration'
				name='duration'
				step='0.25'
				min='0'
				label='Czas trwania (h): *'
				placeholder='h'
				required
				value={durationValue}
				onFocus={handleDurationFocus}
				onBlur={handleDurationBlur}
				onChange={handleDurationChange}
				validationResults={durationValidationResults}
				didEdit={durationDidEdit}
				isFocused={durationIsFocused}
			/>
			<InputLogin
				embedded={true}
				formType={formType}
				type='text'
				id='location'
				name='location'
				label='Miejsce:'
				value={locationValue}
				autoComplete='off'
				onFocus={handleLocationFocus}
				onBlur={handleLocationBlur}
				onChange={handleLocationChange}
				validationResults={locationValidationResults}
				didEdit={locationDidEdit}
				isFocused={locationIsFocused}
			/>
			<InputLogin
				embedded={true}
				formType={formType}
				type='decimal'
				id='price'
				name='price'
				label='Zadatek: *'
				placeholder='zł'
				value={priceValue}
				required
				onFocus={handlePriceFocus}
				onBlur={handlePriceBlur}
				onChange={handlePriceChange}
				validationResults={priceValidationResults}
				didEdit={priceDidEdit}
				isFocused={priceIsFocused}
			/>
			<InputLogin
				embedded={true}
				formType={formType}
				type='select'
				options={[
					{label: 'Aktywny', value: 'Aktywny'},
					{label: 'Zakończony', value: 'Zakończony'},
					{label: 'Zawieszony', value: 'Zawieszony'},
				]}
				id='status'
				name='status'
				label='Status:'
				value={statusValue}
				required
				onFocus={handleStatusFocus}
				onBlur={handleStatusBlur}
				onChange={handleStatusChange}
				validationResults={statusValidationResults}
				didEdit={statusDidEdit}
				isFocused={statusIsFocused}
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
			<div className='user-container modal__summary'>
				{form} {feedback}
			</div>
		</>
	);
}

export default NewProductForm;
