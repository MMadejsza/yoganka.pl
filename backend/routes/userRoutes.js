import express from 'express';
import * as userC from '../controllers/userController.js';
import isAuth from '../middleware/is-auth-user.js';

const router = express.Router();

//! GET____________________________________________________
//@ routes dynamically fetched from browser url
//# set by ViewsController fetchItem()
router.get('/grafik/karnety/:id', userC.getPassById);
router.get('/grafik/karnety', userC.getAllPasses);
router.get('/grafik/:id', userC.getScheduleById);
router.get('/konto/grafik/:id', isAuth, userC.getScheduleById);

//# set by SchedulePage fetchData() and  fetchItem()
router.get('/grafik', userC.getAllSchedules);

//@ routes MANUALLY set
router.get('/show-user-settings', isAuth, userC.getSettings);
router.get('/show-account', isAuth, userC.getAccount);

//! PUT - EDIT_______________________________________________
router.put('/edit-user-settings', isAuth, userC.putEditSettings);

export default router;
