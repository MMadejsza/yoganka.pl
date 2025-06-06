import express from 'express';
import * as customerC from '../controllers/customerController.js';
import isAuth from '../middleware/is-auth-customer.js';
import isAuthUser from '../middleware/is-auth-user.js';

const router = express.Router();

//! GET__________________________________________________________
//@ routes DYNAMICALLY fetched from browser url
//# set by ViewsController fetchItem()
router.get('/konto/platnosci/:id', isAuth, customerC.getPaymentById);
router.get('/konto/karnety/:id', isAuth, customerC.getCustomerPassById);

//@ routes MANUALLY set
router.get('/get-customer-details', isAuth, customerC.getCustomerDetails);

//! POST - CREATE________________________________________________
router.post('/create-booking', isAuthUser, customerC.postCreateBookSchedule);
router.post('/create-pass-purchase', isAuthUser, customerC.postCreateBuyPass);

//! PUT - EDIT____________________________________________________
router.put(
  '/edit-mark-absent/:scheduleID',
  isAuth,
  customerC.putEditMarkAbsent
);
router.put('/edit-customer-data', isAuth, customerC.putEditCustomerDetails);

export default router;
