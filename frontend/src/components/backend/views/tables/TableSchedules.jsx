import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFeedback } from '../../../../hooks/useFeedback.js';
import { getWeekDay } from '../../../../utils/dateTime.js';
import { mutateOnDelete, queryClient } from '../../../../utils/http.js';
import ToggleAddButton from '../../../backend/ToggleAddButton.jsx';
import FeedbackBox from '../../FeedbackBox.jsx';
import ModalTable from '../../ModalTable.jsx';
import WrapperModalTable from '../../WrapperModalTable.jsx';
import NewProductScheduleForm from './add-forms/NewProductScheduleForm.jsx';

function TableSchedules({ data, scheduleRecords, placement, status }) {
  console.log('TableSchedules scheduleRecords', scheduleRecords);
  let params = useParams();
  const isInPaymentView = placement == 'payment';
  const [deleteWarningTriggered, setDeleteWarningTriggered] = useState(false);
  const { feedback, updateFeedback, resetFeedback } = useFeedback();
  const [isFormVisible, setIsFormVisible] = useState();

  const {
    mutate: deleteScheduleRecord,
    isPending: deleteScheduleRecordIsPending,
    isError: deleteScheduleRecordIsError,
    error: deleteScheduleRecordError,
    reset,
  } = useMutation({
    mutationFn: formDataObj =>
      mutateOnDelete(
        status,
        formDataObj,
        `/api/admin-console/delete-schedule/${formDataObj.rowId}`
      ),

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

  const handleDelete = params => {
    console.log(params);
    reset();
    if (!deleteWarningTriggered && !params.isActionDisabled) {
      updateFeedback({
        confirmation: 0,
        message: '',
        warnings: [
          'Wszystkich powiązanych opinii',
          'Wszystkich powiązanych z terminem obecności, a więc wpłynie na statystyki zajęć i użytkowników',
          '(nie ma potrzeby usuwania terminu)',
        ],
      });
      setDeleteWarningTriggered(true);
    } else {
      resetFeedback();
      reset();
      deleteScheduleRecord(params);
    }
  };

  const handleCloseFeedback = () => {
    resetFeedback();
    setDeleteWarningTriggered(false);
  };

  let form;
  let processedScheduleRecordsArr = scheduleRecords;
  let headers = ['Id', 'Dzień', 'Data', 'Godzina', 'Lokacja', 'Frekwencja', ''];
  let keys = [
    'scheduleId',
    'day',
    'date',
    'startTime',
    'location',
    'attendance',
    '',
  ];
  let toggleBtn;
  if (isInPaymentView) {
    headers = [
      'Id',
      'Produkt (Id terminu)',
      'Data',
      'Dzień',
      'Godzina',
      'Lokacja',
      'Zadatek',
    ];
    keys = [
      'scheduleId',
      'productName',
      'date',
      'day',
      'startTime',
      'location',
      'productPrice',
    ];
  } else {
    toggleBtn = (
      <ToggleAddButton isEditing={isFormVisible} onToggle={setIsFormVisible} />
    );
    processedScheduleRecordsArr = scheduleRecords.map(schedule => {
      return {
        ...schedule,
        day: getWeekDay(schedule.date),
        attendance: `${schedule.participants}/${schedule.capacity} (${schedule.attendance}%)`,
        attendanceCount: schedule.attendance,
        isActionDisabled:
          schedule.participants > 0 || new Date(schedule.date) < new Date(),
      };
    });

    form = <NewProductScheduleForm defaultDataObj={data} />;
  }

  const shouldShowForm = !(
    feedback.status != undefined || deleteWarningTriggered
  );
  return (
    <>
      <WrapperModalTable
        content={processedScheduleRecordsArr}
        title={'Terminy'}
        noContentMsg={
          isInPaymentView
            ? 'żywych terminów w systemie - zostały usunięte'
            : 'opublikowanych terminów'
        }
        toggleBtn={toggleBtn}
        form={isFormVisible && form}
        shouldShowForm={shouldShowForm}
      >
        {(feedback.status != undefined || deleteWarningTriggered) && (
          <FeedbackBox
            onCloseFeedback={handleCloseFeedback}
            warnings={feedback.warnings}
            status={feedback.status}
            successMsg={feedback.message}
            isPending={deleteScheduleRecordIsPending}
            isError={deleteScheduleRecordIsError}
            error={deleteScheduleRecordError}
            size='small'
            counter={true}
          />
        )}
        <ModalTable
          classModifier={'admin-view'}
          headers={headers}
          keys={keys}
          content={processedScheduleRecordsArr}
          active={false}
          status={status}
          isAdminPage={true}
          adminActions={true}
          onQuickAction={[{ symbol: 'delete', method: handleDelete }]}
        />
      </WrapperModalTable>
    </>
  );
}

export default TableSchedules;
