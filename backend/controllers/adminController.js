import User from '../models/userModel.js';
import Customer from '../models/customerModel.js';

export const showAllUsers = (req, res, next) => {
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
