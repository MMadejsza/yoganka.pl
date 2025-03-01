import * as models from '../models/_index.js';
import db from '../utils/db.js';

export const showUserByID = (req, res, next) => {
	console.log(`➡️➡️➡️ called showUserByID`);
	const PK = req.user.UserID;
	models.User.findByPk(PK, {
		include: [
			{
				model: models.Customer, // Add Customer
				required: false, // May not exist
				include: [
					{
						model: models.CustomerPhones, // Customer phone numbers
						required: false,
					},
				],
			},
			{
				model: models.UserPrefSettings, // User settings if exist
				required: false,
			},
		],
	})
		.then((user) => {
			if (!user) {
				return res.redirect('/konto');
			}
			console.log('✅ user fetched');

			return res.status(200).json({isLoggedIn: req.session.isLoggedIn, user});
		})
		.catch((err) => console.log(err));
};
export const showScheduleByID = (req, res, next) => {
	console.log(`➡️ called user showScheduleByID`);

	const PK = req.params.id;
	models.ScheduleRecord.findByPk(PK, {
		include: [
			{
				model: models.Product,
				required: true,
			},
			{
				model: models.Booking, // Booking which has relation through BookedSchedule
				through: {attributes: []}, // omit data from mid table
				required: false,
				attributes: {
					exclude: ['Product'],
				},
			},
		],
	})
		.then((scheduleData) => {
			if (!scheduleData) {
				return res.redirect('/grafik');
			}

			// Convert to JSON
			const schedule = scheduleData.toJSON();
			let bookedByUser = false;

			// We substitute bookings content for security
			if (schedule.Bookings) {
				if (req.user && req.user.Customer) {
					bookedByUser = schedule.Bookings.some(
						(booking) => booking.CustomerID === req.user.Customer.CustomerID,
					);
				}
				schedule.Bookings = schedule.Bookings.length;
				schedule.bookedByUser = bookedByUser;
			}

			return res
				.status(200)
				.json({isLoggedIn: req.session.isLoggedIn, schedule, user: req.user});
		})
		.catch((err) => console.log(err));
};

export const bookSchedule = (req, res, next) => {
	let currentCustomer;
	// @ Fetching USER
	// check if there is logged in User
	if (!req.user) {
		return res.status(401).json({error: 'Użytkownik nie jest zalogowany'});
	}
	// If it's not a Customer yet
	let customerPromise;
	if (!req.user.Customer) {
		console.log('Użytkownik nie jest klientem, tworzymy rekord Customer...');
		customerPromise = models.Customer.create({
			UserID: req.user.UserID,
			CustomerType: 'Indywidualny',
			FirstName: 'Imię',
			LastName: 'Nazwisko',
			DoB: new Date().toISOString().split('T')[0], // todays dummy date
		});
	} else {
		customerPromise = Promise.resolve(req.user.Customer);
	}

	//@ BOOKING
	db.transaction((t) => {
		return customerPromise
			.then((customer) => {
				currentCustomer = customer;
				// create booking
				return models.Booking.create(
					{
						CustomerID: customer.CustomerID,
						ScheduleID: req.body.schedule,
						Date: req.body.date,
						Product: req.body.product,
						Status: req.body.status,
						AmountPaid: req.body.amountPaid,
						AmountDue: req.body.amountDue,
						PaymentMethod: req.body.paymentMethod,
						PaymentStatus: req.body.paymentStatus,
					},
					{transaction: t},
				);
			})
			.then((booking) => {
				// After creating the reservation, we connected addScheduleRecord which was generated by Sequelize for many-to-many relationship between reservation and ScheduleRecord. The method adds entry to intermediate table (booked_schedules) and connects created reservation with schedule feeder (ScheduleRecord).
				console.log('scheduleId:', req.body.schedule);
				return booking
					.addScheduleRecord(req.body.schedule, {
						through: {CustomerID: currentCustomer.CustomerID},
						transaction: t,
					})
					.then(() => booking); // We return instance for further .then blocks
			});
	})
		.then((booking) => {
			console.log('Rezerwacja utworzona pomyślnie');
			res.status(201).json({message: 'Rezerwacja utworzona pomyślnie', booking});
		})
		.catch((err) => {
			// Check if error is due to double booking
			if (
				err.name === 'SequelizeUniqueConstraintError' ||
				err.parent?.code === 'ER_DUP_ENTRY'
			) {
				// 409 - conflict
				return res.status(409).json({
					error: 'Ten termin został już zarezerwowany przez tego klienta.',
				});
			}
			console.log(err);
			next(err);
		});
};

export const showAccount = (req, res, next) => {
	console.log(`➡️ called showAccount`, new Date().toISOString());

	// @ Fetching USER
	// check if there is logged in User
	if (!req.user) {
		return res.status(401).json({error: 'Użytkownik nie jest zalogowany'});
	}

	// if only user
	if (!req.user.Customer) {
		const user = req.user;
		console.log('✅ user fetched');
		return res.status(200).json({isLoggedIn: req.session.isLoggedIn, user});
	} else {
		let PK = req.user.Customer.CustomerID;
		console.log('✅ customer fetched');
		models.Customer.findByPk(PK, {
			include: [
				{
					model: models.CustomerPhones, // Customer phone numbers
					required: false,
				},
				{
					model: models.User, // Add Customer
					required: false, // May not exist
					include: [
						{
							model: models.UserPrefSettings, // Customer phone numbers
							required: false,
						},
					],
				},
				{
					model: models.Booking, // His reservations
					required: false,
					include: [
						{
							model: models.Invoice, // eventual invoices
							required: false,
						},
						{
							model: models.ScheduleRecord, // schedules trough booked schedule
							required: false,
							through: {attributes: []}, // deleting if not necessary from middle table
							include: [
								{
									model: models.Product, //schedule's product
									required: false,
								},
								{
									model: models.Feedback, // harmonogram -> opinie
									required: false,
									where: {CustomerID: req.user.Customer.CustomerID}, // but only for particular customer
								},
							],
							attributes: {
								exclude: ['ProductID'], // deleting
							},
						},
					],
					where: {CustomerID: req.user.Customer.CustomerID},
					attributes: {
						exclude: ['ProductID', 'CustomerID'], // deleting
					},
				},
			],
			attributes: {
				exclude: ['UserID'], // deleting
			},
		})
			.then((customer) => {
				if (!customer) {
					return res.redirect('/');
				}
				console.log('✅ customer fetched');
				return res.status(200).json({isLoggedIn: req.session.isLoggedIn, customer});
			})
			.catch((err) => console.log(err));
	}
};

export const getEditSettings = (req, res, next) => {
	console.log(`➡️➡️➡️ called getEditSettings`);

	const PK = req.user.UserPrefSetting?.UserPrefID;

	models.UserPrefSettings.findByPk(PK)
		.then((preferences) => {
			return res.status(200).json({preferences});
		})
		.catch((err) => console.log(err));
};
export const getEditCustomer = (req, res, next) => {
	console.log(`➡️➡️➡️ called getEditCustomer`);
	const customer = req.user.Customer;
	console.log(customer);
	return res.status(200).json({customer});
};
