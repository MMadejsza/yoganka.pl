export function durationToSeconds(durationStrInMinutes = 0) {
  // const [hours, minutes, seconds] = durationStr.split(':').map(Number);
  // return hours * 3600 + minutes * 60 + seconds;
  return durationStrInMinutes * 60;
}
export function secondsToDuration(totalSeconds, limiter) {
  let days;
  if (limiter != 'hours') {
    days = Math.floor(totalSeconds / (24 * 3600));
    totalSeconds %= 24 * 3600;
  }
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Leading zeros
  const dd = String(days); //.padStart(2, '0');
  const hh = String(hours); //.padStart(2, '0');
  const mm = String(minutes); //.padStart(2, '0');
  const ss = String(seconds); //.padStart(2, '0');

  if (limiter == 'hours') {
    return { hours: hh, minutes: mm, seconds: ss };
  }

  return { days: dd, hours: hh, minutes: mm, seconds: ss };
}

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
      // second: '2-digit',
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

export const formatDuration = product => {
  const totalSeconds = durationToSeconds(product.duration);
  const splitDuration = secondsToDuration(totalSeconds);

  const areDays = splitDuration.days != '00' && splitDuration.days != 0;
  const areHours = splitDuration.hours != '00' && splitDuration.hours != 0;
  const areMinutes =
    splitDuration.minutes != '00' && splitDuration.minutes != 0;

  const formattedDuration = `${areDays ? splitDuration.days + ' dni' : ''} ${
    areHours ? splitDuration.hours + ' h' : ''
  } ${areMinutes ? splitDuration.minutes + ' m' : ''}`;

  return formattedDuration;
};
