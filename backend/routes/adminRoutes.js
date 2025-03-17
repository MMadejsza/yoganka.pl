import express from 'express';
import * as adminC from '../controllers/adminController.js';
const router = express.Router();

//@ GET
// filtering is on the Frontend side due to low number of total records
router.get('/grafik/:id', adminC.showScheduleByID);
router.get('/show-all-users', adminC.showAllUsers);
router.get('/show-all-users/:id', adminC.showUserByID);
router.get('/show-user-settings/:id', adminC.getEditSettings);

// router.get('/show-all-users-settings', adminC.showAllUserSettings);
router.get('/show-all-customers', adminC.showAllCustomers);
router.get('/show-all-customers/:id', adminC.showCustomerByID);
router.get('/show-customer-data/:id', adminC.getEditCustomer);

router.get('/show-all-schedules', adminC.showAllSchedules);
router.get('/show-all-schedules/:id', adminC.showScheduleByID);
router.get('/show-product-schedules/:pId/:cId', adminC.showProductSchedules);
router.get('/show-booked-schedules', adminC.showBookedSchedules);
router.get('/show-all-participants-feedback', adminC.showAllParticipantsFeedback);
router.get('/show-all-participants-feedback/:id', adminC.showAllParticipantsFeedbackByID);
router.get('/show-all-newsletters', adminC.showAllNewsletters);
router.get('/show-all-subscribed-newsletters', adminC.showAllSubscribedNewsletters);
router.get('/show-all-products', adminC.showAllProducts);
router.get('/show-all-products/:id', adminC.showProductByID);
router.get('/show-all-bookings', adminC.showAllBookings);
router.get('/show-all-bookings/:id', adminC.showBookingByID);
router.get('/show-all-invoices', adminC.showAllInvoices);

//@ POST
//# CREATE
router.post('/create-user', adminC.postCreateUser);
router.post('/edit-user-settings/:id', adminC.postEditSettings);
router.post('/create-customer', adminC.postCreateCustomer);
//? router.post('/create-customer-phone', adminC.createCustomerPhone);
router.post('/create-schedule-record', adminC.createScheduleRecord);
// router.post('/create-newsletter', adminC.createNewsletter);
router.post('/create-product', adminC.postCreateProduct);
router.post('/create-booking', adminC.postCreateBooking);
// router.post('/create-invoice', adminC.createInvoice);
//# EDIT
router.post('/edit-customer-data/:id', adminC.postEditCustomer);
router.post('/edit-product-data/:id', adminC.postEditProduct);
router.post('/edit-schedule-data/:id', adminC.postEditSchedule);

// # DELETE
router.post('/delete-user/:id', adminC.postDeleteUser);
router.post('/delete-customer/:id', adminC.postDeleteCustomer);
router.post('/delete-product/:id', adminC.postDeleteProduct);
router.post('/delete-schedule/:id', adminC.postDeleteSchedule);
router.post('/delete-booking/:id', adminC.postDeleteBooking);
router.post('/delete-feedback/:id', adminC.postDeleteFeedback);
export default router;
