import express from 'express';
import * as adminC from '../controllers/adminController.js';

const router = express.Router();

//  /admin/* => GET
// filtering is on the Frontend side due to low number of total records
router.get('/show-all-users', adminC.showAllUsers);
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

//  /admin/* => POST
router.post('/create-product', adminC.createProduct);

router.post('/ex', (req, res) => {
	console.log('Got in backend:', req.body);
	res.json({message: 'Backend go data!'});
});

export default router;
