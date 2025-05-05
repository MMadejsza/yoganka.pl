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
} from '../utils/debuggingUtils.js';
import {
  sendResetPassRequestMail,
  sendSignupConfirmationMail,
} from '../utils/mails/templates/authorization/authorizationEmails.js';
import * as msgs from '../utils/resMessagesUtils.js';
let errCode = errorCode;
const person = 'User';

//! STATUS_____________________________________________________
//@ GET
export const getStatus = (req, res, next) => {
  const controllerName = 'getStatus';
  callLog(req, 'User', controllerName);

  const isLoggedIn = res.locals.isLoggedIn || false;
  const role = res.locals.role;
  const token = res.locals.csrfToken;

  // If user is logged in, fetch full user with preferences + passes
  if (isLoggedIn && req.user?.userId) {
    models.User.findByPk(req.user.userId, {
      include: [
        {
          model: models.UserPrefSetting,
          required: false,
          attributes: {
            exclude: ['userId', 'user_id'], // deleting
          },
        },
        {
          model: models.Customer,
          required: false,
          include: [
            {
              model: models.CustomerPass,
              required: false,
              include: [
                {
                  model: models.PassDefinition,
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    })
      .then(user => {
        if (!user) {
          console.warn('⚠️ No user found in getStatus.');
          return res.status(200).json({
            isLoggedIn: false,
            role,
            token,
            user: null,
          });
        }

        // Prepare safe user object for frontend - as much as they only need and nothing more
        const safeUser = {
          userId: user.userId,
          role: user.role,
          emailVerified: user.emailVerified,
          UserPrefSetting: user.UserPrefSetting || null,
          Customer: user.Customer
            ? {
                customerId: user.Customer.customerId,
                firstName: user.Customer.firstName,
                lastName: user.Customer.lastName,
                customerFullName: `${user.Customer.firstName} ${user.Customer.lastName} (Id: ${user.Customer.customerId})`,
                dob: user.Customer.dob,
                phone: user.Customer.phone,

                // Add passes summary for frontend use
                CustomerPasses:
                  user.Customer.CustomerPasses?.map(pass => ({
                    customerPassId: pass.customerPassId,
                    purchaseDate: pass.purchaseDate,
                    validFrom: pass.validFrom,
                    validUntil: pass.validUntil,
                    usesLeft: pass.usesLeft,
                    status: pass.status,
                    PassDefinition: {
                      passDefId: pass.PassDefinition.passDefId,
                      name: pass.PassDefinition.name,
                      passType: pass.PassDefinition.passType,
                      usesTotal: pass.PassDefinition.usesTotal,
                      validityDays: pass.PassDefinition.validityDays,
                      allowedProductTypes:
                        pass.PassDefinition.allowedProductTypes,
                      price: pass.PassDefinition.price,
                    },
                  })) || [],
              }
            : null,
        };

        successLog('User', controllerName);
        return res.status(200).json({
          isLoggedIn,
          role,
          token,
          user: safeUser, // RETURN full safeUser
        });
      })
      .catch(err => {
        console.error('❌ Error in getStatus:', err);
        return res.status(500).json({
          confirmation: 0,
          message: msgs.userStatusError,
        });
      });
  } else {
    // Not logged in – return basic info
    successLog(person, controllerName, 'unauthenticated');
    return res.status(200).json({
      isLoggedIn,
      role,
      token,
      user: null,
    });
  }
};

//! LOG IN / OUT_______________________________________________
//@ POST
export const postLogin = (req, res, next) => {
  const controllerName = 'postLogin';
  callLog(req, person, controllerName);

  const { email, password, date } = req.body;

  models.User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        errCode = 404;
        console.log("\n❌❌❌ User doesn't exist");
        throw new Error(msgs.userNotFound);
      }

      if (user.emailVerified === false) {
        errCode = 403;
        console.log('\n⛔ Konto nieaktywne – brak potwierdzenia maila');
        throw new Error(msgs.emailNotYetVerified);
      }

      user.update({ lastLoginDate: date });
      return user;
    })
    .then(fetchedUser => {
      if (!fetchedUser) return;
      successLog(person, controllerName, 'fetched');

      // regardless match or mismatch catch takes only if something is wrong with bcrypt itself. otherwise it goes to the next block with promise as boolean
      return bcrypt
        .compare(password, fetchedUser.passwordHash)
        .then(doMatch => {
          if (!doMatch) {
            errCode = 400;
            console.log('\n❌❌❌ Password incorrect');
            throw new Error(msgs.wrongPassword);
          }

          successLog(person, controllerName, 'pass match as well');
          // regenerate the session first so we get a brand‑new session ID
          req.session.regenerate(err => {
            if (err) return next(err);

            // now it’s safe to write into the new session
            req.session.isLoggedIn = true;
            req.session.user = fetchedUser;
            req.session.role = fetchedUser.role.toUpperCase();

            // save the session, and only after that send the JSON response
            req.session.save(err => {
              if (err) return next(err);
              return res.status(200).json({
                type: 'login',
                code: 200,
                confirmation: 1,
                message: msgs.userLoggedIn,
              });
            });
          });
        });
    })
    .catch(err =>
      catchErr(person, res, errCode, err, controllerName, {
        type: 'signup',
        code: 404,
      })
    );
};
export const postLogout = (req, res, next) => {
  const controllerName = 'postLogout';
  callLog(req, person, controllerName);
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
  callLog(req, person, controllerName);
  const token = req.params.token;

  if (!token) {
    errCode = 400;
    throw new Error(msgs.invalidTokenMessage);
  }

  if (token.length !== 64) {
    errCode = 400;
    throw new Error(msgs.invalidTokenMessage);
  }

  models.VerificationToken.findOne({
    where: {
      token: token,
      type: 'email',
      expirationDate: { [Op.gt]: new Date() }, // Validation if still active
      used: false,
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
        throw new Error(msgs.invalidTokenMessage);
      }

      // To change the status of the linked account
      const user = validTokenRecord.User;
      user.emailVerified = true;
      validTokenRecord.used = true;

      // save both records
      return Promise.all([user.save(), validTokenRecord.save()]);
    })
    .then(() => {
      successLog(person, controllerName);

      return res.status(200).json({
        confirmation: 1,
        message: msgs.accountActivated,
      });
    })
    .catch(err =>
      catchErr(person, res, errCode, err, controllerName, {
        type: 'verifyEmail',
        code: 400,
      })
    );
};
//@ POST
export const postSignup = (req, res, next) => {
  const controllerName = 'postSignup';
  callLog(req, person, controllerName);

  const { email, password, confirmedPassword, date } = req.body;

  if (password !== confirmedPassword) {
    errCode = 400;
    throw new Error(msgs.passwordsNotMatching);
  }

  models.User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        errCode = 303;
        throw new Error(msgs.userAlreadyExists);
      }

      // it returns the promise
      return bcrypt
        .hash(password, 12)
        .then(passwordHashed => {
          successLog(person, controllerName, 'hashed');

          // create inactive account first
          return models.User.create({
            registrationDate: date,
            passwordHash: passwordHashed,
            lastLoginDate: date,
            email: email,
            role: 'user',
            profilePictureSrcSetJson: null,
          });
        })
        .then(newUser => {
          successLog(person, controllerName);

          // Set token and it expiry threshold
          const emailVerificationToken = crypto.randomBytes(32).toString('hex');
          const tokenExpiration = Date.now() + 1000 * 60 * 60 * 24; // 24 hrs

          // Insert token into db
          return models.VerificationToken.create({
            userId: newUser.userId,
            type: 'email',
            token: emailVerificationToken,
            expirationDate: new Date(tokenExpiration),
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
            message: msgs.registrationSuccess,
          });
        });
    })
    .catch(err =>
      catchErr(person, res, errCode, err, controllerName, {
        type: 'signup',
        code: 303,
      })
    );
};

