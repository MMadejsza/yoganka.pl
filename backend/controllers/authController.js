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
// export const getStatus = (req, res, next) => {
//   const controllerName = 'getStatus';
//   callLog(req, 'User', controllerName);

//   const isLoggedIn = res.locals.isLoggedIn || false;
//   const role = res.locals.role;
//   const token = res.locals.csrfToken;

//   // If user is logged in, fetch full user with preferences + passes
//   if (isLoggedIn && req.user?.userId) {
//     models.User.findByPk(req.user.userId, {
//       include: [
//         {
//           model: models.UserPrefSetting,
//           required: false,
//           attributes: {
//             exclude: ['userId', 'user_id'], // deleting
//           },
//         },
//         {
//           model: models.Customer,
//           required: false,
//           include: [
//             {
//               model: models.CustomerPass,
//               required: false,
//               include: [
//                 {
//                   model: models.PassDefinition,
//                   required: false,
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     })
//       .then(user => {
//         if (!user) {
//           console.warn('⚠️ No user found in getStatus.');
//           return res.status(200).json({
//             isLoggedIn: false,
//             role,
//             token,
//             user: null,
//           });
//         }

//         // Prepare safe user object for frontend - as much as they only need and nothing more
//         const safeUser = {
//           userId: user.userId,
//           role: user.role,
//           emailVerified: user.emailVerified,
//           UserPrefSetting: user.UserPrefSetting || null,
//           Customer: user.Customer
//             ? {
//                 customerId: user.Customer.customerId,
//                 firstName: user.Customer.firstName,
//                 lastName: user.Customer.lastName,
//                 customerFullName: `${user.Customer.firstName} ${user.Customer.lastName} (Id: ${user.Customer.customerId})`,
//                 dob: user.Customer.dob,
//                 phone: user.Customer.phone,

//                 // Add passes summary for frontend use
//                 CustomerPasses:
//                   user.Customer.CustomerPasses?.map(pass => ({
//                     customerPassId: pass.customerPassId,
//                     purchaseDate: pass.purchaseDate,
//                     validFrom: pass.validFrom,
//                     validUntil: pass.validUntil,
//                     usesLeft: pass.usesLeft,
//                     status: pass.status,
//                     PassDefinition: {
//                       passDefId: pass.PassDefinition.passDefId,
//                       name: pass.PassDefinition.name,
//                       passType: pass.PassDefinition.passType,
//                       usesTotal: pass.PassDefinition.usesTotal,
//                       validityDays: pass.PassDefinition.validityDays,
//                       allowedProductTypes:
//                         pass.PassDefinition.allowedProductTypes,
//                       price: pass.PassDefinition.price,
//                     },
//                   })) || [],
//               }
//             : null,
//         };

