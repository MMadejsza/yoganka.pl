import {
  sendAttendanceMarkedAbsentMail,
  sendAttendanceReturningMail,
  sendBookingDeletedMail,
} from './attendanceEmails.js';
import {
  sendCustomerCreatedMail,
  sendUserAccountCreatedMail,
} from './creationEmails.js';
import {
  sendCustomerDeletedMail,
  sendUserAccountDeletedMail,
} from './deletionEmails.js';
import {
  sendNewPassPurchasedMail,
  sendNewReservationMail,
  sendPaymentCancelledMail,
} from './reservationEmails.js';

export {
  sendAttendanceMarkedAbsentMail,
  sendAttendanceReturningMail,
  sendBookingDeletedMail,
  sendCustomerCreatedMail,
  sendCustomerDeletedMail,
  sendNewPassPurchasedMail,
  sendNewReservationMail,
  sendPaymentCancelledMail,
  sendUserAccountCreatedMail,
  sendUserAccountDeletedMail,
};
