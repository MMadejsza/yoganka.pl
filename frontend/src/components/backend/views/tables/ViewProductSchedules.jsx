import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFeedback } from '../../../../hooks/useFeedback.js';
import { getWeekDay } from '../../../../utils/dateTime.js';
import { mutateOnDelete, queryClient } from '../../../../utils/http.js';
import FeedbackBox from '../../FeedbackBox.jsx';
import ModalTable from '../../ModalTable.jsx';
import NewProductScheduleForm from './add-forms/NewProductScheduleForm.jsx';

function DetailsProductSchedules({ scheduleRecords, placement, status }) {
  console.log('DetailsProductSchedules scheduleRecords', scheduleRecords);
  let params = useParams();
  const isInPaymentView = placement == 'payment';
  const [isFormVisible, setIsFormVisible] = useState();
  const [deleteWarningTriggered, setDeleteWarningTriggered] = useState(false);
  const { feedback, updateFeedback, resetFeedback } = useFeedback();

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

  const notPublished = (
    <>
      <div style={{ fontWeight: 'bold', fontSize: '2rem' }}>
        Nie opublikowano
      </div>
    </>
  );

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
  let form;

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

    form = <NewProductScheduleForm />;
  }

  return (
    <>
      <h2 className='user-container__section-title modal__title--day admin-action '>
        Terminy
        {!isInPaymentView && (
          <button
            onClick={e => {
              e.preventDefault;
              setIsFormVisible(!isFormVisible);
            }}
            className={`form-action-btn table-form-btn table-form-btn--submit`}
          >
            <span className='material-symbols-rounded nav__icon nav__icon--side account'>
              {!isFormVisible ? 'add_circle' : 'undo'}
            </span>
          </button>
        )}
      </h2>
      {(feedback.status != undefined || deleteWarningTriggered) && (
        <FeedbackBox
          warnings={feedback.warnings}
          status={feedback.status}
          successMsg={feedback.message}
          isPending={deleteScheduleRecordIsPending}
          isError={deleteScheduleRecordIsError}
          error={deleteScheduleRecordError}
          size='small'
        />
      )}
      {isFormVisible && form}
      {scheduleRecords.length > 0 ? (
        <ModalTable
          headers={headers}
          keys={keys}
          content={processedScheduleRecordsArr}
          active={false}
          status={status}
          isAdminPage={true}
          adminActions={true}
          onQuickAction={[{ symbol: 'delete', method: handleDelete }]}
        />
      ) : (
        notPublished
      )}
    </>
  );
}

export default DetailsProductSchedules;
