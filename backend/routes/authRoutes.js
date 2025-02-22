import express from 'express';
import {postLogin} from '../controllers/authController.js';

const router = express.Router();

router.post('/login-check', postLogin);

export default router;
