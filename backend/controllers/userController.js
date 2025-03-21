import * as models from '../models/_index.js';
import columnMaps from '../utils/columnsMapping.js';
import {formatIsoDateTime, getWeekDay} from '../utils/formatDateTime.js';
import {Sequelize, Op, fn, col} from 'sequelize';
import {errorCode, log, catchErr} from './_controllers.js';
let errCode = errorCode;

//! USER_____________________________________________
//@ GET
export const getAccount = (req, res, next) => {
	const controllerName = 'getAccount';
	log(controllerName);

	// @ Fetching USER
	// check if there is logged in User
	if (!req.user) {
		errCode = 401;
		throw new Error('Użytkownik nie jest zalogowany');
	}

	// if only user
	if (!req.user.Customer) {
		const user = req.user;
		console.log('\n✅✅✅ getAccount user fetched');
		return res
			.status(200)
			.json({confirmation: 1, message: 'Profil uczestnika pobrany pomyślnie.', user});
	} else {
		let PK = req.user.Customer.CustomerID;
		return models.Customer.findByPk(PK, {
			include: [
				{
					model: models.User, // Add Customer
					required: false, // May not exist
					include: [
						{
							model: models.UserPrefSettings, // Customer phone numbers
							required: false,
							attributes: {
								exclude: ['UserID'], // deleting
							},
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
							attributes: {
								exclude: ['BookingID'], // deleting
							},
						},
					],
					where: {CustomerID: req.user.Customer.CustomerID},
					attributes: {
						exclude: ['ProductID', 'CustomerID'], // deleting
					},
				},
				{
					model: models.BookedSchedule,
					required: false,
					include: [
						{
							model: models.ScheduleRecord, // schedules trough booked schedule
							required: false,

							include: [
								{
									model: models.Product, //schedule's product
									required: false,
								},
								{
									model: models.Feedback, // harmonogram -> opinie
									required: false,
									where: {CustomerID: req.user.Customer.CustomerID}, // but only for particular customer
									attributes: {
										exclude: ['CustomerID', 'ScheduleID'], // deleting
									},
								},
							],
							attributes: {
								exclude: ['ProductID'], // deleting
							},
						},
					],
					attributes: {
						exclude: ['CustomerID', 'ScheduleID'], // deleting
					},
				},
			],
			attributes: {
				exclude: ['UserID'], // deleting
			},
		})
			.then((customer) => {
				if (!customer) {
					errCode = 404;
					throw new Error('Nie pobrano danych uczestnika.');
				}
				console.log('\n✅✅✅ showAccount customer fetched');
				return res.status(200).json({
					customer,
					confirmation: 1,
					message: 'Profil uczestnika pobrany pomyślnie.',
				});
			})
			.catch((err) => catchErr(res, errCode, err, controllerName));
	}
};
export const getSettings = (req, res, next) => {
	const controllerName = 'getSettings';
	log(controllerName);
	const PK = req.user.UserPrefSetting?.UserPrefID;

	models.UserPrefSettings.findByPk(PK)
		.then((preferences) => {
			if (!preferences) {
				errCode = 404;
				throw new Error('Nie pobrano ustawień.');
			}
			console.log('\n✅✅✅ getSettings fetched');
			return res
				.status(200)
				.json({confirmation: 1, message: 'Ustawienia pobrana pomyślnie.', preferences});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
//@ PUT
export const putEditSettings = (req, res, next) => {
	const controllerName = 'putEditSettings';
	log(controllerName);

	const userID = req.user.UserID;

	const {handedness, font, notifications, animation, theme} = req.body;
	console.log(`❗❗❗`, req.body);

	// if preferences don't exist - create new ones:
	models.UserPrefSettings.findOrCreate({
		where: {UserID: userID},
		defaults: {
			UserID: userID,
			Handedness: !!handedness || false,
			FontSize: parseInt(font) || 14,
			Notifications: !!notifications || false,
			Animation: !!animation || false,
			Theme: !!theme || false,
		},
	})
		.then(([preferences, created]) => {
			if (!created) {
				// Nothing changed
				if (
					preferences.Handedness == !!handedness &&
					preferences.FontSize == parseInt(font) &&
					preferences.Notifications == !!notifications &&
					preferences.Animation == !!animation &&
					preferences.Theme == !!theme
				) {
					// Nothing changed
					console.log('\n❓❓❓ putEditSettings no change');
					return {confirmation: 0, message: 'Brak zmian'};
				} else {
					// Update
					preferences.Handedness = !!handedness;
					preferences.FontSize = parseInt(font);
					preferences.Notifications = !!notifications;
					preferences.Animation = !!animation;
					preferences.Theme = !!theme;
					return preferences.save().then(() => {
						console.log('\n✅✅✅ putEditSettings Preferences Updated');
						return {confirmation: 1, message: 'Ustawienia zostały zaktualizowane'};
					});
				}
			} else {
				// New preferences created
				console.log('\n✅✅✅ putEditSettings Preferences Created');
				return {confirmation: 1, message: 'Ustawienia zostały utworzone'};
			}
		})
		.then((result) => {
			console.log('\n✅✅✅ Preferences Result sent back');
			return res.status(200).json({
				confirmation: result.confirmation,
				message: result.message,
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName, {code: 409}));
};

//! SCHEDULES_____________________________________________
//@ GET
export const getAllSchedules = (req, res, next) => {
	const controllerName = 'getAllSchedules';
	log(controllerName);

	const model = models.ScheduleRecord;

	// We create dynamic joint columns based on the map
	const columnMap = columnMaps[model.name] || {};
	// If logged In and is Customer - we want to check his booked schedules to flag them later
	const now = new Date();
	model
		.findAll({
			include: [
				{
					model: models.Product,
					attributes: ['Type', 'Name', 'Price'],
				},
				{
					model: models.Booking,
					required: false,
					attributes: ['BookingID'], //booking Id is enough
					through: {
						attributes: ['Attendance', 'CustomerID'], // dołącz dodatkowe atrybuty
					},

					// where: isUser && isCustomer ? {CustomerID: req.user.Customer.CustomerID} : undefined, // Filter
				},
			],
			attributes: {
				exclude: ['ProductID'], // Deleting substituted ones
			},
			where: Sequelize.where(
				fn(
					'CONCAT',
					col('ScheduleRecord.Date'),
					'T',
					col('ScheduleRecord.StartTime'),
					':00',
				),
				{[Op.gte]: now.toISOString()},
			),
		})
		.then((records) => {
			if (!records) {
				errCode = 404;
				throw new Error('Nie znaleziono terminów.');
			}
			// Convert for records for different names
			const formattedRecords = records.map((record) => {
				const newRecord = {}; // Container for formatted data

				const attributes = model.getAttributes();
				const jsonRecord = record.toJSON();
				// console.log('jsonRecord', jsonRecord);

				// 🔄 Iterate after each column in user record
				for (const key in jsonRecord) {
					const newKey = columnMap[key] || key; // New or original name if not specified
					const attributeType = attributes[key]?.type.constructor.key?.toUpperCase();
					if (
						attributeType === 'DATE' ||
						attributeType === 'DATEONLY' ||
						attributeType === 'DATETIME'
					) {
						newRecord[newKey] = formatIsoDateTime(jsonRecord[key], true);
					} else if (key === 'Product' && jsonRecord[key]) {
						newRecord['Typ'] = jsonRecord[key].Type; //  flatten object
						newRecord['Nazwa'] = jsonRecord[key].Name;
					} else if (key === 'Bookings') {
						newRecord.wasUserReserved = jsonRecord.Bookings.some(
							(booking) =>
								booking.BookedSchedule.CustomerID ===
								req.user?.Customer?.CustomerID,
						);
						newRecord.isUserGoing = jsonRecord.Bookings.some((booking) => {
							const isBooked = booking.BookedSchedule;
							const customerID = booking.BookedSchedule.CustomerID;
							const loggedInID = req.user?.Customer?.CustomerID;
							const isGoing =
								booking.BookedSchedule.Attendance === 1 ||
								booking.BookedSchedule.Attendance === true;

							return isBooked && customerID == loggedInID && isGoing;
						});
					} else {
						newRecord[newKey] = jsonRecord[key]; // Assignment
					}
				}
				// console.log(jsonRecord);
				const activeBookings = jsonRecord.Bookings.filter(
					(booking) =>
						booking.BookedSchedule &&
						(booking.BookedSchedule.Attendance === 1 ||
							booking.BookedSchedule.Attendance === true),
				);
				newRecord['Dzień'] = getWeekDay(jsonRecord['Date']);
				newRecord['Zadatek'] = jsonRecord.Product.Price;
				newRecord['Miejsca'] = `${activeBookings.length}/${jsonRecord.Capacity}`;
				newRecord.full = activeBookings.length >= jsonRecord.Capacity;
				return newRecord; // Return new record object
			});

			// New headers (keys from columnMap)
			const totalHeaders = [
				'',
				'Miejsca',
				'Data',
				'Dzień',
				'Godzina',
				'Typ',
				'Nazwa',
				'Lokalizacja',
			];

			// ✅ Return response to frontend
			console.log('\n✅✅✅ user getAllSchedules schedules fetched');
			res.json({
				confirmation: 1,
				message: 'Terminy pobrane pomyślnie.',
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const getScheduleByID = (req, res, next) => {
	const controllerName = 'getScheduleByID';
	log(controllerName);

	const isUser = !!req.user;
	const isCustomer = !!req.user?.Customer;

	const PK = req.params.id;
	models.ScheduleRecord.findByPk(PK, {
		include: [
			{
				model: models.Product,
				required: true,
			},
			{
				model: models.BookedSchedule,
				required: false,
			},
		],
	})
		.then((scheduleData) => {
			if (!scheduleData) {
				errCode = 404;
				throw new Error('Nie znaleziono rezerwacji.');
			}

			// Convert to JSON
			const schedule = scheduleData.toJSON();
			let isUserGoing = false;

			// We substitute bookings content for security
			if (schedule.BookedSchedules && schedule.BookedSchedules?.length > 0) {
				let wasUserReserved;
				const beingAttendedSchedules = schedule.BookedSchedules.filter(
					(schedule) => schedule.Attendance == 1 || schedule.Attendance == true,
				);
				if (isUser && isCustomer) {
					wasUserReserved = schedule.BookedSchedules.some(
						(bookedSchedule) =>
							bookedSchedule.CustomerID === req.user?.Customer.CustomerID,
					);
					isUserGoing = beingAttendedSchedules.some(
						(bookedSchedule) =>
							bookedSchedule.CustomerID === req.user.Customer.CustomerID,
					);
					schedule.BookedSchedules = beingAttendedSchedules.length;
				}
				schedule.Attendance = beingAttendedSchedules.length;
				schedule.isUserGoing = isUserGoing;
				schedule.wasUserReserved = wasUserReserved;
				schedule.full = beingAttendedSchedules.length >= schedule.Capacity;
			}

			console.log('\n✅✅✅ getScheduleByID schedule fetched');
			return res.status(200).json({schedule, user: req.user});
			// return res.status(200).json({schedule});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
