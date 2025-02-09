import User from '../models/userModel.js';
import Customer from '../models/customerModel.js';
import ScheduleRecord from '../models/scheduleModel.js';
import Product from '../models/productModel.js';

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
