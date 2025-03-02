import {useNavigate, useLocation} from 'react-router-dom';
import {useQuery, useMutation} from '@tanstack/react-query';
import {queryClient, fetchItem} from '../../utils/http.js';
import {useInput} from '../../hooks/useInput.js';
import InputLogin from '../login/InputLogin.jsx';

function DetailsUserSettingsForm() {
	const navigate = useNavigate();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const settingsConfirmation = params.get('settingsConfirmation');

	const {
		data,
		isLoading: isFormLoading,
		isError: isFormError,
	} = useQuery({
		queryKey: ['formFilling', 'userSettings'],
		queryFn: ({signal}) => fetchItem('/konto/ustawienia/preferencje', {signal}),
		staleTime: 0,
		refetchOnMount: true,
		enabled: location.pathname.includes('ustawienia'),
	});
	console.log(data);
	const {mutate, isPending, isError, error} = useMutation({
		mutationFn: (formData) => {
			return fetch('/api/konto/ustawienia/update/preferencje', {
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
			queryClient.invalidateQueries(['query', '/konto/ustawienia']);
			navigate('/konto/ustawienia?&settingsConfirmation=1');
		},
		onError: (error) => {
			window.alert(error.message);
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
	if (isFormError) return <div>Błąd ładowania ustawień.</div>;

	// Reset all te inputs
	const handleReset = () => {
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

	let content;
	if (isPending) {
		content = 'Wysyłanie...';
	} else if (isError) {
		content = `Błąd: ${error}'`;
	} else
		content = (
			<form
				action='/api/konto/ustawienia/update/preferencje'
				method='POST'
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
					Resetuj
				</button>
				<button
					type='submit'
					className={`form-action-btn modal__btn modal__btn--small`}>
					{actionTitle}
				</button>
				{settingsConfirmation && (
					<div className='user-container__section-record modal-checklist__li confirmation'>
						Zmiany zatwierdzone
					</div>
				)}
			</form>
		);

	return <>{content}</>;
}

export default DetailsUserSettingsForm;