//! PASSWORD___________________________________________________
//@ GET
// To check if users in-url given password is valid
export const getPasswordToken = (req, res, next) => {
  const controllerName = 'getPasswordToken';
  callLog(req, person, controllerName);
  const token = req.params.token;

  if (!token) {
    errCode = 400;
    throw Error(msgs.incompleteToken);
  }
  if (token.length !== 64) {
    errCode = 400;
    throw Error(msgs.invalidTokenMessage);
  }

  models.VerificationToken.findOne({
    where: {
      token: token,
      type: 'password',
      expirationDate: { [Op.gt]: new Date() }, // Validation
      used: false,
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
        throw Error(msgs.invalidTokenMessage);
      }
      successLog(person, controllerName);

      return res.status(200).json({
        confirmation: 1,
        userId: validTokenRecord.userId,
        message: msgs.validTokenMessage,
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};

//@ POST
export const postResetPassword = (req, res, next) => {
  const controllerName = 'postResetPassword';

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      catchErr(person, res, errCode, err, controllerName);
    }
    // buffer is in hex format
    const token = buffer.toString('hex');

    models.User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (!user) {
          errCode = 404;
          console.log("\n❌❌❌ User doesn't exist");
          throw new Error(msgs.userNotFound);
        }

        return models.VerificationToken.create({
          userId: user.userId,
          type: 'password',
          token: token,
          expirationDate: new Date(Date.now() + 3600000), // 1 hour
        }).then(() => user);
      })
      .then(user => {
        sendResetPassRequestMail({ to: req.body.email, token: token });

        return res.status(200).json({
          type: 'reset',
          code: 200,
          confirmation: 1,
          message: msgs.passwordResetLinkSent,
        });
      })
      .catch(err =>
        catchErr(person, res, errCode, err, controllerName, {
          type: 'reset',
          code: 404,
        })
      );
  });

  callLog(req, person, controllerName);
  successLog(person, controllerName);
};
export const postResendActivation = (req, res, next) => {
  const controllerName = 'postResendActivation';
  callLog(req, person, controllerName);
  const { email } = req.body;
  let targetUser;

  models.User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        errCode = 404;
        throw new Error(msgs.userNotFound);
      }
      targetUser = user;

      // if already verified - neutral status + return
      if (user.emailVerified) {
        successLog(person, controllerName);
        res.status(200).json({
          type: 'resendVerifyEmail',
          code: 200,
          confirmation: 0,
          message: msgs.emailAlreadyVerified,
        });
        return null; //  end of chain
      }

      // Deactivate all the previous tokens
      return models.VerificationToken.update(
        { used: true },
        {
          where: {
            userId: user.userId,
            type: 'email',
            used: false,
          },
        }
      ).then(() => user);
    })
    .then(user => {
      // if user is null it means that res has been send - nothing more to do
      if (!user) return null;

      // generate token
      const token = crypto.randomBytes(32).toString('hex');
      const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
      return models.VerificationToken.create({
        userId: targetUser.userId,
        type: 'email',
        token,
        expirationDate: expiration,
      }).then(() => token);
    })
    .then(token => {
      if (!token) return null;

      // send an email with this token
      sendSignupConfirmationMail({
        to: targetUser.email,
        token,
      });

      successLog(person, controllerName);
      res.status(200).json({
        type: 'resendVerifyEmail',
        code: 200,
        confirmation: 1,
        message: msgs.emailVerifiedSent,
      });
    })
    .catch(err => {
      // if (user === null) catch doesn't do anything either
      if (res.headersSent) return;
      catchErr(person, res, errCode, err, controllerName, {
        type: 'resendVerifyEmail',
        code: errCode || 500,
      });
    });
};

