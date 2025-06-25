import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react'; // to avoid infinite loop with passing [] to useInput
import { useAuthStatus } from '../../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../../hooks/useFeedback.js';
import { useInput } from '../../../../hooks/useInput.js';
import {
  fetchData,
  mutateOnCreate,
  queryClient,
} from '../../../../utils/http.js';
import * as val from '../../../../utils/validation.js';
import FeedbackBox from '../../FeedbackBox.jsx';
import Input from '../../Input.jsx';
import WrapperForm from '../../WrapperForm.jsx';

const debugLogsTurnedOn = false;

function NewPassDefinitionForm() {
  const { feedback, updateFeedback, resetFeedback } = useFeedback();
  const { data: status } = useAuthStatus();

  const {
    mutate: createPassDefinition,
    isPending: isCreatePassDefinitionPending,
    isError: isCreatePassDefinitionError,
    error: createPassDefinitionError,
  } = useMutation({
    mutationFn: formDataObj =>
      mutateOnCreate(
        status,
        formDataObj,
        `/api/admin-console/create-pass-definition`
      ),

    onSuccess: res => {
      queryClient.invalidateQueries(['/admin-console/show-all-passes']);
      updateFeedback(res);
    },
    onError: err => {
      updateFeedback(err);
    },
  });

  const {
    data: productsList,
    isError: isProductsError,
    error: productsError,
  } = useQuery({
    // as id for later caching received data to not send the same request again where location.pathname is key
    queryKey: ['data', '/admin-console/show-all-products'],
    // definition of the code sending the actual request- must be returning the promise
    queryFn: () => fetchData('/admin-console/show-all-products'),
    // only when location.pathname is set extra beyond admin panel:
  });

  let formattedProductsTypes = [];
  if (productsList && productsList.content) {
    const seen = {};
    for (const product of productsList.content) {
      const type = product.type.toUpperCase();
      if (!seen[type]) {
        seen[type] = true;
        formattedProductsTypes.push({ label: product.type, value: type });
      }
    }
  }
  if (debugLogsTurnedOn) {
    console.log(productsList);
  }
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
  } = useInput('', val.productNameValidations);
  const defaultAllowedTypes = useMemo(() => [], []);

  const {
    value: allowedProductTypesValue,
    setValue: setAllowedProductTypesValue, //!
    // handleChange: handleAllowedProductTypesChange,
    handleFocus: handleAllowedProductTypesFocus,
    handleBlur: handleAllowedProductTypesBlur,
    handleReset: handleAllowedProductTypesReset,
    didEdit: allowedProductTypesDidEdit,
    isFocused: allowedProductTypesIsFocused,
    validationResults: allowedProductTypesValidationResults,
    hasError: allowedProductTypesHasError,
  } = useInput(defaultAllowedTypes);

  // to handle the state as an array with group values - not just one
  const handleAllowedProductTypesGroupChange = e => {
    const { value, checked } = e.target;
    setAllowedProductTypesValue(prev =>
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };

  const {
    value: validityDaysValue,
    handleChange: handleValidityDaysChange,
    handleFocus: handleValidityDaysFocus,
    handleBlur: handleValidityDaysBlur,
    handleReset: handleValidityDaysReset,
    didEdit: validityDaysDidEdit,
    isFocused: validityDaysIsFocused,
    validationResults: validityDaysValidationResults,
    hasError: validityDaysHasError,
  } = useInput('', val.validityDaysValidations);
  const {
    value: countValue,
    handleChange: handleCountChange,
    handleFocus: handleCountFocus,
    handleBlur: handleCountBlur,
    handleReset: handleCountReset,
    didEdit: countDidEdit,
    isFocused: countIsFocused,
    validationResults: countValidationResults,
    hasError: countHasError,
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
  const {
    value: descriptionValue,
    handleChange: handleDescriptionChange,
    handleFocus: handleDescriptionFocus,
    handleBlur: handleDescriptionBlur,
    handleReset: handleDescriptionReset,
    didEdit: descriptionDidEdit,
    isFocused: descriptionIsFocused,
    validationResults: descriptionValidationResults,
    hasError: descriptionHasError,
  } = useInput('');

  // Reset all te inputs
  const handleReset = () => {
    resetFeedback();

    handleNameReset();
    handleValidityDaysReset();
    handleCountReset();
    handlePriceReset();
    handleStatusReset();
    handleDescriptionReset();
    handleAllowedProductTypesReset();
  };

  // Submit handling
  const handleSubmit = async e => {
    e.preventDefault(); // No reloading
    console.log('Submit triggered');

    if (
      priceHasError ||
      statusHasError ||
      validityDaysHasError ||
      countHasError ||
      nameHasError ||
      descriptionHasError
    ) {
      return;
    }
    console.log('Submit passed errors');

    const fd = new FormData(e.target);
    const formDataObj = Object.fromEntries(fd.entries());
    formDataObj.allowedProductTypes = allowedProductTypesValue;
    console.log('sent data:', formDataObj);
    createPassDefinition(formDataObj);
    if (feedback.confirmation == 1) handleReset();
  };

  // Dynamically set descriptive names when switching from login in to registration
  const formLabels = {
    formType: 'login',
    title: 'Tworzenie definicji karnetu',
    actionTitle: 'Zatwierdź',
  };

  // Extract values only
  const { formType, title, actionTitle } = formLabels;

  const form = (
    <WrapperForm
      title={''}
      onSubmit={handleSubmit}
      onReset={handleReset}
      submitLabel={actionTitle}
      resetLabel='Resetuj'
    >
      <Input
        embedded={true}
        formType={formType}
        type='text'
        id='name'
        name='name'
        label='Nazwa karnetu w systemie: *'
        placeholder='Etykieta rozpoznawcza - dla uczestników'
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
      <Input
        embedded={true}
        formType={formType}
        type='checkbox'
        id='allowedProductTypes'
        name='allowedProductTypes'
        label='Obejmuje: *'
        value={allowedProductTypesValue} // ["CLASS", "EVENT"]
        onChange={handleAllowedProductTypesGroupChange}
        options={formattedProductsTypes}
      />
      <Input
        embedded={true}
        formType={formType}
        type='number'
        id='count'
        name='count'
        step='1'
        min='0'
        label='Ilość wejść:'
        placeholder='1...99'
        value={countValue}
        onFocus={handleCountFocus}
        onBlur={handleCountBlur}
        onChange={handleCountChange}
        validationResults={countValidationResults}
        didEdit={countDidEdit}
        isFocused={countIsFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='number'
        step='1'
        id='validityDays'
        name='validityDays'
        label='Ważny przez:'
        placeholder='Etykieta rozpoznawcza - dla uczestników (30 = miesiąc,60[...], 365 rok itp.)'
        value={validityDaysValue}
        autoComplete='off'
        onFocus={handleValidityDaysFocus}
        onBlur={handleValidityDaysBlur}
        onChange={handleValidityDaysChange}
        validationResults={validityDaysValidationResults}
        didEdit={validityDaysDidEdit}
        isFocused={validityDaysIsFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='decimal'
        id='price'
        name='price'
        label='Cena: *'
        value={priceValue}
        placeholder='Widoczna dla uczestników'
        required
        onFocus={handlePriceFocus}
        onBlur={handlePriceBlur}
        onChange={handlePriceChange}
        validationResults={priceValidationResults}
        didEdit={priceDidEdit}
        isFocused={priceIsFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='select'
        options={[
          { label: 'Aktywny', value: 1 },
          { label: 'Zakończony', value: -1 },
          { label: 'Zawieszony', value: 0 },
        ]}
        id='status'
        name='status'
        label='Status: *'
        value={statusValue}
        required
        onFocus={handleStatusFocus}
        onBlur={handleStatusBlur}
        onChange={handleStatusChange}
        validationResults={statusValidationResults}
        didEdit={statusDidEdit}
        isFocused={statusIsFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='textarea'
        id='description'
        name='description'
        label='Krótki opis w systemie: *'
        placeholder='Widoczny dla uczestników - opis sprzedażowy'
        cols='40'
        rows='10'
        value={descriptionValue}
        onFocus={handleDescriptionFocus}
        onBlur={handleDescriptionBlur}
        onChange={handleDescriptionChange}
        validationResults={descriptionValidationResults}
        didEdit={descriptionDidEdit}
        isFocused={descriptionIsFocused}
      />{' '}
      {feedback.status !== undefined && (
        <FeedbackBox
          onCloseFeedback={resetFeedback}
          status={feedback.status}
          isPending={isCreatePassDefinitionPending}
          isError={isCreatePassDefinitionError}
          error={createPassDefinitionError}
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

export default NewPassDefinitionForm;
