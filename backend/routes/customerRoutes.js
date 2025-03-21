import express from 'express';
import * as customerC from '../controllers/customerController.js';
import isAuth from '../middleware/is-auth-customer.js';
import isAuthUser from '../middleware/is-auth-user.js';

const router = express.Router();

//! GET
//@ routes DYNAMICALLY fetched from browser url
//# set by ViewFrame fetchItem()
router.get('/konto/rezerwacje/:id', isAuth, customerC.getBookingByID);

//@ routes MANUALLY set
router.get('/get-customer-data', isAuth, customerC.getEditCustomer);

//! POST - CREATE
router.post('/create-booking', isAuthUser, customerC.postBookSchedule);

//! PUT -EDIT
router.put('/edit-mark-absent/:scheduleID', isAuth, customerC.putEditMarkAbsent);
router.put('/edit-customer-data', isAuth, customerC.putEditCustomer);

export default router;
