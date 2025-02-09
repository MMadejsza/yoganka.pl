import User from '../models/userModel.js';
import UserSettings from '../models/userSettingsModel.js';
import Customer from '../models/customerModel.js';
import CustomerPhones from '../models/customerPhoneModel.js';
import Feedback from '../models/feedbackModel.js';
import {Product} from '../models/productModel.js';
import ScheduleRecord from '../models/scheduleRecordModel.js';
import BookedSchedule from '../models/bookedScheduleModel.js';
import Booking from '../models/bookingModel.js';
import Invoice from '../models/invoiceModel.js';
import Newsletter from '../models/newsletterModel.js';
import SubscribedNewsletter from '../models/newsletterSubscribedModel.js';

export const showAllUsers = (req, res, next) => {
	User.fetchAll()
		.then(([rows, fieldData]) => {
			return res.json(rows);
		})
		.catch((err) => console.log(err));
};
export const deleteUser = (req, res, next) => {
	User.fetchAll()
		.then(([rows, fieldData]) => {
			return res.json(rows);
		})
		.catch((err) => console.log(err));
};
export const editUser = (req, res, next) => {
	User.fetchAll()
		.then(([rows, fieldData]) => {
			return res.json(rows);
		})
		.catch((err) => console.log(err));
};

export const showAllCustomers = (req, res, next) => {
	Customer.fetchAll()
		.then(([rows, fieldData]) => {
			return res.json(rows);
		})
		.catch((err) => console.log(err));
};
export const deleteCustomer = (req, res, next) => {
	User.fetchAll()
		.then(([rows, fieldData]) => {
			return res.json(rows);
		})
		.catch((err) => console.log(err));
};
export const editCustomer = (req, res, next) => {
	User.fetchAll()
		.then(([rows, fieldData]) => {
			return res.json(rows);
		})
		.catch((err) => console.log(err));
};
export const showAllCustomersPhones = (req, res, next) => {
	CustomerPhones.fetchAll()
		.then(([rows, fieldData]) => {
			return res.json(rows);
		})
		.catch((err) => console.log(err));
};

export const showAllSchedules = (req, res, next) => {
	ScheduleRecord.fetchAll()
		.then(([rows, fieldData]) => {
			return res.json(rows);
		})
		.catch((err) => console.log(err));
};
export const showAllParticipantsFeedback = (req, res, next) => {
	Feedback.fetchAll()
		.then(([rows, fieldData]) => {
			return res.json(rows);
		})
		.catch((err) => console.log(err));
};
export const showAllNewsletters = (req, res, next) => {
	Newsletter.fetchAll()
		.then(([rows, fieldData]) => {
			return res.json(rows);
		})
		.catch((err) => console.log(err));
};
export const showAllSubscribedNewsletters = (req, res, next) => {
	SubscribedNewsletter.fetchAll()
		.then(([rows, fieldData]) => {
			return res.json(rows);
		})
		.catch((err) => console.log(err));
};
export const createProduct = async (req, res, next) => {
	console.log(req.body);
	const name = req.body.name;
	const type = req.body.type;
	const location = req.body.location;
	const duration = req.body.duration;
	const price = req.body.price;
	const totalSpaces = req.body.totalSpaces;
	const startDate = req.body.startDate;
	Product.create({
		Name: name,
		Type: type,
		Location: location,
		Duration: duration,
		Price: price,
		TotalSpaces: totalSpaces,
		StartDate: startDate,
	})
		.then((res) => {
			console.log('created');
		})
		.catch((err) => console.log(err));
};
export const showAllProducts = (req, res, next) => {
	Product.findAll()
		.then((products) => {
			console.log(products);
			return res.json(products);
		})
		.catch((err) => console.log(err));
};

export const showAllBookings = (req, res, next) => {
	Booking.fetchAll()
		.then(([rows, fieldData]) => {
			return res.json(rows);
		})
		.catch((err) => console.log(err));
};
export const showAllInvoices = (req, res, next) => {
	Invoice.fetchAll()
		.then(([rows, fieldData]) => {
			return res.json(rows);
		})
		.catch((err) => console.log(err));
};
