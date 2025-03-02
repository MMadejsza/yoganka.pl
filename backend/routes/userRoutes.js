import express from 'express';
import * as adminC from '../controllers/adminController.js';
import * as userC from '../controllers/userController.js';

const router = express.Router();

router.get('/grafik/:id', userC.showScheduleByID);
router.get('/grafik', adminC.showAllSchedules);
router.get('/konto/grafik/:id', userC.showScheduleByID);
router.get('/konto/ustawienia/preferencje', userC.getEditSettings);
router.get('/konto/ustawienia/uczestnik', userC.getEditCustomer);
router.get('/konto/ustawienia', userC.showUserByID);
router.get('/account', userC.showAccount);

router.post('/grafik/book/:id', userC.bookSchedule);
router.post('/konto/ustawienia/update/preferencje', userC.postEditSettings);
router.post('/konto/ustawienia/update/uczestnik', userC.postEditCustomer);

export default router;