//         successLog('User', controllerName);
//         return res.status(200).json({
//           isLoggedIn,
//           role,
//           token,
//           user: safeUser, // RETURN full safeUser
//         });
//       })
//       .catch(err => {
//         console.error('❌ Error in getStatus:', err);
//         return res.status(500).json({
//           confirmation: 0,
//           message: msgs.userStatusError,
//         });
//       });
//   } else {
//     // Not logged in – return basic info
//     successLog(person, controllerName, 'unauthenticated');
//     return res.status(200).json({
//       isLoggedIn,
//       role,
//       token,
//       user: null,
//     });
//   }
// };
export const getStatus = async (req, res, next) => {
  const controllerName = 'getStatus';
  callLog(req, 'User', controllerName);
  let errCode = 500;

  try {
    const isLoggedIn = res.locals.isLoggedIn || false;
    const role = res.locals.role;
    const token = res.locals.csrfToken;

    if (isLoggedIn && req.user?.userId) {
      const user = await models.User.findByPk(req.user.userId, {
        include: [
          {
            model: models.UserPrefSetting,
            required: false,
            attributes: { exclude: ['userId', 'user_id'] },
          },
          {
            model: models.Customer,
            required: false,
            include: [
              {
                model: models.CustomerPass,
                required: false,
                include: [{ model: models.PassDefinition, required: false }],
              },
            ],
          },
        ],
      });

      if (!user) {
        console.warn('⚠️ No user found in getStatus.');
        return res
          .status(200)
          .json({ isLoggedIn: false, role, token, user: null });
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
      return res.status(200).json({ isLoggedIn, role, token, user: safeUser });
    }

    // not logged in
    successLog('User', controllerName, 'unauthenticated');
    return res.status(200).json({ isLoggedIn, role, token, user: null });
  } catch (err) {
    console.error('❌ Error in getStatus:', err);
    console.error('[getStatus] error:', err);
    return catchErr('User', res, errCode, err, controllerName);
  }
};

//! LOG IN / OUT_______________________________________________
//@ POST
export const postLogin = async (req, res, next) => {
  const controllerName = 'postLogin';
  callLog(req, person, controllerName);
  let errCode = 500;

  try {
    // lookup user by email
    const { email, password, date } = req.body;
    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      errCode = 404;
      console.log("\n❌❌❌ User doesn't exist");
      throw new Error(msgs.userNotFound);
    }

    // ensure email is verified
    if (user.emailVerified === false) {
      errCode = 403;
      console.log('\n⛔ Konto nieaktywne – brak potwierdzenia maila');
      throw new Error(msgs.emailNotYetVerified);
    }

    // update last login timestamp
    await user.update({ lastLoginDate: date });

    // regardless match or mismatch catch takes only if something is wrong with bcrypt itself. otherwise it goes to the next block with promise as boolean
    // compare password hashes
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      errCode = 400;
      console.log('\n❌❌❌ Password incorrect');
      throw new Error(msgs.wrongPassword);
    }
    successLog(person, controllerName, 'pass match as well');

    // regenerate the session first so we get a brand‑new session ID
    req.session.regenerate(err => {
      if (err) return next(err);

      // write login state into new session
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.role = user.role.toUpperCase();

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
  } catch (err) {
    return catchErr(person, res, errCode, err, controllerName, {
      type: 'signup',
      code: errCode || 500,
    });
  }
};
export const postLogout = (req, res, next) => {
  const controllerName = 'postLogout';
  callLog(req, person, controllerName);

  // clear server-side session
  req.session.destroy(err => {
    if (err) {
      // if something goes wrong destroying the session, pass to error handler
      return next(err);
    }

    // remove the session cookie from client
    res.clearCookie('session_CID');

    // log out success and send response
    successLog(person, controllerName, 'session destroyed');
    return res.status(200).json({ success: true });
  });
};

//! SIGN UP____________________________________________________
//@ GET
export const getEmailToken = async (req, res, next) => {
  const controllerName = 'getEmailToken';
  callLog(req, person, controllerName);
  let errCode = 500;

  try {
    // extract token from URL
    const token = req.params.token;
    if (!token || token.length !== 64) {
      errCode = 400;
      throw new Error(msgs.invalidTokenMessage);
    }

    // look up a still-active, unused email-verification token
    const validTokenRecord = await models.VerificationToken.findOne({
      where: {
        token,
        type: 'email',
        expirationDate: { [Op.gt]: new Date() },
        used: false,
      },
      include: [{ model: models.User, required: true }],
    });

    // if no such token, bail out
    if (!validTokenRecord) {
      errCode = 400;
      console.log('❌ Invalid or expired verification token.');
      throw new Error(msgs.invalidTokenMessage);
    }

    // mark user as verified
    const user = validTokenRecord.User;
    user.emailVerified = true;
    // and mark the token as used
    validTokenRecord.used = true;

    // save both changes in parallel: user and token updates
    // Promise.all waits until all passed promises resolve (or any rejects)
    await Promise.all([
      user.save(), // save the updated user record
      validTokenRecord.save(), // save the updated token record
    ]);

    // send back success
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: msgs.accountActivated,
    });
  } catch (err) {
    // central error handling
    return catchErr(person, res, errCode, err, controllerName, {
      type: 'verifyEmail',
      code: 400,
    });
  }
};
//@ POST
export const postSignup = async (req, res, next) => {
  const controllerName = 'postSignup';
  callLog(req, person, controllerName);
  let errCode = 500;

  try {
    // extract signup payload
    const { email, password, confirmedPassword, date } = req.body;

    // ensure passwords match
    if (password !== confirmedPassword) {
      errCode = 400;
      throw new Error(msgs.passwordsNotMatching);
    }

    // check for existing account
    const existingUser = await models.User.findOne({ where: { email } });
    if (existingUser) {
      errCode = 303;
      throw new Error(msgs.userAlreadyExists);
    }

    // hash the password
    const passwordHash = await bcrypt.hash(password, 12);
    successLog(person, controllerName, 'password hashed');

    // create the new user (inactive)
    const newUser = await models.User.create({
      registrationDate: date,
      passwordHash: passwordHash,
      lastLoginDate: date,
      email: email,
      role: 'user',
      profilePictureSrcSetJson: null,
    });
    successLog(person, controllerName, 'user created');

    // generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    // insert token into database
    await models.VerificationToken.create({
      userId: newUser.userId,
      type: 'email',
      token: emailVerificationToken,
      expirationDate: expirationDate,
    });

    // send activation email
    sendSignupConfirmationMail({
      to: email,
      token: emailVerificationToken,
    });

    // respond to client
    return res.status(200).json({
      type: 'signup',
      code: 200,
      confirmation: 1,
      message: msgs.registrationSuccess,
    });
  } catch (err) {
    // central error handling
    return catchErr(person, res, errCode, err, controllerName, {
      type: 'signup',
      code: errCode,
    });
  }
};

