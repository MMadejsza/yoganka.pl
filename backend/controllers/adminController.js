import * as models from '../models/_index.js';
import simpleListAll from '../utils/listAllToTable.js';

//@ USERS
export const showAllUsers = (req, res, next) => {
	const model = models.User;
	model
		.findAll({
			include: [
				{
					model: models.UserPrefSettings,
					attributes: ['UserPrefID'],
				},
			],
		})
		.then((users) => {
			const userHeaders = Object.keys(model.getAttributes());
			const settingsHeaders = ['UserPrefSetting'];
			const totalHeaders = [...userHeaders, ...settingsHeaders];
			return res.json({
				totalHeaders,
				content: users,
			});
		})
		.catch((err) => console.log(err));
};
export const createUser = (req, res, next) => {
	models.User.create({
		RegistrationDate: req.body.regDate,
		Login: req.body.login,
		Location: req.body.location,
		PasswordHash: req.body.pass,
		LastLoginDate: req.body.loginDate,
		Email: req.body.mail + Math.floor(Math.random() * 1000) + '@google.com',
		Role: req.body.role,
		ProfilePictureSrcSetJSON: req.body.profilePic,
	})
		.then(() => {
			console.log('✅ created');
		})
		.catch((err) => console.log(err));
};
export const deleteUser = (req, res, next) => {
	models.User.fetchAll()
		.then(([rows, fieldData]) => {
			return res.json(rows);
		})
		.catch((err) => console.log(err));
};
export const editUser = (req, res, next) => {
	models.User.fetchAll()
		.then(([rows, fieldData]) => {
			return res.json(rows);
		})
		.catch((err) => console.log(err));
};
export const showAllUserSettings = (req, res, next) => {
	simpleListAll(res, models.UserSettings);
};
//@ CUSTOMERS
export const showAllCustomers = (req, res, next) => {
	simpleListAll(res, models.Customer);
};
export const deleteCustomer = (req, res, next) => {
	models.User.fetchAll()
		.then(([rows, fieldData]) => {
			return res.json(rows);
		})
		.catch((err) => console.log(err));
};
export const editCustomer = (req, res, next) => {
	models.User.fetchAll()
		.then(([rows, fieldData]) => {
			return res.json(rows);
		})
		.catch((err) => console.log(err));
};
export const showAllCustomersPhones = (req, res, next) => {
	models.CustomerPhones.findAll()
		.then((phones) => {
			return res.json(phones);
		})
		.catch((err) => console.log(err));
};
//@ SCHEDULES
export const showAllSchedules = (req, res, next) => {
	simpleListAll(res, models.ScheduleRecord);
};
export const showBookedSchedules = (req, res, next) => {
	models.BookedSchedule.findAll()
		.then((bookedRecords) => {
			return res.json(bookedRecords);
		})
		.catch((err) => console.log(err));
};
export const createScheduleRecord = (req, res, next) => {
	models.ScheduleRecord.create({
		ProductID: req.body.productID,
		Date: req.body.date,
		StartTime: req.body.startTime,
		Location: req.body.location,
	})
		.then(() => {
			console.log('✅ created');
		})
		.catch((err) => console.log(err));
};
//@ FEEDBACK
export const showAllParticipantsFeedback = (req, res, next) => {
	simpleListAll(res, models.Feedback);
};
//@ NEWSLETTERS
export const showAllNewsletters = (req, res, next) => {
	simpleListAll(res, models.Newsletter);
};
//# SUBS
export const showAllSubscribedNewsletters = (req, res, next) => {
	simpleListAll(res, models.SubscribedNewsletter);
};
//@ PRODUCTS
export const showAllProducts = (req, res, next) => {
	simpleListAll(res, models.Product);
};
export const createProduct = async (req, res, next) => {
	models.Product.create({
		Name: req.body.name,
		Type: req.body.type,
		Location: req.body.location,
		Duration: req.body.duration,
		Price: req.body.price,
		TotalSpaces: req.body.totalSpaces,
		StartDate: req.body.startDate,
	})
		.then(() => {
			console.log('✅ created');
		})
		.catch((err) => console.log(err));
};
//@ BOOKINGS
export const showAllBookings = (req, res, next) => {
	simpleListAll(res, models.Booking);
};
//@ INVOICES
export const showAllInvoices = (req, res, next) => {
	simpleListAll(res, models.Invoice);
};
