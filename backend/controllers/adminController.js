import * as models from '../models/_index.js';
import {Sequelize, Op, fn, col} from 'sequelize';
import {simpleListAllToTable, listAllToTable} from '../utils/listAllToTable.js';
import columnMaps from '../utils/columnsMapping.js';
import {formatIsoDateTime, getWeekDay} from '../utils/formatDateTime.js';

//@ USERS
export const showAllUsers = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called showAllUsers`);
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
			if (!records) throw new Error('Nie znaleziono użytkowników.');
			// fetching map for User table or empty object
			const columnMap = columnMaps[model.name] || {};
			const keysForHeaders = Object.values(columnMap);
			// Convert for records for different names
			const formattedRecords = records.map((record) => {
				const newRecord = {}; // Container for formatted data

				// 🔄 Iterate after each column in user record
				for (const key in record.toJSON()) {
					const newKey = columnMap[key] || key; // New or original name if not specified
					if (key == 'UserPrefSetting') {
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
			console.log('\n✅✅✅ Fetched showAllUsers');
			res.json({
				isLoggedIn: req.session.isLoggedIn,
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error showAllUsers', err);
			return res.status(404).json({message: err});
		});
};
export const showUserByID = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called showUserByID`);
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
				throw new Error('Nie znaleziono użytkownika.');
			}

			console.log('✅✅✅ showUserByID user fetched');

			return res.status(200).json({isLoggedIn: req.session.isLoggedIn, user});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error showUserByID', err);
			return res.status(404).json({message: err});
		});
};
export const postCreateUser = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called postCreateUser`);
	const {email, password, confirmedPassword, date} = req.body;

	models.User.findOne({where: {email}})
		.then((user) => {
			if (user) {
				throw new Error('Użytkownik już istnieje.');
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
					return res.status(200).json({
						type: 'signup',
						code: 200,
						confirmation: 1,
						message: '✅ Zarejestrowano pomyślnie',
					});
				});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Użytkownik już istnieje.');
			return res.status(409).json({
				confirmation: 0,
				type: 'signup',
				code: 409,
				message: err.message,
			});
		});
};

export const postDeleteUser = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called postDeleteUser`);
	const id = req.params.id;
	models.User.destroy({
		where: {
			UserID: id,
		},
	})
		.then((deletedCount) => {
			if (!deletedCount) {
				throw new Error('\n❌ Nie usunięto użytkownika.');
			}
			console.log('\n✅✅✅ admin postDeleteUser deleted the user');
			return res.status(200).json({confirmation: true});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error admin postDeleteUser:', err);
			return res.status(404).json({message: err});
		});
};
export const getEditSettings = (req, res, next) => {
	console.log(`\n➡️➡️➡️ admin called getEditSettings`);

	models.UserPrefSettings.findByPk(req.params.id)
		.then((preferences) => {
			if (!preferences) {
				throw new Error('Nie pobrano ustawień.');
			}
			console.log('\n✅✅✅ admin getEditSettings fetched');
			return res.status(200).json({preferences});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error admin fetching the settings:', err.message);
			return res.status(404).json({message: err.message});
		});
};

