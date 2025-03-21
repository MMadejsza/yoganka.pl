import React, {useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import {queryClient, mutateOnEdit} from '../../utils/http.js';
import {formatIsoDateTime} from '../../utils/dateTime.js';
import {useInput} from '../../hooks/useInput.js';
import {useAuthStatus} from '../../hooks/useAuthStatus.js';
import {useFeedback} from '../../hooks/useFeedback.js';
import InputLogin from '../login/InputLogin.jsx';
import UserFeedbackBox from './FeedbackBox.jsx';

function DetailsProductForm({productData}) {
	const {data: status} = useAuthStatus();
	const {feedback, updateFeedback, resetFeedback} = useFeedback();

	const {
		mutate: editProductData,
		isPending: isEditProductDataPending,
		isError: isEditProductDataError,
		error: editProductDataError,
	} = useMutation({
		mutationFn: (formDataObj) =>
			mutateOnEdit(
				status,
				formDataObj,
				`/api/admin-console/edit-product-data/${productData.ProductID}`,
			),

		onSuccess: (res) => {
			queryClient.invalidateQueries([
				'query',
				`/admin-console/show-all-products/${productData.ProductID}`,
			]);
			queryClient.invalidateQueries(['query', `/admin-console/show-all-products`]);
			// updating feedback
			updateFeedback(res);
		},
		onError: (err) => {
			// updating feedback
			updateFeedback(res);
		},
	});
	// Fallback to feed custom hooks when data isn't available
	const typeDefault = productData?.Type || 'Class';
	const dateDefault = productData?.StartDate || formatIsoDateTime(new Date());
	const locationDefault = productData?.Location || ' ';
	const timeString = productData?.Duration;
	const [hours, minutes, seconds] = timeString.split(':').map(Number);
	const totalHours = hours + minutes / 60 + seconds / 3600;
	const durationDefault = totalHours || 1;
	const priceDefault = productData?.Price || 500.0;
	const statusDefault = productData?.Status || 'Aktywny';

	// using custom hook with extracting and reassigning its 'return' for particular inputs and assign validation methods from imported utils. Every inout has its won state now
	const {
		value: typeValue,
		handleChange: handleTypeChange,
		handleFocus: handleTypeFocus,
		handleBlur: handleTypeBlur,
		handleReset: handleTypeReset,
		didEdit: typeDidEdit,
		isFocused: typeIsFocused,
		validationResults: typeValidationResults,
		hasError: typeHasError,
	} = useInput(typeDefault);

	const {
		value: dateValue,
		handleChange: handleDateChange,
		handleFocus: handleDateFocus,
		handleBlur: handleDateBlur,
		handleReset: handleDateReset,
		didEdit: dateDidEdit,
		isFocused: dateIsFocused,
		validationResults: dateValidationResults,
		hasError: dateHasError,
	} = useInput(dateDefault);

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
	} = useInput(locationDefault);

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
	} = useInput(durationDefault);

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
	} = useInput(priceDefault);

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
	} = useInput(statusDefault);

	// Reset all te inputs
	const handleReset = () => {
		resetFeedback();

		handleTypeReset();
		handleDateReset();
		handleLocationReset();
		handleDurationReset();
		handlePriceReset();
		handleStatusReset();
	};

	// Submit handling
	const handleSubmit = async (e) => {
		e.preventDefault(); // No reloading
		// console.log('Submit triggered');

		if (
			typeHasError ||
			dateHasError ||
			locationHasError ||
			durationHasError ||
			priceHasError ||
			statusHasError
		) {
			return;
		}
		console.log('Submit passed errors');

		const fd = new FormData(e.target);
		const formDataObj = Object.fromEntries(fd.entries());
		const givenHoursToMinutes = formDataObj.duration * 60;
		const newDuration = `${Math.floor(givenHoursToMinutes / 60)}:${String(
			givenHoursToMinutes % 60,
		).padStart(2, '0')}:00`;
		formDataObj.duration = newDuration;
		formDataObj.price = parseFloat(formDataObj.price).toFixed(2);
		console.log('sent data:', JSON.stringify(formDataObj));

		editProductData(formDataObj);
		handleReset();
	};

	// Dynamically set descriptive names when switching from login in to registration
	const formLabels = {
		formType: 'settings',
		title: '',
		actionTitle: 'Zatwierdź',
	};
	// Extract values only
	const {formType, title, actionTitle} = formLabels;

	const form = (
		<form
			onSubmit={handleSubmit}
			className={`user-container__details-list modal-checklist__list form`}>
			<h1 className='form__title'>{title}</h1>
			{/* names are for FormData and id for labels */}
			<InputLogin
				embedded={true}
				formType={formType}
				type='text'
				id='type'
				name='type'
				label='Typ:'
				value={typeValue}
				onFocus={handleTypeFocus}
				onBlur={handleTypeBlur}
				onChange={handleTypeChange}
				required
				validationResults={typeValidationResults}
				didEdit={typeDidEdit}
				isFocused={typeIsFocused}
			/>
			<InputLogin
				embedded={true}
				formType={formType}
				type='date'
				id='date'
				name='date'
				label='Data startu:'
				value={dateValue}
				onFocus={handleDateFocus}
				onBlur={handleDateBlur}
				onChange={handleDateChange}
				validationResults={dateValidationResults}
				didEdit={dateDidEdit}
				isFocused={dateIsFocused}
			/>

			<InputLogin
				embedded={true}
				formType={formType}
				type='text'
				id='location'
				name='location'
				label='Miejsce:'
				value={locationValue}
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
				type='number'
				id='duration'
				name='duration'
				step='0.25'
				min='0'
				label='Czas trwania:'
				placeholder='h'
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
				type='decimal'
				id='price'
				name='price'
				label='Zadatek:'
				placeholder='zł'
				value={priceValue}
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
				<span className='material-symbols-rounded nav__icon'>restart_alt</span> Resetuj
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
			{form}
			{feedback.status !== undefined && (
				<UserFeedbackBox
					status={feedback.status}
					isPending={isEditProductDataPending}
					isError={isEditProductDataError}
					error={editProductDataError}
					successMsg={feedback.message}
					warnings={feedback.warnings}
					size='small'
				/>
			)}
		</>
	);
}

export default DetailsProductForm;
