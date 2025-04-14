import { useMutation } from '@tanstack/react-query';
import { useAuthStatus } from '../../../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../../../hooks/useFeedback.js';
import { useInput } from '../../../../../hooks/useInput.js';
import { formatIsoDateTime } from '../../../../../utils/dateTime.js';
import { mutateOnEdit, queryClient } from '../../../../../utils/http.js';
import * as val from '../../../../../utils/validation.js';
import WrapperForm from '../../../../backend/WrapperForm.jsx';
import FeedbackBox from '../../../FeedbackBox.jsx';
import Input from '../../../Input.jsx';

function DetailsFormProduct({ productData }) {
  const { data: status } = useAuthStatus();
  const { feedback, updateFeedback, resetFeedback } = useFeedback();

  const {
    mutate: editProductData,
    isPending: isEditProductDataPending,
    isError: isEditProductDataError,
    error: editProductDataError,
  } = useMutation({
    mutationFn: formDataObj =>
      mutateOnEdit(
        status,
        formDataObj,
        `/api/admin-console/edit-product-data/${productData.productId}`
      ),

    onSuccess: res => {
      queryClient.invalidateQueries([
        'query',
        `/admin-console/show-all-products/${productData.productId}`,
      ]);
      queryClient.invalidateQueries([
        'query',
        `/admin-console/show-all-products`,
      ]);
      // updating feedback
      updateFeedback(res);
    },
    onError: err => {
      // updating feedback
      updateFeedback(res);
    },
  });
  // Fallback to feed custom hooks when data isn't available
  const typeDefault = productData?.type || 'Class';
  const dateDefault = productData?.startDate || formatIsoDateTime(new Date());
  const locationDefault = productData?.location || ' ';
  const timeString = productData?.duration;
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const totalHours = hours + minutes / 60 + seconds / 3600;
  const durationDefault = totalHours || 1;
  const priceDefault = productData?.price || 500.0;
  const statusDefault = productData?.status || 'Aktywny';

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
  } = useInput(locationDefault, val.locationValidations);

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
  } = useInput(durationDefault, val.productDurationValidations);

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
  } = useInput(priceDefault, val.priceValidations);

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
  const handleSubmit = async e => {
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
      givenHoursToMinutes % 60
    ).padStart(2, '0')}:00`;
    formDataObj.duration = newDuration;
    formDataObj.price = parseFloat(formDataObj.price).toFixed(2);
    console.log('sent data:', JSON.stringify(formDataObj));

    editProductData(formDataObj);
    if (feedback.confirmation == 1) handleReset();
  };

  // Dynamically set descriptive names when switching from login in to registration
  const formLabels = {
    formType: 'settings',
    title: '',
    actionTitle: 'Zatwierdź',
  };
  // Extract values only
  const { formType, title, actionTitle } = formLabels;

  const form = (
    <WrapperForm
      title={title}
      onSubmit={handleSubmit}
      onReset={handleReset}
      submitLabel={actionTitle}
      resetLabel='Resetuj'
      classModifier={'product-view'}
    >
      {/* names are for FormData and id for labels */}
      <Input
        embedded={true}
        formType={formType}
        type='select'
        options={[
          { label: 'Online', value: 'Online' },
          { label: 'Stacjonarne', value: 'Class' },
          { label: 'Wydarzenie', value: 'Event' },
          { label: 'Wyjazd', value: 'Camp' },
        ]}
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
      <Input
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
      <Input
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
      <Input
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
      <Input
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
      <Input
        embedded={true}
        formType={formType}
        type='select'
        options={[
          { label: 'Aktywny', value: 'Aktywny' },
          { label: 'Zakończony', value: 'Zakończony' },
          { label: 'Zawieszony', value: 'Zawieszony' },
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
      />{' '}
      {feedback.status !== undefined && (
        <FeedbackBox
          onCloseFeedback={resetFeedback}
          status={feedback.status}
          isPending={isEditProductDataPending}
          isError={isEditProductDataError}
          error={editProductDataError}
          successMsg={feedback.message}
          warnings={feedback.warnings}
          size='small'
        />
      )}
    </WrapperForm>
  );
  return <>{form}</>;
}

export default DetailsFormProduct;
