import { mainTransporter } from '../../transporter.js';

export const sendReservationFreshMail = ({
  to,
  productName,
  date,
  startTime,
  location,
  isAdmin,
}) => {
  const subject = `Mata zaklepana! Do zobaczenia na: ${productName} ${isAdmin ? '(Wysłane przez administratora)' : ''}`;
  const html = `
    <h1>Mata już na Ciebie czeka!</h1>
    <h3>Zajęcia:</h3>
    <p>
      ${productName}<br>
      ${date} ${startTime}<br>
      ${location}
    </p>
    <p>Dziękujemy za rezerwację - do zobaczenia wkrótce! :)</p>
  `;

  return mainTransporter.sendMail({
    from: process.env.SMTP_MAIN_USER,
    to,
    subject,
    html,
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
  const subject = `Witamy z powrotem na zajeciach! ${isAdmin ? '(Wysłane przez administratora)' : ''}`;
  const html = `
     <h1>Już myśleliśmy, że ta mata zmieni właściciela... - ale na szczęście nie!</h1>
    <h3>Zajęcia:</h3>
    <p>
      ${productName}<br>
      ${date} ${startTime}<br>
      ${location}
    </p>
    <p>Dziękujemy za informację - do zobaczenia wkrótce! :)</p>
  `;

  return mainTransporter.sendMail({
    from: process.env.SMTP_MAIN_USER,
    to,
    subject,
    html,
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
  const subject = `Szkoda, że musisz lecieć... :( ${isAdmin ? '(Wysłane przez administratora)' : ''}`;
  const html = `
    <h1>Mata zwolniona ale... mamy nadzieję, że jednak wrócisz!</h1>
    <h3>Zajęcia:</h3>
    <p>
      ${productName}<br>
      ${date} ${startTime}<br>
      ${location}
    </p>
    <p>W każdym razie dziękujemy za informację i do zobaczenie na innych zajęciach! :)</p>
  `;

  return mainTransporter.sendMail({
    from: process.env.SMTP_MAIN_USER,
    to,
    subject,
    html,
  });
};
