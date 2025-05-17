import 'dotenv/config';
import nodemailer from 'nodemailer';

export const mainTransporter = nodemailer.createTransport({
  host: process.env.SMTP_MAIN_HOST,
  port: Number(process.env.SMTP_MAIN_PORT),
  secure: true, // SSL
  auth: {
    user: process.env.SMTP_MAIN_USER,
    pass: process.env.SMTP_MAIN_PASS,
  },
});

export const bookingsTransporter = nodemailer.createTransport({
  host: process.env.SMTP_BOOKINGS_HOST,
  port: Number(process.env.SMTP_BOOKINGS_PORT),
  secure: true, // SSL
  auth: {
    user: process.env.SMTP_BOOKINGS_USER,
    pass: process.env.SMTP_BOOKINGS_PASS,
  },
});
