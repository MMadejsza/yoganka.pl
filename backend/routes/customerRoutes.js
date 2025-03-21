import express from 'express';
import * as customerC from '../controllers/customerController.js';
import isAuth from '../middleware/is-auth-customer.js';
import isAuthUser from '../middleware/is-auth-user.js';

const router = express.Router();

//@ GET
router.get('/konto/ustawienia/uczestnik', isAuth, customerC.getEditCustomer);
router.get('/konto/rezerwacje/:id', isAuth, customerC.getBookingByID);

//@ POST - CREATE
router.post('/create-booking', isAuthUser, customerC.postBookSchedule);

//@ PUT -EDIT
router.put('/edit-mark-absent/:id', isAuth, customerC.putEditMarkAbsent);
router.put('/edit-customer-data', isAuth, customerC.putEditCustomer);

export default router;
