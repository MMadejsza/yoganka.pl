import 'dotenv/config';
import { mainTransporter } from '../../transporter.js';

export const sendUserAccountCreatedMail = ({ to }) => {
  const subject = `🎉 Konto utworzone pomyślnie • Yoganka`;

  const html = `
    <main>
      <h1 style="font-family: sans-serif; color: #7E57C2;">Witaj w Yogance! 🧘‍♀️</h1>
  
      <p>
        Twoje konto zostało utworzone przez administratora i jest już aktywne 🔐<br>
        Zachęcamy do zalogowania się i eksploracji naszej platformy.
      </p>
  
      <p>
        Jeśli masz pytania lub potrzebujesz pomocy, śmiało pisz:
        <a href="mailto:${process.env.SMTP_MAIN_USER}">${process.env.SMTP_MAIN_USER}</a>
      </p>
  
      <p style="margin-top: 2rem;">
        Do zobaczenia na macie 🌸<br>
        <strong>Zespół Yoganki 💜</strong>
      </p>
    </main>
  `;

  mainTransporter
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

export const sendCustomerCreatedMail = ({ to, firstName }) => {
  const subject = `🌿 Witaj w Yogance, ${firstName}!`;

  const html = `
    <main>
      <h1 style="font-family: sans-serif; color: #7E57C2;">
        Witaj na macie, ${firstName} 🙏
      </h1>
  
      <p>
        Twoje konto uczestnika zostało aktywowane przez nasz zespół 💻✨<br>
        Możesz już rezerwować zajęcia, przeglądać grafik i korzystać z portalu Yoganki.
      </p>
  
      <p>
        W razie pytań – napisz do nas:
        <a href="mailto:${process.env.SMTP_MAIN_USER}">${process.env.SMTP_MAIN_USER}</a> 📩
      </p>
  
      <p style="margin-top: 2rem;">
        Z uśmiechem i spokojem,<br>
        <strong>Ekipa Yoganki 💜</strong>
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
