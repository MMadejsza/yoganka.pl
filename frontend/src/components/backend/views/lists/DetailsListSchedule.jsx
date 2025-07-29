import { useState } from 'react';
import { formatDuration, getWeekDay } from '../../../../utils/dateTime.js';
import { protectWordBreaks } from '../../../../utils/validation.js';
import ToggleEditButton from '../../../backend/ToggleEditButton.jsx';
import GenericList from '../../../common/GenericList.jsx';
import DetailsFormSchedule from './edit-forms/DetailsFormSchedule.jsx';

function DetailsListSchedule({ data, placement, isAdminPanel }) {
  console.log(
    `📝
	    Schedule object from backend:`,
    data
  );
  const isScheduleView = placement == 'scheduleView';
  const schedule = data;
  const product = data.Product;

  const attendanceViewData = {
    set: schedule.attendanceViewMode,
    default: schedule.Product.defaultAttendanceViewMode,
  };
  const attendanceViewMode = attendanceViewData.set ? 'set' : 'default';
  let attendanceLabel = 'Frekwencja:';
  let attendanceView = `${schedule.attendance} / ${schedule.capacity}`;

  if (!isAdminPanel)
    switch (attendanceViewData[attendanceViewMode]) {
      case 2:
        attendanceLabel = 'Obecność:';
        attendanceView = `${schedule.attendance} / ${schedule.capacity}`;
        break;
      case 1:
        attendanceLabel = 'Zapisanych:';
        attendanceView = `${
          schedule.attendance == 0 ? '' : schedule.attendance
        }`;
        break;
      case 0:
        attendanceLabel = 'Maks. osób:';
        attendanceView = `${schedule.capacity}`;
        break;
      default:
        attendanceLabel = undefined;
        attendanceView = undefined;
        break;
    }

  const isPassedSchedule =
    new Date(`${data.date}T${data.startTime}:00`) < new Date();

  const formattedDuration = formatDuration(product);

  const [isEditing, setIsEditing] = useState(false);
  const handleStartEditing = () => setIsEditing(true);
  const handleCloseEditing = () => setIsEditing(false);

  const details = [
    { label: isAdminPanel ? 'Id:' : 'Numer:', content: schedule.scheduleId },
    {
      label: attendanceLabel,
      content: attendanceView,
    },
    {
      label: 'Data:',
      content: `${schedule.date} (${getWeekDay(schedule.date)})`,
    },
    { label: 'Godzina:', content: schedule.startTime.slice(0, 5) },
    { label: 'Długość:', content: formattedDuration },
    { label: 'Miejsce:', content: protectWordBreaks(schedule.location) },
  ];

  let content = isEditing ? (
    <DetailsFormSchedule scheduleData={data} />
  ) : (
    <GenericList
      title={`Szczegóły terminu:`}
      details={details}
      attendanceView={attendanceView}
    />
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
