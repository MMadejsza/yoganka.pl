import express from 'express';
import * as adminC from '../controllers/adminController.js';

const router = express.Router();

//@ GET
// filtering is on the Frontend side due to low number of total records
router.get('/show-all-users', adminC.showAllUsers);
router.get('/show-all-users/:id', adminC.showUserByID);
router.get('/show-all-users-settings', adminC.showAllUserSettings);
router.get('/show-all-customers', adminC.showAllCustomers);
router.get('/show-all-customers-phones', adminC.showAllCustomersPhones);
router.get('/show-all-schedules', adminC.showAllSchedules);
router.get('/show-booked-schedules', adminC.showBookedSchedules);
router.get('/show-all-participants-feedback', adminC.showAllParticipantsFeedback);
router.get('/show-all-newsletters', adminC.showAllNewsletters);
router.get('/show-all-subscribed-newsletters', adminC.showAllSubscribedNewsletters);
router.get('/show-all-products', adminC.showAllProducts);
router.get('/show-all-bookings', adminC.showAllBookings);
router.get('/show-all-invoices', adminC.showAllInvoices);

//@ POST
//# CREATE
router.post('/add-user', adminC.createUser);
//? router.post('/create-customer', adminC.createCustomer);
//? router.post('/create-customer-phone', adminC.createCustomerPhone);
router.post('/create-schedule-record', adminC.createScheduleRecord);
// router.post('/create-newsletter', adminC.createNewsletter);
router.post('/create-product', adminC.createProduct);
// router.post('/create-booking', adminC.createBooking);
// router.post('/create-invoice', adminC.createInvoice);
//# EDIT
router.post('/edit-product', adminC.editProduct);

export default router;
