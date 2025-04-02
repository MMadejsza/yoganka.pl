import { useState } from 'react';
import { getWeekDay } from '../../../../utils/dateTime.js';
import {
  durationToSeconds,
  secondsToDuration,
} from '../../../../utils/statistics/statsUtils.js';
import DetailsScheduleForm from './forms/DetailsScheduleForm.jsx';

function DetailsSchedule({ data, placement, isAdminPanel }) {
  console.log(
    `📝
	    Schedule object from backend:`,
    data
  );
  const isScheduleView = placement == 'scheduleView';
  const schedule = data;
  const product = data.Product;
  const totalSeconds = durationToSeconds(product.duration);
  const splitDuration =
    product.type == 'Camp'
      ? secondsToDuration(totalSeconds)
      : secondsToDuration(totalSeconds, 'hours');
  const formattedDuration = `${
    splitDuration.days != '0' && splitDuration.days
      ? splitDuration.days + ' dni'
      : ''
  } ${splitDuration.hours != '0' ? splitDuration.hours + ' h' : ''} ${
    splitDuration.minutes != '0' ? splitDuration.minutes + ' minut' : ''
  }`;
  const isPassedSchedule =
    new Date(`${data.date}T${data.startTime}:00`) < new Date();

  const [isEditing, setIsEditing] = useState(false);
  const handleStartEditing = () => {
    setIsEditing(true);
  };
  const handleCloseEditing = () => {
    setIsEditing(false);
  };

  let content = isEditing ? (
    <DetailsScheduleForm scheduleData={data} />
  ) : (
    <ul className='user-container__details-list modal-checklist__list'>
      <li className='user-container__section-record modal-checklist__li'>
        <p className='user-container__section-record-label dimmed'>
          {isAdminPanel ? 'ID:' : 'Numer:'}
        </p>
        <p className='user-container__section-record-content dimmed'>
          {schedule.scheduleId}
        </p>
      </li>
      <li className='user-container__section-record modal-checklist__li'>
        <p className='user-container__section-record-label'>Uczestnicy:</p>
        <p className='user-container__section-record-content'>
          {`${schedule.attendance} / ${schedule.capacity}`}
        </p>
      </li>
      <li className='user-container__section-record modal-checklist__li'>
        <p className='user-container__section-record-label'>Data:</p>
        <p className='user-container__section-record-content'>
          {`${schedule.date} (${getWeekDay(schedule.date)})`}
        </p>
      </li>
      <li className='user-container__section-record modal-checklist__li'>
        <p className='user-container__section-record-label'>Godzina:</p>
        <p className='user-container__section-record-content'>
          {schedule.startTime}
        </p>
      </li>
      <li className='user-container__section-record modal-checklist__li'>
        <p className='user-container__section-record-label'>Długość:</p>
        <p className='user-container__section-record-content'>{`${formattedDuration}`}</p>
      </li>
      <li className='user-container__section-record modal-checklist__li'>
        <p className='user-container__section-record-label'>Miejsce:</p>
        <p className='user-container__section-record-content'>
          {schedule.location}
        </p>
      </li>
    </ul>
  );

  return (
    <>
      <h2 className='user-container__section-title modal__title--day'>{`Szczegóły terminu:`}</h2>
      {content}
      {isScheduleView && isAdminPanel && !isPassedSchedule && (
        <div className='user-container__action'>
          <button
            className='modal__btn'
            onClick={
              isEditing == false ? handleStartEditing : handleCloseEditing
            }
          >
            {isEditing == false ? (
              <>
                <span className='material-symbols-rounded nav__icon'>edit</span>{' '}
                Edytuj
              </>
            ) : (
              <>
                <span className='material-symbols-rounded nav__icon'>undo</span>{' '}
                Wróć
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}

export default DetailsSchedule;
