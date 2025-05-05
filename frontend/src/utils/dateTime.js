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
    // if we have already the polish format -don't try again(regex for that)
    if (
      typeof dateInput === 'string' &&
      /^\d{2}\.\d{2}\.\d{4}$/.test(dateInput)
    ) {
      return dateInput;
    }
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
      second: '2-digit',
      hour12: false,
    });
  } else formattedTime = '';

  // Concat
  if (isSchedule) {
    return `${formattedDate}`;
  }
  return `${formattedDate} (${getWeekDay(date)}${
    formattedTime ? ` - ` + formattedTime : ``
  })`;
};

export const parsePLDateAtEndOfDay = dateString => {
  // console.log(`parsePLDateAtEndOfDay [dateString]`, dateString);

  let parsePLDateAtEndOfDay;
  if (dateString.includes('.')) {
    const [day, month, year] = dateString.split('.');
    parsePLDateAtEndOfDay = new Date(year, month - 1, day, 23, 59, 59);
  } else if (dateString.includes('-')) {
    const [year, month, day] = dateString.split('-');
    parsePLDateAtEndOfDay = new Date(year, month - 1, day, 23, 59, 59);
  }
  // console.log(`parsePLDateAtEndOfDay`, parsePLDateAtEndOfDay);
  return parsePLDateAtEndOfDay;
};
