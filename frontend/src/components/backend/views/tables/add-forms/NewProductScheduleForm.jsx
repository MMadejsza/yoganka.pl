import { useMutation } from '@tanstack/react-query';
import { useLocation, useParams } from 'react-router-dom';
import { useAuthStatus } from '../../../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../../../hooks/useFeedback.js';
import { useInput } from '../../../../../hooks/useInput.js';
import { mutateOnCreate, queryClient } from '../../../../../utils/http.js';
import WrapperForm from '../../../../backend/WrapperForm.jsx';
import FeedbackBox from '../../../FeedbackBox.jsx';
import Input from '../../../Input.jsx';

function NewProductScheduleForm({ defaultDataObj }) {
  const params = useParams();
  const location = useLocation();

  const { feedback, updateFeedback, resetFeedback } = useFeedback();

  const { data: status } = useAuthStatus();

  const {
    mutate: createSchedule,
    isPending: isCreateSchedulePending,
    isError: isCreateScheduleError,
    error: createScheduleError,
  } = useMutation({
    mutationFn: formDataObj =>
      mutateOnCreate(status, formDataObj, `/api/admin-console/create-schedule`),

    onSuccess: res => {
      queryClient.invalidateQueries([
        `/admin-console/show-all-products/${params.id}`,
      ]);
      updateFeedback(res);
    },
    onError: err => {
      updateFeedback(err);
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
  } = useInput(defaultDataObj?.startDate || '');
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
    validationResults: locationInTableValidationsResults,
    hasError: locationHasError,
  } = useInput(defaultDataObj?.location || '');
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
  } = useInput('');

  // Reset all te inputs
  const handleReset = () => {
    resetFeedback();

    handleDateReset();
    handleTimeReset();
    handleLocationReset();
    handleCapacityReset();
    handleRepeatReset();
    handleShouldRepeatReset();
  };

  // Submit handling
  const handleSubmit = async e => {
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
    if (location.pathname.includes('show-all-products')) {
      formDataObj.productId = params.id;
    }
    console.log('sent data:', formDataObj);
    createSchedule(formDataObj);
    if (feedback.confirmation == 1) handleReset();
  };

  // Dynamically set descriptive names when switching from login in to registration
  const formLabels = {
    formType: 'table',
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
      isTableRowLike={true}
    >
      <Input
        embedded={true}
        formType={formType}
        type='select'
        id='shouldRepeat'
        name='shouldRepeat'
        options={[
          { label: '1x', value: 1 },
          { label: 'Co tydzień', value: 7 },
          { label: 'Co miesiąc', value: 30 },
          { label: 'Co rok', value: 365 },
        ]}
        value={shouldRepeatValue}
        onFocus={handleShouldRepeatFocus}
        onBlur={handleShouldRepeatBlur}
        onChange={handleShouldRepeatChange}
        validationResults={shouldRepeatValidationResults}
        didEdit={shouldRepeatDidEdit}
        isFocused={shouldRepeatIsFocused}
        classModifier={'table-form'}
      />
      <Input
        embedded={true}
        formType={formType}
        type='number'
        id='repeatCount'
        name='repeatCount'
        step='1'
        min='2'
        max={
          shouldRepeatValue == 7 ? '52' : shouldRepeatValue == 30 ? '12' : null
        }
        label=''
        disabled={shouldRepeatValue == 1}
        placeholder='x razy'
        value={repeatValue}
        onFocus={handleRepeatFocus}
        onBlur={handleRepeatBlur}
        onChange={handleRepeatChange}
        validationResults={repeatValidationResults}
        didEdit={repeatDidEdit}
        classModifier={'table-form'}
        isFocused={repeatIsFocused}
      />
      <Input
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
        classModifier={'table-form'}
        isFocused={dateIsFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='time'
        id='startTime'
        name='startTime'
        min='00:00'
        label=''
        value={timeValue}
        required
        onFocus={handleTimeFocus}
        onBlur={handleTimeBlur}
        onChange={handleTimeChange}
        validationResults={timeValidationResults}
        didEdit={timeDidEdit}
        classModifier={'table-form'}
        isFocused={timeIsFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='text'
        id='location'
        name='location'
        label=''
        placeholder='Miejsce'
        maxLength='25'
        value={locationValue}
        onFocus={handleLocationFocus}
        onBlur={handleLocationBlur}
        onChange={handleLocationChange}
        autoComplete='off'
        required
        validationResults={locationInTableValidationsResults}
        didEdit={locationDidEdit}
        classModifier={'table-form'}
        isFocused={locationIsFocused}
      />
      <Input
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
        classModifier={'table-form'}
        isFocused={capacityIsFocused}
      />
    </WrapperForm>
  );

  return (
    <>
      {feedback.status !== undefined && (
        <FeedbackBox
          onCloseFeedback={resetFeedback}
          status={feedback.status}
          isPending={isCreateSchedulePending}
          isError={isCreateScheduleError}
          error={createScheduleError}
          successMsg={feedback.message}
          warnings={feedback.warnings}
          size='small'
        />
      )}
      {form}
    </>
  );
}

export default NewProductScheduleForm;
