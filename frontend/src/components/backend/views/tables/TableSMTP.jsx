import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStatus } from '../../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../../hooks/useFeedback.js';
import { mutateOnDelete, queryClient } from '../../../../utils/http.js';
import FeedbackBox from '../../FeedbackBox.jsx';
import ModalTable from '../../ModalTable.jsx';
import ToggleAddButton from '../../ToggleAddButton.jsx';
import WrapperModalTable from '../../WrapperModalTable.jsx';
import NewSMTPForm from './add-forms/NewSMTPForm.jsx';

function TableSMTP({ allSMTPs, isAdminPage, shouldToggleFrom }) {
  console.log('\n✅✅✅ TableSMTP:', allSMTPs);
  let params = useParams();

  const [isFormVisible, setIsFormVisible] = useState();
  const [deleteWarningTriggered, setDeleteWarningTriggered] = useState(false);
  const { data: status } = useAuthStatus();
  const { feedback, updateFeedback, resetFeedback } = useFeedback({
    getRedirectTarget: () => null,
    onClose: () => {},
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

  const form = <NewSMTPForm />;

  const toggleBtn = shouldToggleFrom && (
    <ToggleAddButton isEditing={isFormVisible} onToggle={setIsFormVisible} />
  );

  const headers = ['Id', 'Host', 'Port', 'Email'];

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
        deleteBookingRecordIsPending
        // ||
        // markAbsentIsPending ||
        // markPresentIsPending
      }
      isError={
        deleteBookingRecordIsError //|| markAbsentIsError || markPresentIsError
      }
      error={
        deleteBookingRecordError //|| markAbsentError || markPresentError
      }
      size='small'
      counter={true}
    />
  );

  const table = (
    <WrapperModalTable
      content={[]}
      title={''}
      noContentMsg={'skrzynek pocztowych'}
      toggleBtn={toggleBtn}
      form={isFormVisible && form}
      shouldShowForm={shouldShowForm}
    >
      {!deleteWarningTriggered && feedbackBox}
      <ModalTable
        classModifier={'admin-view'}
        headers={headers}
        keys={['SMTP_id', 'host', 'port', 'email', '']}
        content={[]}
        active={false}
        isAdminPage={isAdminPage}
        adminActions={true}
        onQuickAction={[
          {
            symbol: 'delete_forever',
            // method: tableObj => handleContact('mail', tableObj),
          },
        ]}
        status={status}
      />
    </WrapperModalTable>
  );

  return <>{table}</>;
}

export default TableSMTP;
