import express from 'express';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

//  /admin/* => GET
router.post('/show-all-users', adminController.showAllUsers);
router.post('/show-all-customers', adminController.showAllCustomers);

router.post('/product', (req, res) => {
	console.log(req.body);
	res.redirect('/');
});

//  /admin/* => POST
router.post('/ex', (req, res) => {
	console.log('Got in backend:', req.body);
	res.json({message: 'Backend go data!'});
});

export default router;
