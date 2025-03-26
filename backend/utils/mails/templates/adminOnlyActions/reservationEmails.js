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

export const sendReservationCancelledMail = ({ to, bookingID }) => {
  const subject = `❗️ Rezerwacja anulowana • nr ${bookingID} (anulowane przez administratora)`;
  const html = `
    <main>
      <h1>Twoja rezerwacja została anulowana ❌</h1>

      <p>
        Niestety, Twoja rezerwacja o numerze <strong>${bookingID}</strong> została usunięta przez administratora systemu.
      </p>

      <p>
        Prawdopodobnie termin został opublikowany błędnie lub musiał zostać wycofany z powodów organizacyjnych.
      </p>

      <p style="margin-top: 1rem;">
        W przypadku jakichkolwiek pytań, skontaktuj się z nami:
        <br />
        📧 <a href="mailto:${process.env.SMTP_MAIN_USER}">${process.env.SMTP_MAIN_USER}</a>
      </p>

      <p style="margin-top: 2rem;">Zespół Yoganki 💜</p>
    </main>
  `;

  return mainTransporter.sendMail({
    from: process.env.SMTP_MAIN_USER,
    to,
    subject,
    html,
  });
};
