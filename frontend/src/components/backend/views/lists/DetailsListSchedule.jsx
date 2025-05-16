import { useState } from 'react';
import { getWeekDay } from '../../../../utils/dateTime.js';
import {
  durationToSeconds,
  secondsToDuration,
} from '../../../../utils/statistics/statsUtils.js';
import ToggleEditButton from '../../../backend/ToggleEditButton.jsx';
import GenericList from '../../../common/GenericList.jsx';
import DetailsFormSchedule from './edit-forms/DetailsFormSchedule.jsx';

function DetailsListSchedule({ data, placement, isAdminPanel }) {
  console.log(
    `📝
	    Schedule object from backend:`,
    data
  );
  const isScheduleView = placement == 'scheduleView',
    schedule = data,
    product = data.Product,
    totalSeconds = durationToSeconds(product.duration),
    splitDuration =
      product.type == 'Camp'
        ? secondsToDuration(totalSeconds)
        : secondsToDuration(totalSeconds, 'hours'),
    formattedDuration = `${
      splitDuration.days != '0' && splitDuration.days
        ? splitDuration.days + ' dni'
        : ''
    } ${splitDuration.hours != '0' ? splitDuration.hours + ' h' : ''} ${
      splitDuration.minutes != '0' ? splitDuration.minutes + ' minut' : ''
    }`,
    isPassedSchedule =
      new Date(`${data.date}T${data.startTime}:00`) < new Date();

  const [isEditing, setIsEditing] = useState(false);
  const handleStartEditing = () => setIsEditing(true);
  const handleCloseEditing = () => setIsEditing(false);

  const details = [
    { label: isAdminPanel ? 'Id:' : 'Numer:', content: schedule.scheduleId },
    {
      label: 'Uczestnicy:',
      content: `${schedule.attendance} / ${schedule.capacity}`,
    },
    {
      label: 'Data:',
      content: `${schedule.date} (${getWeekDay(schedule.date)})`,
    },
    { label: 'Godzina:', content: schedule.startTime },
    { label: 'Długość:', content: formattedDuration },
    { label: 'Miejsce:', content: schedule.location },
  ];

  let content = isEditing ? (
    <DetailsFormSchedule scheduleData={data} />
  ) : (
    <GenericList title={`Szczegóły terminu:`} details={details} />
  );

  return (
    <>
      {content}
      {isScheduleView && isAdminPanel && !isPassedSchedule && (
        <ToggleEditButton
          isEditing={isEditing}
          onStartEditing={handleStartEditing}
          onCloseEditing={handleCloseEditing}
        />
      )}
    </>
  );
}

export default DetailsListSchedule;
