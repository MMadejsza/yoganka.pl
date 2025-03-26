import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import 'dotenv/config';
import { Op } from 'sequelize';
import * as models from '../models/_index.js';
import {
  callLog,
  catchErr,
  errorCode,
  successLog,
} from '../utils/controllersUtils.js';
import { mainTransporter } from '../utils/mails/transporter.js';
let errCode = errorCode;
const person = 'User';

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
// to check if users in-url given password is valid
export const getPasswordToken = (req, res, next) => {
  const controllerName = 'getPasswordToken';
  callLog(person, controllerName);
  const token = req.params.token;

  if (!token) {
    errCode = 400;
    throw Error('Link jest niekompletny.');
  }
  if (token.length !== 64) {
    errCode = 400;
    throw Error('Link jest nieprawidłowy.');
  }

  models.User.findOne({
    where: { resetToken: token, resetTokenExpiration: { [Op.gt]: Date.now() } },
  })
    .then(user => {
      if (!user) {
        errCode = 400;
        console.log('\n❌❌❌ Wrong token');
        throw Error('Link wygasł lub jest nieprawidłowy.');
      }
      return res.status(200).json({
        confirmation: 1,
        userID: user.UserID,
        message: 'Link jest prawidłowy.',
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};

//@ POST
export const postSignup = (req, res, next) => {
  const controllerName = 'postSignup';
  callLog(person, controllerName);

  const { email, password, confirmedPassword, date } = req.body;

  if (password !== confirmedPassword) {
    errCode = 400;
    throw new Error('Hasła nie są zgodne.');
  }

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

          mainTransporter
            .sendMail({
              from: process.env.SMTP_USER,
              to: email,
              subject: 'Rejestracja przebiegła pomyślnie.',
              html: '<h1>RejestracjaDziała elegancko!</h1>',
            })
            .then(() => {
              successLog(person, controllerName, 'mail sent');
            })
            .catch(
              catchErr(res, errCode, err, controllerName, { type: 'signup' })
            );

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
export const postResetPassword = (req, res, next) => {
  const controllerName = 'postResetPassword';

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      catchErr(res, errCode, err, controllerName);
    }
    // buffer is in hex format
    const token = buffer.toString('hex');

    models.User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (!user) {
          errCode = 404;
          console.log("\n❌❌❌ User doesn't exist");
          throw new Error('Użytkownik nie istnieje.');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        mainTransporter.sendMail({
          from: process.env.SMTP_USER,
          to: req.body.email,
          subject: 'Resetowanie hasła',
          html: `
              <p>Poproszono o reset hasła</p>
              <p>Kliknij w <a href="http://localhost:5000/login/${token}">link</a> aby ustawic nowe hasło.</p>              
              `,
        });
        return res.status(200).json({
          type: 'reset',
          code: 200,
          confirmation: 1,
          message: 'Link resetujący hasło wysłany na maila.',
        });
      })
      .catch(err =>
        catchErr(res, errCode, err, controllerName, {
          type: 'reset',
          code: 404,
        })
      );
  });

  callLog(person, controllerName);
  successLog(person, controllerName);
};
//@ PUT
export const putEditPassword = (req, res, next) => {
  const controllerName = 'putEditPassword';
  callLog(person, controllerName);
  const token = req.params.token;
  const { password, confirmedPassword, userID } = req.body;
  // console.log(req.body);

  if (password !== confirmedPassword) {
    errCode = 400;
    throw new Error('Hasła nie są zgodne.');
  }

  models.User.findOne({
    where: {
      UserID: userID,
      resetToken: token,
      resetTokenExpiration: { [Op.gt]: Date.now() },
    },
  })
    .then(user => {
      if (!user) throw new Error('Sesja wygasła');
      return bcrypt.hash(password, 12).then(hashedPassword => {
        if (!hashedPassword)
          throw Error('Błąd szyfrowania hasła - prośba odrzucona.');
        user.PasswordHash = hashedPassword;
        // resetting token
        user.resetToken = null;
        user.resetTokenExpiration = null;
        return user.save();
      });
    })
    .then(userSaved => {
      successLog(person, controllerName);
      return res.status(200).json({
        type: 'new-password',
        code: 200,
        confirmation: 1,
        message: 'Nowe hasło przyjęte - zaloguj się.',
      });
    })
    .catch(err =>
      catchErr(res, errCode, err, controllerName, {
        type: 'editPassword',
        code: 404,
      })
    );
};
