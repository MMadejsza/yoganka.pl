import { formatIsoDateTime, getWeekDay } from './dateTime.js';

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
export const calculateMedian = agesArray => {
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

//@ stats helpers
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

//@ stats calculation
export const calculateStats = customer => {
  console.log(`❗❗❗ calculateStats customer`, customer);
  // console.log(`calculateStats passed customer`, customer);
  const today = new Date().toISOString().split('T')[0];
  const scheduleRecords = [];
  const totalPayments = [];
  const invoices = [];
  const reviews = { keys: undefined, content: [] };
  let totalRevenue = 0;
  let totalTimeInSeconds = 0;
  let totalCampsAmount = 0;
  let totalEventsAmount = 0;
  let totalClassesAmount = 0;
  let totalOnlineAmount = 0;
  let totalSchedulesAmount =
    totalCampsAmount +
    totalEventsAmount +
    totalClassesAmount +
    totalOnlineAmount;
  // console.log(customer.Payments);
  for (let payment of customer.Payments) {
    totalRevenue += parseFloat(payment.amountPaid);

    totalPayments.push({
      ...payment,
      date: formatIsoDateTime(payment.date),
    });
    const invoice = payment.Invoice;
    if (!!invoice) {
      invoice.invoiceDate = formatIsoDateTime(invoice.invoiceDate);
      invoices.push(invoice);
    }
  }

  const attendedBookings = customer.Bookings?.filter(
    booking => booking.attendance == 1 || booking.attendance == true
  );
  for (let booking of attendedBookings) {
    // console.group(`schedule: ${schedule}`);
    const { ScheduleRecord: schedule } = booking;
    schedule.productType = schedule.Product.type;
    schedule.productName = schedule.Product.name;
    schedule.productDuration = schedule.Product.duration;
    schedule.day = getWeekDay(schedule.date);
    schedule.isUserGoing = true;

    scheduleRecords.push(schedule);

    const productType = schedule.productType.toUpperCase();
    // console.log(`scheduleDate >= today ${scheduleDate} ${today}`);
    if (schedule.date <= today) {
      totalSchedulesAmount += 1;
      if (productType === 'ONLINE' || productType === 'CLASS') {
        totalOnlineAmount += 1;
        // console.log(`totalOnlineAmount: ${totalOnlineAmount}`);
      } else if (productType === 'EVENT') {
        totalEventsAmount += 1;
        // console.log(`totalEventsAmount: ${totalEventsAmount}`);
      } else if (productType === 'CAMP') {
        totalCampsAmount += 1;
        // console.log(`totalCampsAmount: ${totalCampsAmount}`);
      }
      totalTimeInSeconds += durationToSeconds(schedule.productDuration);
      // console.log(`totalTimeInSeconds: ${totalTimeInSeconds}`);
      // console.groupEnd();
    }

    if (schedule.Feedbacks && schedule.Feedbacks.length > 0) {
      // Customer can review the schedule only once
      const feedback = schedule.Feedbacks[0];

      reviews.keys = [
        'feedbackId',
        'submissionDate',
        'product',
        'schedule',
        'rating',
        'content',
        'delay',
      ];
      reviews.content.push({
        ...feedback,
        product: `${schedule.Product.name}`,
        schedule: `
        (ID: ${schedule.scheduleId})
        ${schedule.date} ${getWeekDay(schedule.date)}
        ${schedule.startTime}`,
        submissionDate: formatIsoDateTime(feedback.submissionDate),
      });
    }
  }

  const splitDuration = secondsToDuration(totalTimeInSeconds, 'hours');
  const stats = {
    records: scheduleRecords,
    recordsKeys: [
      '',
      'scheduleId',
      'date',
      'day',
      'startTime',
      'productType',
      'productName',
      'location',
    ],
    payments: totalPayments,
    reviews: reviews,
    invoices: invoices,
    revenue: `${Math.round(totalRevenue * 100) / 100}zł`,
    schedulesAmount: {
      total: totalSchedulesAmount,
      breakdown: {
        classes: totalSchedulesAmount,
        online: totalOnlineAmount,
        events: totalEventsAmount,
        camps: totalCampsAmount,
      },
    },
    totalHours: `${splitDuration.hours}:${splitDuration.minutes}`,
  };

  console.log(`❗❗❗ calculateStats stats`, stats);

  return stats;
};
