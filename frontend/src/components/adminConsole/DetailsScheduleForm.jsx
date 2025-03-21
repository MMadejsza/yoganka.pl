import React, {useState} from 'react';
import {useQuery, useMutation} from '@tanstack/react-query';
import {queryClient, fetchStatus, mutateOnEdit} from '../../utils/http.js';
import {formatIsoDateTime} from '../../utils/dateTime.js';
import {useInput} from '../../hooks/useInput.js';
import InputLogin from '../login/InputLogin.jsx';
import UserFeedbackBox from './FeedbackBox.jsx';

function DetailsScheduleForm({scheduleData}) {
	// !dodaj 'zamknij zapisy
	let initialFeedbackConfirmation;
	const [feedbackConfirmation, setFeedbackConfirmation] = useState(initialFeedbackConfirmation);
	const [successMsg, setSuccessMsg] = useState(null);

	const {data: status} = useQuery({
		queryKey: ['authStatus'],
		queryFn: fetchStatus,
	});

	const {
		mutate: editScheduleData,
		isPending: isEditScheduleDataPending,
		isError: isEditScheduleDataError,
		error: editScheduleDataError,
		reset: editScheduleDataReset,
	} = useMutation({
		mutationFn: (formDataObj) =>
			mutateOnEdit(
				status,
				formDataObj,
				`/api/admin-console/edit-schedule-data/${scheduleData.ScheduleID}`,
			),
		onSuccess: (res) => {
			queryClient.invalidateQueries([
				'query',
				`/admin-console/show-all-schedules/${scheduleData.ScheduleID}`,
			]);
			queryClient.invalidateQueries(['query', `/admin-console/show-all-schedules`]);

			if (res.confirmation) {
				setSuccessMsg(res.message);
				setFeedbackConfirmation(1);
			} else {
				setFeedbackConfirmation(0);
			}
		},
	});
	// Fallback to feed custom hooks when data isn't available
	const capacityDefault = scheduleData?.Capacity || 'Class';
	const dateDefault = scheduleData?.Date || formatIsoDateTime(new Date());
	const startTimeDefault = scheduleData?.StartTime || '';
	const locationDefault = scheduleData?.Location || ' ';

	// using custom hook with extracting and reassigning its 'return' for particular inputs and assign validation methods from imported utils. Every inout has its won state now
	const {
		value: capacityValue,
		handleChange: handleCapacityChange,
		handleFocus: handleCapacityFocus,
		handleBlur: handleCapacityBlur,
		handleReset: handleCapacityReset,
		didEdit: capacityDidEdit,
		isFocused: capacityIsFocused,
		validationResults: capacityValidationResults,
		hasError: capacityHasError,
	} = useInput(capacityDefault);

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
		value: startTimeValue,
		handleChange: handleStartTimeChange,
		handleFocus: handleStartTimeFocus,
		handleBlur: handleStartTimeBlur,
		handleReset: handleStartTimeReset,
		didEdit: startTimeDidEdit,
		isFocused: startTimeIsFocused,
		validationResults: startTimeValidationResults,
		hasError: startTimeHasError,
	} = useInput(startTimeDefault);

	// if (isProductLoading) return <div>Ładowanie...</div>;
	// if (isProductError) return <div>Błąd ładowania ustawień.</div>;
	// console.log(data);

	// Reset all te inputs
	const handleReset = () => {
		setFeedbackConfirmation(undefined);
		handleCapacityReset();
		handleDateReset();
		handleStartTimeReset();
		handleLocationReset();
		editScheduleDataReset();
	};

	// Submit handling
	const handleSubmit = async (e) => {
		e.preventDefault(); // No reloading
		console.log('Submit triggered');

		if (capacityHasError || dateHasError || locationHasError || startTimeHasError) {
			return;
		}
		console.log('Submit passed errors');

		const fd = new FormData(e.target);
		const formDataObj = Object.fromEntries(fd.entries());
		formDataObj.capacity = parseInt(formDataObj.capacity);
		console.log('sent data:', JSON.stringify(formDataObj));

		editScheduleData(formDataObj);
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

	let form;
	let feedback = (feedbackConfirmation !== undefined || isEditScheduleDataError) && (
		<UserFeedbackBox
			status={feedbackConfirmation}
			successMsg={successMsg}
			isPending={isEditScheduleDataPending}
			isError={isEditScheduleDataError}
			error={editScheduleDataError}
			size='small'
		/>
	);

	form = (
		<form
			onSubmit={handleSubmit}
			className={`user-container__details-list modal-checklist__list form`}>
			<h1 className='form__title'>{title}</h1>
			{/* names are for FormData and id for labels */}
			<InputLogin
				embedded={true}
				formType={formType}
				type='number'
				id='capacity'
				name='capacity'
				label='Miejsc:'
				min={1}
				max={500}
				value={capacityValue}
				onFocus={handleCapacityFocus}
				onBlur={handleCapacityBlur}
				onChange={handleCapacityChange}
				required
				validationResults={capacityValidationResults}
				didEdit={capacityDidEdit}
				isFocused={capacityIsFocused}
			/>
			<InputLogin
				embedded={true}
				formType={formType}
				type='date'
				id='date'
				name='date'
				label='Data:'
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
				type='time'
				id='startTime'
				name='startTime'
				min='00:00'
				label='Godzina:'
				placeholder='Godzina'
				value={startTimeValue}
				onFocus={handleStartTimeFocus}
				onBlur={handleStartTimeBlur}
				onChange={handleStartTimeChange}
				validationResults={startTimeValidationResults}
				didEdit={startTimeDidEdit}
				isFocused={startTimeIsFocused}
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
			{form} {feedback}
		</>
	);
}

export default DetailsScheduleForm;
