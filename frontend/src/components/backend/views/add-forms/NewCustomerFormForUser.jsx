import { useInput } from '../../../../hooks/useInput.js';
import * as val from '../../../../utils/validation.js';
import WrapperForm from '../../../backend/WrapperForm.jsx';
import Input from '../../Input.jsx';
import Cookies from 'js-cookie';

function NewCustomerFormForUser({ onSave }) {
  // get eventually abandoned previously data
  const cookieData = Cookies.get('newCustomerFormData');
  const defaults = cookieData ? JSON.parse(cookieData) : {};
  
  // using custom hook with extracting and reassigning its 'return' for particular inputs and assign validation methods from imported utils. Every inout has its won state now
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
  } = useInput(defaults.fname ||'', val.firstNameValidations);
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
  } = useInput(defaults.lname ||'', val.lastNameValidations);
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
  } = useInput(defaults.dob ||'', val.dobValidations);
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
  } = useInput(defaults.phone || ' ', val.phoneValidations);
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
  } = useInput(defaults.cMethod || '');
  const {
    value: referralSourceValue,
    handleChange: handleReferralSourceChange,
    handleFocus: handleReferralSourceFocus,
    handleBlur: handleReferralSourceBlur,
    handleReset: handleReferralSourceReset,
    didEdit: referralSourceDidEdit,
    isFocused: referralSourceIsFocused,
    validationResults: referralSourceValidationResults,
    hasError: referralSourceHasError,
  } = useInput(defaults.rSource ||'');
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
  } = useInput(defaults.notes ||'', val.notesValidations);

  // Reset all te inputs
  const handleReset = () => {
    handleFirstNameReset();
    handleLastNameReset();
    handleDoBReset();
    handlePhoneReset();
    handleCMethodReset();
    handleReferralSourceReset();
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
      referralSourceHasError ||
      notesHasError
    ) {
      return;
    }
    console.log('Submit passed errors');


    const details = {
      isFirstTimeBuyer: false,
      cType: 'Indywidualny',
      fname: firstNameValue,
      lname: lastNameValue,
      dob: DoBValue,
      phone: phoneValue,
      cMethod: cMethodValue,
      rSource: referralSourceValue,
      notes: notesValue,
    }

    Cookies.set('newCustomerFormData', JSON.stringify(details), {
      expires: 3,
      path: '/grafik'
    });

    // passing given details to sabe as a customer in state of ViewSchedule
    onSave(details);
    handleReset();

    //! assign registration date
  };

  // Dynamically set descriptive names when switching from login in to registration
  const formLabels = {
    formType: 'newCustomer',
    title: '',
    actionTitle: 'Zapisz',
  };
  
  // Extract values only
  const { formType, title, actionTitle } = formLabels;
  const areErrors = [
    lastNameHasError,
    firstNameHasError,
    DoBHasError,
    phoneHasError,
  ].some(error => error);
  const areEmpty = [firstNameValue, lastNameValue, DoBValue, phoneValue].some(
    value => value.trim() === ''
  );

  const content = (
    <WrapperForm
      title={''}
      onSubmit={handleSubmit}
      onReset={handleReset}
      submitLabel={actionTitle}
      resetLabel='Resetuj'
      classModifier={`customer-first-purchase`}
    >
      {/* names are for FormData and id for labels */}
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
        classModifier={`customer-first-purchase`}
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
        classModifier={`customer-first-purchase`}
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
        max={val.minAge()}
        onFocus={handleDoBFocus}
        onBlur={handleDoBBlur}
        onChange={handleDoBChange}
        autoComplete='bday'
        required
        validationResults={DoBValidationResults}
        didEdit={DoBDidEdit}
        classModifier={`customer-first-purchase`}
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
        classModifier={`customer-first-purchase`}
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
        classModifier={`customer-first-purchase`}
        isFocused={cMethodIsFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='select'
        options={[
          { label: 'Wyszukiwarka', value: 'Google' },
          { label: 'Instagram', value: 'Instagram' },
          { label: 'Facebook', value: 'Facebook' },
          { label: 'Znajomy', value: 'Znajomy' },
          { label: 'Miejscówka', value: 'Miejscówka' },
          { label: 'Praca', value: 'Email' },
        ]}
        id='referralSource'
        name='referralSource'
        label='Źródło polecenia:'
        value={referralSourceValue}
        onFocus={handleReferralSourceFocus}
        onBlur={handleReferralSourceBlur}
        onChange={handleReferralSourceChange}
        validationResults={referralSourceValidationResults}
        didEdit={referralSourceDidEdit}
        classModifier={`customer-first-purchase`}
        isFocused={referralSourceIsFocused}
      />
      {(referralSourceValue == 'Znajomy' ||
        referralSourceValue == 'Miejscówka' ||
        referralSourceValue == 'Praca') && (
        <Input
          embedded={true}
          formType={formType}
          type='textarea'
          id='notes'
          name='notes'
          label='Odwdzięczamy się swoim partnerom - a dokładniej?  :)'
          value={notesValue}
          onFocus={handleNotesFocus}
          onBlur={handleNotesBlur}
          onChange={handleNotesChange}
          validationResults={notesValidationResults}
          didEdit={notesDidEdit}
          classModifier={`customer-first-purchase`}
          isFocused={notesIsFocused}
        />
      )}
    </WrapperForm>
  );

  return (
    <>
      <h1 className='modal__title modal__title--view'>{title}</h1>
      {content}
    </>
  );
}

export default NewCustomerFormForUser;
