import express from 'express';
import * as adminC from '../controllers/adminController.js';
import isAuth from '../middleware/is-auth-admin.js';
const router = express.Router();

//@ GET
// filtering is on the Frontend side due to low number of total records
router.get('/show-all-users', isAuth, adminC.showAllUsers);
router.get('/show-all-users/:id', isAuth, adminC.showUserByID);
router.get('/show-all-users-settings', isAuth, adminC.showAllUserSettings);
router.get('/show-all-customers', isAuth, adminC.showAllCustomers);
router.get('/show-all-customers/:id', isAuth, adminC.showCustomerByID);
router.get('/show-all-customers-phones', isAuth, adminC.showAllCustomersPhones);
router.get('/show-all-schedules', isAuth, adminC.showAllSchedules);
router.get('/show-all-schedules/:id', isAuth, adminC.showScheduleByID);
router.get('/show-booked-schedules', isAuth, adminC.showBookedSchedules);
router.get('/show-all-participants-feedback', isAuth, adminC.showAllParticipantsFeedback);
router.get('/show-all-participants-feedback/:id', isAuth, adminC.showAllParticipantsFeedbackByID);
router.get('/show-all-newsletters', isAuth, adminC.showAllNewsletters);
router.get('/show-all-subscribed-newsletters', isAuth, adminC.showAllSubscribedNewsletters);
router.get('/show-all-products', isAuth, adminC.showAllProducts);
router.get('/show-all-products/:id', isAuth, adminC.showProductByID);
router.get('/show-all-bookings', isAuth, adminC.showAllBookings);
router.get('/show-all-bookings/:id', isAuth, adminC.showBookingByID);
router.get('/show-all-invoices', isAuth, adminC.showAllInvoices);

//@ POST
//# CREATE
router.post('/add-user', isAuth, adminC.createUser);
//? router.post('/create-customer', adminC.createCustomer);
//? router.post('/create-customer-phone', adminC.createCustomerPhone);
router.post('/create-schedule-record', isAuth, adminC.createScheduleRecord);
// router.post('/create-newsletter', adminC.createNewsletter);
router.post('/create-product', isAuth, adminC.createProduct);
// router.post('/create-booking', adminC.createBooking);
// router.post('/create-invoice', adminC.createInvoice);
//# EDIT
router.post('/edit-product', isAuth, adminC.editProduct);

export default router;
