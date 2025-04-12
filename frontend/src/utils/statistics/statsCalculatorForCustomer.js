import { formatIsoDateTime, getWeekDay } from '../dateTime.js';
import { durationToSeconds, secondsToDuration } from './statsUtils.js';

//@ stats calculation
export const statsCalculatorForCustomer = customer => {
  console.log(`❗❗❗ statsCalculatorForCustomer customer`, customer);
  // console.log(`statsCalculatorForCustomer passed customer`, customer);
  const today = new Date().toISOString().split('T')[0];
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
  // console.log(customer.Payments);
  for (let payment of customer.Payments) {
    totalRevenue += parseFloat(payment.amountPaid);

    totalPayments.push({
      ...payment,
      rowId: payment.paymentId,
      date: formatIsoDateTime(payment.date),
      paymentStatus: payment.status.toUpperCase() === 'COMPLETED' ? 'Zrealizowana' : 'Niekompletna',
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
  for (let booking of attendedBookings) {
    // console.group(`schedule: ${schedule}`);
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
      totalTimeInSeconds += durationToSeconds(schedule.Product.duration);
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
