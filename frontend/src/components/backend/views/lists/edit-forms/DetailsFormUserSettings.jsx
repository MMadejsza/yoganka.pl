import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useAuthStatus } from '../../../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../../../hooks/useFeedback.js';
import { useInput } from '../../../../../hooks/useInput.js';
import {
  fetchItem,
  mutateOnEdit,
  queryClient,
} from '../../../../../utils/http.js';
import WrapperForm from '../../../../backend/WrapperForm.jsx';
import FeedbackBox from '../../../FeedbackBox.jsx';
import Input from '../../../Input.jsx';
function DetailsFormUserSettings({
  title,
  settingsData,
  customerAccessed,
  adminAccessed,
  classModifier,
}) {
  const params = useParams();
  const { feedback, updateFeedback, resetFeedback } = useFeedback();
  const { data: status } = useAuthStatus();
  console.log('settingsData', settingsData);

  const queryKey = customerAccessed
    ? ['formFilling', 'userSettings']
    : adminAccessed
    ? ['formFilling', 'userSettings', settingsData?.userPrefId || params.id]
    : null;

  const dynamicFetchAddress = customerAccessed
    ? '/show-user-settings'
    : adminAccessed
    ? `/admin-console/show-user-settings/${settingsData?.userPrefId}`
    : null;

  const { data, isLoading: isFormLoading } = useQuery({
    queryKey,
    queryFn: ({ signal }) => fetchItem(dynamicFetchAddress, { signal }),
    staleTime: 0,
    refetchOnMount: true,
    enabled: customerAccessed || adminAccessed,
  });
  console.log(data);

  const dynamicMutationAddress = customerAccessed
    ? '/api/edit-user-settings'
    : adminAccessed
    ? `/api/admin-console/edit-user-settings/${params.id}`
    : null;
  console.log('dynamicMutationAddress', dynamicMutationAddress);

  const {
    mutate: editUserSettings,
    isPending: isEditUserSettingsPending,
    isError: isEditUserSettingsError,
    error: editUserSettingsError,
  } = useMutation({
    mutationFn: formDataObj =>
      mutateOnEdit(status, formDataObj, dynamicMutationAddress),

    onSuccess: res => {
      if (adminAccessed) {
        queryClient.invalidateQueries([
          'query',
          `/admin-console/show-all-users/${params.id}`,
        ]);
      } else {
        queryClient.invalidateQueries(queryKey);
      }

      // updating feedback
      updateFeedback(res);
    },

    onError: err => {
      // updating feedback
      updateFeedback(err);
    },
  });

  // Fallback to feed custom hooks when data isn't available
  const preferences = data?.preferences || {
    handedness: false,
    fontSize: 'M',
    notifications: false,
    animation: false,
    theme: false,
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
  } = useInput(!!preferences.handedness);

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
  } = useInput(preferences.fontSize);

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
  } = useInput(!!preferences.notifications);

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
  } = useInput(!!preferences.animation);
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
  } = useInput(!!preferences.theme);

  if (isFormLoading) return <div>Ładowanie...</div>;

  // Reset all te inputs
  const handleReset = () => {
    resetFeedback();

    handleHandednessReset();
    handleFontReset();
    handleNotificationsReset();
    handleAnimationReset();
    handleThemeReset();
  };

  // Submit handling
  const handleSubmit = async e => {
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
    editUserSettings(formDataObj);
    if (feedback.confirmation == 1) handleReset();

    //! assign registration date
  };

  // Dynamically set descriptive names when switching from login in to registration
  const formLabels = {
    formType: 'settings',
    formTitle: title,
    actionTitle: 'Zatwierdź',
  };
  // Extract values only
  const { formType, formTitle, actionTitle } = formLabels;

  const form = (
    <WrapperForm
      title={formTitle}
      onSubmit={handleSubmit}
      onReset={handleReset}
      submitLabel={actionTitle}
      resetLabel='Resetuj'
      classModifier={classModifier}
    >
      {/* names are for FormData and id for labels */}
      <Input
        embedded={true}
        formType={formType}
        type='checkbox'
        id='handedness'
        name='handedness'
        label='Menu po lewej:'
        value={handednessValue}
        checked={handednessValue}
        onFocus={handleHandednessFocus}
        onBlur={handleHandednessBlur}
        onChange={e => handleHandednessChange(e, 'menuPosition')}
        autoComplete='handedness'
        validationResults={handednessValidationResults}
        didEdit={handednessDidEdit}
        isFocused={handednessIsFocused}
        classModifier={classModifier}
      />
      <Input
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
        classModifier={classModifier}
      />
      <Input
        embedded={true}
        formType={formType}
        type='select'
        options={[
          { label: 'XS', value: 'XS' },
          { label: 'S', value: 'S' },
          { label: 'M', value: 'M' },
          { label: 'L', value: 'L' },
          { label: 'XL', value: 'XL' },
        ]}
        id='font'
        name='font'
        label='Rozmiar czcionki:'
        value={fontValue}
        onFocus={handleFontFocus}
        onBlur={handleFontBlur}
        onChange={e => handleFontChange(e, 'font')}
        validationResults={fontValidationResults}
        didEdit={fontDidEdit}
        isFocused={fontIsFocused}
        classModifier={classModifier}
      />
      {/* <Input
        embedded={true}
        formType={formType}
        type='checkbox'
        id='animation'
        name='animation'
        label='Animacje:'
        value={animationsValue}
        checked={animationsValue}
        onFocus={handleAnimationFocus}
        onBlur={handleAnimationBlur}
        onChange={handleAnimationChange}
        validationResults={animationValidationResults}
        didEdit={animationDidEdit}
        isFocused={animationIsFocused}classModifier={classModifier}
      /> */}
      {/* <Input
        embedded={true}
        formType={formType}
        type='checkbox'
        id='theme'
        name='theme'
        label='Ciemny motyw:'
        value={themeValue}
        checked={themeValue}
        onFocus={handleThemeFocus}
        onBlur={handleThemeBlur}
        onChange={handleThemeChange}
        validationResults={themeValidationResults}
        didEdit={themeDidEdit}
        isFocused={themeIsFocused}classModifier={classModifier}
      /> */}
      {feedback.status !== undefined && (
        <FeedbackBox
          onCloseFeedback={resetFeedback}
          status={feedback.status}
          isPending={isEditUserSettingsPending}
          isError={isEditUserSettingsError}
          error={editUserSettingsError}
          successMsg={feedback.message}
          warnings={feedback.warnings}
          size='small'
        />
      )}
    </WrapperForm>
  );

  return <>{form}</>;
}

export default DetailsFormUserSettings;
