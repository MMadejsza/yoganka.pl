import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { mutateOnEdit, queryClient } from '../../utils/http.js';
import ModalTable from './ModalTable.jsx';

function DetailsProductPayments({ type, stats, isAdminPage }) {
  console.log('\n✅✅✅DetailsProductPayments:');
  console.log('\nisAdminPage:', isAdminPage);

  let params = useParams();
  const { feedback, updateFeedback, resetFeedback } = useFeedback();
  let paymentsArray = stats.totalPayments;

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
      keys={[
        'paymentId',
        'date',
        'customerFullName',
        'amountPaid',
        'paymentMethod',
      ]}
      content={paymentsArray}
      active={false}
    />
  );

  const title =
    type === 'Camp' || type === 'Event'
      ? 'Płatności bezpośrednie'
      : 'Wszystkie płatności bezpośrednie - bezzwrotne';
  return (
    <>
      <h2 className='user-container__section-title modal__title--day admin-action'>
        {`${title} (${paymentsArray.length}):`}
      </h2>
      {table}
    </>
  );
}

export default DetailsProductPayments;
