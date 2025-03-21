import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useQuery, useMutation} from '@tanstack/react-query';
import {queryClient, fetchItem, fetchStatus} from '../../utils/http.js';
import {useInput} from '../../hooks/useInput.js';
import InputLogin from '../login/InputLogin.jsx';
import UserFeedbackBox from './FeedbackBox.jsx';

function DetailsUserSettingsForm({settingsData, customerAccessed, adminAccessed}) {
	const params = useParams();
	let initialFeedbackConfirmation;
	const [feedbackConfirmation, setFeedbackConfirmation] = useState(initialFeedbackConfirmation);
	const [successMsg, setSuccessMsg] = useState(null);

	console.log('settingsData', settingsData);
	const {data: status} = useQuery({
		queryKey: ['authStatus'],
		queryFn: fetchStatus,
	});

	const queryKey = customerAccessed
		? ['formFilling', 'userSettings']
		: adminAccessed
		? ['formFilling', 'userSettings', settingsData?.UserPrefID || '']
		: null;
	const dynamicFetchAddress = customerAccessed
		? '/show-user-settings'
		: adminAccessed
		? `/admin-console/show-user-settings/${settingsData?.UserPrefID}`
		: null;
	const {
		data,
		isLoading: isFormLoading,
		isError: isFormError,
	} = useQuery({
		queryKey: queryKey,
		queryFn: ({signal}) => fetchItem(dynamicFetchAddress, {signal}),
		staleTime: 0,
		refetchOnMount: true,
		enabled: customerAccessed || adminAccessed,
	});
	console.log(data);

	const dynamicMutationAddress = customerAccessed
		? '/api/edit-user-settings'
		: adminAccessed
		? `/api/admin-console/edit-user-settings/${settingsData?.UserPrefID}`
		: null;
	console.log('dynamicMutationAddress', dynamicMutationAddress);

	const {mutate, isPending, isError, error} = useMutation({
		mutationFn: (formData) => {
			return fetch(dynamicMutationAddress, {
				method: 'PUT',
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
			queryClient.invalidateQueries(['query', '/show-account']);
			queryClient.invalidateQueries(['query', `/admin-console/show-all-users/${params.id}`]);
			if (res.confirmation) {
				setSuccessMsg(res.message);
				setFeedbackConfirmation(1);
			} else {
				setFeedbackConfirmation(0);
			}
		},
	});

	// Fallback to feed custom hooks when data isn't available
	const preferences = data?.preferences || {
		Handedness: false,
		FontSize: 14,
		Notifications: false,
		Animation: false,
		Theme: false,
	};

	// using custom hook with extracting and reassigning its 'return' for particular inputs and assign validation methods from imported utils. Every inout has its won state now

	const {
		value: handednessValue,
		handleChange: handleHandednessChange,
		handleFocus: handleHandednessFocus,
		handleBlur: handleHandednessBlur,
		handleReset: handleHandednessReset,
		didEdit: handednessDidEdit,
		isFocused: handednessIsFocused,
		validationResults: handednessValidationResults,
		hasError: handednessHasError,
	} = useInput(!!preferences.Handedness);

	const {
		value: fontValue,
		handleChange: handleFontChange,
		handleFocus: handleFontFocus,
		handleBlur: handleFontBlur,
		handleReset: handleFontReset,
		didEdit: fontDidEdit,
		isFocused: fontIsFocused,
		validationResults: fontValidationResults,
		hasError: fontHasError,
	} = useInput(preferences.FontSize);

	const {
		value: notificationsValue,
		handleChange: handleNotificationsChange,
		handleFocus: handleNotificationsFocus,
		handleBlur: handleNotificationsBlur,
		handleReset: handleNotificationsReset,
		didEdit: notificationsDidEdit,
		isFocused: notificationsIsFocused,
		validationResults: notificationsValidationResults,
		hasError: notificationsHasError,
	} = useInput(!!preferences.Notifications);

	const {
		value: animationsValue,
		handleChange: handleAnimationChange,
		handleFocus: handleAnimationFocus,
		handleBlur: handleAnimationBlur,
		handleReset: handleAnimationReset,
		didEdit: animationDidEdit,
		isFocused: animationIsFocused,
		validationResults: animationValidationResults,
		hasError: animationHasError,
	} = useInput(!!preferences.Animation);
	const {
		value: themeValue,
		handleChange: handleThemeChange,
		handleFocus: handleThemeFocus,
		handleBlur: handleThemeBlur,
		handleReset: handleThemeReset,
		didEdit: themeDidEdit,
		isFocused: themeIsFocused,
		validationResults: themeValidationResults,
		hasError: themeHasError,
	} = useInput(!!preferences.Theme);

	if (isFormLoading) return <div>Ładowanie...</div>;

	// Reset all te inputs
	const handleReset = () => {
		setFeedbackConfirmation(undefined);
		handleHandednessReset();
		handleFontReset();
		handleNotificationsReset();
		handleAnimationReset();
		handleThemeReset();
	};

	// Submit handling
	const handleSubmit = async (e) => {
		e.preventDefault(); // No reloading
		console.log('Submit triggered');

		if (
			handednessHasError ||
			fontHasError ||
			notificationsHasError ||
			animationHasError ||
			themeHasError
		) {
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
		formType: 'settings',
		title: '',
		actionTitle: 'Zatwierdź',
	};
	// Extract values only
	const {formType, title, actionTitle} = formLabels;

	let form;
	let feedback = feedbackConfirmation !== undefined && (
		<UserFeedbackBox
			status={feedbackConfirmation}
			isPending={isPending}
			isError={isError}
			error={error}
			successMsg={successMsg}
			size='small'
		/>
	);

	form = (
		<form
			onSubmit={handleSubmit}
			className={`user-container__details-list modal-checklist__list`}>
			<h1 className='form__title'>{title}</h1>
			{/* names are for FormData and id for labels */}
			<InputLogin
				embedded={true}
				formType={formType}
				type='checkbox'
				id='handedness'
				name='handedness'
				label='Pozycja menu:'
				value={handednessValue}
				checked={handednessValue}
				onFocus={handleHandednessFocus}
				onBlur={handleHandednessBlur}
				onChange={handleHandednessChange}
				autoComplete='handedness'
				validationResults={handednessValidationResults}
				didEdit={handednessDidEdit}
				isFocused={handednessIsFocused}
			/>
			<InputLogin
				embedded={true}
				formType={formType}
				type='number'
				id='font'
				name='font'
				label='Rozmiar czcionki:'
				min='10'
				max='16'
				value={fontValue}
				onFocus={handleFontFocus}
				onBlur={handleFontBlur}
				onChange={handleFontChange}
				validationResults={fontValidationResults}
				didEdit={fontDidEdit}
				isFocused={fontIsFocused}
			/>
			<InputLogin
				embedded={true}
				formType={formType}
				type='checkbox'
				id='notifications'
				name='notifications'
				label='Powiadomienia:'
				value={notificationsValue}
				checked={notificationsValue}
				onFocus={handleNotificationsFocus}
				onBlur={handleNotificationsBlur}
				onChange={handleNotificationsChange}
				validationResults={notificationsValidationResults}
				didEdit={notificationsDidEdit}
				isFocused={notificationsIsFocused}
			/>
			<InputLogin
				embedded={true}
				formType={formType}
				type='checkbox'
				id='animation'
				name='animation'
				label='Animacje'
				value={animationsValue}
				checked={animationsValue}
				onFocus={handleAnimationFocus}
				onBlur={handleAnimationBlur}
				onChange={handleAnimationChange}
				validationResults={animationValidationResults}
				didEdit={animationDidEdit}
				isFocused={animationIsFocused}
			/>
			<InputLogin
				embedded={true}
				formType={formType}
				type='checkbox'
				id='theme'
				name='theme'
				label='Motyw:'
				value={themeValue}
				checked={themeValue}
				onFocus={handleThemeFocus}
				onBlur={handleThemeBlur}
				onChange={handleThemeChange}
				validationResults={themeValidationResults}
				didEdit={themeDidEdit}
				isFocused={themeIsFocused}
			/>

			<button
				type='reset'
				onClick={handleReset}
				className='form-switch-btn modal__btn  modal__btn--secondary modal__btn--small'>
				<span className='material-symbols-rounded nav__icon'>restart_alt</span>Resetuj
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

export default DetailsUserSettingsForm;
