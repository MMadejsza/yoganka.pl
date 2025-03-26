import 'dotenv/config';
import { mainTransporter } from '../../transporter.js';

export const sendReservationFreshMail = ({
  to,
  productName,
  date,
  startTime,
  location,
  isAdmin,
}) => {
  const subject = `🧘‍♀️ Mata zaklepana • ${productName} ${isAdmin ? '(rezerwacja od administratora)' : ''}`;
  const html = `
    <main>
      <h1>Twoje miejsce jest zarezerwowane 🌿</h1>

      <h3>🧘‍♀️ Zajęcia:</h3>
      <p>
        <strong>${productName}</strong><br>
        📅 ${date} o ${startTime}<br>
        📍 ${location}
      </p>

      <p>✨ Dziękujemy za rezerwację. Czekamy na Ciebie z dobrą energią i spokojem 🙏</p>

      <p style="margin-top: 2rem;">Do zobaczenia na macie,<br><strong>Zespół Yoganki 💜</strong></p>
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
