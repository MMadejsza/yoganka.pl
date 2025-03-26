import {
  sendAttendanceReturningMail as baseAttendanceReturningMail,
  sendAttendanceMarkedAbsentMail as baseMarkedAbsentMail,
  sendReservationFreshMail as baseReservationFreshMail,
} from '../customerActions/reservationEmails.js';

export const sendReservationFreshMail = configObject => {
  configObject.isAdmin = true;
  baseReservationFreshMail(configObject);
};

export const sendAttendanceReturningMail = configObject => {
  configObject.isAdmin = true;
  baseAttendanceReturningMail(configObject);
};

export const sendAttendanceMarkedAbsentMail = configObject => {
  configObject.isAdmin = true;
  baseMarkedAbsentMail(configObject);
};
