import express from 'express';
import * as adminC from '../controllers/adminController.js';
import * as userC from '../controllers/userController.js';

const router = express.Router();

router.get('/grafik/:id', userC.showScheduleByID);
router.get('/grafik', adminC.showAllSchedules);
router.get('/konto/grafik/:id', userC.showScheduleByID);
router.get('/konto/ustawienia/get-settings', userC.getEditSettings);
router.get('/konto/ustawienia/get-customer', userC.getEditCustomer);
router.get('/konto/ustawienia', userC.showUserByID);
router.get('/account', userC.showAccount);

router.post('/grafik/book/:id', userC.bookSchedule);

export default router;
