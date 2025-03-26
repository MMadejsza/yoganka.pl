import 'dotenv/config';
import { mainTransporter } from '../../transporter.js';

export const sendSignupConfirmationMail = ({ to }) => {
  const subject = `🌸 Witaj na macie • Yoganka`;
  const html = `
    <main style="font-family: sans-serif; color: #333;">
      <h1 style="color: #7E57C2;">Twoje konto zostało utworzone! 🧘‍♀️</h1>

      <p>Dziękujemy za dołączenie do społeczności Yoganki – cieszymy się, że jesteś z nami 💜</p>

      <h3>📋 Co możesz teraz zrobić?</h3>
      <ul>
        <li>⚙️ Ustawić swoje preferencje</li>
        <li>📅 Przeglądać grafik zajęć</li>
      </ul>

      <h3>🌟 A po pierwszej rezerwacji:</h3>
      <ul>
        <li>📌 Śledzić historię swoich zajęć</li>
        <li>📊 Sprawdzać swoje statystyki 
          <span style="opacity: 0.6;">(w przygotowaniu)</span>
        </li>
        <li>🧾 Zarządzać swoimi płatnościami i dostępami</li>
      </ul>

      <p style="margin-top: 2rem;">
        Do zobaczenia na macie – z dobrym oddechem i spokojem 🌿
      </p>

      <p style="margin-top: 2rem;">
        Z uśmiechem,<br>
        <strong>Ekipa Yoganki ✨</strong>
      </p>
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

export const sendResetPassRequestMail = ({ to, token }) => {
  const subject = `Reset hasła • Yoganka`;
  const html = `
   <main>
    <section>
      <h1>🔐 Reset hasła</h1>
      <p>Poproszono o zresetowanie Twojego hasła.</p>
      <p>Kliknij w <a href="http://localhost:5000/login/${token}">✨ ten link ✨</a>, aby ustawić nowe hasło i wrócić do balansu 🧘‍♀️</p>
    </section>
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