//! PASSWORD___________________________________________________
export const getPasswordToken = async (req, res, next) => {
  const controllerName = 'getPasswordToken';
  callLog(req, person, controllerName);
  let errCode = 500;

  try {
    // extract token from URL params
    const token = req.params.token;
    if (!token) {
      errCode = 400;
      throw new Error(msgs.incompleteToken);
    }
    if (token.length !== 64) {
      errCode = 400;
      throw new Error(msgs.invalidTokenMessage);
    }

    // look up a valid, unused password-reset token
    const validTokenRecord = await models.VerificationToken.findOne({
      where: {
        token,
        type: 'password',
        expirationDate: { [Op.gt]: new Date() },
        used: false,
      },
      include: [{ model: models.User, required: true }],
    });

    // if no record found, treat as invalid
    if (!validTokenRecord) {
      errCode = 400;
      console.log('❌ Wrong or expired password token');
      throw new Error(msgs.invalidTokenMessage);
    }

    // successful lookup
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      userId: validTokenRecord.userId,
      message: msgs.validTokenMessage,
    });
  } catch (err) {
    // central error handling
    return catchErr(person, res, errCode, err, controllerName);
  }
};
//@ POST
export const postResetPassword = async (req, res, next) => {
  const controllerName = 'postResetPassword';
  callLog(req, person, controllerName);
  let errCode = 500;

  try {
    // generate a secure random token (synchronously)
    const token = crypto.randomBytes(32).toString('hex');

    // look up the user by email
    const user = await models.User.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      errCode = 404;
      console.log("\n❌❌❌ User doesn't exist");
      throw new Error(msgs.userNotFound);
    }

    // create a password reset token that expires in 1 hour
    await models.VerificationToken.create({
      userId: user.userId,
      type: 'password',
      token,
      expirationDate: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      used: false,
    });

    // send the reset link email
    sendResetPassRequestMail({ to: req.body.email, token });

    // respond with success
    return res.status(200).json({
      type: 'reset',
      code: 200,
      confirmation: 1,
      message: msgs.passwordResetLinkSent,
    });
  } catch (err) {
    // handle errors centrally
    return catchErr(person, res, errCode, err, controllerName, {
      type: 'reset',
      code: errCode || 404,
    });
  }
};
export const postResendActivation = async (req, res, next) => {
  const controllerName = 'postResendActivation';
  callLog(req, person, controllerName);
  let errCode = 500;

  try {
    const { email } = req.body;

    // find user by email
    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      errCode = 404;
      throw new Error(msgs.userNotFound);
    }

    // if the account is already verified, return a neutral status
    if (user.emailVerified) {
      successLog(person, controllerName, 'already verified');
      return res.status(200).json({
        type: 'resendVerifyEmail',
        code: 200,
        confirmation: 0,
        message: msgs.emailAlreadyVerified,
      });
    }

    // mark all previous email tokens as used
    await models.VerificationToken.update(
      { used: true },
      {
        where: {
          userId: user.userId,
          type: 'email',
          used: false,
        },
      }
    );

    // generate a new activation token and save it
    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
    await models.VerificationToken.create({
      userId: user.userId,
      type: 'email',
      token,
      expirationDate: expiration,
    });

    // send the activation email
    sendSignupConfirmationMail({ to: email, token });

    successLog(person, controllerName, 'activation resent');
    return res.status(200).json({
      type: 'resendVerifyEmail',
      code: 200,
      confirmation: 1,
      message: msgs.emailVerifiedSent,
    });
  } catch (err) {
    if (res.headersSent) return;
    return catchErr(person, res, errCode, err, controllerName, {
      type: 'resendVerifyEmail',
      code: errCode || 500,
    });
  }
};
//@ PUT
export const putEditPassword = async (req, res, next) => {
  const controllerName = 'putEditPassword';
  callLog(req, person, controllerName);
  let errCode = 500;

  try {
    // extract token and new passwords from request
    const token = req.params.token;
    const { password, confirmedPassword, userId } = req.body;

    // ensure the two passwords match
    if (password !== confirmedPassword) {
      errCode = 400;
      throw new Error(msgs.passwordsNotMatching);
    }

    // look up a valid, unused password-reset token for this user
    const verToken = await models.VerificationToken.findOne({
      where: {
        token,
        type: 'password',
        expirationDate: { [Op.gt]: new Date() },
        used: false,
      },
      include: [
        {
          model: models.User,
          required: true,
          where: { userId },
        },
      ],
    });

    // if token not found or expired, abort
    if (!verToken) {
      errCode = 400;
      console.log('\n❌❌❌ Wrong token');
      throw new Error(msgs.sessionExpired);
    }

    // hash the new password
    const hashed = await bcrypt.hash(password, 12);
    if (!hashed) throw new Error(msgs.passwordEncryptionError);

    // save the new password
    verToken.User.passwordHash = hashed;
    await verToken.User.save();

    // log the successful update
    successLog(person, controllerName);

    // respond to client immediately
    res.status(200).json({
      type: 'new-password',
      code: 200,
      confirmation: 1,
      message: msgs.passwordUpdated,
    });

    // after a short delay, mark this token as used
    setTimeout(() => {
      verToken.update({ used: true }).catch(err => {
        console.log('Failed to mark token as used:', err);
      });
    }, 5000);
  } catch (err) {
    // central error handler
    return catchErr(person, res, errCode, err, controllerName, {
      type: 'editPassword',
      code: errCode || 404,
    });
  }
};
