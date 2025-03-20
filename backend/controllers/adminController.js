import * as models from '../models/_index.js';
import {Sequelize, Op, fn, col} from 'sequelize';
import {addDays, addMonths, addYears, format} from 'date-fns';
import db from '../utils/db.js';
import {simpleListAllToTable, listAllToTable} from '../utils/listAllToTable.js';
import columnMaps from '../utils/columnsMapping.js';
import {formatIsoDateTime, getWeekDay} from '../utils/formatDateTime.js';
import {errorCode, log, catchErr} from './_controllers.js';
let errCode = errorCode;

//@ USERS
export const showAllUsers = (req, res, next) => {
	const controllerName = 'showAllUsers';
	log(controllerName);

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
		.then((records) => {
			if (!records) {
				errCode = 404;
				throw new Error('Nie znaleziono użytkowników.');
			}
			// fetching map for User table or empty object
			const columnMap = columnMaps[model.name] || {};
			const keysForHeaders = Object.values(columnMap);
			// Convert for records for different names
			const formattedRecords = records.map((record) => {
				const newRecord = {}; // Container for formatted data
				const attributes = model.getAttributes();

				// 🔄 Iterate after each column in user record
				for (const key in record.toJSON()) {
					const newKey = columnMap[key] || key; // New or original name if not specified
					const attributeType = attributes[key]?.type.constructor.key?.toUpperCase();
					if (
						attributeType === 'DATE' ||
						attributeType === 'DATEONLY' ||
						attributeType === 'DATETIME'
					) {
						newRecord[newKey] = formatIsoDateTime(record[key]);
					} else if (key == 'UserPrefSetting') {
						if (record[key]) {
							newRecord[newKey] = `Tak (ID: ${record[key]['UserPrefID']})`;
						} else newRecord[newKey] = 'Nie';
					} else if (key == 'LastLoginDate' || key == 'RegistrationDate') {
						newRecord[newKey] = record[key];
					} else {
						newRecord[newKey] = record[key]; // Assignment
					}
				}

				return newRecord; // Return new record object
			});

			// New headers (keys from columnMap)
			const totalHeaders = keysForHeaders;

			// ✅ Return response to frontend
			console.log('\n✅✅✅ showAllUsers fetched');
			res.json({
				confirmation: 1,
				message: 'Konta pobrane pomyślnie.',
				isLoggedIn: req.session.isLoggedIn,
				totalHeaders, // To render
				content: formattedRecords.sort((a, b) => a.Email.localeCompare(b.Email)), // With new names
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const showUserByID = (req, res, next) => {
	const controllerName = 'showUserByID';
	log(controllerName);

	const PK = req.params.id || req.user.UserID;
	models.User.findByPk(PK, {
		include: [
			{
				model: models.Customer, // Add Customer
				required: false, // May not exist
			},
			{
				model: models.UserPrefSettings, // User settings if exist
				required: false,
			},
		],
	})
		.then((user) => {
			if (!user) {
				errCode = 404;
				throw new Error('Nie znaleziono użytkownika.');
			}

			console.log('\n✅✅✅ showUserByID user fetched');
			return res
				.status(200)
				.json({confirmation: 1, isLoggedIn: req.session.isLoggedIn, user});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const postCreateUser = (req, res, next) => {
	const controllerName = 'postCreateUser';
	log(controllerName);
	const {email, password, confirmedPassword, date} = req.body;

	models.User.findOne({where: {email}})
		.then((user) => {
			if (user) {
				errCode = 409;
				throw new Error('Konto już istnieje.');
			}

			// it returns the promise
			return bcrypt
				.hash(password, 12)
				.then((passwordHashed) => {
					return models.User.create({
						RegistrationDate: date,
						PasswordHash: passwordHashed,
						LastLoginDate: date,
						Email: email,
						Role: 'user',
						ProfilePictureSrcSetJSON: null,
					});
				})
				.then((newUser) => {
					console.log('\n✅✅✅ postCreateUser User created.');
					return res.status(200).json({
						type: 'signup',
						code: 200,
						confirmation: 1,
						message: 'Konto utworzone pomyślnie',
					});
				});
		})

		.catch((err) => catchErr(res, errCode, err, controllerName, {type: 'signup', code: 409}));
};
export const postDeleteUser = (req, res, next) => {
	const controllerName = 'postDeleteUser';
	log(controllerName);

	const id = req.params.id;
	models.User.destroy({
		where: {
			UserID: id,
		},
	})
		.then((deletedCount) => {
			if (!deletedCount) {
				errCode = 404;
				throw new Error('Nie usunięto użytkownika.');
			}
			console.log('\n✅✅✅ admin postDeleteUser deleted the user');
			return res.status(200).json({confirmation: 1, message: 'Konto usunięte pomyślnie.'});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const getEditSettings = (req, res, next) => {
	const controllerName = 'getEditSettings';
	log(controllerName);

	models.UserPrefSettings.findByPk(req.params.id)
		.then((preferences) => {
			if (!preferences) {
				errCode = 404;
				throw new Error('Nie pobrano ustawień.');
			}
			console.log('\n✅✅✅ admin getEditSettings fetched');
			return res.status(200).json({confirmation: 1, preferences});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};

export const postEditSettings = (req, res, next) => {
	const controllerName = 'postEditSettings';
	log(controllerName);

	const userID = req.params.id;
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
					console.log('\n❓❓❓ postEditSettings Admin Preferences no change');
					return {confirmation: 0, message: 'Brak zmian.'};
				} else {
					// Update
					preferences.Handedness = !!handedness;
					preferences.FontSize = parseInt(font);
					preferences.Notifications = !!notifications;
					preferences.Animation = !!animation;
					preferences.Theme = !!theme;

					return preferences.save().then(() => {
						console.log('\n✅✅✅ postEditSettings Admin Preferences Updated');
						return {confirmation: 1, message: 'Ustawienia zostały zaktualizowane.'};
					});
				}
			} else {
				// New preferences created
				console.log('\n✅✅✅ postEditSettings Admin Preferences Created');
				return {confirmation: 1, message: 'Ustawienia zostały utworzone'};
			}
		})
		.then((result) => {
			console.log('\n✅✅✅ Admin Preferences Result sent back');
			return res.status(200).json({
				confirmation: result.confirmation,
				message: result.message,
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};

//@ CUSTOMERS
export const showAllCustomers = (req, res, next) => {
	const controllerName = 'showAllCustomers';
	log(controllerName);
	const model = models.Customer;

	// We create dynamic joint columns based on the map
	const columnMap = columnMaps[model.name] || {};
	const keysForHeaders = Object.values(columnMap);
	const includeAttributes = [
		//  FirstName + LastName => Name
		[Sequelize.literal("CONCAT(CustomerID, '-', UserID)"), 'ID klienta-użytkownika'],
		[Sequelize.literal("CONCAT(FirstName, ' ', LastName)"), 'Imię Nazwisko'],
	];

	model
		.findAll({
			attributes: {
				include: includeAttributes, // Adding joint columns
				exclude: ['UserID'], // Deleting substituted ones
			},
		})
		.then((records) => {
			if (!records) {
				errCode = 404;
				throw new Error('Nie znaleziono użytkowników.');
			}
			// Convert for records for different names
			const formattedRecords = records.map((record) => {
				const newRecord = {}; // Container for formatted data

				const jsonRecord = record.toJSON();

				// 🔄 Iterate after each column in user record
				for (const key in jsonRecord) {
					const newKey = columnMap[key] || key; // New or original name if not specified
					newRecord[newKey] = jsonRecord[key]; // Assignment
				}

				return newRecord; // Return new record object
			});

			// New headers (keys from columnMap)
			const totalHeaders = keysForHeaders;
			// ✅ Return response to frontend
			console.log('\n✅✅✅ showAllCustomers customers fetched');
			res.json({
				confirmation: 1,
				isLoggedIn: req.session.isLoggedIn,
				totalHeaders, // To render
				content: formattedRecords.sort((a, b) => a.LastName.localeCompare(b.LastName)), // With new names
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const showCustomerByID = (req, res, next) => {
	console.log(`\n➡️ admin called showCustomerByID`, new Date().toISOString());
	// console.log(req.user);
	const PK = req.params.id;
	models.Customer.findByPk(PK, {
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
				throw new Error('Nie znaleziono profilu uczestnika.');
			}
			console.log('\n✅✅✅ showCustomerByID customer fetched');
			return res
				.status(200)
				.json({confirmation: 1, isLoggedIn: req.session.isLoggedIn, customer});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const postCreateCustomer = (req, res, next) => {
	const controllerName = 'postCreateCustomer';
	log(controllerName);
	const {userID, customerType, firstName, lastName, DoB, phone, cMethod, loyalty, notes} =
		req.body;
	let customerPromise;
	models.Customer.findOne({where: {UserID: userID}})
		.then((customer) => {
			if (customer) {
				errCode = 409;
				throw new Error('Profil uczestnika już istnieje.');
			}
			return (customerPromise = models.Customer.create({
				CustomerType: customerType || 'Indywidualny',
				UserID: userID,
				FirstName: firstName,
				LastName: lastName,
				DoB: DoB,
				Phone: phone,
				PreferredContactMethod: cMethod || '=',
				ReferralSource: 'Admin insert',
				Loyalty: loyalty || 5,
				Notes: notes,
			}).then((newCustomer) => {
				return models.User.update({Role: 'customer'}, {where: {UserID: userID}}).then(
					() => newCustomer,
				);
			}));
		})
		.then((newCustomer) => {
			console.log('\n✅✅✅ postCreateCustomer customer created.');
			return res.status(200).json({
				code: 200,
				confirmation: 1,
				message: 'Zarejestrowano pomyślnie.',
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName, {code: 409}));
};
export const postDeleteCustomer = (req, res, next) => {
	const controllerName = 'postDeleteCustomer';
	log(controllerName);

	const id = req.params.id;
	models.Customer.destroy({
		where: {
			CustomerID: id,
		},
	})
		.then((deletedCount) => {
			if (!deletedCount) {
				errCode = 404;
				throw new Error('Nie usunięto profilu uczestnika.');
			}
			console.log('\n✅✅✅ admin postDeleteUser deleted the customer');
			return res.status(200).json({confirmation: 1, message: 'Profil usunięty pomyślnie.'});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const getEditCustomer = (req, res, next) => {
	const controllerName = 'getEditCustomer';
	log(controllerName);

	models.Customer.findByPk(req.params.id)
		.then((customer) => {
			if (!customer) {
				errCode = 404;
				throw new Error('Nie znaleziono danych uczestnika.');
			}
			console.log('\n✅✅✅ Fetched admin getEditCustomer customer');
			return res
				.status(200)
				.json({confirmation: 1, customer, message: 'Dane uczestnika pobrane pomyślnie.'});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const postEditCustomer = (req, res, next) => {
	const controllerName = 'postEditCustomer';
	log(controllerName);

	const customerId = req.params.id;

	const {
		phone: newPhone,
		cMethod: newContactMethod,
		loyalty: newLoyalty,
		notes: newNotes,
	} = req.body;

	if (!newPhone || !newPhone.trim()) {
		errCode = 400;
		console.log('\n❌❌❌ Error postEditCustomer No phone');
		throw new Error('Numer telefonu nie może być pusty.');
	}

	models.Customer.findByPk(customerId)
		.then((customer) => {
			errCode = 404;
			if (!customer) throw new Error('Nie znaleziono danych uczestnika.');

			console.log('\n✅✅✅ Fetched admin postEditCustomer customer');
			return customer;
		})
		.then((foundCustomer) => {
			const {Phone, PreferredContactMethod, Loyalty, Notes} = foundCustomer;
			if (
				Phone == newPhone &&
				PreferredContactMethod == newContactMethod &&
				Loyalty == newLoyalty &&
				Notes == newNotes
			) {
				// Nothing changed
				console.log('\n❓❓❓ Admin Customer no change');
				return {confirmation: 0, message: 'Brak zmian'};
			}
			return foundCustomer;
		})
		.then((fetchedCustomer) => {
			models.Customer.update(
				{
					Phone: newPhone,
					PreferredContactMethod: newContactMethod,
					Loyalty: newLoyalty,
					Notes: newNotes,
				},
				{where: {CustomerID: customerId}},
			)
				.then((customerResult) => {
					return {customerResult};
				})
				.then((results) => {
					console.log('\n✅✅✅ admin postEditCustomer UPDATE successful');
					const affectedCustomerRows = results.customerResult[0];
					const status = affectedCustomerRows >= 1;
					return res.status(200).json({
						message: 'Profil zaktualizowany pomyślnie.',
						confirmation: status,
						affectedCustomerRows,
					});
				})
				.catch((err) => catchErr(res, errCode, err, controllerName));
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};

//@ SCHEDULES
export const showAllSchedules = (req, res, next) => {
	const controllerName = 'showAllSchedules';
	log(controllerName);
	const model = models.ScheduleRecord;

	// We create dynamic joint columns based on the map
	const columnMap = columnMaps[model.name] || {};
	const keysForHeaders = Object.values(columnMap);

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
		})
		.then((records) => {
			if (!records) {
				errCode = 404;
				throw new Error('Nie znaleziono terminów.');
			}
			// Convert for records for different names
			const formattedRecords = records.map((record) => {
				const newRecord = {}; // Container for formatted data

				// const attributes = model.getAttributes();
				const jsonRecord = record.toJSON();
				// console.log('jsonRecord', jsonRecord);

				// 🔄 Iterate after each column in user record
				for (const key in jsonRecord) {
					const newKey = columnMap[key] || key; // New or original name if not specified
					// const attributeType = attributes[key]?.type.constructor.key?.toUpperCase();
					// if (
					// 	attributeType === 'DATE' ||
					// 	attributeType === 'DATEONLY' ||
					// 	attributeType === 'DATETIME'
					// ) {
					// 	newRecord[newKey] = jsonRecord[key];
					// } else
					if (key === 'Product' && jsonRecord[key]) {
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
			const totalHeaders = keysForHeaders;
			// ✅ Return response to frontend
			console.log('✅✅✅ admin getShowAllSchedules schedules fetched');
			res.json({
				confirmation: 1,
				message: 'Terminy pobrane pomyślnie.',
				totalHeaders, // To render
				content: formattedRecords.sort((a, b) => new Date(b.Data) - new Date(a.Data)), // With new names
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const showScheduleByID = (req, res, next) => {
	const controllerName = 'showScheduleByID';
	console.log(`\n➡️➡️➡️ admin called`, controllerName);

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
				include: [
					{
						model: models.Customer,
						attributes: {exclude: ['UserID']},
					},
					{
						model: models.Booking,
						// attributes: {exclude: ['UserID']},
					},
				],
			},
			{
				model: models.Feedback,
				required: false,
				include: [
					{
						model: models.Customer,
						attributes: {exclude: ['UserID']},
					},
				],
				attributes: {exclude: ['CustomerID']},
			},
		],
	})
		.then((scheduleData) => {
			if (!scheduleData) {
				errCode = 404;
				throw new Error('Nie znaleziono terminu.');
			}
			// Konwersja rekordu na zwykły obiekt
			let schedule = scheduleData.toJSON();

			// [Zmienione] Dodano logikę przetwarzania rezerwacji podobną do działającego kodu:
			let isUserGoing = false;
			schedule.Attendance = 0;

			if (schedule.BookedSchedules && schedule.BookedSchedules.length > 0) {
				let wasUserReserved;
				const beingAttendedSchedules = schedule.BookedSchedules.filter(
					(bs) => bs.Attendance == 1 || bs.Attendance == true,
				);
				if (req.user && req.user.Customer) {
					wasUserReserved = schedule.BookedSchedules.some(
						(bs) => bs.CustomerID === req.user?.Customer.CustomerID,
					);
					isUserGoing = beingAttendedSchedules.some(
						(bs) => bs.CustomerID === req.user.Customer.CustomerID,
					);
					schedule.attendanceCount = beingAttendedSchedules.length; // [Zmienione] – nowa właściwość
				}
				schedule.Attendance = beingAttendedSchedules.length;
				schedule.isUserGoing = isUserGoing;
				schedule.wasUserReserved = wasUserReserved;
				schedule.full = beingAttendedSchedules.length >= schedule.Capacity;
			}
			// [Zmienione] Ustalanie statusu terminu (jak w działającym kodzie)
			const scheduleDateTime = new Date(`${schedule.Date}T${schedule.StartTime}:00`);
			const now = new Date();
			schedule.isCompleted = scheduleDateTime <= now;

			// Zwracamy pełen obiekt użytkownika (zgodnie z działającym kodem)
			console.log('✅✅✅ admin showScheduleByID schedule fetched');
			return res.status(200).json({
				confirmation: 1,
				message: 'Termin pobrany pomyślnie',
				schedule,
				user: req.user,
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const showProductSchedules = (req, res, next) => {
	const controllerName = 'showProductSchedulesByID';
	console.log(`\n➡️➡️➡️ admin called`, controllerName);

	const productID = req.params.pId;
	const customerID = req.params.cId;

	// find all schedule for chosen Product
	models.ScheduleRecord.findAll({where: {ProductID: productID}})
		.then((foundSchedules) => {
			//find all bookings for given customer
			return models.BookedSchedule.findAll({where: {CustomerID: customerID}}).then(
				(bookedByCustomerSchedules) => {
					// filter bookings which have not been booked yet by him
					const filteredSchedules = foundSchedules.filter((foundSchedule) => {
						return !bookedByCustomerSchedules.some(
							(bs) => bs.ScheduleID == foundSchedule.ScheduleID,
						);
					});
					return filteredSchedules;
				},
			);
		})
		.then((filteredFoundSchedules) => {
			console.log(`✅✅✅ admin ${controllerName} schedule fetched`);
			res.status(200).json({
				confirmation: 1,
				message: 'Terminy pobrane pomyślnie.',
				content: filteredFoundSchedules,
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const showBookedSchedules = (req, res, next) => {};
export const postCreateScheduleRecord = (req, res, next) => {
	const controllerName = 'postCreateScheduleRecord';
	log(controllerName);
	const {productID, date, capacity, location, startTime, repeatCount, shouldRepeat} = req.body;
	const inputsContent = [date, capacity, location, startTime, repeatCount || 1, shouldRepeat];

	let currentDate = new Date(`${date}T${startTime}`);

	inputsContent.forEach((inputValue) => {
		if (!inputValue || !inputValue.toString().trim()) {
			errCode = 400;
			console.log('\n❌❌❌ Error postCreateScheduleRecord:', 'No enough data');
			throw new Error('Nie podano wszystkich danych.');
		}
	});

	// chose amount of iterations
	const iterations = shouldRepeat == 1 ? 1 : repeatCount;
	// Recursive function to let each call finish and update the date in between
	function createRecord(i, currentDate, records = [], transaction) {
		// base condition to stop and resolve the promise
		if (i >= iterations) {
			return Promise.resolve(records);
		}
		// create schedule within passed transaction
		return models.ScheduleRecord.create(
			{
				ProductID: productID,
				Date: currentDate,
				StartTime: startTime,
				Location: location,
				Capacity: capacity,
			},
			{transaction},
		).then((record) => {
			console.log('\n✅✅✅ postCreateScheduleRecord created for:', currentDate);
			// Update the date based on shouldRepeat:
			if (shouldRepeat == 7) {
				currentDate = addDays(currentDate, 7);
			} else if (shouldRepeat == 30) {
				currentDate = addMonths(currentDate, 1);
			} else if (shouldRepeat == 365) {
				currentDate = addYears(currentDate, 1);
			}
			records.push(record);
			return createRecord(i + 1, currentDate, records, transaction);
		});
	}

	// # Transaction start to eventually rollback all the changes if anything wrong

	db.transaction((t) => {
		return createRecord(0, currentDate, [], t);
	})
		.then((createdRecords) => {
			console.log('\n✅✅✅ postCreateScheduleRecord created all records successfully.');
			res.status(201).json({
				confirmation: 1,
				message: 'Terminy utworzone pomyślnie.',
				records: createdRecords,
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const postDeleteSchedule = (req, res, next) => {
	const controllerName = 'postDeleteSchedule';
	log(controllerName);
	const id = req.params.id;

	models.ScheduleRecord.findOne({
		where: {
			ScheduleID: id,
		},
	})
		.then((foundSchedule) => {
			if (!foundSchedule) {
				errCode = 404;
				throw new Error('Nie znaleziono terminu do usunięcia.');
			} else if (
				new Date(`${foundSchedule.Date}T${foundSchedule.StartTime}:00`) < new Date()
			) {
				errCode = 400;
				throw new Error(
					'Nie można usunąć terminu który już minął. Posiada też wartość historyczną dla statystyk.',
				);
			}

			return models.BookedSchedule.findOne({
				where: {ScheduleID: id},
			}).then((foundRecord) => {
				if (foundRecord) {
					errCode = 409;
					throw new Error(
						'Nie można usunąć terminu, który posiada rekordy obecności (obecny/anulowany). Najpierw USUŃ rekordy obecności w konkretnym terminie.',
					);
				}
				return foundSchedule.destroy();
			});
		})
		.then((deletedCount) => {
			if (!deletedCount) {
				errCode = 404;
				throw new Error('Nie usunięto terminu.');
			}
			console.log('\n✅✅✅ admin postDeleteSchedule deleted the schedule record');
			return res.status(200).json({confirmation: 1, message: 'Termin usunięty pomyślnie.'});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const postEditSchedule = async (req, res, next) => {
	const controllerName = 'postEditSchedule';
	log(controllerName);

	const scheduleId = req.params.id;

	const {newCapacity, newStartDate, newStartTime, newLocation} = req.body;

	if (
		!newCapacity ||
		!newStartDate ||
		!newStartDate.trim() ||
		!newLocation ||
		!newLocation.trim() ||
		!newStartTime ||
		!newStartTime.trim()
	) {
		errCode = 400;
		console.log('\n❌❌❌ Error postEditSchedule:', 'No enough data');
		throw new Error('Nie podano wszystkich danych.');
	}

	models.ScheduleRecord.findByPk(scheduleId)
		.then((schedule) => {
			if (!schedule) {
				errCode = 404;
				throw new Error('Nie znaleziono danych terminu.');
			}
			console.log('\n✅✅✅ Fetched admin postEditSchedule schedule');
			return schedule;
		})
		.then((foundSchedule) => {
			const {Capacity, Date, Location, StartTime} = foundSchedule;
			if (new Date(`${foundSchedule.Date}T${foundSchedule.StartTime}:00`) < new Date()) {
				errCode = 400;
				console.log('\n❓❓❓ Admin schedule is past - not to edit');
				throw new Error('Nie można edytować minionego terminu.');
			} else if (
				Capacity == newCapacity &&
				Date === newStartDate &&
				Location === newLocation &&
				StartTime === newStartTime
			) {
				// Nothing changed
				console.log('\n❓❓❓ Admin schedule no change');
				return {confirmation: 0, message: 'Brak zmian'};
			}
			return foundSchedule;
		})
		.then((fetchedSchedule) => {
			models.ScheduleRecord.update(
				{
					Capacity: newCapacity,
					StartDate: newStartDate,
					StartTime: newStartTime,
					Location: newLocation,
				},
				{where: {ScheduleID: scheduleId}},
			)
				.then((scheduleResult) => {
					return {scheduleResult};
				})
				.then((results) => {
					console.log('\n✅✅✅ admin postEditSchedule UPDATE successful');
					const affectedScheduleRows = results.scheduleResult[0];
					const status = affectedScheduleRows >= 1;
					return res.status(200).json({
						message: 'Termin zaktualizowany pomyślnie.',
						confirmation: status,
						affectedScheduleRows,
					});
				})
				.catch((err) => catchErr(res, errCode, err, controllerName));
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
//@ ATTENDANCE
export const postDeleteAttendanceRecord = (req, res, next) => {
	const controllerName = 'postDeleteAttendanceRecord';
	log(controllerName);
	console.log(req.body);

	const {attendanceCustomerID, attendanceBookingID} = req.body;

	models.BookedSchedule.findOne({
		where: {CustomerID: attendanceCustomerID, BookingID: attendanceBookingID},
	})
		.then((foundRecord) => {
			if (!foundRecord) {
				errCode = 404;
				throw new Error('Nie znaleziono rekordu obecności w dzienniku.');
			}
			return foundRecord.destroy();
		})
		.then((deletedCount) => {
			if (!deletedCount) {
				errCode = 404;
				throw new Error('Nie usunięto rekordu.');
			}

			console.log('\n✅✅✅ admin postDeleteAttendanceRecord UPDATE successful');
			return res.status(200).json({
				confirmation: 1,
				message: 'Rekord obecności usunięty.',
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const postMarkAbsent = (req, res, next) => {
	const controllerName = 'postMarkAbsent';
	log(controllerName);

	const {attendanceCustomerID, attendanceBookingID} = req.body;

	models.BookedSchedule.findOne({
		where: {CustomerID: attendanceCustomerID, BookingID: attendanceBookingID},
	})
		.then((foundRecord) => {
			if (!foundRecord) {
				errCode = 404;
				throw new Error('Nie znaleziono rekordu obecności w dzienniku.');
			}
			return foundRecord.update({
				Attendance: 0,
				DidAction: 'Admin',
			});
		})
		.then((updatedRecord) => {
			console.log('\n✅✅✅ admin postMarkAbsent UPDATE successful');
			const status = updatedRecord ? true : false;
			return res.status(200).json({
				confirmation: status,
				message: 'Uczestnik oznaczony jako nieobecny.',
				affectedRows: status ? 1 : 0,
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const postMarkPresent = (req, res, next) => {
	const controllerName = 'postMarkPresent';
	log(controllerName);
	console.log(req.body);
	const {cancelledAttendanceCustomerID, cancelledAttendanceBookingID} = req.body;

	models.BookedSchedule.findOne({
		where: {CustomerID: cancelledAttendanceCustomerID, BookingID: cancelledAttendanceBookingID},
	})
		.then((foundRecord) => {
			if (!foundRecord) {
				errCode = 404;
				throw new Error('Nie znaleziono rekordu obecności w dzienniku.');
			}
			return foundRecord.update({
				Attendance: 1,
				DidAction: 'Admin',
			});
		})
		.then((updatedRecord) => {
			console.log('\n✅✅✅ admin postMarkPresent UPDATE successful');
			const status = updatedRecord ? true : false;
			return res.status(200).json({
				confirmation: status,
				message: 'Uczestnik oznaczony jako obecny.',
				affectedRows: status ? 1 : 0,
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
//@ FEEDBACK
export const showAllParticipantsFeedback = (req, res, next) => {
	const controllerName = 'showAllParticipantsFeedback';
	log(controllerName);

	const model = models.Feedback;

	// We create dynamic joint columns based on the map
	const columnMap = columnMaps[model.name] || {};

	const includeAttributes = [];

	model
		.findAll({
			include: [
				{
					model: models.Customer,
					attributes: [
						[Sequelize.literal("CONCAT(FirstName, ' ', LastName)"), 'Imię Nazwisko'],
					],
				},
				{
					model: models.ScheduleRecord, //  ScheduleRecord
					include: [
						{
							model: models.Product, // Product through ScheduleRecord
							attributes: ['Name'],
						},
					],
					attributes: ['ScheduleID', 'Date', 'StartTime'],
				},
			],
			attributes: {
				include: includeAttributes, // Adding joint columns
				exclude: ['Product'], // Deleting substituted ones
			},
		})
		.then((records) => {
			if (!records) {
				errCode = 404;
				throw new Error('Nie znaleziono opinii.');
			}
			// Convert for records for different names
			const formattedRecords = records.map((record) => {
				const newRecord = {}; // Container for formatted data
				const attributes = model.getAttributes();
				const jsonRecord = record.toJSON();
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
					} else if (key == 'Customer') {
						const customer = jsonRecord[key]['Imię Nazwisko'];
						const customerID = jsonRecord.CustomerID;
						newRecord[newKey] = `${customer} (${customerID})`;
					} else if (key == 'ScheduleRecord') {
						const dataKey = columnMap['Data'] || 'Data';
						const startTimeKey = columnMap['Godzina'] || 'Godzina';
						const nameKey = columnMap['Nazwa'] || 'Nazwa';

						newRecord[dataKey] = formatIsoDateTime(jsonRecord[key]['Date']);
						newRecord[startTimeKey] = jsonRecord[key]['StartTime'];
						newRecord[
							nameKey
						] = `${jsonRecord[key].Product?.Name} (${jsonRecord[key].ScheduleID})`;
					} else {
						newRecord[newKey] = jsonRecord[key]; // Assignment
					}
				}
				return newRecord; // Return new record object
			});

			const keysForHeaders = Object.values(columnMap);
			// New headers (keys from columnMap)
			const totalHeaders = keysForHeaders;

			// ✅ Return response to frontend
			console.log('\n✅✅✅ showAllParticipantsFeedback reviews fetched');
			res.json({
				confirmation: 1,
				message: 'Opinie pobrane pomyślnie',
				isLoggedIn: req.session.isLoggedIn,
				records: records,
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const showAllParticipantsFeedbackByID = (req, res, next) => {
	console.log(`\n➡️ admin called showAllParticipantsFeedbackByID`);

	const PK = req.params.id;
	models.Feedback.findByPk(PK, {
		include: [
			{
				model: models.Customer,
				attributes: {exclude: []},
			},
			{
				model: models.ScheduleRecord,
				attributes: {exclude: ['ProductID']},
				include: [
					{
						model: models.Product,
						attributes: {exclude: []},
					},
				],
			},
		],
		attributes: {exclude: ['CustomerID', 'ScheduleID']},
	})
		.then((review) => {
			if (!review) {
				errCode = 404;
				throw new Error('Nie znaleziono opinii.');
			}
			const customerId = review.Customer.CustomerID;

			return models.Feedback.findAll({
				where: {
					CustomerID: customerId,
					// op from sequelize means not equal
					FeedbackID: {[Op.ne]: PK},
				},
				include: [
					{
						model: models.ScheduleRecord,
						attributes: {exclude: ['ProductID']},
						include: [
							{
								model: models.Product,
								attributes: {exclude: []},
							},
						],
					},
				],
				attributes: {exclude: ['CustomerID', 'ScheduleID']},
			}).then((otherReviews) => {
				console.log('\n✅✅✅ showAllParticipantsFeedbackByID Feedback fetched');
				return res.status(200).json({
					confirmation: 1,
					message: 'Opinia pobrana pomyślnie',
					isLoggedIn: req.session.isLoggedIn,
					review,
					otherReviews,
				});
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const postDeleteFeedback = (req, res, next) => {
	const controllerName = 'postDeleteFeedback';
	log(controllerName);

	const id = req.params.id;
	models.Feedback.destroy({
		where: {
			FeedbackID: id,
		},
	})
		.then((deletedCount) => {
			if (!deletedCount) {
				errCode = 404;
				throw new Error('Nie usunięto opinii.');
			}
			console.log('\n✅✅✅ admin postDeleteFeedback deleted the feedback');
			return res.status(200).json({confirmation: 1, message: 'Opinia usunięta pomyślnie.'});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
//@ NEWSLETTERS
export const showAllNewsletters = (req, res, next) => {
	const controllerName = 'showAllNewsletters';
	log(controllerName);

	simpleListAllToTable(res, models.Newsletter);
};
//# SUBS
export const showAllSubscribedNewsletters = (req, res, next) => {
	simpleListAllToTable(res, models.SubscribedNewsletter);
};
//@ PRODUCTS
export const showAllProducts = (req, res, next) => {
	const controllerName = 'showAllProducts';
	log(controllerName);
	simpleListAllToTable(res, models.Product);
};
export const showProductByID = (req, res, next) => {
	const controllerName = 'showProductByID';
	log(controllerName);

	const PK = req.params.id;
	models.Product.findByPk(PK, {
		include: [
			{
				model: models.ScheduleRecord,
				required: false,
				include: [
					{
						model: models.Booking, // Booking which has relation through BookedSchedule
						as: 'Bookings',
						through: {}, // omit data from mid table
						required: false,
						attributes: {
							exclude: ['Product'],
						},
						include: [
							{
								model: models.Customer,
								attributes: {exclude: ['UserID']},
							},
						],
					},
					{
						model: models.Feedback,
						required: false,
						include: [
							{
								model: models.Customer,
								attributes: {exclude: ['UserID']},
							},
						],
						attributes: {exclude: ['CustomerID']},
					},
				],
				attributes: {
					exclude: ['ProductID'],
				},
			},
		],
	})
		.then((product) => {
			if (!product) {
				errCode = 404;
				throw new Error('Nie znaleziono produktu.');
			}
			console.log('\n✅✅✅ showProductByID product fetched');
			return res.status(200).json({
				confirmation: 1,
				message: 'Produkt pobrany pomyślnie pomyślnie.',
				isLoggedIn: req.session.isLoggedIn,
				product,
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const postCreateProduct = async (req, res, next) => {
	const controllerName = 'postCreateProduct';
	log(controllerName);

	const {name, productType, StartDate, duration, location, price, status} = req.body;

	let productPromise;
	models.Product.findOne({where: {Name: name}})
		.then((product) => {
			if (product) {
				errCode = 409;
				throw new Error('Produkt już istnieje.');
			}
			return (productPromise = models.Product.create({
				Name: name,
				Type: productType,
				Location: location,
				Duration: duration,
				Price: price,
				StartDate: StartDate,
				Status: status || 'Aktywny',
			}));
		})
		.then((newProduct) => {
			console.log('\n✅✅✅ postCreateProduct Stworzono pomyślnie.');
			return res.status(200).json({
				code: 200,
				confirmation: 1,
				message: 'Stworzono pomyślnie.',
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName, {code: 409}));
};
export const postEditProduct = async (req, res, next) => {
	const controllerName = 'postEditProduct';
	log(controllerName);
	const productId = req.params.id;

	const {newType, newStartDate, newLocation, newDuration, newPrice, newStatus} = req.body;

	if (
		!newType ||
		!newType.trim() ||
		!newStartDate ||
		!newStartDate.trim() ||
		!newLocation ||
		!newLocation.trim() ||
		!newDuration ||
		!newPrice ||
		!newStatus ||
		!newStatus.trim()
	) {
		console.log('\n❌❌❌ Error postEditCustomer:', 'No enough data');
		errCode = 400;
		throw new Error('Nie podano wszystkich danych.');
	}

	models.Product.findByPk(productId)
		.then((product) => {
			if (!product) {
				errCode = 404;
				throw new Error('Nie znaleziono danych uczestnika.');
			}
			console.log('\n✅✅✅ Fetched admin postEditProduct product');
			return product;
		})
		.then((foundProduct) => {
			const {Type, StartDate, Location, Duration, Price, Status} = foundProduct;
			if (
				Type === newType &&
				StartDate === newStartDate &&
				Location === newLocation &&
				Duration === newDuration &&
				Price === newPrice &&
				Status === newStatus
			) {
				// Nothing changed
				console.log('\n❓❓❓ Admin Product no change');
				return {confirmation: 0, message: 'Brak zmian'};
			}
			return foundProduct;
		})
		.then((fetchedProduct) => {
			models.Product.update(
				{
					Type: newType,
					StartDate: newStartDate,
					Location: newLocation,
					Duration: newDuration,
					Price: newPrice,
					Status: newStatus,
				},
				{where: {ProductID: productId}},
			)
				.then((productResult) => {
					return {productResult};
				})
				.then((results) => {
					console.log('\n✅✅✅ admin postEditProduct UPDATE successful');
					const affectedProductRows = results.productResult[0];
					const status = affectedProductRows >= 1;
					return res.status(200).json({
						confirmation: status,
						message: 'Zmiany zaakceptowane.',
						affectedProductRows,
					});
				})
				.catch((err) => catchErr(res, errCode, err, controllerName));
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const postDeleteProduct = (req, res, next) => {
	const controllerName = 'postDeleteProduct';
	log(controllerName);

	const id = req.params.id;
	models.Product.destroy({
		where: {
			ProductID: id,
		},
	})
		.then((deletedCount) => {
			if (!deletedCount) {
				errCode = 404;
				throw new Error('Nie usunięto zajęć.');
			}
			console.log('\n✅✅✅ admin postDeleteProduct deleted the product');
			return res.status(200).json({confirmation: 1, message: 'Produkt usunięty pomyślnie.'});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
//@ BOOKINGS
export const showAllBookings = (req, res, next) => {
	const controllerName = 'showAllBookings';
	log(controllerName);
	const model = models.Booking;

	// We create dynamic joint columns based on the map
	const columnMap = columnMaps[model.name] || {};
	const keysForHeaders = Object.values(columnMap);

	model
		.findAll({
			include: [
				{
					model: models.Customer,
					attributes: [
						[Sequelize.literal("CONCAT(FirstName, ' ', LastName)"), 'Imię Nazwisko'],
					],
				},
				{
					model: models.ScheduleRecord,
					through: {model: models.BookedSchedule}, // M:N relation
					include: [
						{
							model: models.Product,
							attributes: ['Name'],
						},
					],
					attributes: ['ScheduleID'],
				},
			],
			attributes: {
				exclude: ['Product', 'ScheduleID'],
			},
		})
		.then((records) => {
			if (!records) {
				errCode = 404;
				throw new Error('Nie znaleziono rezerwacji.');
			}
			const formattedRecords = records.map((record) => {
				const attributes = model.getAttributes();
				const newRecord = {};
				const jsonRecord = record.toJSON();

				// Konwersja pól na poprawne nazwy
				for (const key in jsonRecord) {
					const attributeType = attributes[key]?.type.constructor.key?.toUpperCase();
					const newKey = columnMap[key] || key;
					if (['DATE', 'DATEONLY', 'DATETIME'].includes(attributeType)) {
						newRecord[newKey] = jsonRecord[key];
					} else if (key === 'Customer') {
						const customer = jsonRecord[key]['Imię Nazwisko'];
						const customerID = jsonRecord.CustomerID;
						newRecord[newKey] = `${customer} (${customerID})`;
					} else if (key === 'ScheduleRecords') {
						const products = jsonRecord[key]
							.map((sr) => `${sr.Product?.Name} (${sr.BookedSchedule?.ScheduleID})`)
							.filter(Boolean);
						newRecord['Terminy'] = jsonRecord[key];
						newRecord['Produkty'] =
							products.length > 0 ? products.join(', ') : 'Brak danych';
					} else {
						newRecord[newKey] = jsonRecord[key];
					}
				}

				return newRecord;
			});

			// Nagłówki
			const totalHeaders = keysForHeaders;
			req.session.isLoggedIn = true;
			// ✅ Zwrócenie odpowiedzi do frontend
			console.log('\n✅✅✅ getShowAllBookings bookings fetched');
			res.json({
				confirmation: 1,
				message: 'Rezerwacje pobrane pomyślnie.',
				isLoggedIn: req.session.isLoggedIn,
				totalHeaders,
				records: records,
				content: formattedRecords.sort(
					(a, b) => new Date(b['Data Rezerwacji']) - new Date(a['Data Rezerwacji']),
				),
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const showBookingByID = (req, res, next) => {
	const controllerName = 'showBookingByID';
	log(controllerName);

	const PK = req.params.id;
	models.Booking.findByPk(PK, {
		through: {attributes: []}, // omit data from mid table
		required: false,
		attributes: {
			exclude: ['Product', 'CustomerID'],
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
			console.log('\n✅✅✅ admin showBookingByID Schedule fetched');
			return res.status(200).json({
				confirmation: 1,
				message: 'Rezerwacja pobrana pomyślnie.',
				isLoggedIn: req.session.isLoggedIn,
				booking,
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const postCreateBooking = (req, res, next) => {
	const controllerName = 'postCreateBooking';
	log(controllerName);

	const {
		customerID,
		productID,
		productName,
		productPrice,
		scheduleID,
		amountPaid,
		paymentMethod,
	} = req.body;

	errCode = 400;
	if (!customerID) {
		console.log('\n❌❌❌ customerID empty.');
		throw new Error('Pole uczestnika nie może być puste.');
	}
	if (!productID || !productID.trim()) {
		console.log('\n❌❌❌ productID empty');
		throw new Error('Pole zajęć nie może być puste.');
	}
	if (!scheduleID || !scheduleID.trim()) {
		console.log('\n❌❌❌ scheduleID empty');
		throw new Error('Pole terminu nie może być puste.');
	}
	if (!amountPaid || !amountPaid.trim()) {
		console.log('\n❌❌❌ amountPaid empty');
		throw new Error('Pole kwoty nie może być puste.');
	}
	if (!paymentMethod || !paymentMethod.trim()) {
		console.log('\n❌❌❌ paymentMethod empty');
		throw new Error('Pole metody płatności nie może być puste.');
	}

	let isNewCustomer = false;
	db.transaction((t) => {
		// Fetch schedule and lock it for other paralele transactions
		return models.ScheduleRecord.findOne({
			where: {ScheduleID: scheduleID}, //from mutation
			transaction: t,
			lock: t.LOCK.UPDATE, //@
		})

			.then((scheduleRecord) => {
				if (!scheduleRecord) {
					errCode = 404;
					throw new Error('Nie znaleziono terminu');
				}
				// @ admin IS able to fill the past schedule but not change it:
				// const scheduleDateTime = new Date(
				// 	`${scheduleRecord.Date}T${scheduleRecord.StartTime}:00`,
				// );
				// if (scheduleDateTime < new Date()) {
				// 	errCode = 401;
				// 	throw new Error('Nie można rezerwować terminu, który już minął.');
				// }
				// Count the current amount of reservations
				return models.BookedSchedule.count({
					where: {ScheduleID: scheduleID, Attendance: 1},
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
							CustomerID: customerID,
						},
						include: [
							{
								model: models.ScheduleRecord,
								where: {ScheduleID: scheduleID},
								through: {
									attributes: [
										'Attendance',
										'CustomerID',
										'BookingID',
										'ScheduleID',
									],
									where: {CustomerID: customerID},
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
					throw new Error(
						'Uczestnik już rezerwował ten termin. Można mu ewentualnie poprawić obecność w zakładce wspomnianego terminu w "Grafik" w panelu admina.',
					);
				} else {
					// booking doesn't exist - create new one
					const amountDueCalculated = parseFloat(productPrice) - parseFloat(amountPaid);
					const statusDeduced = amountDueCalculated <= 0 ? 'w pełni' : 'Częściowo';
					const paymentMethodDeduced =
						paymentMethod == 1
							? 'Gotówka (M)'
							: paymentMethod == 2
							? 'BLIK (M)'
							: 'Przelew (M)';
					return models.Booking.create(
						{
							CustomerID: customerID,
							Date: new Date(),
							Product: productName,
							Status: statusDeduced,
							AmountPaid: amountPaid,
							AmountDue: amountDueCalculated,
							PaymentMethod: paymentMethodDeduced,
							PaymentStatus: 'Completed',
						},
						{transaction: t},
					).then((booking) => {
						// After creating the reservation, we connected addScheduleRecord which was generated by Sequelize for many-to-many relationship between reservation and ScheduleRecord. The method adds entry to intermediate table (booked_schedules) and connects created reservation with schedule feeder (ScheduleRecord).
						// console.log('scheduleId:', req.body.schedule);
						return booking
							.addScheduleRecord(scheduleID, {
								through: {CustomerID: customerID, DidAction: 'Admin'},
								transaction: t,
								individualHooks: true,
							})
							.then(() => booking);
					});
				}
			});
	})
		.then((booking) => {
			console.log('\n✅✅✅ admin postBookSchedule Rezerwacja utworzona pomyślnie');
			res.status(201).json({
				isNewCustomer,
				confirmation: 1,
				message: 'Rezerwacja utworzona pomyślnie.',
				booking,
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
export const postDeleteBooking = (req, res, next) => {
	const controllerName = 'postDeleteBooking';
	log(controllerName);

	const id = req.params.id;
	models.Booking.destroy({
		where: {
			BookingID: id,
		},
	})
		.then((deletedCount) => {
			if (!deletedCount) {
				errCode = 404;
				throw new Error('\n❌ Nie usunięto rezerwacji.');
			}
			console.log('\n✅✅✅ admin postDeleteBooking deleted the feedback');
			return res.status(200).json({
				confirmation: 1,
				message: 'Rezerwacja usunięta pomyślnie.',
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
//@ INVOICES
export const showAllInvoices = (req, res, next) => {
	const controllerName = 'showAllInvoices';
	log(controllerName);

	const model = models.Invoice;

	// We create dynamic joint columns based on the map
	const columnMap = columnMaps[model.name] || {};
	const keysForHeaders = Object.values(columnMap);

	const includeAttributes = [];

	model
		.findAll({
			include: [
				{
					model: models.Booking,
					include: [
						{
							model: models.Customer, // from Booking
							attributes: [
								[
									Sequelize.literal("CONCAT(FirstName, ' ', LastName)"),
									'Imię Nazwisko',
								],
							],
						},
					],
				},
			],
			attributes: {
				include: includeAttributes, // Adding joint columns
				exclude: ['Product'], // Deleting substituted ones
			},
		})
		.then((records) => {
			if (!records) {
				errCode = 404;
				throw new Error('Nie znaleziono faktur.');
			}
			// Convert for records for different names
			const formattedRecords = records.map((record) => {
				const newRecord = {}; // Container for formatted data
				const attributes = model.getAttributes();
				const jsonRecord = record.toJSON();
				// 🔄 Iterate after each column in user record
				for (const key in jsonRecord) {
					const newKey = columnMap[key] || key; // New or original name if not specified
					const attributeType = attributes[key]?.type.constructor.key.toUpperCase(); // check type
					if (
						attributeType === 'DATE' ||
						attributeType === 'DATEONLY' ||
						attributeType === 'DATETIME'
					) {
						newRecord[newKey] = formatIsoDateTime(jsonRecord[key]);
					} else if (key === 'Booking' && jsonRecord[key]) {
						//# Name
						newRecord[newKey] = jsonRecord[key].Customer?.['Imię Nazwisko'];
					} else {
						newRecord[newKey] = jsonRecord[key];
					}
				}

				return newRecord; // Return new record object
			});

			// New headers (keys from columnMap)
			const totalHeaders = keysForHeaders;
			req.session.isLoggedIn = true;
			// ✅ Return response to frontend
			console.log('\n✅✅✅ showAllInvoices invoices fetched');
			res.json({
				confirmation: 1,
				message: 'Faktury pobrane pomyślnie.',
				isLoggedIn: req.session.isLoggedIn,
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
		})
		.catch((err) => catchErr(res, errCode, err, controllerName));
};
