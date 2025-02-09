import User from '../models/userModel.js';
import UserSettings from '../models/userSettingsModel.js';
import Customer from '../models/customerModel.js';
import CustomerPhones from '../models/customerPhoneModel.js';
import Feedback from '../models/feedbackModel.js';
import Product from '../models/productModel.js';
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
export const showAllProducts = (req, res, next) => {
	Product.fetchAll()
		.then(([rows, fieldData]) => {
			return res.json(rows);
		})
		.catch((err) => console.log(err));
};
