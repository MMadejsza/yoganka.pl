import {useMutation} from '@tanstack/react-query';
import {queryClient, mutateOnCreate} from '../../utils/http.js';
import {useInput} from '../../hooks/useInput.js';
import {useFeedback} from '../../hooks/useFeedback.js';
import {useAuthStatus} from '../../hooks/useAuthStatus.js';
import InputLogin from '../login/InputLogin.jsx';
import FeedbackBox from './FeedbackBox.jsx';
import * as val from '../../utils/validation.js';

function NewProductForm() {
	const {feedback, updateFeedback, resetFeedback} = useFeedback();
	const {data: status} = useAuthStatus();

	const {
		mutate: createProduct,
		isPending: isCreateProductPending,
		isError: isCreateProductError,
		error: createProductError,
	} = useMutation({
		mutationFn: (formDataObj) =>
			mutateOnCreate(status, formDataObj, `/api/admin-console/create-product`),

		onSuccess: (res) => {
			queryClient.invalidateQueries(['/admin-console/show-all-products']);
			updateFeedback(res);
		},
		onError: (err) => {
			updateFeedback(err);
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
		resetFeedback();

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
		createProduct(formDataObj);
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

	const form = (
		<form
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
				{form}
				{feedback.status !== undefined && (
					<FeedbackBox
						status={feedback.status}
						isPending={isCreateProductPending}
						isError={isCreateProductError}
						error={createProductError}
						successMsg={feedback.message}
						warnings={feedback.warnings}
						size='small'
					/>
				)}
			</div>
		</>
	);
}

export default NewProductForm;
