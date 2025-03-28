import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { mutateOnEdit, queryClient } from '../../utils/http.js';
import FeedbackBox from './FeedbackBox.jsx';
import ModalTable from './ModalTable.jsx';

function DetailsProductPayments({ type, stats, isAdminPage }) {
  console.log('\n✅✅✅DetailsProductPayments:');
  console.log('\nisAdminPage:', isAdminPage);

  let params = useParams();
  const { feedback, updateFeedback, resetFeedback } = useFeedback();
  let paymentsArray = stats.totalPayments || stats.payments;
  let cancelledPaymentsArr = paymentsArray.filter(b => b.Attendance == false);

  const { data: status } = useAuthStatus();

  const {
    mutate: markPresent,
    isPending: markPresentIsPending,
    isError: markPresentIsError,
    error: markPresentError,
  } = useMutation({
    mutationFn: formDataObj =>
      mutateOnEdit(status, formDataObj, `/api/admin-console/edit-mark-present`),

    onSuccess: res => {
      queryClient.invalidateQueries([
        `/admin-console/show-all-schedules/${params.id}`,
      ]);
      console.log('res', res);

      // updating feedback
      updateFeedback(res);
    },
    onError: err => {
      // updating feedback
      updateFeedback(err);
    },
  });

  const table = (
    <ModalTable
      headers={['ID', 'Data', 'Uczestnik', 'Zadatek', 'Metoda płatności']}
      keys={['PaymentID', 'Date', 'customer', 'AmountPaid', 'PaymentMethod']}
      content={paymentsArray}
      active={false}
    />
  );
  const cancelledTable = cancelledPaymentsArr?.length > 0 && (
    <>
      <h2 className='user-container__section-title modal__title--day'>
        {`Płatności anulowanych obecności (${cancelledPaymentsArr.length}):`}
      </h2>
      {feedback.status !== undefined && (
        <FeedbackBox
          status={feedback.status}
          isPending={markPresentIsPending}
          isError={markPresentIsError}
          error={markPresentError}
          successMsg={feedback.message}
          warnings={feedback.warnings}
          size='small'
        />
      )}
      <ModalTable
        headers={['ID', 'Data', 'Uczestnik', 'Zadatek', 'Metoda płatności', '']}
        keys={[
          'PaymentID',
          'Date',
          'customer',
          'AmountPaid',
          'PaymentMethod',
          '',
        ]}
        content={cancelledPaymentsArr}
        active={false}
        isAdminPage={isAdminPage}
        adminActions={true}
        onQuickAction={[{ symbol: 'restore', method: markPresent }]}
      />
    </>
  );

  const title =
    type === 'Camp' || type === 'Event' ? 'Płatności' : 'Wszystkie płatności';
  return (
    <>
      <h2 className='user-container__section-title modal__title--day'>
        {`${title} (${paymentsArray.length}):`}
      </h2>
      {table}
      {cancelledTable}
    </>
  );
}

export default DetailsProductPayments;
