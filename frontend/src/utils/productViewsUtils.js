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
  // console.log(`schedules: `, schedules);
  const attendedBookings = [];
  const scheduleRecords = [];
  const bookings = [];
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
    totalCapacity += schedule.Capacity;

    let sessionReviewsCount = 0;
    if (schedule.Feedbacks && schedule.Feedbacks.length > 0) {
      totalReviews += schedule.Feedbacks.length;
      sessionReviewsCount = schedule.Feedbacks.length;
      for (let feedback of schedule.Feedbacks) {
        sumFeedbackRating += feedback.Rating;
        feedbackCount++;

        reviews.push({
          id: feedback.FeedbackID,
          date: formatIsoDateTime(feedback.SubmissionDate),
          customer: `${feedback.Customer.FirstName} ${feedback.Customer.LastName}`,
          rating: feedback.Rating,
          review: feedback.Text,
          delay: feedback.Delay,
        });
      }
    }

    const allBookings = schedule.Bookings ?? [];
    let scheduleParticipantsAmount = 0;
    let scheduleAttendance = 0;
    if (allBookings.length > 0) {
      totalTimeInSeconds += durationToSeconds(product.Duration);

      // # BOOKING Level
      for (let booking of allBookings) {
        totalRevenue += parseFloat(booking.AmountPaid);
        participantAges.push(calculateAge(booking.Customer.DoB));

        booking.Attendance = 0;
        const formattedCustomer = `${booking.Customer.FirstName} ${booking.Customer.LastName} (${booking.Customer.CustomerID})`;
        if (booking.BookedSchedule?.Attendance == true) {
          scheduleParticipantsAmount += 1;
          totalParticipantsAmount += 1;
          booking.Attendance = true;

          const isoTimeStamp = new Date(
            booking.BookedSchedule.TimeStamp
          ).toISOString();
          attendedBookings.push({
            id: booking.BookingID,
            date: formatIsoDateTime(booking.Date),
            customerID: booking.Customer.CustomerID,
            customer: formattedCustomer,
            value: booking.AmountPaid,
            timestamp: formatIsoDateTime(isoTimeStamp),
            method: booking.PaymentMethod,
            Attendance: 1,
          });
        }
        booking.customer = formattedCustomer;
        bookings.push(booking);
      }
      scheduleAttendance = Math.round(
        (scheduleParticipantsAmount / schedule.Capacity) * 100
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
      ScheduleID: schedule.ScheduleID,
      Date: schedule.Date,
      StartTime: schedule.StartTime,
      Location: schedule.Location,
      bookingsNumber: schedule.Bookings.length,
      participants: scheduleParticipantsAmount,
      capacity: schedule.Capacity,
      Attendance: scheduleAttendance,
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
    attendedBookings: attendedBookings,
    totalBookings: bookings,
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
  const attendedBookings = [];
  const totalBookings = [];
  const reviews = [];
  const participantAges = [];
  let totalRevenue = 0;
  let totalTimeInSeconds = 0;
  let totalBookingsAmount = 0;
  let attendedBookingsAmount = 0;
  let totalReviews = 0;
  let sumFeedbackRating = 0;
  let feedbackCount = 0;

  const now = new Date();

  // Używamy BookedSchedules (z atrybutem Attendance) do określenia faktycznego uczestnictwa
  const attendedRecords = schedule
    ? schedule.BookedSchedules?.filter(
        abs => abs.Attendance === true || abs.Attendance === 1
      )
    : [];

  schedule.BookedSchedules.forEach(bs => {
    // Tworzymy obiekt Date z daty i godziny terminu
    const scheduleDateTime = new Date(`${bs.Date}T${bs.StartTime}:00`);
    // Uważamy termin za "odbyte", jeśli jego data już minęła
    bs.Booking.customer = `${bs.Customer.FirstName} ${bs.Customer.LastName} (${bs.Customer.CustomerID})`;
    bs.Booking.Attendance = bs.Attendance;
    totalBookings.push(bs.Booking);
    if (scheduleDateTime > now) return;
    totalBookingsAmount++;
    // Sumujemy czas trwania zajęć tylko wtedy, gdy są potwierdzeni uczestnicy
    if (attendedRecords.length > 0) {
      totalTimeInSeconds += durationToSeconds(product.Duration);
    }
    // Liczymy przychód na podstawie wszystkich rezerwacji, niezależnie od tego, czy użytkownik przyszedł
    totalRevenue += parseFloat(bs.Booking.AmountPaid);
  });

  // Przetwarzamy dane z potwierdzonych uczestnictw (BookedSchedules)
  attendedRecords.forEach(record => {
    attendedBookingsAmount++;
    participantAges.push(calculateAge(record.Customer.DoB));
    const isoTimeStamp = new Date(record.TimeStamp).toISOString();
    attendedBookings.push({
      id: record.BookingID, // Zakładamy, że rekord BookedSchedule zawiera odniesienie do BookingID
      date:
        formatIsoDateTime(record.Booking.Date) || formatIsoDateTime(bs.Date), //! Jeśli dostępna, inaczej używamy daty terminu
      customer: `${record.Customer.FirstName} ${record.Customer.LastName}`,
      timestamp: `${formatIsoDateTime(isoTimeStamp)}`,

      customerID: record.Customer.CustomerID,
      value: record.Booking.AmountPaid, // Informacja z BookedSchedule – dla odniesienia (nie wpływa na revenue)
      method: record.Booking.PaymentMethod,
    });
  });

  // Przetwarzamy opinie – logika pozostaje bez zmian
  if (schedule.Feedbacks && schedule.Feedbacks.length > 0) {
    totalReviews += schedule.Feedbacks.length;
    schedule.Feedbacks.forEach(feedback => {
      sumFeedbackRating += feedback.Rating;
      feedbackCount++;
      reviews.push({
        id: feedback.FeedbackID,
        date: formatIsoDateTime(feedback.SubmissionDate),
        customer: `${feedback.Customer.FirstName} ${feedback.Customer.LastName}`,
        rating: feedback.Rating,
        review: feedback.Text,
        delay: feedback.Delay,
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
    `➡️ stats avgAttendancePercentage = ${attendedBookingsAmount}/${product.TotalSpaces}`
  );
  const avgAttendancePercentage =
    attendedBookingsAmount > 0
      ? Math.round((attendedBookingsAmount / schedule.Capacity) * 100)
      : 0;
  const avgReviewersPercentage =
    attendedBookingsAmount > 0
      ? Math.round((totalReviews / attendedBookingsAmount) * 100)
      : 0;

  const stats = {
    totalBookings: totalBookings,
    totalBookingsAmount: totalBookingsAmount,
    attendedBookings: attendedBookings,
    totalParticipantsAmount: attendedBookingsAmount,
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
