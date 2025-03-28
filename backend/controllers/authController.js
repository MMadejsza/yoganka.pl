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
} from '../utils/loggingUtils.js';
import {
  sendResetPassRequestMail,
  sendSignupConfirmationMail,
} from '../utils/mails/templates/authorization/authorizationEmails.js';
let errCode = errorCode;
const person = 'User';

//! STATUS_____________________________________________________
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
//! LOG IN / OUT_______________________________________________
//@ POST
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

      if (user.EmailVerified === false) {
        errCode = 403;
        console.log('\n⛔ Konto nieaktywne – brak potwierdzenia maila');
        throw new Error(
          'Aby się zalogować, najpierw potwierdź swój adres e-mail.'
        );
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
            req.session.save();
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

//! SIGN UP____________________________________________________
//@ GET
export const getEmailToken = (req, res, next) => {
  const controllerName = 'getEmailToken';
  callLog(person, controllerName);
  const token = req.params.token;

  if (!token) {
    errCode = 400;
    throw new Error('Link prawdopodobnie wygasł.');
  }

  if (token.length !== 64) {
    errCode = 400;
    throw new Error('Link jest nieprawidłowy.');
  }

  models.VerificationToken.findOne({
    where: {
      Token: token,
      Type: 'email',
      ExpirationDate: { [Op.gt]: new Date() }, // Validation if still active
      Used: false,
    },
    include: [
      {
        model: models.User, // to assign the status for linked account
        required: true,
      },
    ],
  })
    .then(validTokenRecord => {
      if (!validTokenRecord) {
        errCode = 400;
        console.log('\n❌ Nieprawidłowy lub wygasły token weryfikacyjny.');
        throw new Error('Link jest nieważny lub wygasł.');
      }

      // To change the status of the linked account
      const user = validTokenRecord.User;
      user.EmailVerified = true;
      validTokenRecord.Used = true;

      return user.save();
    })
    .then(() => {
      successLog(person, controllerName);

      return res.status(200).json({
        confirmation: 1,
        message: 'konto aktywowane.',
      });
    })
    .catch(err =>
      catchErr(res, errCode, err, controllerName, {
        type: 'verifyEmail',
        code: 400,
      })
    );
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

          // create inactive account first
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

          // Set token and it expiry threshold
          const emailVerificationToken = crypto.randomBytes(32).toString('hex');
          const tokenExpiration = Date.now() + 1000 * 60 * 60 * 24; // 24 hrs

          // Insert token into db
          return models.VerificationToken.create({
            UserID: newUser.UserID,
            Type: 'email',
            Token: emailVerificationToken,
            ExpirationDate: new Date(tokenExpiration),
          }).then(() => ({ newUser, emailVerificationToken }));
        })
        .then(({ newUser, emailVerificationToken }) => {
          // Send activation email with token
          sendSignupConfirmationMail({
            to: email,
            token: emailVerificationToken,
          });

          return res.status(200).json({
            type: 'signup',
            code: 200,
            confirmation: 1,
            message:
              '✅ Zarejestrowano pomyślnie. Sprawdź maila, aby aktywować konto.',
          });
        });
    })
    .catch(err =>
      catchErr(res, errCode, err, controllerName, { type: 'signup', code: 303 })
    );
};

//! PASSWORD___________________________________________________
//@ GET
// To check if users in-url given password is valid
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

  models.VerificationToken.findOne({
    where: {
      Token: token,
      Type: 'password',
      ExpirationDate: { [Op.gt]: new Date() }, // Validation
      Used: false,
    },
    include: [
      {
        model: models.User,
        required: true, // If there will be no user assigned - error = extra validation
      },
    ],
  })
    .then(validTokenRecord => {
      if (!validTokenRecord) {
        errCode = 400;
        console.log('\n❌❌❌ Wrong token');
        throw Error('Link wygasł lub jest nieprawidłowy.');
      }
      return res.status(200).json({
        confirmation: 1,
        userID: validTokenRecord.UserID,
        message: 'Link jest prawidłowy.',
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};

//@ POST
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

        return models.VerificationToken.create({
          UserID: user.UserID,
          Type: 'password',
          Token: token,
          ExpirationDate: new Date(Date.now() + 3600000), // 1 hour
        }).then(() => user);
      })
      .then(user => {
        sendResetPassRequestMail({ to: req.body.email, token: token });

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

  // Find te token for this user
  models.VerificationToken.findOne({
    where: {
      Token: token,
      Type: 'password',
      ExpirationDate: { [Op.gt]: new Date() }, // Validation if token is up to date
    },
    include: [
      {
        model: models.User,
        required: true,
        where: { UserID: userID }, // dodatkowy warunek dla pewności
      },
    ],
  })
    .then(validTokenRecord => {
      if (!validTokenRecord) throw new Error('Sesja wygasła');
      // save assigned user for later methods
      const user = validTokenRecord.User;

      return bcrypt.hash(password, 12).then(hashedPassword => {
        if (!hashedPassword)
          throw Error('Błąd szyfrowania hasła - prośba odrzucona.');
        user.PasswordHash = hashedPassword;
        // save user but remain the token in the db for eventual abuse logging later on
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
