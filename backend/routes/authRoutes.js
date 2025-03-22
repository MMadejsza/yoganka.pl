import express from 'express';
import {
  getStatus,
  postLogin,
  postLogout,
  postSignup,
} from '../controllers/authController.js';

const router = express.Router();

//! GET___________________________________________________
router.get('/status', getStatus);

//! POST - CREATE__________________________________________
router.post('/login', postLogin);
router.post('/signup', postSignup);
router.post('/logout', postLogout);

export default router;
