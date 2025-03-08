import db from '../utils/db.js';
import * as models from '../models/_index.js';

export const postBookSchedule = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called postBookSchedule`);
	// @ Fetching USER
	// check if there is logged in User
	if (!req.user) {
		throw new Error({message: 'Użytkownik nie jest zalogowany'});
	}
	let currentCustomer;
	// If it's not a Customer yet
	let customerPromise;
	if (!req.user.Customer) {
		const cDetails = req.body.customerDetails;
		console.log('❗❗❗Użytkownik nie jest klientem, tworzymy rekord Customer...');

		if (!cDetails) {
			console.log('\n❌❌❌ Brak danych klienta');
			return res.status(400).json({message: 'Brak danych klienta'});
		}
		if (!cDetails.fname || !cDetails.fname.trim()) {
			console.log('\n❌❌❌ Imię nie może być puste');
			return res.status(400).json({message: 'Imię nie może być puste'});
		}
		if (!cDetails.lname || !cDetails.lname.trim()) {
			console.log('\n❌❌❌ Nazwisko nie może być puste');
			return res.status(400).json({message: 'Nazwisko nie może być puste'});
		}
		if (!cDetails.dob || !cDetails.dob.trim()) {
			console.log('\n❌❌❌ Data urodzenia nie może być puste');
			return res.status(400).json({message: 'Data urodzenia nie może być pusta'});
		}
		if (!cDetails.phone || !cDetails.phone.trim()) {
			console.log('\n❌❌❌ Telefon nie może być puste');
			return res.status(400).json({message: 'Numer telefonu nie może być pusty'});
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
		});
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
					console.log('❗❗❗if (!scheduleRecord) {');
					throw new Error({message: 'Nie znaleziono terminu'});
				}
				const scheduleDateTime = new Date(
					`${scheduleRecord.Date}T${scheduleRecord.StartTime}:00`,
				);
				if (scheduleDateTime < new Date()) {
					throw new Error({message: 'Nie można rezerwować terminu, który już minął.'});
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
						console.log('❗❗❗if (currentAttendance >= scheduleRecord.capacity)');
						throw new Error({message: 'Brak wolnych miejsc na ten termin.'});
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
					// If booking exists - update attendance only
					// console.log('❗❗❗', existingBooking);
					return existingBooking.ScheduleRecords[0].BookedSchedule.update(
						{Attendance: true},
						{transaction: t},
					).then(() => existingBooking);
				} else {
					// booking doesn't exist - create new one
					return models.Booking.create(
						{
							CustomerID: currentCustomer.CustomerID,
							Date: req.body.date,
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
							})
							.then(() => booking);
					});
				}
			});
	})
		.then((booking) => {
			console.log('\n✅✅✅ Rezerwacja utworzona pomyślnie');
			res.status(201).json({message: 'Rezerwacja utworzona pomyślnie', booking});
		})
		.catch((err) => {
			console.error(err);
			// If no enough spaces
			console.log('\n❌❌❌ Error postBookSchedule:', err.message);
			if (err.message === 'Brak wolnych miejsc na ten termin.') {
				return res.status(409).json({message: err.message});
			}

			if (
				err.message === 'Użytkownik nie jest zalogowany.' ||
				err.message === 'Nie można rezerwować terminu, który już minął.'
			) {
				return res.status(401).json({message: err.message});
			}
			// if the same customer tries to book the schedule
			if (
				err.name === 'SequelizeUniqueConstraintError' ||
				err.parent?.code === 'ER_DUP_ENTRY'
			) {
				return res.status(409).json({
					message: 'Ten termin został już opłacony przez tego klienta.',
				});
			}
			return res.status(500).json({message: err.message});
		});
};
export const postCancelSchedule = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called postCancelSchedule`);
	const scheduleID = req.params.id;

	models.ScheduleRecord.findOne({where: {ScheduleID: scheduleID}})
		.then((scheduleRecord) => {
			if (!scheduleRecord) {
				throw new Error({message: 'Nie znaleziono terminu.'});
			}
			const scheduleDateTime = new Date(
				`${scheduleRecord.Date}T${scheduleRecord.StartTime}:00`,
			);

			if (scheduleDateTime < new Date()) {
				throw new Error({message: 'Nie można zwolnić miejsca dla minionego terminu.'});
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
					console.log('\n✅✅✅ postCancelSchedule Update successful');
					return res
						.status(200)
						.json({message: 'Miejsce zwolnione - dziękujemy za informację :)'});
				} else {
					throw new Error({message: 'Nie znaleziono terminu.'});
				}
			});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error postCancelSchedule:', err.message);
			if (err.message === 'Nie znaleziono terminu.') {
				return res.status(404).json({message: err.message});
			}
			if (err.message == 'Nie można zwolnić miejsca dla minionego terminu.') {
				return res.status(409).json({message: err.message});
			}
			next(err);
		});
};

export const getEditCustomer = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called getEditCustomer`);
	const customer = req.user.Customer;
	// console.log(customer);
	return res.status(200).json({customer});
};
export const postEditCustomer = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called postEditCustomer`);

	const customerId = req.user.Customer.CustomerID;
	const newPhone = req.body.phone;
	const newContactMethod = req.body.cMethod;
	if (!newPhone || !newPhone.trim()) {
		console.log('\n❌❌❌ Error postEditCustomer:', 'No phone');
		return res.status(400).json({message: 'Numer telefonu nie może być pusty'});
	}

	models.Customer.update(
		{Phone: newPhone, PreferredContactMethod: newContactMethod},
		{where: {CustomerID: customerId}},
	)
		.then((customerResult) => {
			return {customerResult};
		})
		.then((results) => {
			console.log('\n✅✅✅ postEditCustomer Update successful');
			const affectedCustomerRows = results.customerResult[0];
			const status = affectedCustomerRows >= 1;
			return res.status(200).json({
				confirmation: status,
				affectedCustomerRows,
			});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error postEditCustomer:', err);
			return res.status(500).json({error: err.message});
		});
};

export const getShowBookingByID = (req, res, next) => {
	console.log(`\n➡️➡️➡️ customer called showBookingByID`);

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
				throw new Error({message: 'Nie znaleziono rezerwacji.'});
			}
			console.log('\n✅✅✅ getShowBookingByID booking fetched');
			return res.status(200).json({isLoggedIn: req.session.isLoggedIn, booking});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error fetching the booking:', err.message);
			return res.status(404).json({message: err.message});
		});
};
