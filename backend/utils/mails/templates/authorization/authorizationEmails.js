import { mainTransporter } from '../../transporter.js';

export const sendSignupConfirmationMail = ({ to }) => {
  const subject = `Witaj na macie • Yoganka`;
  const html = `
    <main>
      <h1>Konto utworzone - witamy na pokładzie! 🧘‍♀️🌿</h1>

      <h3>📋 Teraz masz możliwość:</h3>
      <ul>
        <li>⚙️ Zmiany preferencji strony</li>
        <li>📅 Rezerwowania terminów</li>
      </ul>

      <h3>🌟 A po pierwszej rezerwacji:</h3>
      <ul>
        <li>📅 Rezerwowania terminów</li>
        <li>🧾 Sprawdzania całej swojej historii z Yoganką</li>
        <li>
          📊 Śledzenia swoich statystyk
          <span style="opacity: 0.6">(W budowie)</span>
        </li>
      </ul>

      <h1>Nie mogę się doczekać kiedy wejdziesz ze mną na matę! 🙏✨</h1>
    </main>   
  `;

  return mainTransporter.sendMail({
    from: process.env.SMTP_MAIN_USER,
    to,
    subject,
    html,
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

  return mainTransporter.sendMail({
    from: process.env.SMTP_MAIN_USER,
    to,
    subject,
    html,
  });
};
