import db from '../utils/db.js';
import * as models from '../models/_index.js';
import columnMaps from '../utils/columnsMapping.js';
import {formatIsoDateTime, getWeekDay} from '../utils/formatDateTime.js';

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

			return res.status(200).json({user});
		})
		.catch((err) => console.log(err));
};
export const showAllSchedules = (req, res, next) => {
	const model = models.ScheduleRecord;
	const isUser = !!req.user;
	const isCustomer = !!req.user?.Customer;

	// We create dynamic joint columns based on the map
	const columnMap = columnMaps[model.name] || {};

	// If logged In and is Customer - we want to check his booked schedules to flag them later

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

					// where: isUser && isCustomer ? {CustomerID: req.user.Customer.CustomerID} : undefined, // Filter
				},
			],
			attributes: {
				exclude: ['ProductID'], // Deleting substituted ones
			},
		})
		.then((records) => {
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
						newRecord[newKey] = formatIsoDateTime(jsonRecord[key]);
					} else if (key === 'Product' && jsonRecord[key]) {
						newRecord['Typ'] = jsonRecord[key].Type; //  flatten object
						newRecord['Nazwa'] = jsonRecord[key].Name;
					} else if (key === 'Bookings') {
						newRecord.bookedByUser = jsonRecord.Bookings.some(
							(booking) =>
								booking.BookedSchedule.CustomerID == req.user?.Customer.CustomerID,
						);
					} else {
						newRecord[newKey] = jsonRecord[key]; // Assignment
					}
				}
				newRecord['Dzień'] = getWeekDay(jsonRecord['Date']);
				newRecord['Zadatek'] = jsonRecord.Product.Price;
				newRecord['Miejsca'] = `${jsonRecord.Bookings.length}/${jsonRecord.Capacity}`;
				newRecord.full = jsonRecord.Bookings.length >= jsonRecord.Capacity;
				return newRecord; // Return new record object
			});

			// New headers (keys from columnMap)
			const totalHeaders = [
				'',
				'Miejsca',
				'Data',
				'Dzień',
				'Godzina rozpoczęcia',
				'Typ',
				'Nazwa',
				'Lokalizacja',
			];
			// ✅ Return response to frontend
			res.json({
				records: records,
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
		})
		.catch((err) => console.log(err));
};
export const showScheduleByID = (req, res, next) => {
	console.log(`➡️ called user showScheduleByID`);

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
			{
				model: models.Booking, // Booking which has relation through BookedSchedule
				through: {}, // attributes: [] omit data from mid table
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
			if (schedule.BookedSchedules && schedule.BookedSchedules?.length > 0) {
				if (isUser && isCustomer) {
					bookedByUser = schedule.BookedSchedules.some(
						(bookedSchedule) =>
							bookedSchedule.CustomerID === req.user.Customer.CustomerID,
					);
				}
				schedule.Bookings = schedule.BookedSchedules.length;
				schedule.bookedByUser = bookedByUser;
				schedule.full = schedule.BookedSchedules.length >= schedule.Capacity;
			}
			schedule.BookedSchedules = schedule.BookedSchedules.length;
			return res.status(200).json({schedule, user: req.user});
			// return res.status(200).json({schedule});
		})
		.catch((err) => console.log(err));
};

export const showAccount = (req, res, next) => {
	console.log(`➡️➡️➡️ called showAccount`, new Date().toISOString());
	// return res.status(401).json({});

	// @ Fetching USER
	// check if there is logged in User
	if (!req.user) {
		return res.status(401).json({error: 'Użytkownik nie jest zalogowany'});
	}

	// if only user
	if (!req.user.Customer) {
		const user = req.user;
		console.log('✅✅✅ user fetched');
		return res.status(200).json({user});
	} else {
		let PK = req.user.Customer.CustomerID;
		console.log('✅✅✅ customer fetched');
		models.Customer.findByPk(PK, {
			include: [
				{
					model: models.CustomerPhones, // Customer phone numbers
					required: false,
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
			],
			attributes: {
				exclude: ['UserID'], // deleting
			},
		})
			.then((customer) => {
				if (!customer) {
					return res.redirect('/');
				}
				console.log('✅✅✅ showAccount customer fetched');
				return res.status(200).json({customer});
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
// export const getEditCustomer = (req, res, next) => {
// 	console.log(`➡️➡️➡️ called getEditCustomer`);
// 	const customer = req.user.Customer;
// 	// console.log(customer);
// 	return res.status(200).json({customer});
// };

export const postEditSettings = (req, res, next) => {
	console.log(`➡️➡️➡️ called postEditSettings`);
	const userID = req.user.UserID;
	const handedness = !!req.body.handedness || false;
	const font = req.body.font || 14;
	const notifications = !!req.body.notifications || false;
	const animation = !!req.body.animation || false;
	const theme = !!req.body.theme || false;

	// if preferences don't exist - create new ones:
	models.UserPrefSettings.findOrCreate({
		where: {UserID: userID},
		defaults: {
			UserID: userID,
			Handedness: handedness,
			FontSize: font,
			Notifications: notifications,
			Animation: animation,
			Theme: theme,
		},
	})
		.then(([preferences, created]) => {
			if (!created) {
				// They exist so just update
				preferences.Handedness = handedness;
				preferences.FontSize = font;
				preferences.Notifications = notifications;
				preferences.Animation = animation;
				preferences.Theme = theme;
				return preferences.save();
			}
			return preferences;
		})
		.then((result) => {
			console.log('✅✅✅ Preferences Updated or Created');
			return res.status(200).json({result});
		})
		.catch((err) => console.log(err));
};
