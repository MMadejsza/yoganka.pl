import 'dotenv/config';
import { mainTransporter } from '../../transporter.js';

export const sendUserAccountDeletedMail = ({ to }) => {
  const subject = `📭 Konto usunięte • Yoganka`;

  const html = `
      <main style="font-family: sans-serif; color: #333;">
        <h1>Konto zostało usunięte ❌</h1>
  
        <p>Twoje konto w Yogance zostało usunięte przez administratora.</p>
  
        <p>Jeśli to była pomyłka lub masz pytania, napisz do nas: 
          <a href="mailto:${process.env.SMTP_MAIN_USER}">${process.env.SMTP_MAIN_USER}</a>
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
