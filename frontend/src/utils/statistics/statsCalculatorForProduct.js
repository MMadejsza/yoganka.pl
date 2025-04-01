import { formatIsoDateTime } from '../dateTime.js';
import {
  calculateAge,
  calculateAgeMedian,
  durationToSeconds,
  secondsToDuration,
} from './statsUtils.js';

//@ stats calculation
export const statsCalculatorForProduct = (product, schedules) => {
  console.log(`❗❗❗ statsCalculatorForProduct product`, product);
  console.log(`❗❗❗ statsCalculatorForProduct schedules`, schedules);
  console.log(`schedules: `, schedules);

  // Outcome arrays
  const attendedBookings = []; // Bookings with attendance = 1
  const allBookings = [];
  const scheduleRecords = []; // Podsumowanie na poziomie harmonogramu
  const payments = []; // Unique Payments (direct payments)
  const reviews = [];
  const participantAges = [];
  const sessionParticipantsArr = [];
  const sessionReviewersPercentageArr = [];
  const passesUsed = [];

  // Global counters
  let totalRevenue = 0;
  let totalDirectPayments = 0;
  let totalWithPassesPayments = 0;
  let totalTimeInSeconds = 0;
  let totalSchedules = 0;
  let totalParticipantsAmount = 0;
  let totalCapacity = 0;
  let totalReviews = 0;
  let sumFeedbackRating = 0;
  let feedbackCount = 0;

  // To not count multiple Payment (if 1 payment is for many Bookings - future feature)
  const countedPaymentIds = new Set();

  //@ SCHEDULE Level
  for (let schedule of schedules) {
    totalSchedules += 1;
    totalCapacity += schedule.capacity;

    //# Feedbacks
    let sessionReviewsCount = 0;
    if (schedule.Feedbacks && schedule.Feedbacks.length > 0) {
      totalReviews += schedule.Feedbacks.length;
      sessionReviewsCount = schedule.Feedbacks.length;

      schedule.Feedbacks.forEach(feedback => {
        sumFeedbackRating += feedback.rating;
        feedbackCount++;

        reviews.push({
          ...feedback,
          rowId: feedback.feedbackId,
          submissionDate: formatIsoDateTime(feedback.submissionDate),
          customerFullName: `${feedback.Customer.firstName} ${feedback.Customer.lastName}`,
        });
      });
    }

    // Fetch bookings
    const bookings = schedule.Bookings ?? [];
    let scheduleParticipantsAmount = 0;
    let directPaymentCount = 0; //bookings paid directly

    // If bookings exist - add timing
    if (bookings.length > 0) {
      totalTimeInSeconds += durationToSeconds(product.duration);
    }

    // # BOOKING Level
    for (let booking of bookings) {
      let bookingValue = 0;
      let method = '';
      const formattedCustomer = booking.Customer
        ? `${booking.Customer.firstName} ${booking.Customer.lastName} (${booking.Customer.customerId})`
        : '';

      // Check if direct payment
      if (booking.paymentId && booking.Payment) {
        bookingValue = parseFloat(booking.Payment.amountPaid);
        method = booking.Payment.paymentMethod;

        // Income counted only once
        if (!countedPaymentIds.has(booking.Payment.paymentId)) {
          totalRevenue += bookingValue;
          countedPaymentIds.add(booking.Payment.paymentId);
          payments.push({
            ...booking.Payment,
            rowId: booking.Payment.paymentId,
            customerFullName: formattedCustomer,
            date: formatIsoDateTime(booking.Payment.date),
          });
        }
        directPaymentCount++;
        totalDirectPayments++;
      } else if (booking.customerPassId && booking.CustomerPass) {
        // Booking opłacony passem – przychód nie jest dodawany
        method = booking.CustomerPass.PassDefinition.name;
        bookingValue = 0;
        totalWithPassesPayments++;
        passesUsed.push({
          ...booking.CustomerPass,
          rowId: booking.CustomerPass.customerPassId,
        });
      }

      // If booking is being attended
      if (booking.attendance) {
        scheduleParticipantsAmount += 1;
        totalParticipantsAmount += 1;

        // If available - add age
        if (booking.Customer && booking.Customer.dob) {
          participantAges.push(calculateAge(booking.Customer.dob));
        }

        // Budujemy rekord attendedBookings – zachowujemy te same klucze co wcześniej
        attendedBookings.push({
          ...booking,
          rowId: booking.bookingId,
          timestamp: formatIsoDateTime(booking.timestamp),
          customerFullName: formattedCustomer,
          paymentMethod: method,
        });
      }

      allBookings.push({
        ...booking,
        rowId: booking.bookingId,
        timestamp: formatIsoDateTime(booking.timestamp),
        customerFullName: formattedCustomer,
        paymentMethod: method,
      });
    }

    // Wyliczamy procentową frekwencję dla harmonogramu
    const scheduleAttendance =
      schedule.capacity > 0
        ? Math.round((scheduleParticipantsAmount / schedule.capacity) * 100)
        : 0;

    sessionParticipantsArr.push(scheduleParticipantsAmount);
    const sessionReviewersPercentage =
      scheduleParticipantsAmount > 0
        ? (sessionReviewsCount / scheduleParticipantsAmount) * 100
        : 0;
    sessionReviewersPercentageArr.push(sessionReviewersPercentage);
    // Tworzymy rekord harmonogramu – utrzymujemy klucze jak wcześniej
    scheduleRecords.push({
      ...schedule,
      rowId: schedule.scheduleId,
      paymentsNumber: directPaymentCount, // liczba bookingów opłaconych bezpośrednio
      participants: scheduleParticipantsAmount,
      attendance: scheduleAttendance,
    });
  }

  // Globalne wyliczenia
  const splitDuration = secondsToDuration(totalTimeInSeconds);
  const formattedDuration =
    `${splitDuration.days !== '00' ? splitDuration.days + ' dni' : ''} ${splitDuration.hours !== '00' ? splitDuration.hours + ' godzin' : ''} ${splitDuration.minutes !== '00' ? splitDuration.minutes + ' minut' : ''}`.trim();

  const avgFeedbackScore =
    feedbackCount > 0 ? sumFeedbackRating / feedbackCount : 0;
  const medianAge =
    participantAges.length > 0
      ? calculateAgeMedian(participantAges)
      : 'Brak danych';

  const avgParticipantsAmountPerSesh =
    sessionParticipantsArr.length > 0
      ? Math.round(
          (sessionParticipantsArr.reduce((acc, cur) => acc + cur, 0) /
            sessionParticipantsArr.length) *
            100
        ) / 100
      : 0;
  const medianParticipantsAmountPerSesh =
    sessionParticipantsArr.length > 0
      ? Math.round(calculateAgeMedian(sessionParticipantsArr) * 100) / 100
      : 0;

  // Obliczamy średnią i medianę frekwencji (procentowo) na podstawie rekordów harmonogramów
  const attendancePercentages = scheduleRecords.map(
    record => record.attendance
  );
  const avgAttendancePercentagePerSeshValue =
    attendancePercentages.length > 0
      ? Math.round(
          (attendancePercentages.reduce((acc, cur) => acc + cur, 0) /
            attendancePercentages.length) *
            100
        ) / 100
      : 0;
  const avgAttendancePercentagePerSesh = `${avgAttendancePercentagePerSeshValue}%`;
  const medianAttendancePercentagePerSeshValue =
    attendancePercentages.length > 0
      ? Math.round(calculateAgeMedian(attendancePercentages) * 100) / 100
      : 0;
  const medianAttendancePerSesh = `${medianAttendancePercentagePerSeshValue}%`;

  // Obliczenia dla procentu recenzji (feedbacków) w stosunku do liczby uczestników sesji
  const avgReviewersPercentageValue =
    sessionReviewersPercentageArr.length > 0
      ? Math.round(
          (sessionReviewersPercentageArr.reduce((acc, cur) => acc + cur, 0) /
            sessionReviewersPercentageArr.length) *
            100
        ) / 100
      : 0;
  const avgReviewersPercentage = `${avgReviewersPercentageValue}%`;
  const medianReviewersPercentageValue =
    sessionReviewersPercentageArr.length > 0
      ? Math.round(calculateAgeMedian(sessionReviewersPercentageArr) * 100) /
        100
      : 0;
  const medianReviewersPercentage = `${medianReviewersPercentageValue}%`;

  const stats = {
    scheduleRecords: scheduleRecords,
    attendedPayments: attendedBookings,
    totalPayments: payments,
    reviews: reviews,
    reviewsKeys: [
      'feedbackId',
      'submissionDate',
      'customerFullName',
      'rating',
      'content',
      'delay',
    ],
    totalSchedulesAmount: totalSchedules,
    totalTime: formattedDuration,
    revenue: `${Math.round(totalRevenue * 100) / 100}zł`,
    medianParticipantsAge: medianAge,
    totalParticipantsAmount: totalParticipantsAmount,
    avgParticipantsAmountPerSesh: avgParticipantsAmountPerSesh,
    medianParticipantsAmountPerSesh: medianParticipantsAmountPerSesh,
    avgAttendancePercentagePerSesh: avgAttendancePercentagePerSesh,
    medianAttendancePerSesh: medianAttendancePerSesh,
    avgReviewersPercentage: avgReviewersPercentage,
    medianReviewersPercentage: medianReviewersPercentage,
    avgFeedbackScore: Math.round(avgFeedbackScore * 100) / 100,
  };

  console.log(`❗❗❗ statsCalculatorForProduct stats`, stats);
  return stats;
};
