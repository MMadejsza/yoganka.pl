import express from 'express';
import * as userC from '../controllers/userController.js';
import isAuth from '../middleware/is-auth-user.js';

const router = express.Router();

router.get('/grafik/:id', userC.getShowScheduleByID);
router.get('/grafik', userC.getShowAllSchedules);
router.get('/konto/grafik/:id', isAuth, userC.getShowScheduleByID);
router.get('/konto/ustawienia/preferencje', isAuth, userC.getEditSettings);
// router.get('/konto/ustawienia/uczestnik', userC.getputEditCustomer);
router.get('/konto/ustawienia', isAuth, userC.getShowUserByID);
router.get('/account', isAuth, userC.getShowAccount);

// router.post('/grafik/book/:id', userC.bookSchedule);
router.post('/konto/ustawienia/update/preferencje', isAuth, userC.putEditSettings);
// router.post('/konto/ustawienia/update/uczestnik', userC.putEditCustomer);

export default router;
