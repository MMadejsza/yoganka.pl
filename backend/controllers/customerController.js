import db from '../utils/db.js';
import * as models from '../models/_index.js';
import {errorCode, log, catchErr} from './_controllers.js';
let errCode = errorCode;

export const postCreateBookSchedule = (req, res, next) => {
	const controllerName = 'postCreateBookSchedule';
	log(controllerName);

	// @ Fetching USER
	let currentCustomer;
	let isNewCustomer = false;
	// If it's not a Customer yet
	let customerPromise;
	if (!req.user.Customer) {
		const cDetails = req.body.customerDetails;
		console.log('❗❗❗User isnt the customer, creation of the record Customer...');
		errCode = 400;
		if (!cDetails) {
			console.log('\n❌❌❌ No given customer data');
			throw new Error('Brak danych klienta.');
		}
		if (!cDetails.fname || !cDetails.fname.trim()) {
			console.log('\n❌❌❌ fName field empty');
			throw new Error('Imię nie może być puste.');
		}
		if (!cDetails.lname || !cDetails.lname.trim()) {
			console.log('\n❌❌❌ lname field empty');
			throw new Error('Nazwisko nie może być puste.');
		}
		if (!cDetails.dob || !cDetails.dob.trim()) {
			console.log('\n❌❌❌ dob field empty');
			throw new Error('Data urodzenia nie może być pusta.');
		}
		if (!cDetails.phone || !cDetails.phone.trim()) {
			console.log('\n❌❌❌ phone field empty');
			throw new Error('Numer telefonu nie może być pusty.');
		}

		customerPromise = models.Customer.create({
			CustomerType: cDetails.cType,
			UserID: req.user.UserID,
			FirstName: cDetails.fname,
			LastName: cDetails.lname,
			DoB: cDetails.dob,
			Phone: cDetails.phone,
			PreferredContactMethod: cDetails.cMethod || '-',
			ReferralSource: cDetails.rSource || '-',
			Notes: cDetails.notes,
		}).then((newCustomer) => {
			return models.User.update({Role: 'customer'}, {where: {UserID: req.user.UserID}}).then(
				() => newCustomer,
			);
		});

		isNewCustomer = true;
	} else {
		customerPromise = Promise.resolve(req.user.Customer);
	}

	//@ BOOKING
	db.transaction((t) => {
		return customerPromise
			.then((customer) => {
				currentCustomer = customer;
				// Fetch schedule and lock it for other paralele transactions
				return models.ScheduleRecord.findOne({
					where: {ScheduleID: req.body.schedule}, //from mutation
					transaction: t,
					lock: t.LOCK.UPDATE, //@
				});
			})
			.then((scheduleRecord) => {
				if (!scheduleRecord) {
					errCode = 404;
					throw new Error('Nie znaleziono terminu');
				}
				const scheduleDateTime = new Date(
					`${scheduleRecord.Date}T${scheduleRecord.StartTime}:00`,
				);
				if (scheduleDateTime < new Date()) {
					errCode = 401;
					throw new Error('Nie można rezerwować terminu, który już minął.');
				}
				// console.log('scheduleRecord', scheduleRecord);
				// Count the current amount of reservations
				return models.BookedSchedule.count({
					where: {ScheduleID: req.body.schedule, Attendance: 1},
					transaction: t,
					lock: t.LOCK.UPDATE, //@
				}).then((currentAttendance) => {
					// console.log('currentAttendance', currentAttendance);

					if (currentAttendance >= scheduleRecord.Capacity) {
						// If limit is reached
						errCode = 409;
						throw new Error('Brak wolnych miejsc na ten termin.');
					}

					// IF still enough spaces - check if booked in the past
					return models.Booking.findOne({
						where: {
							CustomerID: currentCustomer.CustomerID,
						},
						include: [
							{
								model: models.ScheduleRecord,
								where: {ScheduleID: req.body.schedule},
								through: {
									attributes: [
										'Attendance',
										'CustomerID',
										'BookingID',
										'ScheduleID',
									],
									where: {CustomerID: currentCustomer.CustomerID},
								},
								required: true,
							},
						],
						transaction: t,
						lock: t.LOCK.UPDATE,
					});
				});
			})
			.then((existingBooking) => {
				if (existingBooking) {
					//! assuming single schedule/booking
					return existingBooking.ScheduleRecords[0].BookedSchedule.update(
						{Attendance: true},
						{transaction: t},
					).then(() => existingBooking);
				} else {
					// booking doesn't exist - create new one
					return models.Booking.create(
						{
							CustomerID: currentCustomer.CustomerID,
							Date: new Date(),
							Product: req.body.product,
							Status: req.body.status,
							AmountPaid: req.body.amountPaid,
							AmountDue: req.body.amountDue,
							PaymentMethod: req.body.paymentMethod,
							PaymentStatus: req.body.paymentStatus,
						},
						{transaction: t},
					).then((booking) => {
						// After creating the reservation, we connected addScheduleRecord which was generated by Sequelize for many-to-many relationship between reservation and ScheduleRecord. The method adds entry to intermediate table (booked_schedules) and connects created reservation with schedule feeder (ScheduleRecord).
						// console.log('scheduleId:', req.body.schedule);
						return booking
							.addScheduleRecord(req.body.schedule, {
								through: {CustomerID: currentCustomer.CustomerID},
								transaction: t,
								individualHooks: true,
							})
							.then(() => booking);
					});
				}
			});
	})
		.then((booking) => {
			console.log('\n✅✅✅ postCreateBookSchedule Rezerwacja utworzona pomyślnie');
			res.status(201).json({
				isNewCustomer,
				confirmation: 1,
				message: 'Rezerwacja utworzona pomyślnie.',
				booking,
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const putEditMarkAbsent = (req, res, next) => {
	const controllerName = 'putEditMarkAbsent';
	log(controllerName);
	const scheduleID = req.params.scheduleID;

	models.ScheduleRecord.findOne({where: {ScheduleID: scheduleID}})
		.then((scheduleRecord) => {
			if (!scheduleRecord) {
				errCode = 404;
				throw new Error('Nie znaleziono terminu.');
			}
			const scheduleDateTime = new Date(
				`${scheduleRecord.Date}T${scheduleRecord.StartTime}:00`,
			);

			if (scheduleDateTime < new Date()) {
				errCode = 401;
				throw new Error('Nie można zwolnić miejsca dla minionego terminu.');
			}
			return models.BookedSchedule.update(
				{Attendance: false},
				{
					where: {
						ScheduleID: scheduleID,
						CustomerID: req.user.Customer.CustomerID,
					},
				},
			).then(([updatedCount]) => {
				if (updatedCount > 0) {
					console.log('\n✅✅✅ putEditMarkAbsent Update successful');
					return res.status(200).json({
						confirmation: 1,
						message: 'Miejsce zwolnione - dziękujemy za informację :)',
					});
				} else {
					errCode = 404;

					throw new Error('Nie znaleziono terminu.');
				}
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};

export const getCustomerDetails = (req, res, next) => {
	const controllerName = 'getCustomerDetails';
	log(controllerName);
	const customer = req.user.Customer;
	// console.log(customer);
	return res.status(200).json({confirmation: 1, customer});
};
export const putEditCustomerDetails = (req, res, next) => {
	const controllerName = 'putEditCustomerDetails';
	log(controllerName);

	console.log(req.body);

	const customerId = req.user.Customer.CustomerID;
	const {phone: newPhone, cMethod: newContactMethod} = req.body;

	if (!newPhone || !newPhone.trim()) {
		console.log('\n❌❌❌ Error putEditCustomerDetails:', 'No phone');
		errCode = 400;
		throw new Error('Numer telefonu nie może być pusty');
	}

	models.Customer.update(
		{Phone: newPhone, PreferredContactMethod: newContactMethod},
		{where: {CustomerID: customerId}},
	)
		.then((customerResult) => {
			return {customerResult};
		})
		.then((results) => {
			console.log('\n✅✅✅ putEditCustomerDetails Update successful');
			const affectedCustomerRows = results.customerResult[0];
			const status = affectedCustomerRows >= 1;
			return res.status(200).json({
				confirmation: status,
				affectedCustomerRows,
				message: 'Profil zaktualizowany pomyslnie.',
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};

export const getBookingByID = (req, res, next) => {
	const controllerName = 'getBookingByID';
	log(controllerName);

	const PK = req.params.id;

	models.Booking.findByPk(PK, {
		through: {attributes: []}, // omit data from mid table
		required: false,
		attributes: {
			exclude: ['CustomerID'],
		},
		include: [
			{
				model: models.Customer,
				attributes: {exclude: []},
			},
			{
				model: models.ScheduleRecord,
				attributes: {exclude: ['UserID']},
				through: {attributes: []}, // omit data from mid table
				include: [
					{
						model: models.Product,
						attributes: {exclude: []},
					},
				],
			},
		],
	})
		.then((booking) => {
			if (!booking) {
				errCode = 404;
				throw new Error('Nie znaleziono rezerwacji.');
			}
			console.log('\n✅✅✅ getBookingByID booking fetched');
			return res.status(200).json({
				confirmation: 1,
				message: 'Rezerwacja pobrana pomyślnie.',
				isLoggedIn: req.session.isLoggedIn,
				booking,
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
