import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useMutation, useQuery} from '@tanstack/react-query';
import {queryClient, fetchStatus} from '../../utils/http.js';
import {useInput} from '../../hooks/useInput.js';
import InputLogin from '../login/InputLogin.jsx';
import FeedbackBox from './FeedbackBox.jsx';
import * as val from '../../utils/validation.js';

function NewProductScheduleForm() {
	const params = useParams();
	let initialFeedbackConfirmation;
	const [feedbackConfirmation, setFeedbackConfirmation] = useState(initialFeedbackConfirmation);

	const {data: status} = useQuery({
		queryKey: ['authStatus'],
		queryFn: fetchStatus,
	});

	let successMsg;
	const {mutate, isPending, isError, error} = useMutation({
		mutationFn: (formData) => {
			return fetch(`/api/admin-console/create-schedule`, {
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
			queryClient.invalidateQueries([`/admin-console/show-all-products/${params.id}`]);
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
		value: shouldRepeatValue,
		handleChange: handleShouldRepeatChange,
		handleFocus: handleShouldRepeatFocus,
		handleBlur: handleShouldRepeatBlur,
		handleReset: handleShouldRepeatReset,
		didEdit: shouldRepeatDidEdit,
		isFocused: shouldRepeatIsFocused,
		validationResults: shouldRepeatValidationResults,
		hasError: shouldRepeatHasError,
	} = useInput(1);
	const {
		value: repeatValue,
		handleChange: handleRepeatChange,
		handleFocus: handleRepeatFocus,
		handleBlur: handleRepeatBlur,
		handleReset: handleRepeatReset,
		didEdit: repeatDidEdit,
		isFocused: repeatIsFocused,
		validationResults: repeatValidationResults,
		hasError: repeatHasError,
	} = useInput('');
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
	} = useInput('');
	const {
		value: timeValue,
		handleChange: handleTimeChange,
		handleFocus: handleTimeFocus,
		handleBlur: handleTimeBlur,
		handleReset: handleTimeReset,
		didEdit: timeDidEdit,
		isFocused: timeIsFocused,
		validationResults: timeValidationResults,
		hasError: timeHasError,
	} = useInput('');
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
		value: capacityValue,
		handleChange: handleCapacityChange,
		handleFocus: handleCapacityFocus,
		handleBlur: handleCapacityBlur,
		handleReset: handleCapacityReset,
		didEdit: capacityDidEdit,
		isFocused: capacityIsFocused,
		validationResults: capacityValidationResults,
		hasError: capacityHasError,
	} = useInput('', val.capacityValidations);

	// Reset all te inputs
	const handleReset = () => {
		setFeedbackConfirmation(undefined);
		handleDateReset();
		handleTimeReset();
		handleLocationReset();
		handleCapacityReset();
		handleRepeatReset();
		handleShouldRepeatReset();
	};

	// Submit handling
	const handleSubmit = async (e) => {
		e.preventDefault(); // No reloading
		console.log('Submit triggered');

		if (
			locationHasError ||
			capacityHasError ||
			dateHasError ||
			timeHasError ||
			shouldRepeatHasError ||
			repeatHasError
		) {
			return;
		}
		console.log('Submit passed errors');

		const fd = new FormData(e.target);
		const formDataObj = Object.fromEntries(fd.entries());
		formDataObj.productID = params.id;
		console.log('sent data:', formDataObj);
		mutate(formDataObj);
		handleReset();
	};

	// Dynamically set descriptive names when switching from login in to registration
	const formLabels = {
		formType: 'table',
		title: '',
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
			// size='small'
		/>
	);

	form = (
		<form
			// action='/api/login-pass/login'
			method='POST'
			onSubmit={handleSubmit}
			className={`table-form`}>
			<h1 className='form__title'>{title}</h1>

			<div className='table-form__content'>
				<InputLogin
					embedded={true}
					formType={formType}
					type='select'
					id='shouldRepeat'
					name='shouldRepeat'
					options={[
						{label: '1x', value: 1},
						{label: 'Co tydzień', value: 7},
						{label: 'Co miesiąc', value: 30},
						{label: 'Co rok', value: 365},
					]}
					value={shouldRepeatValue}
					onFocus={handleShouldRepeatFocus}
					onBlur={handleShouldRepeatBlur}
					onChange={handleShouldRepeatChange}
					validationResults={shouldRepeatValidationResults}
					didEdit={shouldRepeatDidEdit}
					isFocused={shouldRepeatIsFocused}
				/>
				<InputLogin
					embedded={true}
					formType={formType}
					type='number'
					id='repeatCount'
					name='repeatCount'
					step='1'
					min='0'
					max={shouldRepeatValue == 7 ? '52' : shouldRepeatValue == 30 ? '12' : null}
					label=''
					disabled={shouldRepeatValue == 1}
					placeholder='x razy'
					value={repeatValue}
					onFocus={handleRepeatFocus}
					onBlur={handleRepeatBlur}
					onChange={handleRepeatChange}
					validationResults={repeatValidationResults}
					didEdit={repeatDidEdit}
					isFocused={repeatIsFocused}
				/>
				<InputLogin
					embedded={true}
					formType={formType}
					type='date'
					id='date'
					name='date'
					label=''
					value={dateValue}
					onFocus={handleDateFocus}
					onBlur={handleDateBlur}
					onChange={handleDateChange}
					autoComplete='off'
					required
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
					label=''
					value={timeValue}
					required
					onFocus={handleTimeFocus}
					onBlur={handleTimeBlur}
					onChange={handleTimeChange}
					validationResults={timeValidationResults}
					didEdit={timeDidEdit}
					isFocused={timeIsFocused}
				/>
				<InputLogin
					embedded={true}
					formType={formType}
					type='text'
					id='location'
					name='location'
					label=''
					placeholder='Lokacja'
					value={locationValue}
					onFocus={handleLocationFocus}
					onBlur={handleLocationBlur}
					onChange={handleLocationChange}
					autoComplete='off'
					required
					validationResults={locationValidationResults}
					didEdit={locationDidEdit}
					isFocused={locationIsFocused}
				/>
				<InputLogin
					embedded={true}
					formType={formType}
					type='number'
					id='capacity'
					name='capacity'
					step='1'
					min='0'
					label=''
					placeholder='Ilość miejsc'
					required
					value={capacityValue}
					onFocus={handleCapacityFocus}
					onBlur={handleCapacityBlur}
					onChange={handleCapacityChange}
					validationResults={capacityValidationResults}
					didEdit={capacityDidEdit}
					isFocused={capacityIsFocused}
				/>
				<div className='action-btns'>
					<button
						type='reset'
						onClick={handleReset}
						className='form-switch-btn modal__btn--secondary  table-form-btn'>
						<span className='material-symbols-rounded nav__icon'>restart_alt</span>
					</button>
					<button
						type='submit'
						className={`form-action-btn table-form-btn table-form-btn--submit`}>
						<span className='material-symbols-rounded nav__icon'>check</span>
					</button>
				</div>
			</div>
		</form>
	);

	return (
		<>
			{form} {feedback}
		</>
	);
}

export default NewProductScheduleForm;
