export function calculateAge(dateString) {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Decrease if before birthday
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}
export const calculateAgeMedian = agesArray => {
  if (agesArray.length === 0) return null; // No data
  const sortedAges = [...agesArray].sort((a, b) => a - b); // Sort increasingly
  const midIndex = Math.floor(sortedAges.length / 2);

  // If odd array
  if (sortedAges.length % 2 !== 0) {
    return sortedAges[midIndex];
  }

  // If even
  return (sortedAges[midIndex - 1] + sortedAges[midIndex]) / 2;
};
export function durationToSeconds(durationStr) {
  const [hours, minutes, seconds] = durationStr.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
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
export const calculateMode = agesArray => {
  const frequency = {};
  let maxFreq = 0;
  let mode = null;

  // Count frequency of each age
  agesArray.forEach(age => {
    frequency[age] = (frequency[age] || 0) + 1;
    if (frequency[age] > maxFreq) {
      maxFreq = frequency[age];
      mode = age;
    }
  });

  return mode;
};
