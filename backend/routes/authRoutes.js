import express from 'express';
import {getStatus, postLogin, postLogout} from '../controllers/authController.js';

const router = express.Router();

router.get('/status', getStatus);
router.post('/login-check', postLogin);
router.post('/logout', postLogout);

export default router;
