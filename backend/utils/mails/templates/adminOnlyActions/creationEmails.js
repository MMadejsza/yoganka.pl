import 'dotenv/config';
import { mainTransporter } from '../../transporter.js';

export const sendCustomerCreatedMail = ({ to, firstName }) => {
  const subject = `🌿 Witaj w Yogance, ${firstName}!`;
  const html = `
    <main>
      <h1 style="font-family: sans-serif; color: #7E57C2;">Witaj na macie, ${firstName} 🙏</h1>

      <p>Twoje konto uczestnika zostało właśnie aktywowane przez nasz zespół.</p>

      <p>🧘‍♀️ Możesz teraz wygodnie rezerwować swoje ulubione zajęcia, przeglądać grafik i być na bieżąco z wydarzeniami w Yogance.</p>

      <p>✨ W razie pytań jesteśmy tutaj: 
        <a href="mailto:${process.env.SMTP_MAIN_USER}">${process.env.SMTP_MAIN_USER}</a>
      </p>

      <p style="margin-top: 2rem;">Z uśmiechem i spokojem,<br><strong>Ekipa Yoganki 💜</strong></p>
    </main>
  `;

  return mainTransporter
    .sendMail({
      from: process.env.SMTP_MAIN_USER,
      to,
      subject,
      html,
    })
    .catch(err => console.warn(`⚠️ Mail nie został wysłany: ${err.message}`)); // nie przerywa kontrolera
};
