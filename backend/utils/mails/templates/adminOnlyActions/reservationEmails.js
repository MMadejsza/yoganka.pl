import 'dotenv/config';
import { mainTransporter } from '../../transporter.js';
import {
  sendNewPassPurchasedMail as basePassFreshMail,
  sendNewReservationMail as baseReservationFreshMail,
} from '../customerActions/reservationEmails.js';

//! OVERWRITTEN CUSTOMER_____________________________________________
export const sendNewReservationMail = configObject => {
  configObject.isAdmin = true;
  baseReservationFreshMail(configObject);
};
export const sendNewPassPurchasedMail = configObject => {
  configObject.isAdmin = true;
  basePassFreshMail(configObject);
};

//! ADMIN ONLY_____________________________________________
export const sendPaymentCancelledMail = ({ to, paymentId }) => {
  const subject = `❗️ Płatność anulowana • nr ${paymentId} (anulowane przez administratora)`;
  const html = `
    <main>
      <h1>Twoja płatność została anulowana ❌</h1>

      <p>
        Niestety, Twoja płatność o numerze <strong>${paymentId}</strong> została usunięta przez administratora systemu.
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

  return mainTransporter
    .sendMail({
      from: process.env.SMTP_MAIN_USER,
      to,
      subject,
      html,
    })
    .catch(err => {
      console.warn('⚠️ Sending email failed:', err.message);
    });
};
