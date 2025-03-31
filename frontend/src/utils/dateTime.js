export const getWeekDay = dateStr => {
  const date = new Date(dateStr);
  const days = [
    'Niedziela',
    'Poniedziałek',
    'Wtorek',
    'Środa',
    'Czwartek',
    'Piątek',
    'Sobota',
  ];
  return days[date.getDay()];
};

export const formatIsoDateTime = (dateInput, isSchedule) => {
  // console.log(`formatIsoDateTime front utils dateInput`, dateInput);
  // console.log(`formatIsoDateTime front utils isSchedule`, isSchedule);
  const isoString =
    typeof dateInput === 'string'
      ? dateInput
      : new Date(dateInput).toISOString();

  // Create object Date
  const date = new Date(isoString);
  // format [date] [time (hh:mm)]
  let formattedDate = isoString.slice(0, 10);
  if (isSchedule) {
    formattedDate = date.toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  let formattedTime;
  if (isoString?.length != 10) {
    formattedTime = date.toLocaleString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } else formattedTime = '';

  // Concat
  if (isSchedule) {
    return `${formattedDate}`;
  }
  return `${formattedDate} (${getWeekDay(date)}${formattedTime ? ` - ` + formattedTime : ``})`;
};
