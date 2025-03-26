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

export const sendAttendanceReturningMail = ({
  to,
  productName,
  date,
  startTime,
  location,
  isAdmin,
}) => {
  const subject = `🌸 Dobrze, że wracasz • Yoganka ${isAdmin ? '(rezerwacja od administratora)' : ''}`;
  const html = `
    <main>
      <h1>Twoja mata tęskniła! 💜</h1>

      <p>Jesteśmy szczęśliwi, że znów będziemy razem praktykować. Dzięki za informację o Twoim powrocie 🙏</p>

      <h3>🧘‍♀️ Szczegóły zajęć:</h3>
      <p>
        <strong>${productName}</strong><br>
        📅 ${date} o ${startTime}<br>
        📍 ${location}
      </p>

      <p>Do zobaczenia na macie – z dobrą energią i spokojnym oddechem 🌿</p>

      <p style="margin-top: 2rem;">Z uśmiechem,<br><strong>Ekipa Yoganki ✨</strong></p>
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

export const sendAttendanceMarkedAbsentMail = ({
  to,
  productName,
  date,
  startTime,
  location,
  isAdmin,
}) => {
  const subject = `🌙 Do zobaczenia następnym razem • Yoganka ${isAdmin ? '(oznaczenie od administratora)' : ''}`;
  const html = `
    <main>
      <h1>Twoja mata będzie dziś odpoczywać 🌿</h1>

      <p>Rozumiemy, że czasem trzeba odpuścić – to też część praktyki 🙏</p>

      <h3>📋 Zajęcia, na które się nie pojawisz:</h3>
      <p>
        <strong>${productName}</strong><br>
        📅 ${date} o ${startTime}<br>
        📍 ${location}
      </p>

      <p>Będziemy na Ciebie czekać na kolejnych zajęciach – z otwartym sercem i spokojnym oddechem 💜</p>

      <p style="margin-top: 2rem;">Do zobaczenia w swoim czasie,<br><strong>Zespół Yoganki ✨</strong></p>
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

export const sendAttendanceFirstBookingForScheduleMail = ({
  to,
  productName,
  date,
  startTime,
  location,
  isAdmin,
}) => {
  const subject = `✅ Rezerwacja potwierdzona • ${productName} ${isAdmin ? '(dodane przez administratora)' : ''}`;
  const html = `
    <main>
      <h1>Twoja obecność została potwierdzona ✨</h1>

      <p>Dziękujemy za zapisanie się na ten termin. Cieszymy się, że będziesz z nami 🌿</p>

      <h3>🧘‍♀️ Szczegóły zajęć:</h3>
      <p>
        <strong>${productName}</strong><br>
        📅 ${date} o ${startTime}<br>
        📍 ${location}
      </p>

      <p>To Twoja pierwsza obecność na tym konkretnym terminie – mata już czeka!</p>

      <p style="margin-top: 2rem;">Z pozdrowieniami,<br><strong>Zespół Yoganki 💜</strong></p>
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
