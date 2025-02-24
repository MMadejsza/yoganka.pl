import express from 'express';
import {postLogin, postLogout} from '../controllers/authController.js';

const router = express.Router();

router.post('/login-check', postLogin);
router.post('/logout', postLogout);

export default router;
