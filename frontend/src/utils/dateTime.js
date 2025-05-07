export const monthMap = {
  '01': 'Styczeń',
  '02': 'Luty',
  '03': 'Marzec',
  '04': 'Kwiecień',
  '05': 'Maj',
  '06': 'Czerwiec',
  '07': 'Lipiec',
  '08': 'Sierpień',
  '09': 'Wrzesień',
  10: 'Październik',
  11: 'Listopad',
  12: 'Grudzień',
};

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

export const formatIsoDateTime = (dateInput, onlyDate = false) => {
  // If we didn't get anything, there's nothing to format.
  if (!dateInput) {
    return '';
  }

  // Create a Date object. If it’s invalid, bail out with an empty string.
  const dateObj = new Date(dateInput);
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  // We use toISOString() to normalize the date to a standard format.
  const isoString = dateObj.toISOString();
  const normalized = new Date(isoString);

  // Extract just the date portion in YYYY-MM-DD format.
  let formattedDate = isoString.slice(0, 10);

  // If we want a locale-specific day/month/year, use toLocaleDateString.
  if (onlyDate) {
    formattedDate = normalized.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  // Now handle time. We only add it if the input had a time component.
  let formattedTime = '';
  if (isoString.length > 10) {
    // We force 24-hour format, with seconds.
    formattedTime = normalized.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  // If onlyDate is true, we return just the date string.
  if (onlyDate) {
    return formattedDate;
  }

  // Otherwise, combine date, weekday and time into one string.
  const weekday = getWeekDay(normalized);
  return `${formattedDate} (${weekday}${
    formattedTime ? ` – ${formattedTime}` : ''
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
