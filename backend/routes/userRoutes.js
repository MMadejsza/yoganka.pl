import express from 'express';
import * as adminC from '../controllers/adminController.js';
import * as userC from '../controllers/userController.js';

const router = express.Router();

router.get('/grafik', adminC.showAllSchedules);
router.get('/grafik/:id', userC.showScheduleByID);

export default router;
