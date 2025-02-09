import User from '../models/userModel.js';
import UserSettings from '../models/userSettingsModel.js';
import {Customer} from '../models/customerModel.js';
import {CustomerPhones} from '../models/customerPhoneModel.js';
import Feedback from '../models/feedbackModel.js';
import {Product} from '../models/productModel.js';
import ScheduleRecord from '../models/scheduleRecordModel.js';
import {BookedSchedule} from '../models/bookedScheduleModel.js';
import {Booking} from '../models/bookingModel.js';
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
	Customer.findAll()
		.then((customers) => {
			return res.json(customers);
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
	CustomerPhones.findAll()
		.then((phones) => {
			return res.json(phones);
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
export const showBookedSchedules = (req, res, next) => {
	BookedSchedule.findAll()
		.then((bookedRecords) => {
			return res.json(bookedRecords);
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
	Product.create({
		Name: req.body.name,
		Type: req.body.type,
		Location: req.body.location,
		Duration: req.body.duration,
		Price: req.body.price,
		TotalSpaces: req.body.totalSpaces,
		StartDate: req.body.startDate,
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
	Booking.findAll()
		.then((bookings) => {
			return res.json(bookings);
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
