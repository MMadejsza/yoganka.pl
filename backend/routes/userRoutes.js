import express from 'express';
import * as userC from '../controllers/userController.js';
import isAuth from '../middleware/is-auth-user.js';

const router = express.Router();

router.get('/grafik/:id', userC.showScheduleByID);
router.get('/grafik', userC.showAllSchedules);
router.get('/konto/grafik/:id', isAuth, userC.showScheduleByID);
router.get('/konto/ustawienia/preferencje', isAuth, userC.getEditSettings);
// router.get('/konto/ustawienia/uczestnik', userC.getEditCustomer);
router.get('/konto/ustawienia', isAuth, userC.showUserByID);
router.get('/account', isAuth, userC.showAccount);

// router.post('/grafik/book/:id', userC.bookSchedule);
router.post('/konto/ustawienia/update/preferencje', isAuth, userC.postEditSettings);
// router.post('/konto/ustawienia/update/uczestnik', userC.postEditCustomer);

export default router;
