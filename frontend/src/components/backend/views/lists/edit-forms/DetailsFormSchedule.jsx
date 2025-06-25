import { useMutation } from '@tanstack/react-query';
import { useAuthStatus } from '../../../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../../../hooks/useFeedback.js';
import { useInput } from '../../../../../hooks/useInput.js';
import { formatIsoDateTime } from '../../../../../utils/dateTime.js';
import { mutateOnEdit, queryClient } from '../../../../../utils/http.js';
import * as val from '../../../../../utils/validation.js';
// import Loader from '../../../../common/Loader.jsx';
import WrapperForm from '../../../../backend/WrapperForm.jsx';
import FeedbackBox from '../../../FeedbackBox.jsx';
import Input from '../../../Input.jsx';

function DetailsFormSchedule({ scheduleData }) {
  // !dodaj 'zamknij zapisy
  const { feedback, updateFeedback, resetFeedback } = useFeedback();
  const { data: status } = useAuthStatus();

  const {
    mutate: editScheduleData,
    isPending: isEditScheduleDataPending,
    isError: isEditScheduleDataError,
    error: editScheduleDataError,
    reset: editScheduleDataReset,
  } = useMutation({
    mutationFn: formDataObj =>
      mutateOnEdit(
        status,
        formDataObj,
        `/api/admin-console/edit-schedule-data/${scheduleData.scheduleId}`
      ),
    onSuccess: res => {
      queryClient.invalidateQueries([
        'query',
        `/admin-console/show-all-schedules/${scheduleData.scheduleId}`,
      ]);
      queryClient.invalidateQueries([
        'query',
        `/admin-console/show-all-schedules`,
      ]);

      // updating feedback
      updateFeedback(res);
    },
    onError: err => {
      // updating feedback
      updateFeedback(err);
    },
  });
  // Fallback to feed custom hooks when data isn't available
  const capacityDefault = scheduleData?.capacity || 10;
  const dateDefault = scheduleData?.date || formatIsoDateTime(new Date());
  const startTimeDefault = scheduleData?.startTime || '';
  const locationDefault = scheduleData?.location || ' ';

  // using custom hook with extracting and reassigning its 'return' for particular inputs and assign validation methods from imported utils. Every inout has its won state now
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
  } = useInput(capacityDefault);

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
    value: startTimeValue,
    handleChange: handleStartTimeChange,
    handleFocus: handleStartTimeFocus,
    handleBlur: handleStartTimeBlur,
    handleReset: handleStartTimeReset,
    didEdit: startTimeDidEdit,
    isFocused: startTimeIsFocused,
    validationResults: startTimeValidationResults,
    hasError: startTimeHasError,
  } = useInput(startTimeDefault);

  const {
    value: setAttendanceViewValue,
    handleChange: handleSetAttendanceViewChange,
    handleFocus: handleSetAttendanceViewFocus,
    handleBlur: handleSetAttendanceViewBlur,
    handleReset: handleSetAttendanceViewReset,
    didEdit: setAttendanceViewDidEdit,
    isFocused: setAttendanceViewIsFocused,
    validationResults: setAttendanceViewValidationResults,
    hasError: setAttendanceViewHasError,
  } = useInput('0');

  // if (isProductLoading) return <Loader label={'Ładowanie'} />;
  // if (isProductError) return <div>Błąd ładowania ustawień.</div>;
  // console.log(data);

  // Reset all te inputs
  const handleReset = () => {
    resetFeedback();

    handleCapacityReset();
    handleDateReset();
    handleStartTimeReset();
    handleLocationReset();
    editScheduleDataReset();
    handleSetAttendanceViewReset();
  };

  // Submit handling
  const handleSubmit = async e => {
    e.preventDefault(); // No reloading
    console.log('Submit triggered');

    if (
      capacityHasError ||
      dateHasError ||
      locationHasError ||
      startTimeHasError ||
      setAttendanceViewHasError
    ) {
      return;
    }
    console.log('Submit passed errors');

    const fd = new FormData(e.target);
    const formDataObj = Object.fromEntries(fd.entries());
    formDataObj.capacity = parseInt(formDataObj.capacity);
    console.log('sent data:', JSON.stringify(formDataObj));

    editScheduleData(formDataObj);
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
    >
      {/* names are for FormData and id for labels */}
      <Input
        embedded={true}
        formType={formType}
        type='number'
        id='capacity'
        name='capacity'
        label='Miejsc:'
        min={1}
        max={500}
        value={capacityValue}
        onFocus={handleCapacityFocus}
        onBlur={handleCapacityBlur}
        onChange={handleCapacityChange}
        required
        validationResults={capacityValidationResults}
        didEdit={capacityDidEdit}
        isFocused={capacityIsFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='date'
        id='date'
        name='date'
        label='Data:'
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
        type='time'
        id='startTime'
        name='startTime'
        min='00:00'
        label='Godzina:'
        placeholder='Godzina'
        value={startTimeValue}
        onFocus={handleStartTimeFocus}
        onBlur={handleStartTimeBlur}
        onChange={handleStartTimeChange}
        validationResults={startTimeValidationResults}
        didEdit={startTimeDidEdit}
        isFocused={startTimeIsFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='text'
        id='location'
        name='location'
        label='Miejsce:'
        placeholder='Miejsce'
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
        type='select'
        options={[
          { label: 'Pełna Frekwencja', value: 2 },
          { label: 'Tylko liczba os.', value: 1 },
          { label: 'Tylko pojemność', value: 0 },
          { label: 'Brak', value: -1 },
        ]}
        id='attendanceViewMode'
        name='attendanceViewMode'
        label='Widok osób:'
        value={setAttendanceViewValue}
        required
        onFocus={handleSetAttendanceViewFocus}
        onBlur={handleSetAttendanceViewBlur}
        onChange={handleSetAttendanceViewChange}
        validationResults={setAttendanceViewValidationResults}
        didEdit={setAttendanceViewDidEdit}
        isFocused={setAttendanceViewIsFocused}
      />
      {feedback.status !== undefined && (
        <FeedbackBox
          onCloseFeedback={resetFeedback}
          status={feedback.status}
          isPending={isEditScheduleDataPending}
          isError={isEditScheduleDataError}
          error={editScheduleDataError}
          successMsg={feedback.message}
          warnings={feedback.warnings}
          size='small'
        />
      )}
    </WrapperForm>
  );
  return <>{form}</>;
}

export default DetailsFormSchedule;
