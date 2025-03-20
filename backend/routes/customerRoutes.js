import express from 'express';
import * as customerC from '../controllers/customerController.js';
import isAuth from '../middleware/is-auth-customer.js';
import isAuthUser from '../middleware/is-auth-user.js';

const router = express.Router();
router.get('/konto/ustawienia/uczestnik', isAuth, customerC.getEditCustomer);
router.get('/konto/rezerwacje/:id', isAuth, customerC.getBookingByID);

router.post('/grafik/book/:id', isAuthUser, customerC.postBookSchedule);
router.post('/grafik/cancel/:id', isAuth, customerC.postCancelSchedule);
router.put('/edit-customer-data', isAuth, customerC.putEditCustomer);

export default router;
