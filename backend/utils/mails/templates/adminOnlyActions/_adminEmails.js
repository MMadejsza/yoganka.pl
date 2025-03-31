import {
  sendAttendanceMarkedAbsentMail,
  sendAttendanceRecordDeletedMail,
  sendAttendanceReturningMail,
} from './attendanceEmails.js';
import {
  sendAccountCreatedMail,
  sendCustomerCreatedMail,
} from './creationEmails.js';
import {
  sendCustomerDeletedMail,
  sendUserAccountDeletedMail,
} from './deletionEmails.js';
import {
  sendPassFreshMail,
  sendReservationCancelledMail,
  sendReservationFreshMail,
} from './reservationEmails.js';

export {
  sendAccountCreatedMail,
  sendAttendanceMarkedAbsentMail,
  sendAttendanceRecordDeletedMail,
  sendAttendanceReturningMail,
  sendCustomerCreatedMail,
  sendCustomerDeletedMail,
  sendPassFreshMail,
  sendReservationCancelledMail,
  sendReservationFreshMail,
  sendUserAccountDeletedMail,
};
