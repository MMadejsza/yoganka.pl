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