export const putEditPassword = (req, res, next) => {
  const controllerName = 'putEditPassword';
  callLog(req, person, controllerName);
  const token = req.params.token;
  const { password, confirmedPassword, userId } = req.body;

  if (password !== confirmedPassword) {
    errCode = 400;
    throw new Error(msgs.passwordsNotMatching);
  }
  let verToken;
  // Find the token for this user
  models.VerificationToken.findOne({
    where: {
      token: token,
      type: 'password',
      expirationDate: { [Op.gt]: new Date() }, // Token must be up-to-date
    },
    include: [
      {
        model: models.User,
        required: true,
        where: { userId: userId }, // additional safety check
      },
    ],
  })
    .then(validTokenRecord => {
      console.log(
        'Token from DB:',
        validTokenRecord ? validTokenRecord.token : 'No token found'
      );
      if (!validTokenRecord) {
        console.log('\n❌❌❌ Wrong token');
        errCode = 400;
        throw new Error(msgs.sessionExpired);
      }

      verToken = validTokenRecord;
      // Hash the new password
      return bcrypt.hash(password, 12).then(hashedPassword => {
        if (!hashedPassword) throw new Error(msgs.passwordEncryptionError);

        verToken.User.passwordHash = hashedPassword;
        // Save the updated user password
        return verToken.User.save();
      });
    })
    .then(userSaved => {
      successLog(person, controllerName);
      // Najpierw wyślij odpowiedź do klienta:
      res.status(200).json({
        type: 'new-password',
        code: 200,
        confirmation: 1,
        message: msgs.passwordUpdated,
      });

      setTimeout(() => {
        verTokenRecord.update({ used: true }).catch(err => {
          console.log('Nie udało się oznaczyć tokena jako used:', err);
        });
      }, 5000);
    })
    .catch(err =>
      catchErr(person, res, errCode, err, controllerName, {
        type: 'editPassword',
        code: 404,
      })
    );
};
