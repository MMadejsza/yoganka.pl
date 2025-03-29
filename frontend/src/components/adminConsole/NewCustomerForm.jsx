import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStatus } from '../../hooks/useAuthStatus.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { useInput } from '../../hooks/useInput.js';
import { fetchData, mutateOnCreate, queryClient } from '../../utils/http.js';
import * as val from '../../utils/validation.js';
import InputLogin from '../login/InputLogin.jsx';
import FeedbackBox from './FeedbackBox.jsx';

function NewCustomerForm({ onClose }) {
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

  const usersOptionsList = usersList?.content?.sort(
    (a, b) => new Date(b.Zarejestrowany) - new Date(a.Zarejestrowany)
  );
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
    handleReset();
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
    <form
      onSubmit={handleSubmit}
      className={`user-container__details-list modal-checklist__list`}
    >
      <h1 className='form__title'>{title}</h1>
      {/* names are for FormData and id for labels */}
      <InputLogin
        embedded={true}
        formType={formType}
        type='select'
        options={usersOptionsList.map(userObj => ({
          label: `(ID: ${userObj.ID}) ${userObj.email}`,
          value: userObj.ID,
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
      <InputLogin
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
        className='form-switch-btn modal__btn  modal__btn--secondary modal__btn--small'
      >
        <span className='material-symbols-rounded nav__icon'>restart_alt</span>
        Resetuj
      </button>
      <button
        type='submit'
        className={`form-action-btn modal__btn modal__btn--small`}
      >
        <span className='material-symbols-rounded nav__icon'>check</span>{' '}
        {actionTitle}
      </button>
    </form>
  );

  return (
    <>
      {/* <section className={formType}> */}
      <div className='user-container modal__summary'>
        {form}
        {feedback.status !== undefined && (
          <FeedbackBox
            status={feedback.status}
            isPending={isCreateCustomerPending}
            isError={isCreateCustomerError}
            error={createCustomerError}
            successMsg={feedback.message}
            warnings={feedback.warnings}
            size='small'
          />
        )}
      </div>
      {/* </section> */}
    </>
  );
}

export default NewCustomerForm;
