import * as models from '../models/_index.js';
import {Sequelize} from 'sequelize';

import {simpleListAllToTable, listAllToTable} from '../utils/listAllToTable.js';
import columnMaps from '../utils/columnsMapping.js';
import formatIsoDateTime from '../utils/formatDateTime.js';

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
		.then((records) => {
			// fetching map for User table or empty object
			const columnMap = columnMaps[model.name] || {};

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
						newRecord[newKey] = formatIsoDateTime(record[key]);
					} else {
						newRecord[newKey] = record[key]; // Assignment
					}
				}

				return newRecord; // Return new record object
			});

			// New headers (keys from columnMap)
			const totalHeaders = [
				'ID',
				'Data rejestracji',
				'Ostatnie logowanie',
				'Login',
				'Hasło (hash)',
				'E-mail',
				// 'Rola',
				'Zdjęcie profilowe',
				'Ustawienia użytkownika',
			];

			// ✅ Return response to frontend
			res.json({
				totalHeaders, // To render
				content: formattedRecords, // With new names
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
	listAllToTable(res, models.UserSettings, null);
};
//@ CUSTOMERS
export const showAllCustomers = (req, res, next) => {
	const model = models.Customer;

	// We create dynamic joint columns based on the map
	const columnMap = columnMaps[model.name] || {};
	const includeAttributes = [
		//  FirstName + LastName => Name
		[Sequelize.literal("CONCAT(CustomerID, '-', UserID)"), 'ID klienta-użytkownika'],
		[Sequelize.literal("CONCAT(FirstName, ' ', LastName)"), 'Imię Nazwisko'],
	];

	model
		.findAll({
			attributes: {
				include: includeAttributes, // Adding joint columns
				exclude: ['CustomerID', 'UserID', 'FirstName', 'LastName'], // Deleting substituted ones
			},
		})
		.then((records) => {
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
			const totalHeaders = [
				'ID klienta-użytkownika',
				'Imię Nazwisko',
				'Typ klienta',
				'Data urodzenia',
				'Preferowany kontakt',
				'Lojalność',
				'Źródło polecenia',
				'Notatki',
			];

			// ✅ Return response to frontend
			res.json({
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
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
	const model = models.ScheduleRecord;

	// We create dynamic joint columns based on the map
	const columnMap = columnMaps[model.name] || {};
	const includeAttributes = [];

	model
		.findAll({
			include: [
				{
					model: models.Product,
					attributes: ['Type', 'Name'],
				},
			],
			attributes: {
				include: includeAttributes, // Adding joint columns
				exclude: ['ProductID'], // Deleting substituted ones
			},
		})
		.then((records) => {
			// Convert for records for different names
			const formattedRecords = records.map((record) => {
				const newRecord = {}; // Container for formatted data

				const jsonRecord = record.toJSON();

				// 🔄 Iterate after each column in user record
				for (const key in jsonRecord) {
					if (key === 'Product' && jsonRecord[key]) {
						newRecord['Typ'] = jsonRecord[key].Type; //  flatten object
						newRecord['Nazwa'] = jsonRecord[key].Name;
					} else {
						const newKey = columnMap[key] || key; // New or original name if not specified
						newRecord[newKey] = jsonRecord[key]; // Assignment
					}
				}

				return newRecord; // Return new record object
			});

			// New headers (keys from columnMap)
			const totalHeaders = [
				'ID Terminu',
				'Data',
				'Godzina rozpoczęcia',
				'Typ',
				'Nazwa',
				'Lokalizacja',
			];

			// ✅ Return response to frontend
			res.json({
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
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
	simpleListAllToTable(res, models.Feedback);
};
//@ NEWSLETTERS
export const showAllNewsletters = (req, res, next) => {
	simpleListAllToTable(res, models.Newsletter);
};
//# SUBS
export const showAllSubscribedNewsletters = (req, res, next) => {
	simpleListAllToTable(res, models.SubscribedNewsletter);
};
//@ PRODUCTS
export const showAllProducts = (req, res, next) => {
	simpleListAllToTable(res, models.Product);
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
	simpleListAllToTable(res, models.Booking);
};
//@ INVOICES
export const showAllInvoices = (req, res, next) => {
	simpleListAllToTable(res, models.Invoice);
};
