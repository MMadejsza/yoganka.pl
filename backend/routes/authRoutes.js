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

const router = express.Router();

//! GET___________________________________________________
router.get('/status', getStatus);
router.get('/password-token/:token', getPasswordToken);

//! POST - CREATE__________________________________________
router.post('/login', postLogin);
router.post('/signup', postSignup);
router.post('/logout', postLogout);
router.post('/reset', postResetPassword);

//! PUT - EDIT____________________________________________________
router.put('/new-password/:token', putEditPassword);

export default router;
