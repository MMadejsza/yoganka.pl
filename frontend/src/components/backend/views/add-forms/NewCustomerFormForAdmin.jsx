import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStatus } from '../../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../../hooks/useFeedback.js';
import { useInput } from '../../../../hooks/useInput.js';
import {
  fetchData,
  mutateOnCreate,
  queryClient,
} from '../../../../utils/http.js';
import * as val from '../../../../utils/validation.js';
import WrapperForm from '../../../backend/WrapperForm.jsx';
import FeedbackBox from '../../FeedbackBox.jsx';
import Input from '../../Input.jsx';

function NewCustomerFormForAdmin() {
  const { feedback, updateFeedback, resetFeedback } = useFeedback();
  const { data: status } = useAuthStatus();

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

  const usersOptionsList = usersList?.content
    ?.sort(
      (a, b) => new Date(b.registrationDate) - new Date(a.registrationDate)
    )
    .filter(u => u.role.toUpperCase() === 'USER');
  console.log('usersOptionsList: ', usersOptionsList);

  const {
    mutate: createCustomer,
    isPending: isCreateCustomerPending,
    isError: isCreateCustomerError,
    error: createCustomerError,
  } = useMutation({
    mutationFn: formDataObj =>
      mutateOnCreate(status, formDataObj, `/api/admin-console/create-customer`),

    onSuccess: res => {
      queryClient.invalidateQueries(['/admin-console/show-all-customers']);
      updateFeedback(res);
    },
    onError: err => {
      updateFeedback(err);
    },
  });

  // using custom hook with extracting and reassigning its 'return' for particular inputs and assign validation methods from imported utils. Every inout has its own state now
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
  } = useInput('');

  // Reset all te inputs
  const handleReset = () => {
    resetFeedback();

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
  const handleSubmit = async e => {
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

    createCustomer(formDataObj);
    if (feedback.confirmation == 1) handleReset();
  };

  // Dynamically set descriptive names when switching from login in to registration
  const formLabels = {
    formType: 'login',
    title: 'Przypisanie nowego profilu uczestnika',
    actionTitle: 'Zatwierdź',
  };

  // Extract values only
  const { formType, title, actionTitle } = formLabels;

  const form = usersList && (
    <WrapperForm
      title={''}
      onSubmit={handleSubmit}
      onReset={handleReset}
      submitLabel={actionTitle}
      resetLabel='Resetuj'
    >
      {/* names are for FormData and id for labels */}
      <Input
        embedded={true}
        formType={formType}
        type='select'
        options={usersOptionsList.map(userObj => ({
          label: `(Id: ${userObj.userId}) ${userObj.email}`,
          value: userObj.userId,
        }))}
        id='user'
        name='userId'
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
      <Input
        embedded={true}
        formType={formType}
        type='select'
        options={[
          { label: 'Indywidualny', value: 'Indywidualny' },
          { label: 'B2B', value: 'Biznesowy' },
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
      <Input
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
      <Input
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
      <Input
        embedded={true}
        formType={formType}
        type='date'
        id='dob'
        name='dob'
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
      <Input
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
      <Input
        embedded={true}
        formType={formType}
        type='select'
        options={[
          { label: 'Telefon', value: 'Telefon' },
          { label: 'Email', value: 'Email' },
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
      <Input
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
      <Input
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
      {feedback.status !== undefined && (
        <FeedbackBox
          onCloseFeedback={resetFeedback}
          status={feedback.status}
          isPending={isCreateCustomerPending}
          isError={isCreateCustomerError}
          error={createCustomerError}
          successMsg={feedback.message}
          warnings={feedback.warnings}
          size='small'
        />
      )}
    </WrapperForm>
  );

  return (
    <>
      <h1 className='modal__title modal__title--view'>{title}</h1>
      {form}
    </>
  );
}

export default NewCustomerFormForAdmin;
