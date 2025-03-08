import * as models from '../models/_index.js';
import {Sequelize, Op} from 'sequelize';
import {simpleListAllToTable, listAllToTable} from '../utils/listAllToTable.js';
import columnMaps from '../utils/columnsMapping.js';
import {formatIsoDateTime, getWeekDay} from '../utils/formatDateTime.js';

//@ USERS
export const showAllUsers = (req, res, next) => {
	console.log(`\n➡️ called showAllUsers`);
	console.log(`\n➡️ called showAllUsers`, req.user);
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
				isLoggedIn: req.session.isLoggedIn,
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
		})
		.catch((err) => console.log(err));
};
export const showUserByID = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called showUserByID`);
	const PK = req.params.id || req.user.UserID;
	models.User.findByPk(PK, {
		include: [
			{
				model: models.Customer, // Add Customer
				required: false, // May not exist
				// include: [
				// 	{
				// 		model: models.CustomerPhones, // Customer phone numbers
				// 		required: false,
				// 	},
				// ],
			},
			{
				model: models.UserPrefSettings, // User settings if exist
				required: false,
			},
		],
	})
		.then((user) => {
			if (!user) {
				return res.redirect('/admin-console/show-all-users');
			}
			console.log('✅ user fetched');

			return res.status(200).json({isLoggedIn: req.session.isLoggedIn, user});
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
			res.status(201).json({
				isLoggedIn: req.session.isLoggedIn,
				message: '✅ User created',
			});
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
	listAllToTable(res, models.UserPrefSettings, null);
};
//@ CUSTOMERS
export const showAllCustomers = (req, res, next) => {
	console.log(`\n➡️ called showAllCustomers`);
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
				exclude: ['UserID', 'FirstName', 'LastName'], // Deleting substituted ones
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
				isLoggedIn: req.session.isLoggedIn,
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
		})
		.catch((err) => console.log(err));
};
export const showCustomerByID = (req, res, next) => {
	console.log(`\n➡️ called showCustomerByID`, new Date().toISOString());

	const PK = req.params.id;
	models.Customer.findByPk(PK, {
		include: [
			// {
			// 	model: models.CustomerPhones, // Customer phone numbers
			// 	required: false,
			// },
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
								where: {CustomerID: req.params.id}, // but only for particular customer
							},
						],
						attributes: {
							exclude: ['ProductID'], // deleting
						},
					},
				],
				where: {CustomerID: req.params.id},
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
				return res.redirect('/admin-console/show-all-users');
			}
			console.log('✅ customer fetched');
			return res.status(200).json({isLoggedIn: req.session.isLoggedIn, customer});
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

	// If logged In and is Customer - we want to check his booked schedules to flag them later
	const bookingInclude = {
		model: models.Booking,
		required: false,
		attributes: ['BookingID'], //booking Id is enough

		where:
			req.user && req.user.Customer ? {CustomerID: req.user.Customer.CustomerID} : undefined, // Filter
	};

	model
		.findAll({
			include: [
				{
					model: models.Product,
					attributes: ['Type', 'Name', 'Price'],
				},
				bookingInclude,
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
					} else if (key === 'Bookings' && req.user.Customer) {
						newRecord.isUserGoing = (jsonRecord.Bookings || []).length > 0;
					} else {
						newRecord[newKey] = jsonRecord[key]; // Assignment
					}
				}
				newRecord['Dzień'] = getWeekDay(jsonRecord['Date']);
				newRecord['Zadatek'] = jsonRecord.Product.Price;
				return newRecord; // Return new record object
			});

			// New headers (keys from columnMap)
			const totalHeaders = [
				'',
				'ID',
				'Data',
				'Dzień',
				'Godzina rozpoczęcia',
				'Typ',
				'Nazwa',
				'Lokalizacja',
			];
			// ✅ Return response to frontend
			res.json({
				isLoggedIn: req.session.isLoggedIn || false,
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
		})
		.catch((err) => console.log(err));
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
				model: models.Booking, // Booking which has relation through BookedSchedule
				through: {attributes: []}, // omit data from mid table
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
	})
		.then((schedule) => {
			if (!schedule) {
				return res.redirect('/admin-console/show-all-schedules');
			}
			return res.status(200).json({isLoggedIn: req.session.isLoggedIn, schedule});
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
				'ID',
				'Ocena (1-5)',
				'Treść Opinii',
				'Data Zgłoszenia',
				'Opóźnienie',
				'ID Klienta',
				'Imię Nazwisko',
				'ID Terminu',
				'Data',
				'Godzina',
				'Produkt',
			];

			// ✅ Return response to frontend
			res.json({
				isLoggedIn: req.session.isLoggedIn,
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
		})
		.catch((err) => console.log(err));
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
export const showProductByID = (req, res, next) => {
	console.log(`\n➡️ called showProductByID`);

	const PK = req.params.id;
	models.Product.findByPk(PK, {
		include: [
			{
				model: models.ScheduleRecord,
				required: false,
				include: [
					{
						model: models.Booking, // Booking which has relation through BookedSchedule
						through: {attributes: []}, // omit data from mid table
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
export const createProduct = async (req, res, next) => {
	models.Product.create({
		Name: req.body.name,
		Type: req.body.type,
		Location: req.body.location,
		Duration: req.body.duration,
		Price: req.body.price,
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
			req.session.isLoggedIn = true;
			// ✅ Zwrócenie odpowiedzi do frontendu
			res.json({
				isLoggedIn: req.session.isLoggedIn,
				totalHeaders,
				content: formattedRecords,
			});
		})
		.catch((err) => console.error('Błąd w pobieraniu rezerwacji:', err));
};
export const showBookingByID = (req, res, next) => {
	console.log(`\n➡️ called showBookingByID`);

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
			req.session.isLoggedIn = true;
			// ✅ Return response to frontend
			res.json({
				isLoggedIn: req.session.isLoggedIn,
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
		})
		.catch((err) => console.log(err));
};
