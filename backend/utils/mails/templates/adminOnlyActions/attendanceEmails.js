import 'dotenv/config';
import { mainTransporter } from '../../transporter.js';
import {
  sendAttendanceFirstBookingForScheduleMail as baseAttendanceFirstBookingForScheduleMail,
  sendAttendanceReturningMail as baseAttendanceReturningMail,
  sendAttendanceMarkedAbsentMail as baseMarkedAbsentMail,
} from '../customerActions/attendanceEmails.js';

export const sendAttendanceFirstBookingForScheduleMail = configObject => {
  configObject.isAdmin = true;
  baseAttendanceFirstBookingForScheduleMail(configObject);
};

export const sendAttendanceReturningMail = configObject => {
  configObject.isAdmin = true;
  baseAttendanceReturningMail(configObject);
};

export const sendAttendanceMarkedAbsentMail = configObject => {
  configObject.isAdmin = true;
  baseMarkedAbsentMail(configObject);
};

export const sendAttendanceRecordDeletedMail = ({
  to,
  productName,
  date,
  startTime,
  location,
}) => {
  const subject = `🗓️ Zapis na termin anulowany • ${productName} (zmiana przez administratora)`;
  const html = `
      <main>
        <h1>Zapis na zajęcia został anulowany ❌</h1>
  
        <p>Twój udział w poniższym terminie został usunięty:</p>
  
        <h3>🧘‍♀️ Szczegóły:</h3>
        <p>
          <strong>${productName}</strong><br>
          📅 ${date} o ${startTime}<br>
          📍 ${location}
        </p>
  
        <p>Jeśli była to pomyłka lub chcesz wybrać inny termin, skontaktuj się z nami lub zapisz ponownie 😊</p>
  
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
