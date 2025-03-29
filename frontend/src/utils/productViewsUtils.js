import {
  calculateAge,
  calculateMedian,
  calculateMode,
  durationToSeconds,
  secondsToDuration,
} from './customerViewsUtils.js';
import { formatIsoDateTime } from './dateTime.js';

//@ stats calculation
export const calculateProductStats = (product, schedules) => {
  console.log(`❗❗❗ calculateProductStats product`, product);
  console.log(`❗❗❗ calculateProductStats schedules`, schedules);
  console.log(`schedules: `, schedules);
  const attendedPayments = [];
  const scheduleRecords = [];
  const payments = [];
  const attendances = [];
  const reviews = [];
  const participantAges = [];
  const sessionParticipantsArr = [];
  const sessionReviewersPercentageArr = [];

  let totalRevenue = 0;
  let totalTimeInSeconds = 0;
  let totalSchedules = 0;
  let totalParticipantsAmount = 0;
  let totalCapacity = 0;
  let totalReviews = 0;
  let sumFeedbackRating = 0;
  let feedbackCount = 0;

  // @ SCHEDULE Level
  for (let schedule of schedules) {
    totalSchedules += 1;
    totalCapacity += schedule.capacity;

    let sessionReviewsCount = 0;
    if (schedule.Feedbacks && schedule.Feedbacks.length > 0) {
      totalReviews += schedule.Feedbacks.length;
      sessionReviewsCount = schedule.Feedbacks.length;
      for (let feedback of schedule.Feedbacks) {
        sumFeedbackRating += feedback.rating;
        feedbackCount++;

        reviews.push({
          id: feedback.feedbackId,
          date: formatIsoDateTime(feedback.submissionDate),
          customer: `${feedback.Customer.firstName} ${feedback.Customer.lastName}`,
          rating: feedback.rating,
          review: feedback.text,
          delay: feedback.delay,
        });
      }
    }

    const allPayments = schedule.Payments ?? [];
    let scheduleParticipantsAmount = 0;
    let scheduleAttendance = 0;
    if (allPayments.length > 0) {
      totalTimeInSeconds += durationToSeconds(product.duration);

      // # BOOKING Level
      for (let payment of allPayments) {
        totalRevenue += parseFloat(payment.amountPaid);
        participantAges.push(calculateAge(payment.Customer.dob));

        payment.attendance = 0;
        const formattedCustomer = `${payment.Customer.firstName} ${payment.Customer.lastName} (${payment.Customer.customerId})`;
        if (payment.Booking?.attendance == true) {
          scheduleParticipantsAmount += 1;
          totalParticipantsAmount += 1;
          payment.attendance = true;

          console.log('payment.Booking.timestamp', payment.Booking.timestamp);
          const isoTimeStamp = new Date(
            payment.Booking.timestamp
          ).toISOString();
          attendedPayments.push({
            id: payment.paymentId,
            date: formatIsoDateTime(payment.date),
            customerId: payment.Customer.customerId,
            customer: formattedCustomer,
            value: payment.amountPaid,
            timestamp: formatIsoDateTime(isoTimeStamp),
            method: payment.paymentMethod,
            attendance: 1,
          });
        }
        payment.customer = formattedCustomer;
        payments.push(payment);
      }
      scheduleAttendance = Math.round(
        (scheduleParticipantsAmount / schedule.capacity) * 100
      );
    }
    attendances.push(scheduleAttendance);
    sessionParticipantsArr.push(scheduleParticipantsAmount);
    let sessionReviewersPercentage = 0;
    if (scheduleParticipantsAmount > 0) {
      sessionReviewersPercentage =
        (sessionReviewsCount / scheduleParticipantsAmount) * 100;
    }
    sessionReviewersPercentageArr.push(sessionReviewersPercentage);

    scheduleRecords.push({
      scheduleId: schedule.scheduleId,
      date: schedule.date,
      startTime: schedule.startTime,
      location: schedule.location,
      paymentsNumber: schedule.Payments.length,
      participants: scheduleParticipantsAmount,
      capacity: schedule.capacity,
      attendance: scheduleAttendance,
    });
  }

  const splitDuration = secondsToDuration(totalTimeInSeconds);
  const formattedDuration = `${splitDuration.days != '00' ? splitDuration.days + ' dni' : ''} ${
    splitDuration.hours != '00' ? splitDuration.hours + ' godzin' : ''
  } ${splitDuration.minutes != '00' ? splitDuration.minutes + ' minut' : ''}`;

  let avgFeedbackScore = 0;
  if (feedbackCount > 0) {
    avgFeedbackScore = sumFeedbackRating / feedbackCount;
  }

  // Global
  const medianAge =
    participantAges.length > 0
      ? calculateMedian(participantAges)
      : 'Brak danych';

  // Per schedule
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
      ? Math.round(calculateMedian(sessionParticipantsArr) * 100) / 100
      : 0;

  const avgAttendancePercentagePerSeshValue =
    attendances.length > 0
      ? Math.round(
          (attendances.reduce((acc, cur) => acc + cur, 0) /
            attendances.length) *
            100
        ) / 100
      : 0;
  const avgAttendancePercentagePerSesh = `${avgAttendancePercentagePerSeshValue}%`;
  const medianAttendancePercentagePerSeshValue =
    attendances.length > 0
      ? Math.round(calculateMedian(attendances) * 100) / 100
      : 0;
  const medianAttendancePerSesh = `${medianAttendancePercentagePerSeshValue}%`;

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
      ? Math.round(calculateMedian(sessionReviewersPercentageArr) * 100) / 100
      : 0;
  const medianReviewersPercentage = `${medianReviewersPercentageValue}%`;

  const stats = {
    scheduleRecords: scheduleRecords,
    attendedPayments: attendedPayments,
    totalPayments: payments,
    reviews: reviews,
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
  console.log(`❗❗❗ calculateProductStats stats`, stats);

  return stats;
};

export const calculateScheduleStats = (product, schedule) => {
  console.log(`❗❗❗ calculateScheduleStats product`, product);
  console.log(`❗❗❗ calculateScheduleStats schedule`, schedule);

  // Inicjalizacja zmiennych statystycznych
  const attendedPayments = [];
  const totalPayments = [];
  const reviews = [];
  const participantAges = [];
  let totalRevenue = 0;
  let totalTimeInSeconds = 0;
  let totalPaymentsAmount = 0;
  let attendedPaymentsAmount = 0;
  let totalReviews = 0;
  let sumFeedbackRating = 0;
  let feedbackCount = 0;

  const now = new Date();

  // Używamy Bookings (z atrybutem attendance) do określenia faktycznego uczestnictwa
  const attendedRecords = schedule
    ? schedule.Bookings?.filter(
        abs => abs.attendance === true || abs.attendance === 1
      )
    : [];

  schedule.Bookings.forEach(bs => {
    // Tworzymy obiekt Date z daty i godziny terminu
    const scheduleDateTime = new Date(`${bs.date}T${bs.startTime}:00`);
    // Uważamy termin za "odbyte", jeśli jego data już minęła
    bs.Payment.customer = `${bs.Customer.firstName} ${bs.Customer.lastName} (${bs.Customer.customerId})`;
    bs.Payment.attendance = bs.attendance;
    totalPayments.push(bs.Payment);
    if (scheduleDateTime > now) return;
    totalPaymentsAmount++;
    // Sumujemy czas trwania zajęć tylko wtedy, gdy są potwierdzeni uczestnicy
    if (attendedRecords.length > 0) {
      totalTimeInSeconds += durationToSeconds(product.duration);
    }
    // Liczymy przychód na podstawie wszystkich rezerwacji, niezależnie od tego, czy użytkownik przyszedł
    totalRevenue += parseFloat(bs.Payment.amountPaid);
  });

  // Przetwarzamy dane z potwierdzonych uczestnictw (Bookings)
  attendedRecords.forEach(record => {
    attendedPaymentsAmount++;
    participantAges.push(calculateAge(record.Customer.dob));
    const isoTimeStamp = new Date(record.timestamp).toISOString();
    attendedPayments.push({
      id: record.paymentId, // Zakładamy, że rekord Bookings zawiera odniesienie do paymentId
      date:
        formatIsoDateTime(record.Payment.date) || formatIsoDateTime(bs.date), //! Jeśli dostępna, inaczej używamy daty terminu
      customer: `${record.Customer.firstName} ${record.Customer.lastName}`,
      timestamp: `${formatIsoDateTime(isoTimeStamp)}`,

      customerId: record.Customer.customerId,
      value: record.Payment.amountPaid, // Informacja z Bookings – dla odniesienia (nie wpływa na revenue)
      method: record.Payment.paymentMethod,
    });
  });

  // Przetwarzamy opinie – logika pozostaje bez zmian
  if (schedule.Feedbacks && schedule.Feedbacks.length > 0) {
    totalReviews += schedule.Feedbacks.length;
    schedule.Feedbacks.forEach(feedback => {
      sumFeedbackRating += feedback.rating;
      feedbackCount++;
      reviews.push({
        id: feedback.feedbackId,
        date: formatIsoDateTime(feedback.submissionDate),
        customer: `${feedback.Customer.firstName} ${feedback.Customer.lastName}`,
        rating: feedback.rating,
        review: feedback.text,
        delay: feedback.delay,
      });
    });
  }

  const splitDuration = secondsToDuration(totalTimeInSeconds);
  const formattedDuration =
    `${splitDuration.days !== '00' ? splitDuration.days + ' dni ' : ''}${
      splitDuration.hours !== '00' ? splitDuration.hours + ' godzin ' : ''
    }${splitDuration.minutes !== '00' ? splitDuration.minutes + ' minut' : ''}`.trim();

  const avgFeedbackScore =
    feedbackCount > 0 ? sumFeedbackRating / feedbackCount : 0;
  console.log(`✅✅participantAges`, participantAges);
  console.log(
    `✅✅calculateMode(participantAges)`,
    calculateMode(participantAges)
  );
  const medianAge =
    participantAges.length > 0
      ? calculateMedian(participantAges)
      : 'Brak danych';

  // Uśredniamy na podstawie liczby minionych terminów (nawet pustych)

  console.log(
    `➡️ stats avgAttendancePercentage = ${attendedPaymentsAmount}/${product.TotalSpaces}`
  );
  const avgAttendancePercentage =
    attendedPaymentsAmount > 0
      ? Math.round((attendedPaymentsAmount / schedule.capacity) * 100)
      : 0;
  const avgReviewersPercentage =
    attendedPaymentsAmount > 0
      ? Math.round((totalReviews / attendedPaymentsAmount) * 100)
      : 0;

  const stats = {
    totalPayments: totalPayments,
    totalPaymentsAmount: totalPaymentsAmount,
    attendedPayments: attendedPayments,
    totalParticipantsAmount: attendedPaymentsAmount,
    medianParticipantsAge: medianAge,
    avgAttendancePercentage: `${avgAttendancePercentage}%`,
    reviews: reviews,
    avgReviewersPercentage: `${avgReviewersPercentage}%`,
    avgFeedbackScore: avgFeedbackScore,
    totalTime: formattedDuration,
    revenue: `${Math.round(totalRevenue * 100) / 100}zł`,
  };

  console.log(`❗❗❗ calculateScheduleStats stats`, stats);
  return stats;
};
