import 'dotenv/config';
import { mainTransporter } from '../../transporter.js';

export const sendNewReservationMail = ({
  to,
  productName,
  date,
  startTime,
  location,
  isAdmin,
}) => {
  const subject = `🧘‍♀️ Mata zaklepana • ${productName} ${
    isAdmin ? '(rezerwacja od administratora)' : ''
  }`;
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

export const sendNewPassPurchasedMail = ({
  to,
  productName,
  productPrice,
  purchaseDate,
  validFrom,
  validUntil,
  allowedProductTypes,
  usesTotal,
  description,
  isAdmin,
}) => {
  const subject = `🌸 Nowy karnet • ${productName} ${
    isAdmin ? '(dodany przez administratora)' : ''
  }`;

  const formatDate = dateStr =>
    dateStr
      ? new Date(dateStr).toLocaleDateString('pl-PL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null;

  const formattedPurchaseDate = formatDate(purchaseDate);
  const formattedValidFrom = formatDate(validFrom);
  const formattedValidUntil = formatDate(validUntil);

  const usageInfo = usesTotal ? `${usesTotal} wejść` : 'bez limitu wejść';
  const validityInfo = formattedValidUntil
    ? `od ${formattedValidFrom} do ${formattedValidUntil}`
    : `od ${formattedValidFrom} bez daty końcowej`;

  const productTypeLabels = {
    class: 'zajęcia stacjonarne',
    event: 'wydarzenia specjalne',
    camp: 'wyjazdy i warsztaty',
    online: 'zajęcia online',
  };

  const productTypesInfo = allowedProductTypes?.length
    ? allowedProductTypes
        .map(type => productTypeLabels[type] || type)
        .join(', ')
    : 'wszystkie dostępne aktywności';

  const html = `
    <main style="font-family: sans-serif; line-height: 1.6; color: #333;">
      <h1 style="color: #7B5CA0;">Twój karnet jest aktywny 💫</h1>

      <p>Dziękujemy za ${
        isAdmin ? 'dodanie' : 'zakup'
      } <strong>${productName}</strong>! Poniżej znajdziesz szczegóły swojego karnetu:</p>

      <h3>🪷 Szczegóły:</h3>
      <ul style="padding-left: 1.2rem;">
        <li><strong>Nazwa:</strong> ${productName}</li>
        <li><strong>Cena:</strong> ${productPrice} zł</li>
        <li><strong>Data zakupu:</strong> ${formattedPurchaseDate}</li>
        <li><strong>Ważność:</strong> ${validityInfo}</li>
        <li><strong>Limit wejść:</strong> ${usageInfo}</li>
        <li><strong>Obejmuje:</strong> ${productTypesInfo}</li>
      </ul>

      ${
        description
          ? `<p style="margin-top: 1rem;"><strong>Opis karnetu:</strong><br>${description}</p>`
          : ''
      }

      <p style="margin-top: 2rem;">🧘‍♀️ Możesz teraz korzystać z zajęć i wydarzeń objętych karnetem. Rezerwuj miejsce przez swój profil Yoganki.</p>

      <p style="margin-top: 2rem;">Z wdzięcznością i spokojem,<br><strong>Zespół Yoganki 💜</strong></p>
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
