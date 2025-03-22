import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { mutateOnEdit, queryClient } from '../../utils/http.js';
import FeedbackBox from './FeedbackBox.jsx';
import ModalTable from './ModalTable';

function DetailsProductBookings({ type, stats, isAdminPage }) {
  console.log('\n✅✅✅DetailsProductBookings:');
  console.log('\nisAdminPage:', isAdminPage);

  let params = useParams();
  const { feedback, updateFeedback, resetFeedback } = useFeedback();
  let bookingsArray = stats.totalBookings || stats.bookings;
  let cancelledBookingsArr = bookingsArray.filter(b => b.Attendance == false);

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
      headers={[
        'ID',
        'Data rezerwacji',
        'Uczestnik',
        'Zadatek',
        'Metoda płatności',
      ]}
      keys={['BookingID', 'Date', 'customer', 'AmountPaid', 'PaymentMethod']}
      content={bookingsArray}
      active={false}
    />
  );
  const cancelledTable = cancelledBookingsArr?.length > 0 && (
    <>
      <h2 className='user-container__section-title modal__title--day'>
        {`Rezerwacje anulowanych obecności (${cancelledBookingsArr.length}):`}
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
        headers={[
          'ID',
          'Data rezerwacji',
          'Uczestnik',
          'Zadatek',
          'Metoda płatności',
          '',
        ]}
        keys={[
          'BookingID',
          'Date',
          'customer',
          'AmountPaid',
          'PaymentMethod',
          '',
        ]}
        content={cancelledBookingsArr}
        active={false}
        isAdminPage={isAdminPage}
        adminActions={true}
        onQuickAction={[{ symbol: 'restore', method: markPresent }]}
      />
    </>
  );

  const title =
    type === 'Camp' || type === 'Event' ? 'Rezerwacje' : 'Wszystkie rezerwacje';
  return (
    <>
      <h2 className='user-container__section-title modal__title--day'>
        {`${title} (${bookingsArray.length}):`}
      </h2>
      {table}
      {cancelledTable}
    </>
  );
}

export default DetailsProductBookings;
