import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus.js';
import { useFeedback } from '../../hooks/useFeedback';
import { mutateOnDelete, mutateOnEdit, queryClient } from '../../utils/http.js';
import FeedbackBox from './FeedbackBox.jsx';
import ModalTable from './ModalTable';
import NewAttendanceForm from './NewAttendanceForm';

function DetailsTableAttendance({ stats, isAdminPage }) {
  // console.log('\n✅✅✅DetailsTableAttendance:');
  let bookingsArray = stats.attendedBookings;
  let params = useParams();
  const [isFormVisible, setIsFormVisible] = useState();

  const [deleteWarningTriggered, setDeleteWarningTriggered] = useState(false);
  const { data: status } = useAuthStatus();
  const { feedback, updateFeedback, resetFeedback } = useFeedback({
    getRedirectTarget: () => null,
    onClose: () => {},
  });

  const {
    mutate: markAbsent,
    isPending: markAbsentIsPending,
    isError: markAbsentIsError,
    error: markAbsentError,
  } = useMutation({
    mutationFn: formDataObj => {
      resetFeedback();
      setDeleteWarningTriggered(false);
      return mutateOnEdit(
        status,
        formDataObj,
        `/api/admin-console/edit-mark-absent`
      );
    },

    onSuccess: res => {
      queryClient.invalidateQueries([
        `/admin-console/show-all-schedules/${params.id}`,
      ]);
      console.log('res', res);

      updateFeedback(res);
    },
    onError: err => {
      updateFeedback(err);
    },
  });

  const {
    mutate: deleteAttendanceRecord,
    isPending: deleteAttendanceRecordIsPending,
    isError: deleteAttendanceRecordIsError,
    error: deleteAttendanceRecordError,
    reset,
  } = useMutation({
    mutationFn: formDataObj => {
      setDeleteWarningTriggered(false);
      return mutateOnDelete(
        status,
        formDataObj,
        `/api/admin-console/delete-attendance-record`
      );
    },

    onSuccess: res => {
      queryClient.invalidateQueries([
        `/admin-console/show-all-schedules/${params.id}`,
      ]);
      console.log('res', res);

      updateFeedback(res);
    },
    onError: err => {
      updateFeedback(err);
    },
  });

  const handleDelete = params => {
    reset();
    if (!deleteWarningTriggered) {
      // 1st click
      updateFeedback({
        confirmation: 0,
        message: '',
        warnings: [
          'Rekordu wliczanego do statystyk w systemie. Nie powinno być potrzeby tego robić.',
          'Skontaktuj się z IT lub kliknij jeszcze raz w ciągu 5s w celu potwierdzenia.',
        ],
      });
      setDeleteWarningTriggered(true);
    } else {
      resetFeedback();
      reset();
      deleteAttendanceRecord(params);
    }
  };

  const table = (
    <ModalTable
      headers={['ID Ucz.', 'Data zapisania', 'Uczestnik', '']}
      keys={['customerId', 'timestamp', 'customerName', '']}
      content={bookingsArray}
      active={false}
      isAdminPage={isAdminPage}
      adminActions={true}
      onQuickAction={[
        { extraClass: 'dimmed', symbol: 'delete', method: handleDelete },
        { symbol: 'person_remove', method: markAbsent },
      ]}
    />
  );

  const form = <NewAttendanceForm />;

  return (
    <>
      <h2 className='user-container__section-title modal__title--day admin-action'>
        {`Obecność (${bookingsArray.length})`}
      </h2>
      {(feedback.status != undefined || deleteWarningTriggered) && (
        <FeedbackBox
          warnings={feedback.warnings}
          status={feedback.status}
          successMsg={feedback.message}
          isPending={deleteAttendanceRecordIsPending || markAbsentIsPending}
          isError={deleteAttendanceRecordIsError || markAbsentIsError}
          error={deleteAttendanceRecordError || markAbsentError}
          size='small'
        />
      )}
      {isFormVisible && form}
      {table}
    </>
  );
}

export default DetailsTableAttendance;
