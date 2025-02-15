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
export const showUserByID = (req, res, next) => {
	const PK = req.params.id;
	models.User.findByPk(PK, {
		include: [
			{
				model: models.Customer, // Add Customer
				required: false, // May not exist
			},
		],
	})
		.then((user) => {
			if (!user) {
				return res.redirect('/admin-console/show-all-users');
			}
			console.log('✅ user fetched');
			return res.status(200).json({user});
		})
		.catch((err) => console.log(err));
};
export const createUser = (req, res, next) => {
	// console.log('📩 Otrzymane dane:', req.body);
	models.User.create({
		RegistrationDate: req.body.registrationDate,
		Login: req.body.login,
		PasswordHash: req.body.password,
		LastLoginDate: 'logindate',
		Email: req.body.email + Math.floor(Math.random() * 1000) + '@google.com',
		Role: req.body.role,
		ProfilePictureSrcSetJSON: req.body.profilePicture,
	})
		.then(() => {
			console.log('✅ user created');
			res.status(201).json({message: '✅ User created'});
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
					} else if (key === 'Product' && jsonRecord[key]) {
						newRecord['Typ'] = jsonRecord[key].Type; //  flatten object
						newRecord['Nazwa'] = jsonRecord[key].Name;
					} else {
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
//@ FEEDBACK
export const showAllParticipantsFeedback = (req, res, next) => {
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
						newRecord['Imię Nazwisko'] = jsonRecord[key]['Imię Nazwisko'];
					} else if (key == 'ScheduleRecord') {
						newRecord['Data'] = jsonRecord[key]['Date'];
						newRecord['Godzina'] = jsonRecord[key]['StartTime'];
						//ScheduleRecords and inside Product object
						newRecord['Produkt'] = jsonRecord[key].Product?.Name;
					} else {
						newRecord[newKey] = jsonRecord[key]; // Assignment
					}
				}
				return newRecord; // Return new record object
			});

			// New headers (keys from columnMap)
			const totalHeaders = [
				'Ocena (1-5)',
				'Treść Opinii',
				'Data Zgłoszenia',
				'Opóźnienie',
				'ID Opinii',
				'ID Klienta',
				'Imię Nazwisko',
				'ID Terminu',
				'Data',
				'Godzina',
				'Produkt',
			];

			// ✅ Return response to frontend
			res.json({
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
		})
		.catch((err) => console.log(err));
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
export const editProduct = async (req, res, next) => {
	models.Product.findByPk()
		.then({
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
	const model = models.Booking;

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
					model: models.ScheduleRecord,
					through: {model: models.BookedSchedule}, // M:N relacja
					include: [
						{
							model: models.Product,
							attributes: ['Name'],
						},
					],
					attributes: ['ScheduleID'], // Klucz dla referencji
				},
			],
			attributes: {
				exclude: ['Product', 'ScheduleID'], // Usuwamy starą kolumnę
			},
		})
		.then((records) => {
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
						newRecord['Klient'] = jsonRecord[key]['Imię Nazwisko'];
					} else if (key === 'ScheduleRecords') {
						// 🔥 Główna poprawka: WYRAŹNE zbieranie WSZYSTKICH produktów
						const products = jsonRecord[key]
							.map((sr) => sr.Product?.Name)
							.filter(Boolean);

						newRecord['Produkt'] =
							products.length > 0 ? products.join(', ') : 'Brak danych';
					} else {
						newRecord[newKey] = jsonRecord[key];
					}
				}

				return newRecord;
			});

			// Nagłówki
			const totalHeaders = [
				'ID',
				'Data Rezerwacji',
				'Klient',
				'Produkt',
				'Status',
				'Kwota do zapłaty',
				'Kwota zapłacona',
				'Metoda płatności',
				'Status płatności',
			];

			// ✅ Zwrócenie odpowiedzi do frontendu
			res.json({
				totalHeaders,
				content: formattedRecords,
			});
		})
		.catch((err) => console.error('Błąd w pobieraniu rezerwacji:', err));
};
//@ INVOICES
export const showAllInvoices = (req, res, next) => {
	const model = models.Invoice;

	// We create dynamic joint columns based on the map
	const columnMap = columnMaps[model.name] || {};
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
						newRecord['Klient'] = jsonRecord[key].Customer?.['Imię Nazwisko'];
					} else {
						newRecord[newKey] = jsonRecord[key];
					}
				}

				return newRecord; // Return new record object
			});

			// New headers (keys from columnMap)
			const totalHeaders = [
				'ID FV',
				'ID Rezerwacji',
				'Klient',
				'Data faktury',
				'Termin płatności',
				'Kwota całkowita',
				'Status płatności',
			];

			// ✅ Return response to frontend
			res.json({
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
		})
		.catch((err) => console.log(err));
};
