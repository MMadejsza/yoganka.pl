import { formatIsoDateTime, getWeekDay } from '../dateTime.js';
import { durationToSeconds, secondsToDuration } from './statsUtils.js';

//@ stats calculation
export const statsCalculatorForCustomer = customer => {
  const logsTurnedOn = false;

  if (logsTurnedOn)
    console.log.log(`❗❗❗ statsCalculatorForCustomer customer`, customer);
  if (logsTurnedOn)
    console.log.log(`statsCalculatorForCustomer passed customer`, customer);
  const now = new Date();
  const attendedScheduleRecords = [];
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
  if (logsTurnedOn) console.log.log(customer.Payments);
  for (let payment of customer.Payments) {
    totalRevenue += parseFloat(payment.amountPaid);

    totalPayments.push({
      ...payment,
      rowId: payment.paymentId,
      date: formatIsoDateTime(payment.date),
      cardDate: payment.date,
      cardTime: payment.date.split('T')[1].slice(0, 8),
      paymentStatus: payment.status,
    });
    const invoice = payment.Invoice;
    if (!!invoice) {
      invoices.push({
        ...invoice,
        rowId: invoice.invoiceId,
        invoiceDate: formatIsoDateTime(invoice.invoiceDate),
      });
    }
  }

  const attendedBookings = customer.Bookings?.filter(
    booking => booking.attendance == 1 || booking.attendance == true
  );
  const cancelledBookings = customer.Bookings?.filter(
    booking => booking.attendance == 0 || booking.attendance == false
  );
  for (let booking of attendedBookings) {
    if (logsTurnedOn) console.log.group(`schedule: ${schedule}`);
    const { ScheduleRecord: schedule } = booking;

    attendedScheduleRecords.push({
      ...schedule,
      rowId: schedule.scheduleId,
      productType: schedule.Product.type,
      productName: schedule.Product.name,
      productDuration: schedule.Product.duration,
      day: getWeekDay(schedule.date),
      isUserGoing: true,
    });

    const productType = schedule.Product.type.toUpperCase();
    const sessionDateTime = new Date(
      `${schedule.date}T${schedule.startTime || '00:00:00'}`
    );
    if (logsTurnedOn)
      console.log.log(`sessionDateTime <= now ${sessionDateTime} ${now}`);
    if (sessionDateTime <= now) {
      totalSchedulesAmount += 1;
      if (productType === 'ONLINE' || productType === 'CLASS') {
        totalOnlineAmount += 1;
        if (logsTurnedOn)
          console.log.log(`totalOnlineAmount: ${totalOnlineAmount}`);
      } else if (productType === 'EVENT') {
        totalEventsAmount += 1;
        if (logsTurnedOn)
          console.log.log(`totalEventsAmount: ${totalEventsAmount}`);
      } else if (productType === 'CAMP') {
        totalCampsAmount += 1;
        if (logsTurnedOn)
          console.log.log(`totalCampsAmount: ${totalCampsAmount}`);
      }
      totalTimeInSeconds += durationToSeconds(schedule.Product.duration);
      if (logsTurnedOn)
        console.log.log(`totalTimeInSeconds: ${totalTimeInSeconds}`);
      if (logsTurnedOn) console.log.groupEnd();
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
        rowId: feedback.feedbackId,
        product: `${schedule.Product.name}`,
        schedule: `
        (Id: ${schedule.scheduleId})
        ${schedule.date} ${getWeekDay(schedule.date)}
        ${schedule.startTime}`,
        submissionDate: formatIsoDateTime(feedback.submissionDate),
      });
    }
  }

  const splitDuration = secondsToDuration(totalTimeInSeconds, 'hours');
  const stats = {
    attendedSchedules: attendedScheduleRecords,
    attendedBookings,
    cancelledBookings,
    allBookings: customer.Bookings,
    recordsKeys: [
      // '',
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

  console.log(`❗❗❗ statsCalculatorForCustomer stats`, stats);

  return stats;
};
