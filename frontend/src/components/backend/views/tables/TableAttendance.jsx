import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStatus } from '../../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../../hooks/useFeedback.js';
import {
  mutateOnDelete,
  mutateOnEdit,
  queryClient,
} from '../../../../utils/http.js';
import ToggleAddButton from '../../../backend/ToggleAddButton.jsx';
import FeedbackBox from '../../FeedbackBox.jsx';
import ModalTable from '../../ModalTable.jsx';
import WrapperModalTable from '../../WrapperModalTable.jsx';
import NewBookingForm from './add-forms/NewBookingForm.jsx';

function TableAttendance({ allBookings, isAdminPage, shouldToggleFrom }) {
  // console.log('\n✅✅✅DetailsTableAttendance:');
  let attendedBookingsArray = allBookings.attendedBookings;
  let cancelledBookingsArray = allBookings.cancelledBookings;
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
    mutate: markPresent,
    isPending: markPresentIsPending,
    isError: markPresentIsError,
    error: markPresentError,
  } = useMutation({
    mutationFn: formDataObj => {
      setDeleteWarningTriggered(false);
      return mutateOnEdit(
        status,
        formDataObj,
        `/api/admin-console/edit-mark-present`
      );
    },

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

  const {
    mutate: deleteBookingRecord,
    isPending: deleteBookingRecordIsPending,
    isError: deleteBookingRecordIsError,
    error: deleteBookingRecordError,
    reset,
  } = useMutation({
    mutationFn: formDataObj => {
      resetFeedback();
      setDeleteWarningTriggered(false);
      return mutateOnDelete(
        status,
        formDataObj,
        `/api/admin-console/delete-booking-record`
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
      deleteBookingRecord(params);
    }
  };

  const handleCloseFeedback = () => {
    resetFeedback();
    setDeleteWarningTriggered(false);
  };

  const form = <NewBookingForm />;

  const toggleBtn = shouldToggleFrom && (
    <ToggleAddButton isEditing={isFormVisible} onToggle={setIsFormVisible} />
  );
  const headers = [
    'Id',
    'Metoda rezerwacji',
    'Data zapisania',
    'Uczestnik',
    '',
  ];

  const shouldShowForm = !(
    feedback.status != undefined || deleteWarningTriggered
  );

  const feedbackBox = (feedback.status != undefined ||
    deleteWarningTriggered) && (
    <FeedbackBox
      onCloseFeedback={handleCloseFeedback}
      warnings={feedback.warnings}
      status={feedback.status}
      successMsg={feedback.message}
      isPending={
        deleteBookingRecordIsPending ||
        markAbsentIsPending ||
        markPresentIsPending
      }
      isError={
        deleteBookingRecordIsError || markAbsentIsError || markPresentIsError
      }
      error={deleteBookingRecordError || markAbsentError || markPresentError}
      size='small'
      counter={true}
    />
  );

  const table = (
    <WrapperModalTable
      content={attendedBookingsArray}
      title={'Potwierdzone rezerwacje'}
      noContentMsg={'aktywnych rezerwacji'}
      toggleBtn={toggleBtn}
      form={isFormVisible && form}
      shouldShowForm={shouldShowForm}
    >
      {!deleteWarningTriggered && feedbackBox}
      <ModalTable
        classModifier={'admin-view'}
        headers={headers}
        keys={[
          'bookingId',
          'paymentMethod',
          'timestamp',
          'customerFullName',
          '',
        ]}
        content={attendedBookingsArray}
        active={false}
        isAdminPage={isAdminPage}
        adminActions={true}
        onQuickAction={[{ symbol: 'person_remove', method: markAbsent }]}
        status={status}
      />
    </WrapperModalTable>
  );

  const cancelledTable = (
    <WrapperModalTable
      content={cancelledBookingsArray}
      title={'Anulowane rezerwacje'}
      noContentMsg={'anulowanych rezerwacji'}
      shouldShowForm={shouldShowForm}
    >
      {feedbackBox}
      <ModalTable
        classModifier={'admin-view'}
        headers={headers}
        keys={[
          'bookingId',
          'paymentMethod',
          'timestamp',
          'customerFullName',
          '',
        ]}
        content={cancelledBookingsArray}
        active={false}
        isAdminPage={isAdminPage}
        adminActions={true}
        onQuickAction={[
          { extraClass: 'dimmed', symbol: 'delete', method: handleDelete },
          { symbol: 'restore', method: markPresent },
        ]}
        status={status}
      />
    </WrapperModalTable>
  );

  return (
    <>
      {table}

      {cancelledTable}
    </>
  );
}

export default TableAttendance;
