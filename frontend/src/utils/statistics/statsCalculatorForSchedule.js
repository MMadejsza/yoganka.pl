import { formatIsoDateTime } from '../dateTime.js';
import {
  calculateAge,
  calculateAgeMedian,
  calculateMode,
  durationToSeconds,
  secondsToDuration,
} from './statsUtils.js';

export const statsCalculatorForSchedule = (product, schedule) => {
  console.log(`❗❗❗ statsCalculatorForSchedule product`, product);
  console.log(`❗❗❗ statsCalculatorForSchedule schedule`, schedule);

  // Inicjalizacja zmiennych statystycznych
  const attendedBookings = schedule.attendedRecords;
  const totalPayments = [];
  const totalPasses = [];
  const reviews = [];
  const participantAges = [];
  let totalRevenue = 0,
    totalTimeInSeconds = 0,
    totalPaymentsAmount = 0,
    sumFeedbackRating = 0;
  let attendedBookingsCount = attendedBookings?.length;
  let totalBookingsAmount = schedule.Bookings?.length;
  let feedbackCount = schedule.Feedbacks?.length || 0;

  const now = new Date();

  // Używamy Bookings (z atrybutem attendance) do określenia faktycznego uczestnictwa
  schedule.Bookings.forEach(bs => {
    // Tworzymy obiekt Date z daty i godziny terminu
    // Uważamy termin za "odbyte", jeśli jego data już minęła
    const scheduleDateTime = new Date(`${bs.date}T${bs.startTime}:00`);
    const formattedName = `${bs.Customer.firstName} ${bs.Customer.lastName} (${bs.Customer.customerId})`;
    // if paid by direct payment
    if (!!bs.Payment) {
      // bs.Payment.attendance = bs.attendance;
      totalPayments.push({
        ...bs.Payment,
        rwoId: bs.Payment.paymentId,
        customerFullName: formattedName,
      });
    }
    if (!!bs.CustomerPass) {
      // bs.Payment.attendance = bs.attendance;
      totalPasses.push({
        ...bs.CustomerPass,
        rwoId: bs.CustomerPass.customerPassId,
        customerFullName: formattedName,
      });
    }
    if (scheduleDateTime > now) return;
    totalPaymentsAmount++;
    // Sumujemy czas trwania zajęć tylko wtedy, gdy są potwierdzeni uczestnicy
    if (attendedBookingsCount > 0) {
      totalTimeInSeconds += durationToSeconds(product.duration);
    }
    // Liczymy przychód na podstawie wszystkich rezerwacji, niezależnie od tego, czy użytkownik przyszedł
    totalRevenue += parseFloat(bs.Payment?.amountPaid || 0);
  });

  // Przetwarzamy dane z potwierdzonych uczestnictw (Bookings)
  attendedBookings.forEach(attendedBooking => {
    participantAges.push(calculateAge(attendedBooking.Customer.dob));
    // const isoTimeStamp = new Date(attendedBooking.timestamp).toISOString();
    attendedBooking.paymentMethod = attendedBooking.Payment
      ? attendedBooking.Payment.paymentMethod
      : attendedBooking.CustomerPass.PassDefinition?.name;
    attendedBooking.value = attendedBooking.Payment?.amountPaid || '-';
    attendedBooking.date = formatIsoDateTime(attendedBooking.timestamp);
    attendedBooking.customerFullName = `${attendedBooking.Customer.firstName} ${attendedBooking.Customer.lastName}`;
    // attendedBooking.timestamp = `${formatIsoDateTime(isoTimeStamp)}`;
  });

  // Przetwarzamy opinie – logika pozostaje bez zmian
  if (schedule.Feedbacks && schedule.Feedbacks.length > 0) {
    // totalReviews += schedule.Feedbacks.length;
    schedule.Feedbacks.forEach(feedback => {
      sumFeedbackRating += feedback.rating;

      reviews.push({
        ...feedback,
        rwoId: feedback.feedbackId,
        submissionDate: formatIsoDateTime(feedback.submissionDate),
        customerFullName: `${feedback.Customer.firstName} ${feedback.Customer.lastName}`,
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
      ? calculateAgeMedian(participantAges)
      : 'Brak danych';

  // Uśredniamy na podstawie liczby minionych terminów (nawet pustych)
  console.log(
    `➡️ stats avgAttendancePercentage = ${attendedBookingsCount}/${schedule.capacity}`
  );
  const avgAttendancePercentage =
    attendedBookingsCount > 0
      ? Math.round((attendedBookingsCount / schedule.capacity) * 100)
      : 0;
  const avgReviewersPercentage =
    attendedBookingsCount > 0
      ? Math.round((feedbackCount / attendedBookingsCount) * 100)
      : 0;

  const stats = {
    totalBookingsAmount,
    totalPasses,
    totalPayments,
    totalPaymentsAmount,
    attendedBookings,
    attendedBookingsCount,
    medianParticipantsAge: medianAge,
    avgAttendancePercentage: `${avgAttendancePercentage}%`,
    reviews: reviews,
    avgReviewersPercentage: `${avgReviewersPercentage}%`,
    avgFeedbackScore: avgFeedbackScore,
    totalTime: formattedDuration,
    revenue: `${Math.round(totalRevenue * 100) / 100}zł`,
  };

  console.log(`❗❗❗ statsCalculatorForSchedule stats`, stats);
  return stats;
};
