import bcrypt from 'bcryptjs';
import 'dotenv/config';
import nodemailer from 'nodemailer';
import * as models from '../models/_index.js';
import {
  callLog,
  catchErr,
  errorCode,
  successLog,
} from '../utils/controllersUtils.js';
let errCode = errorCode;
const person = 'User';

// setting up mailer for confirmation emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, //  SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

//! LOGIN / SIGNUP_____________________________________________
//@ GET
export const getStatus = (req, res, next) => {
  const controllerName = 'getStatus';
  callLog(person, controllerName);
  successLog(person, controllerName);
  console.log({
    isLoggedIn: res.locals.isLoggedIn || false,
    role: res.locals.role,
    token: res.locals.csrfToken,
  });
  return res.status(200).json({
    isLoggedIn: res.locals.isLoggedIn || false,
    role: res.locals.role,
    token: res.locals.csrfToken,
  });
};
//@ POST
export const postSignup = (req, res, next) => {
  const controllerName = 'postSignup';
  callLog(person, controllerName);

  const { email, password, confirmedPassword, date } = req.body;

  models.User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        errCode = 303;
        throw new Error('Użytkownik już istnieje.');
      }

      // it returns the promise
      return bcrypt
        .hash(password, 12)
        .then(passwordHashed => {
          successLog(person, controllerName, 'hashed');
          return models.User.create({
            RegistrationDate: date,
            PasswordHash: passwordHashed,
            LastLoginDate: date,
            Email: email,
            Role: 'user',
            ProfilePictureSrcSetJSON: null,
          });
        })
        .then(newUser => {
          successLog(person, controllerName);

          transporter
            .sendMail({
              from: process.env.SMTP_USER,
              to: email,
              subject: 'Rejestracja przebiegła pomyślnie.',
              html: '<h1>RejestracjaDziała elegancko!</h1>',
            })
            .then(() => {
              successLog(person, controllerName, 'mail sent');
            })
            .catch(mailErr => {
              console.error(
                `[${controllerName}] Błąd przy wysyłaniu maila:`,
                mailErr
              );
            });

          return res.status(200).json({
            type: 'signup',
            code: 200,
            confirmation: 1,
            message: '✅ Zarejestrowano pomyślnie',
          });
        });
    })
    .catch(err =>
      catchErr(res, errCode, err, controllerName, { type: 'signup', code: 303 })
    );
};
export const postLogin = (req, res, next) => {
  const controllerName = 'postLogin';
  callLog(person, controllerName);

  const { email, password, date } = req.body;

  models.User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        errCode = 404;
        console.log("\n❌❌❌ User doesn't exist");
        throw new Error('Użytkownik nie istnieje.');
      }
      user.update({ LastLoginDate: date });
      return user;
    })
    .then(fetchedUser => {
      if (!fetchedUser) {
        return;
      }
      successLog(person, controllerName, 'fetched');
      // regardless match or mismatch catch takes only if something is wrong with bcrypt itself. otherwise it goes to the next block with promise as boolean
      return bcrypt
        .compare(password, fetchedUser.PasswordHash)
        .then(doMatch => {
          if (doMatch) {
            successLog(person, controllerName, 'pass match as well');
            req.session.isLoggedIn = true;
            req.session.user = fetchedUser;
            req.session.role = fetchedUser.Role.toUpperCase();
            return res.status(200).json({
              type: 'login',
              code: 200,
              confirmation: 1,
              message: 'Zalogowano pomyślnie',
            });
          } else {
            errCode = 400;
            console.log('\n❌❌❌ Password incorrect');
            throw new Error('Hasło nieprawidłowe.');
          }
        });
    })
    .catch(err =>
      catchErr(res, errCode, err, controllerName, { type: 'signup', code: 404 })
    );
};
export const postLogout = (req, res, next) => {
  const controllerName = 'postLogout';
  callLog(person, controllerName);
  successLog(person, controllerName);
  req.session.destroy(err => {
    console.log('postLogout');
    if (err) {
      return next(err);
    }
    res.clearCookie('session_CID');
    res.json({ success: true });
  });
};
