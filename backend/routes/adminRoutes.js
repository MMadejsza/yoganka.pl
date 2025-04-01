import express from 'express';
import * as adminC from '../controllers/adminController.js';
const router = express.Router();

//! GET___________________________________________________
//@ routes DYNAMICALLY fetched from browser url - in english (set by AdminPage fetchData())
router.get('/show-all-users', adminC.getAllUsers);
router.get('/show-all-users/:id', adminC.getUserByID);
router.get('/show-user-settings/:id', adminC.getUserSettings);
router.get('/show-all-customers', adminC.getAllCustomers);
router.get('/show-all-customers/:id', adminC.getCustomerByID);
router.get('/show-customer-data/:id', adminC.getCustomerDetails);
router.get('/show-all-schedules', adminC.getAllSchedules);
router.get('/show-all-schedules/:id', adminC.getScheduleByID);
router.get('/show-product-schedules/:pId/:cId', adminC.getProductSchedules);
router.get('/show-booked-schedules', adminC.getBookings);
router.get(
  '/show-all-participants-feedback',
  adminC.getAllParticipantsFeedback
);
router.get(
  '/show-all-participants-feedback/:id',
  adminC.getAllParticipantsFeedbackByID
);
router.get('/show-all-newsletters', adminC.getAllNewsletters);
router.get(
  '/show-all-subscribed-newsletters',
  adminC.getAllSubscribedNewsletters
);
router.get('/show-all-products', adminC.getAllProducts);
router.get('/show-all-products/:id', adminC.getProductByID);
router.get('/show-all-payments', adminC.getAllPayments);
router.get('/show-all-payments/:id', adminC.getPaymentByID);
router.get('/show-all-invoices', adminC.getAllInvoices);

//! POST - CREATE__________________________________________
router.post('/create-user', adminC.postCreateUser);
router.post('/create-customer', adminC.postCreateCustomer);
router.post('/create-schedule', adminC.postCreateScheduleRecord);
router.post('/create-product', adminC.postCreateProduct);
router.post('/create-payment', adminC.postCreatePayment);

//! PUT - EDIT______________________________________________
router.put('/edit-customer-data/:id', adminC.putEditCustomerDetails);
router.put('/edit-mark-absent', adminC.putEditMarkAbsent);
router.put('/edit-mark-present', adminC.putEditMarkPresent);
router.put('/edit-user-settings/:id', adminC.putEditUserSettings);
router.put('/edit-product-data/:id', adminC.putEditProduct);
router.put('/edit-schedule-data/:id', adminC.putEditSchedule);

//! DELETE_________________________________________________
router.delete('/delete-user/:id', adminC.deleteUser);
router.delete('/delete-customer/:id', adminC.deleteCustomer);
router.delete('/delete-booking-record', adminC.deleteBookingRecord);
router.delete('/delete-product/:id', adminC.deleteProduct);
router.delete('/delete-schedule/:id', adminC.deleteSchedule);
router.delete('/delete-payment/:id', adminC.deletePayment);
router.delete('/delete-feedback/:id', adminC.deleteFeedback);

export default router;
