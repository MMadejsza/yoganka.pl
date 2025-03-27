import express from 'express';
import {
  getEmailToken,
  getPasswordToken,
  getStatus,
  postLogin,
  postLogout,
  postResetPassword,
  postSignup,
  putEditPassword,
} from '../controllers/authController.js';
import {
  loginLimiter,
  resetPasswordLimiter,
} from '../middleware/requestsLimiters.js';

const router = express.Router();

//! GET___________________________________________________
router.get('/status', getStatus);
router.get('/password-token/:token', getPasswordToken);
router.get('/email-token/:token', getEmailToken);

//! POST - CREATE__________________________________________
router.post('/login', loginLimiter, postLogin);
router.post('/signup', postSignup);
router.post('/logout', postLogout);
router.post('/reset', resetPasswordLimiter, postResetPassword);

//! PUT - EDIT____________________________________________________
router.put('/new-password/:token', putEditPassword);

export default router;
