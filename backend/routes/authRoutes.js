import express from 'express';
import {
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
router.get('/password-token/:token', resetPasswordLimiter, getPasswordToken);

//! POST - CREATE__________________________________________
router.post('/login', loginLimiter, postLogin);
router.post('/signup', postSignup);
router.post('/logout', postLogout);
router.post('/reset', resetPasswordLimiter, postResetPassword);

//! PUT - EDIT____________________________________________________
router.put('/new-password/:token', resetPasswordLimiter, putEditPassword);

export default router;
