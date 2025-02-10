import * as models from '../models/_index.js';

//@ USERS
export const showAllUsers = (req, res, next) => {
	models.User.findAll({
		include: [
			{
				model: models.UserPrefSettings,
				attributes: ['UserPrefID'],
			},
		],
	})
		.then((users) => {
			const userHeaders = Object.keys(models.User.getAttributes());
			const settingsHeaders = ['UserPrefSetting'];
			const headers = [...userHeaders, ...settingsHeaders];
			console.log(users);
			return res.json({
				headers,
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
	models.UserSettings.findAll()
		.then((settings) => {
			return res.json(settings);
		})
		.catch((err) => console.log(err));
};
//@ CUSTOMERS
export const showAllCustomers = (req, res, next) => {
	models.Customer.findAll()
		.then((customers) => {
			return res.json(customers);
		})
		.catch((err) => console.log(err));
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
	models.ScheduleRecord.findAll()
		.then((scheduleRecords) => {
			return res.json(scheduleRecords);
		})
		.catch((err) => console.log(err));
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
	models.Feedback.findAll()
		.then((feedbacks) => {
			return res.json(feedbacks);
		})
		.catch((err) => console.log(err));
};
//@ NEWSLETTERS
export const showAllNewsletters = (req, res, next) => {
	models.Newsletter.findAll()
		.then((newsletters) => {
			return res.json(newsletters);
		})
		.catch((err) => console.log(err));
};
//# SUBS
export const showAllSubscribedNewsletters = (req, res, next) => {
	models.SubscribedNewsletter.findAll()
		.then((subscribedNewsletters) => {
			return res.json(subscribedNewsletters);
		})
		.catch((err) => console.log(err));
};
//@ PRODUCTS
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
export const showAllProducts = (req, res, next) => {
	models.Product.findAll()
		.then((products) => {
			console.log(products);
			return res.json(products);
		})
		.catch((err) => console.log(err));
};
//@ BOOKINGS
export const showAllBookings = (req, res, next) => {
	models.Booking.findAll()
		.then((bookings) => {
			return res.json(bookings);
		})
		.catch((err) => console.log(err));
};
//@ INVOICES
export const showAllInvoices = (req, res, next) => {
	models.Invoice.findAll()
		.then((invoices) => {
			return res.json(invoices);
		})
		.catch((err) => console.log(err));
};
