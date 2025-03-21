import {useParams} from 'react-router-dom';
import {useQuery, useMutation} from '@tanstack/react-query';
import {queryClient, fetchItem, mutateOnEdit} from '../../utils/http.js';
import {useInput} from '../../hooks/useInput.js';
import {useFeedback} from '../../hooks/useFeedback.js';
import {useAuthStatus} from '../../hooks/useAuthStatus.js';
import {phoneValidations} from '../../utils/validation.js';
import InputLogin from '../login/InputLogin.jsx';
import UserFeedbackBox from './FeedbackBox.jsx';

function DetailsCustomerForm({customerData, customerAccessed, adminAccessed}) {
	// console.log('DetailsCustomerForm customerAccessed adminAccessed', customerAccessed, adminAccessed);
	const params = useParams();
	const {feedback, updateFeedback, resetFeedback} = useFeedback();
	const {data: status} = useAuthStatus();

	const queryKey = customerAccessed
		? ['formFilling', 'putEditCustomerDetails']
		: adminAccessed
		? ['formFilling', 'putEditCustomerDetails', customerData.CustomerID]
		: null;
	const dynamicFetch = (signal) => {
		if (customerAccessed) return fetchItem('/customer/get-customer-details', {signal});
		else
			return fetchItem(`/admin-console/show-customer-data/${customerData.CustomerID}`, {
				signal,
			});
	};
	const {
		data,
		isLoading: isCustomerLoading,
		isEditCustomerDetailsError: isCustomerError,
	} = useQuery({
		queryKey,
		queryFn: ({signal}) => dynamicFetch(signal),
		staleTime: 0,
		refetchOnMount: true,
		enabled: customerAccessed || adminAccessed,
	});

	const dynamicMutationAddress = customerAccessed
		? '/api/customer' + '/edit-customer-data'
		: adminAccessed
		? `/api/admin-console` + `/edit-customer-data/${customerData.CustomerID}`
		: null;
	const {
		mutate: editCustomerDetails,
		isPending: isEditCustomerDetailsPending,
		isError: isEditCustomerDetailsError,
		error: editCustomerDetailsError,
	} = useMutation({
		mutationFn: (formDataObj) => mutateOnEdit(status, formDataObj, dynamicMutationAddress),
		onSuccess: (res) => {
			if (customerAccessed) queryClient.invalidateQueries(['query', '/show-account']);
			else
				queryClient.invalidateQueries([
					'query',
					`/admin-console/show-all-users/${params.id}`,
				]);

			// updating feedback
			updateFeedback(res);
		},
		onError: (err) => {
			// updating feedback
			updateFeedback(err);
		},
	});
	// Fallback to feed custom hooks when data isn't available
	const phoneDefault = data?.customer.Phone || ' ';
	const loyaltyDefault = data?.customer.Loyalty || 5;
	const notesDefault = data?.customer.Notes || ' ';
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
	} = useInput(loyaltyDefault);

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
	} = useInput(notesDefault);

	if (isCustomerLoading) return <div>Ładowanie...</div>;

	// Reset all te inputs
	const handleReset = () => {
		resetFeedback();

		handlePhoneReset();
		handleCMethodReset();
		handleLoyaltyReset();
		handleNotesReset();
	};

	// Submit handling
	const handleSubmit = async (e) => {
		e.preventDefault(); // No reloading
		// console.log('Submit triggered');

		if (phoneHasError || cMethodHasError || loyaltyHasError || notesHasError) {
			return;
		}
		console.log('Submit passed errors');

		const fd = new FormData(e.target);
		const formDataObj = Object.fromEntries(fd.entries());
		console.log('sent data:', formDataObj);
		editCustomerDetails(formDataObj);
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
					{label: 'Telefon', value: 'Telefon'},
					{label: 'Email', value: 'Email'},
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
			{adminAccessed && (
				<>
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
				</>
			)}

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
					isPending={isEditCustomerDetailsPending}
					isError={isEditCustomerDetailsError}
					error={editCustomerDetailsError}
					successMsg={feedback.message}
					warnings={feedback.warnings}
					size='small'
				/>
			)}
		</>
	);
}

export default DetailsCustomerForm;
