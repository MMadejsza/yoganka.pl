import db from '../utils/db.js';
import * as models from '../models/_index.js';

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
export const postCancelSchedule = (req, res, next) => {
	const scheduleID = req.params.id;
	models.BookedSchedule.destroy({
		where: {
			ScheduleID: scheduleID,
			CustomerID: req.user.Customer.CustomerID,
		},
	})
		.then((deletedCount) => {
			if (deletedCount > 0) {
				return res
					.status(200)
					.json({message: 'Miejsce zwolnione - dziękujemy za informację :)'});
			} else {
				return res
					.status(404)
					.json({message: 'Nie znaleziono terminu do zwolnienia miejsca'});
			}
		})
		.catch((err) => {
			console.error(err);
			next(err);
		});
};
export const getEditCustomer = (req, res, next) => {
	console.log(`➡️➡️➡️ called getEditCustomer`);
	const customer = req.user.Customer;
	// console.log(customer);
	return res.status(200).json({customer});
};

export const postEditCustomer = (req, res, next) => {
	console.log(`➡️➡️➡️ called postEditSettings`);
	db.transaction()
		.then((t) => {
			const customerId = req.user.Customer.CustomerID;
			const newPhone = req.body.phone;
			const newContactMethod = req.body.cMethod;

			return models.CustomerPhones.update(
				{CustomerMobile: newPhone},
				{where: {CustomerID: customerId}, transaction: t},
			)
				.then((phoneResult) => {
					return models.Customer.update(
						{PreferredContactMethod: newContactMethod},
						{where: {CustomerID: customerId}, transaction: t},
					).then((customerResult) => {
						return {phoneResult, customerResult};
					});
				})
				.then((results) => {
					return t.commit().then(() => {
						console.log('Transaction committed, updates successful');
						const affectedPhoneRows = results.phoneResult[0];
						const affectedCustomerRows = results.customerResult[0];
						const status = affectedPhoneRows >= 1 || affectedCustomerRows >= 1;
						return res.status(200).json({
							confirmation: status,
							affectedPhoneRows,
							affectedCustomerRows,
						});
					});
				})
				.catch((err) => {
					return t.rollback().then(() => {
						console.log('Transaction rollback, error:', err);
						return res.status(500).json({error: err.message});
					});
				});
		})
		.catch((err) => {
			console.log('Error starting transaction:', err);
			return res.status(500).json({error: err.message});
		});
};
