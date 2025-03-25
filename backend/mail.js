import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, //  SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter
  .sendMail({
    from: 'maciej.it@yoganka.pl',
    to: 'maciej.madejsza@gmail.com',
    subject: 'Test OVH SMTP',
    text: 'Działa elegancko 🎉',
  })
  .then(info => console.log('✔️ Mail poszedł:', info.response))
  .catch(err => console.error('❌ Błąd SMTP:', err));