export const postEditSettings = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called Admin postEditSettings`);
	const userID = req.params.id;
	const handedness = !!req.body.handedness || false;
	const font = parseInt(req.body.font) || 14;
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
				// Nothing changed
				if (
					preferences.Handedness === handedness &&
					preferences.FontSize === font &&
					preferences.Notifications === notifications &&
					preferences.Animation === animation &&
					preferences.Theme === theme
				) {
					// Nothing changed
					console.log('\n❓❓❓ Admin Preferences no change');
					return {confirmation: 0, message: 'Brak zmian'};
				} else {
					// Update
					preferences.Handedness = handedness;
					preferences.FontSize = font;
					preferences.Notifications = notifications;
					preferences.Animation = animation;
					preferences.Theme = theme;

					return preferences.save().then(() => {
						console.log('\n✅✅✅ Admin Preferences Updated');
						return {confirmation: 1, message: 'Ustawienia zostały zaktualizowane'};
					});
				}
			} else {
				// New preferences created
				console.log('\n✅✅✅ Admin Preferences Created');
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
		.catch((err) => {
			console.log('\n❌❌❌ Admin Error in postEditSettings:', err);
			return res.status(500).json({message: err});
		});
};
export const showAllUserSettings = (req, res, next) => {
	listAllToTable(res, models.UserPrefSettings, null);
};
//@ CUSTOMERS
export const showAllCustomers = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called showAllCustomers`);
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
				exclude: ['UserID', 'FirstName', 'LastName'], // Deleting substituted ones
			},
		})
		.then((records) => {
			if (!records) throw new Error('Nie znaleziono użytkowników.');
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
			console.log('✅✅✅ showAllCustomers customers fetched');
			res.json({
				isLoggedIn: req.session.isLoggedIn,
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error showAllCustomers', err);
			return res.status(404).json({message: err});
		});
};
export const showCustomerByID = (req, res, next) => {
	console.log(`\n➡️ called showCustomerByID`, new Date().toISOString());
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
				return res.redirect('/admin-console/show-all-users');
			}
			console.log('✅ customer fetched');
			return res.status(200).json({isLoggedIn: req.session.isLoggedIn, customer});
		})
		.catch((err) => console.log(err));
};
export const postCreateCustomer = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called postCreateCustomer`);
	const {userID, customerType, firstName, lastName, DoB, phone, cMethod, loyalty, notes} =
		req.body;
	let customerPromise;
	models.Customer.findOne({where: {UserID: userID}})
		.then((customer) => {
			if (customer) {
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
			console.log('\n✅✅✅ postCreateCustomer Zarejestrowano pomyślnie.');
			return res.status(200).json({
				code: 200,
				confirmation: 1,
				message: 'Zarejestrowano pomyślnie.',
			});
		})
		.catch((err) => {
			console.log('\n❌❌❌ postCreateCustomer Profil uczestnika już istnieje.');
			return res.status(409).json({
				confirmation: 0,
				code: 409,
				message: err.message,
			});
		});
};
export const postDeleteCustomer = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called postDeleteCustomer`);
	const id = req.params.id;
	models.Customer.destroy({
		where: {
			CustomerID: id,
		},
	})
		.then((deletedCount) => {
			if (!deletedCount) {
				throw new Error('\n❌ Nie usunięto profilu uczestnika.');
			}
			console.log('\n✅✅✅ admin postDeleteUser deleted the customer');
			return res.status(200).json({confirmation: true});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error admin postDeleteCustomer:', err);
			return res.status(404).json({message: err});
		});
};
export const getEditCustomer = (req, res, next) => {
	console.log(`\n➡️➡️➡️ admin called getEditCustomer`);
	models.Customer.findByPk(req.params.id)
		.then((customer) => {
			if (!customer) throw new Error('Nie znaleziono danych uczestnika.');
			console.log('\n✅✅✅ Fetched admin getEditCustomer customer');
			return res.status(200).json({customer});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error admin getEditCustomer', err);
			return res.status(404).json({message: err});
		});
};
export const postEditCustomer = (req, res, next) => {
	console.log(`\n➡️➡️➡️ admin called postEditCustomer`);
	const customerId = req.params.id;
	const newPhone = req.body.phone;
	const newContactMethod = req.body.cMethod;
	const newLoyalty = req.body.loyalty;
	const newNotes = req.body.notes;

	if (!newPhone || !newPhone.trim()) {
		console.log('\n❌❌❌ Error postEditCustomer:', 'No phone');
		return res.status(400).json({message: 'Numer telefonu nie może być pusty'});
	}

	models.Customer.findByPk(customerId)
		.then((customer) => {
			if (!customer) throw new Error('Nie znaleziono danych uczestnika.');
			console.log('\n✅✅✅ Fetched admin postEditCustomer customer');
			return customer;
		})
		.then((foundCustomer) => {
			if (
				foundCustomer.Phone == newPhone &&
				foundCustomer.PreferredContactMethod == newContactMethod &&
				foundCustomer.Loyalty == newLoyalty &&
				foundCustomer.Notes == newNotes
			) {
				// Nothing changed
				console.log('\n❓❓❓ Admin Customer no change');
				return {confirmation: 0, message: 'Brak zmian'};
			}
			return foundCustomer;
		})
		.then((fetchedCustomer) => {
			if (!fetchedCustomer) throw new Error('Nie przekazano uczestnika do update.');

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
						confirmation: status,
						affectedCustomerRows,
					});
				})
				.catch((err) => {
					console.log('\n❌❌❌ Error admin  postEditCustomer UPDATE:', err);
					return res.status(500).json({error: err});
				});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error admin postEditCustomer', err);
			return res.status(404).json({message: err});
		});
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
	console.log(`\n➡️➡️➡️ called admin getShowAllSchedules`);
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
			if (!records) throw new Error('Nie znaleziono terminów.');
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
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error admin getShowAllSchedules', err);
			return res.status(404).json({message: err});
		});
};
export const showScheduleByID = (req, res, next) => {
	console.log(`\n➡️ called showScheduleByID`);
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
				return res.redirect('/admin-console/show-all-schedules');
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
			return res.status(200).json({schedule, user: req.user});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error fetching the schedule:', err);
			return res.status(404).json({message: err});
		});
};
export const showBookedSchedules = (req, res, next) => {};
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
export const postDeleteSchedule = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called postDeleteSchedule`);
	const id = req.params.id;

	models.ScheduleRecord.findOne({
		where: {
			ScheduleID: id,
		},
	})
		.then((foundSchedule) => {
			if (!foundSchedule) {
				throw new Error('\n❌ Nie znaleziono terminu do usunięcia.');
			} else if (
				new Date(`${foundSchedule.Date}T${foundSchedule.StartTime}:00`) < new Date()
			) {
				throw new Error(
					'\n❌ Nie można usunąć terminu który już minął. Posiada też wartość historyczną dla statystyk.',
				);
			}
			return foundSchedule.destroy();
		})
		.then((deletedCount) => {
			if (!deletedCount) {
				throw new Error('\n❌ Nie usunięto terminu.');
			}
			console.log('\n✅✅✅ admin postDeleteSchedule deleted the schedule record');
			return res.status(200).json({confirmation: true});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error admin postDeleteSchedule:', err);
			return res.status(404).json({message: err});
		});
};
export const postEditSchedule = async (req, res, next) => {
	console.log(`\n➡️➡️➡️ called admin postEditSchedule`);
	const scheduleId = req.params.id;
	const newCapacity = req.body.capacity;
	const newStartDate = req.body.date;
	const newStartTime = req.body.startTime;
	const newLocation = req.body.location;
	console.log(scheduleId);
	console.log(newCapacity);
	console.log(newStartDate);
	console.log(newStartTime);
	console.log(newLocation);

	if (
		!newCapacity ||
		!newStartDate ||
		!newStartDate.trim() ||
		!newLocation ||
		!newLocation.trim() ||
		!newStartTime ||
		!newStartTime.trim()
	) {
		console.log('\n❌❌❌ Error postEditSchedule:', 'No enough data');
		return res.status(400).json({message: 'Nie podano wszystkich danych.'});
	}

	models.ScheduleRecord.findByPk(scheduleId)
		.then((schedule) => {
			if (!schedule) throw new Error('Nie znaleziono danych terminu.');
			console.log('\n✅✅✅ Fetched admin postEditSchedule schedule');
			return schedule;
		})
		.then((foundSchedule) => {
			if (new Date(`${foundSchedule.Date}T${foundSchedule.StartTime}:00`) < new Date()) {
				console.log('\n❓❓❓ Admin schedule is past - not to edit');
				throw new Error('Nie można edytować minionego terminu.');
			} else if (
				foundSchedule.Capacity == newCapacity &&
				foundSchedule.Date === newStartDate &&
				foundSchedule.Location === newLocation &&
				foundSchedule.StartTime === newStartTime
			) {
				// Nothing changed
				console.log('\n❓❓❓ Admin schedule no change');
				return {confirmation: 0, message: 'Brak zmian'};
			}
			return foundSchedule;
		})
		.then((fetchedSchedule) => {
			if (!fetchedSchedule) throw new Error('Nie przekazano terminu do update.');

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
						confirmation: status,
						affectedScheduleRows,
					});
				})
				.catch((err) => {
					console.log('\n❌❌❌ Error admin  postEditSchedule UPDATE:', err);
					return res.status(500).json({message: err.message});
				});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error admin postEditSchedule', err);
			return res.status(404).json({message: err.message});
		});
};
//@ FEEDBACK
export const showAllParticipantsFeedback = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called showAllParticipantsFeedback`);

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
			if (!records) throw new Error('Nie znaleziono opinii.');
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
			console.log('✅✅✅ showAllParticipantsFeedback reviews fetched');
			res.json({
				isLoggedIn: req.session.isLoggedIn,
				records: records,
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error showAllCustomers', err);
			return res.status(404).json({message: err});
		});
};
export const showAllParticipantsFeedbackByID = (req, res, next) => {
	console.log(`\n➡️ called showAllParticipantsFeedbackByID`);

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
				return res.redirect('/admin-console/show-all-participants-feedback');
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
				console.log('✅ Feedback fetched');
				return res
					.status(200)
					.json({isLoggedIn: req.session.isLoggedIn, review, otherReviews});
			});
		})
		.catch((err) => console.log(err));
};
export const postDeleteFeedback = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called postDeleteFeedback`);
	const id = req.params.id;
	models.Feedback.destroy({
		where: {
			FeedbackID: id,
		},
	})
		.then((deletedCount) => {
			if (!deletedCount) {
				throw new Error('\n❌ Nie usunięto opinii.');
			}
			console.log('\n✅✅✅ admin postDeleteFeedback deleted the feedback');
			return res.status(200).json({confirmation: true});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error admin postDeleteFeedback:', err);
			return res.status(404).json({message: err});
		});
};
//@ NEWSLETTERS
export const showAllNewsletters = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called showAllNewsletters`);

	simpleListAllToTable(res, models.Newsletter);
};
//# SUBS
export const showAllSubscribedNewsletters = (req, res, next) => {
	simpleListAllToTable(res, models.SubscribedNewsletter);
};
//@ PRODUCTS
export const showAllProducts = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called showAllProducts`);
	simpleListAllToTable(res, models.Product);
};
export const showProductByID = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called showProductByID`);

	const PK = req.params.id;
	models.Product.findByPk(PK, {
		include: [
			{
				model: models.ScheduleRecord,
				required: false,
				include: [
					{
						model: models.Booking, // Booking which has relation through BookedSchedule
						through: {}, // omit data from mid table
						required: false,
						attributes: {
							exclude: ['Product', 'CustomerID'],
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
				return res.redirect('/admin-console/show-all-products');
			}
			console.log('✅ product fetched');
			return res.status(200).json({isLoggedIn: req.session.isLoggedIn, product});
		})
		.catch((err) => console.log(err));
};
export const postCreateProduct = async (req, res, next) => {
	console.log(`\n➡️➡️➡️ called postCreateProduct`);
	const {userID, customerType, firstName, lastName, DoB, phone, cMethod, loyalty, notes} =
		req.body;
	// let customerPromise;
	// models.Customer.findOne({where: {UserID: userID}})
	// 	.then((customer) => {
	// 		if (customer) {
	// 			throw new Error('Profil uczestnika już istnieje.');
	// 		}
	// 		return (customerPromise = models.Customer.create({
	// 			CustomerType: customerType || 'Indywidualny',
	// 			UserID: userID,
	// 			FirstName: firstName,
	// 			LastName: lastName,
	// 			DoB: DoB,
	// 			Phone: phone,
	// 			PreferredContactMethod: cMethod || '=',
	// 			ReferralSource: 'Admin insert',
	// 			Loyalty: loyalty || 5,
	// 			Notes: notes,
	// 		}).then((newCustomer) => {
	// 			return models.User.update({Role: 'customer'}, {where: {UserID: userID}}).then(
	// 				() => newCustomer,
	// 			);
	// 		}));
	// 	})
	// 	.then((newCustomer) => {
	// 		console.log('\n✅✅✅ postCreateProduct Zarejestrowano pomyślnie.');
	// 		return res.status(200).json({
	// 			code: 200,
	// 			confirmation: 1,
	// 			message: 'Zarejestrowano pomyślnie.',
	// 		});
	// 	})
	// 	.catch((err) => {
	// 		console.log('\n❌❌❌ postCreateProduct Profil uczestnika już istnieje.');
	// 		return res.status(409).json({
	// 			confirmation: 0,
	// 			code: 409,
	// 			message: err.message,
	// 		});
	// 	});
};
export const postEditProduct = async (req, res, next) => {
	console.log(`\n➡️➡️➡️ called admin postEditProduct`);
	const productId = req.params.id;
	const newType = req.body.type;
	const newStartDate = req.body.date;
	const newLocation = req.body.location;
	const newDuration = req.body.duration;
	const newPrice = req.body.price;

	if (
		!newType ||
		!newType.trim() ||
		!newStartDate ||
		!newStartDate.trim() ||
		!newLocation ||
		!newLocation.trim() ||
		!newDuration ||
		!newPrice
	) {
		console.log('\n❌❌❌ Error postEditCustomer:', 'No enough data');
		return res.status(400).json({message: 'Nie podano wszystkich danych.'});
	}

	models.Product.findByPk(productId)
		.then((product) => {
			if (!product) throw new Error('Nie znaleziono danych uczestnika.');
			console.log('\n✅✅✅ Fetched admin postEditProduct product');
			return product;
		})
		.then((foundProduct) => {
			if (
				foundProduct.Type === newType &&
				foundProduct.StartDate === newStartDate &&
				foundProduct.Location === newLocation &&
				foundProduct.Duration === newDuration &&
				foundProduct.Price === newPrice
			) {
				// Nothing changed
				console.log('\n❓❓❓ Admin Product no change');
				return {confirmation: 0, message: 'Brak zmian'};
			}
			return foundProduct;
		})
		.then((fetchedProduct) => {
			if (!fetchedProduct) throw new Error('Nie przekazano produktu do update.');

			models.Product.update(
				{
					Type: newType,
					StartDate: newStartDate,
					Location: newLocation,
					Duration: newDuration,
					Price: newPrice,
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
						affectedProductRows,
					});
				})
				.catch((err) => {
					console.log('\n❌❌❌ Error admin  postEditProduct UPDATE:', err);
					return res.status(500).json({error: err});
				});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error admin postEditProduct', err);
			return res.status(404).json({message: err});
		});
};
export const postDeleteProduct = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called postDeleteProduct`);
	const id = req.params.id;
	models.Product.destroy({
		where: {
			ProductID: id,
		},
	})
		.then((deletedCount) => {
			if (!deletedCount) {
				throw new Error('\n❌ Nie usunięto zajęć.');
			}
			console.log('\n✅✅✅ admin postDeleteProduct deleted the product');
			return res.status(200).json({confirmation: true});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error admin postDeleteProduct:', err);
			return res.status(404).json({message: err});
		});
};
//@ BOOKINGS
export const showAllBookings = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called showAllBookings`);
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
			if (!records) throw new Error('Nie znaleziono rezerwacji.');
			const formattedRecords = records.map((record) => {
				const attributes = model.getAttributes();
				const newRecord = {};
				const jsonRecord = record.toJSON();

				// Konwersja pól na poprawne nazwy
				for (const key in jsonRecord) {
					const attributeType = attributes[key]?.type.constructor.key?.toUpperCase();
					const newKey = columnMap[key] || key;
					if (['DATE', 'DATEONLY', 'DATETIME'].includes(attributeType)) {
						newRecord[newKey] = formatIsoDateTime(jsonRecord[key]);
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
			console.log('✅✅✅ getShowAllBookings bookings fetched');
			res.json({
				isLoggedIn: req.session.isLoggedIn,
				totalHeaders,
				records: records,
				content: formattedRecords,
			});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error admin getShowAllSchedules', err);
			return res.status(404).json({message: err});
		});
};
export const showBookingByID = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called showBookingByID`);

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
				return res.redirect('/admin-console/show-all-bookings');
			}
			console.log('✅ Schedule fetched');
			return res.status(200).json({isLoggedIn: req.session.isLoggedIn, booking});
		})
		.catch((err) => console.log(err));
};
export const postDeleteBooking = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called postDeleteBooking`);
	const id = req.params.id;
	models.Booking.destroy({
		where: {
			BookingID: id,
		},
	})
		.then((deletedCount) => {
			if (!deletedCount) {
				throw new Error('\n❌ Nie usunięto rezerwacji.');
			}
			console.log('\n✅✅✅ admin postDeleteBooking deleted the feedback');
			return res.status(200).json({confirmation: true});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error admin postDeleteBooking:', err);
			return res.status(404).json({message: err});
		});
};
//@ INVOICES
export const showAllInvoices = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called showAllInvoices`);

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
			if (!records) throw new Error('Nie znaleziono faktur.');
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
			console.log('✅✅✅ showAllInvoices invoices fetched');
			res.json({
				isLoggedIn: req.session.isLoggedIn,
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
		})
		.catch((err) => {
			console.log('\n❌❌❌ Error admin showAllInvoices', err);
			return res.status(404).json({message: err});
		});
};
