import express from 'express';
import * as userC from '../controllers/userController.js';
import isAuth from '../middleware/is-auth-user.js';

const router = express.Router();

//! GET
//@ routes dynamically fetched from browser url
//# set by ViewFrame fetchItem()
router.get('/grafik/:id', userC.getShowScheduleByID);
router.get('/konto/grafik/:id', isAuth, userC.getShowScheduleByID);

//# set by SchedulePage fetchData() and  fetchItem()
router.get('/grafik', userC.getShowAllSchedules);

//@ routes MANUALLY set
router.get('/show-user-settings', isAuth, userC.getSettings);
router.get('/show-account', isAuth, userC.getAccount);

//! PUT -EDIT
router.put('/edit-user-settings', isAuth, userC.putEditSettings);

export default router;
