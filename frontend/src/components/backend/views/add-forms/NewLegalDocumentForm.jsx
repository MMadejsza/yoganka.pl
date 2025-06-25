import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStatus } from '../../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../../hooks/useFeedback.js';
import { useInput } from '../../../../hooks/useInput.js';
import { mutateOnCreate, queryClient } from '../../../../utils/http.js';
import WrapperForm from '../../../backend/WrapperForm.jsx';
import FeedbackBox from '../../FeedbackBox.jsx';
import Input from '../../Input.jsx';
import QlEditor from './QlEditor.jsx';

export default function NewLegalDocumentForm({ docType }) {
  const key =
    docType === 'tos'
      ? '/admin-console/show-all-tos-versions'
      : '/admin-console/show-all-gdpr-versions';
  const mutateEndpoint =
    docType === 'tos'
      ? '/api/admin-console/create-tos-version'
      : '/api/admin-console/create-gdpr-version';

  const { feedback, updateFeedback, resetFeedback } = useFeedback();
  const { data: status } = useAuthStatus();

  const { data: currentData, isLoading: listLoading } = useQuery({
    queryKey: ['data', key],
    queryFn: () => fetchData(key),
    staleTime: 10000,
  });
  console.log('NewLegalDocumentForm currentData', currentData);

  // 1. Wyciągamy tylko wersje
  const versionList = currentData?.content?.map(item => item.version) || [];

  // 2. Obliczamy kolejną wersję
  let nextVersion = 'v1.0.0';
  if (versionList.length > 0) {
    const sorted = [...versionList].sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );
    const last = sorted[sorted.length - 1]; // np. "v1.0.8"
    const [maj, min, pat] = last
      .slice(1) // usuń 'v'
      .split('.') // ["1","0","8"]
      .map(Number); // [1,0,8]
    nextVersion = `v${maj}.${min}.${pat + 1}`; // => "v1.0.9"
  }

  console.log(nextVersion);

  const {
    value: version,
    handleChange: onVersionChange,
    handleBlur: onVersionBlur,
    handleReset: resetVersion,
    didEdit: versionDidEdit,
    isFocused: versionIsFocused,
    validationResults: versionValidationResults,
    hasError: versionHasError,
  } = useInput(nextVersion, [
    { rule: v => v.trim().length > 0, message: 'Musisz podać nazwę wersji' },
    {
      //  format vX.X.X
      rule: v => /^v\d+\.\d+\.\d+$/.test(v),
      message: 'Format wersji musi być vX.X.X (np. v1.2.3)',
    },
  ]);

  const {
    value: content,
    handleChange: onContentChange,
    handleBlur: onContentBlur,
    handleReset: resetContent,
    didEdit: contentDidEdit,
    isFocused: contentIsFocused,
    validationResults: contentValidationResults,
    hasError: contentHasError,
  } = useInput('', [
    {
      rule: v => v.trim().length > 0,
      message: 'Musisz wprowadzić treść dokumentu',
    },
  ]);

  const {
    mutate: createDoc,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: formDataObj =>
      mutateOnCreate(status, formDataObj, mutateEndpoint),
    onSuccess: res => {
      queryClient.invalidateQueries([
        'data',
        docType === 'tos'
          ? '/admin-console/show-all-tos-versions'
          : '/admin-console/show-all-gdpr-versions',
      ]);
      updateFeedback(res);
    },
    onError: err => {
      updateFeedback(err);
    },
  });

  const handleReset = () => {
    resetFeedback();
    resetContent();
    resetVersion();
  };
  const handleSubmit = e => {
    e.preventDefault();
    // jeśli błąd walidacji, zatrzymaj
    if (versionHasError || contentHasError) {
      return;
    }
    console.log('Submit passed errors');

    console.log('sent data:', { version, content });

    createDoc({ version, content });
    if (feedback.confirmation == 1) {
      handleReset();
      queryClient.invalidateQueries([key]);
    }
  };

  return (
    <>
      <h1 className='modal__title modal__title--view'>
        {docType === 'tos' ? 'Nowa wersja regulaminu' : 'Nowa wersja RODO'}
      </h1>
      <WrapperForm
        title={''}
        onSubmit={handleSubmit}
        onReset={handleReset}
        submitLabel={'Zapisz'}
        resetLabel={'Resetuj'}
        disabled={isLoading}
      >
        <Input
          embedded
          formType='login'
          type='text'
          id='version'
          name='version'
          label='Wersja (format vX.X.X):'
          placeholder='v1.0.0'
          value={version}
          onChange={onVersionChange}
          onBlur={onVersionBlur}
          validationResults={versionValidationResults}
          didEdit={versionDidEdit}
          isFocused={versionIsFocused}
          required
        />

        <QlEditor
          id='content'
          name='content'
          label='Treść dokumentu:'
          value={content}
          onChange={onContentChange}
          onBlur={onContentBlur}
          validationResults={contentValidationResults}
          didEdit={contentDidEdit}
          required
        />

        {feedback.status !== undefined && (
          <FeedbackBox
            onCloseFeedback={resetFeedback}
            status={feedback.status}
            isPending={isLoading}
            isError={isError}
            error={error}
            successMsg={feedback.message}
            warnings={feedback.warnings}
            size='small'
          />
        )}
      </WrapperForm>
    </>
  );
}
