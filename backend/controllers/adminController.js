import { addDays, addMonths, addYears } from 'date-fns';
import { Op, Sequelize } from 'sequelize';
import * as models from '../models/_index.js';
import columnMaps from '../utils/columnsMapping.js';
import {
  callLog,
  catchErr,
  errorCode,
  successLog,
} from '../utils/controllersUtils.js';
import db from '../utils/db.js';
import { formatIsoDateTime, getWeekDay } from '../utils/formatDateTime.js';
import { simpleListAllToTable } from '../utils/listAllToTable.js';
import {
  sendAttendanceMarkedAbsentMail,
  sendAttendanceRecordDeletedMail,
  sendAttendanceReturningMail,
} from '../utils/mails/templates/adminOnlyActions/attendanceEmails.js';
import {
  sendReservationCancelledMail,
  sendReservationFreshMail,
} from '../utils/mails/templates/adminOnlyActions/reservationEmails.js';
let errCode = errorCode;
const person = 'Admin';

//! USERS_____________________________________________
//@ GET
export const getAllUsers = (req, res, next) => {
  const controllerName = 'getAllUsers';
  callLog(person, controllerName);

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
    .then(records => {
      if (!records) {
        errCode = 404;
        throw new Error('Nie znaleziono użytkowników.');
      }
      // fetching map for User table or empty object
      const columnMap = columnMaps[model.name] || {};
      const keysForHeaders = Object.values(columnMap);
      // Convert for records for different names
      const formattedRecords = records.map(record => {
        const newRecord = {}; // Container for formatted data
        const attributes = model.getAttributes();

        // 🔄 Iterate after each column in user record
        for (const key in record.toJSON()) {
          const newKey = columnMap[key] || key; // New or original name if not specified
          const attributeType =
            attributes[key]?.type.constructor.key?.toUpperCase();
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
      successLog(person, controllerName);
      res.json({
        confirmation: 1,
        message: 'Konta pobrane pomyślnie.',
        isLoggedIn: req.session.isLoggedIn,
        totalHeaders, // To render
        content: formattedRecords.sort((a, b) =>
          a.Email.localeCompare(b.Email)
        ), // With new names
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
export const getUserByID = (req, res, next) => {
  const controllerName = 'getUserByID';
  callLog(person, controllerName);

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
    .then(user => {
      if (!user) {
        errCode = 404;
        throw new Error('Nie znaleziono użytkownika.');
      }

      successLog(person, controllerName);
      return res
        .status(200)
        .json({ confirmation: 1, isLoggedIn: req.session.isLoggedIn, user });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
export const getUserSettings = (req, res, next) => {
  const controllerName = 'getUserSettings';
  callLog(person, controllerName);

  models.UserPrefSettings.findByPk(req.params.id)
    .then(preferences => {
      if (!preferences) {
        successLog(person, controllerName, 'fetched default');

        res.status(200).json({
          confirmation: 1,
          message: 'Brak własnych ustawień - załadowane domyślne.',
        });
        return null;
      }
      successLog(person, controllerName, 'fetched custom settings');
      return res.status(200).json({ confirmation: 1, preferences });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
//@ POST
export const postCreateUser = (req, res, next) => {
  const controllerName = 'postCreateUser';
  callLog(person, controllerName);
  const { email, password, confirmedPassword, date } = req.body;

  models.User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        errCode = 409;
        throw new Error('Konto już istnieje.');
      }

      // it returns the promise
      return bcrypt
        .hash(password, 12)
        .then(passwordHashed => {
          return models.User.create({
            RegistrationDate: date,
            PasswordHash: passwordHashed,
            LastLoginDate: date,
            Email: email,
            Role: 'user',
            ProfilePictureSrcSetJSON: null,
          });
        })
        .then(newUser => {
          successLog(person, controllerName);
          return res.status(200).json({
            type: 'signup',
            code: 200,
            confirmation: 1,
            message: 'Konto utworzone pomyślnie',
          });
        });
    })

    .catch(err =>
      catchErr(res, errCode, err, controllerName, { type: 'signup', code: 409 })
    );
};
//@ PUT
export const putEditUserSettings = (req, res, next) => {
  const controllerName = 'putEditUserSettings';
  callLog(person, controllerName);

  const userID = req.params.id;
  const { handedness, font, notifications, animation, theme } = req.body;
  console.log(`❗❗❗`, req.body);

  // if preferences don't exist - create new ones:
  models.UserPrefSettings.findOrCreate({
    where: { UserID: userID },
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
          console.log(
            '\n❓❓❓ putEditUserSettings Admin Preferences no change'
          );
          res.status(200).json({ confirmation: 0, message: 'Brak zmian' });
          return null;
        } else {
          // Update
          preferences.Handedness = !!handedness;
          preferences.FontSize = parseInt(font);
          preferences.Notifications = !!notifications;
          preferences.Animation = !!animation;
          preferences.Theme = !!theme;

          return preferences.save().then(() => {
            successLog(person, controllerName, 'updated');
            return {
              confirmation: 1,
              message: 'Ustawienia zostały zaktualizowane.',
            };
          });
        }
      } else {
        // New preferences created
        successLog(person, controllerName, 'created');
        return { confirmation: 1, message: 'Ustawienia zostały utworzone' };
      }
    })
    .then(result => {
      if (!result) return;
      successLog(person, controllerName, 'sent');
      return res.status(200).json({
        confirmation: result.confirmation,
        message: result.message,
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
//@ DELETE
export const deleteUser = (req, res, next) => {
  const controllerName = 'deleteUser';
  callLog(person, controllerName);

  const id = req.params.id;
  models.User.destroy({
    where: {
      UserID: id,
    },
  })
    .then(deletedCount => {
      if (!deletedCount) {
        errCode = 404;
        throw new Error('Nie usunięto użytkownika.');
      }
      successLog(person, controllerName);
      return res
        .status(200)
        .json({ confirmation: 1, message: 'Konto usunięte pomyślnie.' });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};

//! CUSTOMERS_____________________________________________
//@ GET
export const getAllCustomers = (req, res, next) => {
  const controllerName = 'getAllCustomers';
  callLog(person, controllerName);
  const model = models.Customer;

  // We create dynamic joint columns based on the map
  const columnMap = columnMaps[model.name] || {};
  const keysForHeaders = Object.values(columnMap);
  const includeAttributes = [
    //  FirstName + LastName => Name
    [
      Sequelize.literal("CONCAT(CustomerID, '-', UserID)"),
      'ID klienta-użytkownika',
    ],
    [Sequelize.literal("CONCAT(FirstName, ' ', LastName)"), 'Imię Nazwisko'],
  ];

  model
    .findAll({
      attributes: {
        include: includeAttributes, // Adding joint columns
        exclude: ['UserID'], // Deleting substituted ones
      },
    })
    .then(records => {
      if (!records) {
        errCode = 404;
        throw new Error('Nie znaleziono użytkowników.');
      }
      // Convert for records for different names
      const formattedRecords = records.map(record => {
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
      successLog(person, controllerName);
      res.json({
        confirmation: 1,
        isLoggedIn: req.session.isLoggedIn,
        totalHeaders, // To render
        content: formattedRecords.sort((a, b) =>
          a.LastName.localeCompare(b.LastName)
        ), // With new names
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
export const getCustomerByID = (req, res, next) => {
  const controllerName = 'getCustomerByID';
  callLog(person, controllerName);

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
                where: { CustomerID: req.user.Customer.CustomerID }, // but only for particular customer
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
    .then(customer => {
      if (!customer) {
        errCode = 404;
        throw new Error('Nie znaleziono profilu uczestnika.');
      }
      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        isLoggedIn: req.session.isLoggedIn,
        customer,
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
export const getCustomerDetails = (req, res, next) => {
  const controllerName = 'getEditCustomerDetails';
  callLog(person, controllerName);

  models.Customer.findByPk(req.params.id)
    .then(customer => {
      if (!customer) {
        errCode = 404;
        throw new Error('Nie znaleziono danych uczestnika.');
      }
      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        customer,
        message: 'Dane uczestnika pobrane pomyślnie.',
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
//@ POST
export const postCreateCustomer = (req, res, next) => {
  const controllerName = 'postCreateCustomer';
  callLog(person, controllerName);

  const {
    userID,
    customerType,
    firstName,
    lastName,
    DoB,
    phone,
    cMethod,
    loyalty,
    notes,
  } = req.body;
  let customerPromise, customerEmail;

  models.Customer.findOne({ where: { UserID: userID } })
    .then(customer => {
      if (customer) {
        errCode = 409;
        throw new Error('Profil uczestnika już istnieje.');
      }

      return models.User.findByPk(userID, {
        attributes: ['Email'],
      });
    })
    .then(user => {
      if (!user) {
        errCode = 404;
        throw new Error('Nie znaleziono użytkownika.');
      }

      customerEmail = user.Email;

      return models.Customer.create({
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
      }).then(newCustomer => {
        return models.User.update(
          { Role: 'customer' },
          { where: { UserID: userID } }
        ).then(() => newCustomer);
      });
    })
    .then(newCustomer => {
      successLog(person, controllerName);
      return res.status(200).json({
        code: 200,
        confirmation: 1,
        message: 'Zarejestrowano pomyślnie.',
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName, { code: 409 }));
};
//@ PUT
export const putEditCustomerDetails = (req, res, next) => {
  const controllerName = 'putEditCustomerDetails';
  callLog(person, controllerName);

  const customerId = req.params.id;

  const {
    phone: newPhone,
    cMethod: newContactMethod,
    loyalty: newLoyalty,
    notes: newNotes,
  } = req.body;

  if (!newPhone || !newPhone.trim()) {
    errCode = 400;
    console.log('\n❌❌❌ Error putEditCustomerDetails No phone');
    throw new Error('Numer telefonu nie może być pusty.');
  }

  models.Customer.findByPk(customerId)
    .then(customer => {
      errCode = 404;
      if (!customer) throw new Error('Nie znaleziono danych uczestnika.');

      successLog(person, controllerName, 'fetched');
      return customer;
    })
    .then(foundCustomer => {
      const { Phone, PreferredContactMethod, Loyalty, Notes } = foundCustomer;
      if (
        Phone == newPhone &&
        PreferredContactMethod == newContactMethod &&
        Loyalty == newLoyalty &&
        Notes == newNotes
      ) {
        // Nothing changed
        console.log('\n❓❓❓ Admin Customer no change');
        res.status(200).json({ confirmation: 0, message: 'Brak zmian' });
        return null;
      }
      return foundCustomer;
    })
    .then(fetchedCustomer => {
      if (!fetchedCustomer) return;
      models.Customer.update(
        {
          Phone: newPhone,
          PreferredContactMethod: newContactMethod,
          Loyalty: newLoyalty,
          Notes: newNotes,
        },
        { where: { CustomerID: customerId } }
      )
        .then(customerResult => {
          return { customerResult };
        })
        .then(results => {
          successLog(person, controllerName);
          const affectedCustomerRows = results.customerResult[0];
          const status = affectedCustomerRows >= 1;
          return res.status(200).json({
            message: 'Profil zaktualizowany pomyślnie.',
            confirmation: status,
            affectedCustomerRows,
          });
        })
        .catch(err => catchErr(res, errCode, err, controllerName));
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
//@ DELETE
export const deleteCustomer = (req, res, next) => {
  const controllerName = 'deleteCustomer';
  callLog(person, controllerName);

  const id = req.params.id;
  models.Customer.destroy({
    where: {
      CustomerID: id,
    },
  })
    .then(deletedCount => {
      if (!deletedCount) {
        errCode = 404;
        throw new Error('Nie usunięto profilu uczestnika.');
      }
      successLog(person, controllerName);
      return res
        .status(200)
        .json({ confirmation: 1, message: 'Profil usunięty pomyślnie.' });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};

//! SCHEDULES_____________________________________________
//@ GET
export const getAllSchedules = (req, res, next) => {
  const controllerName = 'getAllSchedules';
  callLog(person, controllerName);
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
    .then(records => {
      if (!records) {
        errCode = 404;
        throw new Error('Nie znaleziono terminów.');
      }
      // Convert for records for different names
      const formattedRecords = records.map(record => {
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
              booking =>
                booking.BookedSchedule.CustomerID ===
                req.user?.Customer?.CustomerID
            );
            newRecord.isUserGoing = jsonRecord.Bookings.some(booking => {
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
          booking =>
            booking.BookedSchedule &&
            (booking.BookedSchedule.Attendance === 1 ||
              booking.BookedSchedule.Attendance === true)
        );
        newRecord['Dzień'] = getWeekDay(jsonRecord['Date']);
        newRecord['Zadatek'] = jsonRecord.Product.Price;
        newRecord['Miejsca'] =
          `${activeBookings.length}/${jsonRecord.Capacity}`;
        newRecord.full = activeBookings.length >= jsonRecord.Capacity;
        return newRecord; // Return new record object
      });

      // New headers (keys from columnMap)
      const totalHeaders = keysForHeaders;
      // ✅ Return response to frontend
      successLog(person, controllerName);
      res.json({
        confirmation: 1,
        message: 'Terminy pobrane pomyślnie.',
        totalHeaders, // To render
        content: formattedRecords.sort(
          (a, b) => new Date(b.Data) - new Date(a.Data)
        ), // With new names
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
export const getScheduleByID = (req, res, next) => {
  const controllerName = 'getScheduleByID';
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
            attributes: { exclude: ['UserID'] },
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
            attributes: { exclude: ['UserID'] },
          },
        ],
        attributes: { exclude: ['CustomerID'] },
      },
    ],
  })
    .then(scheduleData => {
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
          bs => bs.Attendance == 1 || bs.Attendance == true
        );
        if (req.user && req.user.Customer) {
          wasUserReserved = schedule.BookedSchedules.some(
            bs => bs.CustomerID === req.user?.Customer.CustomerID
          );
          isUserGoing = beingAttendedSchedules.some(
            bs => bs.CustomerID === req.user.Customer.CustomerID
          );
          schedule.attendanceCount = beingAttendedSchedules.length; // [Zmienione] – nowa właściwość
        }
        schedule.Attendance = beingAttendedSchedules.length;
        schedule.isUserGoing = isUserGoing;
        schedule.wasUserReserved = wasUserReserved;
        schedule.full = beingAttendedSchedules.length >= schedule.Capacity;
      }
      // [Zmienione] Ustalanie statusu terminu (jak w działającym kodzie)
      const scheduleDateTime = new Date(
        `${schedule.Date}T${schedule.StartTime}:00`
      );
      const now = new Date();
      schedule.isCompleted = scheduleDateTime <= now;

      // Zwracamy pełen obiekt użytkownika (zgodnie z działającym kodem)
      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        message: 'Termin pobrany pomyślnie',
        schedule,
        user: req.user,
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
export const getProductSchedules = (req, res, next) => {
  const controllerName = 'getProductSchedulesByID';
  console.log(`\n➡️➡️➡️ admin called`, controllerName);

  const productID = req.params.pId;
  const customerID = req.params.cId;

  // find all schedule for chosen Product
  models.ScheduleRecord.findAll({ where: { ProductID: productID } })
    .then(foundSchedules => {
      //find all bookings for given customer
      return models.BookedSchedule.findAll({
        where: { CustomerID: customerID },
      }).then(bookedByCustomerSchedules => {
        // filter bookings which have not been booked yet by him
        const filteredSchedules = foundSchedules.filter(foundSchedule => {
          return !bookedByCustomerSchedules.some(
            bs => bs.ScheduleID == foundSchedule.ScheduleID
          );
        });
        return filteredSchedules;
      });
    })
    .then(filteredFoundSchedules => {
      successLog(person, controllerName);
      res.status(200).json({
        confirmation: 1,
        message: 'Terminy pobrane pomyślnie.',
        content: filteredFoundSchedules,
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
export const getBookedSchedules = (req, res, next) => {};
//@ POST
export const postCreateScheduleRecord = (req, res, next) => {
  const controllerName = 'postCreateScheduleRecord';
  callLog(person, controllerName);
  const {
    productID,
    date,
    capacity,
    location,
    startTime,
    repeatCount,
    shouldRepeat,
  } = req.body;
  const inputsContent = [
    date,
    capacity,
    location,
    startTime,
    repeatCount || 1,
    shouldRepeat,
  ];

  let currentDate = new Date(`${date}T${startTime}`);

  inputsContent.forEach(inputValue => {
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
      { transaction }
    ).then(record => {
      successLog(person, controllerName, `created for: ${currentDate}`);
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

  db.transaction(t => {
    return createRecord(0, currentDate, [], t);
  })
    .then(createdRecords => {
      successLog(person, controllerName);
      res.status(201).json({
        confirmation: 1,
        message: 'Terminy utworzone pomyślnie.',
        records: createdRecords,
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
//@ PUT
export const putEditSchedule = async (req, res, next) => {
  const controllerName = 'putEditSchedule';
  callLog(person, controllerName);

  const scheduleId = req.params.id;

  console.log(`❗❗❗req.body`, req.body);
  const {
    capacity: newCapacity,
    date: newStartDate,
    startTime: newStartTime,
    location: newLocation,
  } = req.body;

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
    console.log('\n❌❌❌ Error putEditSchedule:', 'No enough data');
    throw new Error('Nie podano wszystkich danych.');
  }

  models.ScheduleRecord.findByPk(scheduleId)
    .then(schedule => {
      if (!schedule) {
        errCode = 404;
        throw new Error('Nie znaleziono danych terminu.');
      }
      successLog(person, controllerName, 'fetched');

      return schedule;
    })
    .then(foundSchedule => {
      const {
        Capacity,
        Date: scheduleDate,
        Location,
        StartTime,
      } = foundSchedule;
      if (
        new Date(`${foundSchedule.Date}T${foundSchedule.StartTime}:00`) <
        new Date()
      ) {
        errCode = 400;
        console.log('\n❓❓❓ Admin schedule is past - not to edit');
        throw new Error('Nie można edytować minionego terminu.');
      } else if (
        Capacity == newCapacity &&
        scheduleDate === newStartDate &&
        Location === newLocation &&
        StartTime === newStartTime
      ) {
        // Nothing changed
        console.log('\n❓❓❓ Admin schedule no change');
        res.status(200).json({ confirmation: 0, message: 'Brak zmian' });
        return null;
      }
      return foundSchedule;
    })
    .then(fetchedSchedule => {
      if (!fetchedSchedule) return;
      models.ScheduleRecord.update(
        {
          Capacity: newCapacity,
          Date: newStartDate,
          StartTime: newStartTime,
          Location: newLocation,
        },
        { where: { ScheduleID: scheduleId } }
      )
        .then(scheduleResult => {
          return { scheduleResult };
        })
        .then(results => {
          successLog(person, controllerName);
          const affectedScheduleRows = results.scheduleResult[0];
          const status = affectedScheduleRows >= 1;
          return res.status(200).json({
            message: 'Termin zaktualizowany pomyślnie.',
            confirmation: status,
            affectedScheduleRows,
          });
        })
        .catch(err => catchErr(res, errCode, err, controllerName));
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
//@ DELETE
export const deleteSchedule = (req, res, next) => {
  const controllerName = 'deleteSchedule';
  callLog(person, controllerName);
  const id = req.params.id;
  console.log(`${controllerName} deleting id: `, id);

  models.ScheduleRecord.findOne({
    where: {
      ScheduleID: id,
    },
  })
    .then(foundSchedule => {
      if (!foundSchedule) {
        errCode = 404;
        console.log(
          `\n❌❌❌ Error Admin ${controllerName} Schedule to delete not found.`
        );
        throw new Error('Nie znaleziono terminu do usunięcia.');
      } else if (
        new Date(`${foundSchedule.Date}T${foundSchedule.StartTime}:00`) <
        new Date()
      ) {
        errCode = 400;
        console.log(
          `\n❌❌❌ Error Admin ${controllerName} Schedule is passed - can't be deleted.`
        );
        throw new Error(
          'Nie można usunąć terminu który już minął. Posiada też wartość historyczną dla statystyk.'
        );
      }

      return models.BookedSchedule.findOne({
        where: { ScheduleID: id },
      }).then(foundRecord => {
        if (foundRecord) {
          errCode = 409;
          console.log(
            `\n❌❌❌ Error Admin ${controllerName} Schedule is booked - can't be deleted.`
          );
          throw new Error(
            'Nie można usunąć terminu, który posiada rekordy obecności (obecny/anulowany). Najpierw USUŃ rekordy obecności w konkretnym terminie.'
          );
        }
        return foundSchedule.destroy();
      });
    })
    .then(deletedCount => {
      if (!deletedCount) {
        errCode = 404;
        console.log(
          `\n❌❌❌ Error Admin ${controllerName} Schedule not deleted.`
        );
        throw new Error('Nie usunięto terminu.');
      }
      successLog(person, controllerName);
      return res
        .status(200)
        .json({ confirmation: 1, message: 'Termin usunięty pomyślnie.' });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};

//! ATTENDANCE_____________________________________________
//@ GET
//@ POST
//@ PUT
export const putEditMarkAbsent = (req, res, next) => {
  const controllerName = 'putEditMarkAbsent';
  callLog(person, controllerName);

  const { attendanceCustomerID, attendanceBookingID, product } = req.body;
  let currentScheduleRecord, customerEmail;

  // Find schedule
  models.BookedSchedule.findOne({
    where: { CustomerID: attendanceCustomerID, BookingID: attendanceBookingID },
    include: [
      {
        model: models.ScheduleRecord,
        required: true,
      },
    ],
  })
    .then(foundRecord => {
      if (!foundRecord) {
        errCode = 404;
        throw new Error('Nie znaleziono rekordu obecności w dzienniku.');
      }
      // Assign for email data
      currentScheduleRecord = foundRecord.ScheduleRecord;

      // Find the customer for email address
      return models.Customer.findByPk(attendanceCustomerID, {
        include: [{ model: models.User, attributes: ['Email'] }],
      });
    })
    .then(customer => {
      if (!customer || !customer.User) {
        errCode = 404;
        throw new Error('Nie znaleziono użytkownika przypisanego do klienta.');
      }
      // Assign for email data
      customerEmail = customer.User.Email;

      // Finally update attendance
      return models.BookedSchedule.update(
        {
          Attendance: 0,
          DidAction: person,
        },
        {
          where: {
            CustomerID: attendanceCustomerID,
            BookingID: attendanceBookingID,
          },
        }
      );
    })
    .then(() => {
      // Send confirmation email
      sendAttendanceMarkedAbsentMail({
        to: customerEmail,
        productName: product,
        date: currentScheduleRecord.Date,
        startTime: currentScheduleRecord.StartTime,
        location: currentScheduleRecord.Location,
      });

      successLog(person, controllerName);
      // Send confirmation to frontend
      return res.status(200).json({
        confirmation: 1,
        message: 'Uczestnik oznaczony jako nieobecny.',
        affectedRows: 2,
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
export const putEditMarkPresent = (req, res, next) => {
  const controllerName = 'putEditMarkPresent';
  callLog(person, controllerName);

  const { cancelledAttendanceCustomerID, cancelledAttendanceBookingID } =
    req.body;

  let currentScheduleRecord, customerEmail;

  // Find schedule
  models.BookedSchedule.findOne({
    where: {
      CustomerID: cancelledAttendanceCustomerID,
      BookingID: cancelledAttendanceBookingID,
    },
    include: [
      {
        model: models.ScheduleRecord,
        required: true,
      },
    ],
  })
    .then(foundRecord => {
      if (!foundRecord) {
        errCode = 404;
        throw new Error('Nie znaleziono rekordu obecności w dzienniku.');
      }

      // Assign for email data
      currentScheduleRecord = foundRecord.ScheduleRecord;

      // Find the customer for email address
      return models.Customer.findByPk(cancelledAttendanceCustomerID, {
        include: [{ model: models.User, attributes: ['Email'] }],
      });
    })
    .then(customer => {
      if (!customer || !customer.User) {
        errCode = 404;
        throw new Error('Nie znaleziono użytkownika przypisanego do klienta.');
      }

      // Assign for email data
      customerEmail = customer.User.Email;

      // Finally update attendance
      return models.BookedSchedule.update(
        {
          Attendance: 1,
          DidAction: person,
        },
        {
          where: {
            CustomerID: cancelledAttendanceCustomerID,
            BookingID: cancelledAttendanceBookingID,
          },
        }
      );
    })
    .then(updatedRecord => {
      // Send confirmation email
      sendAttendanceReturningMail({
        to: customerEmail,
        productName: currentScheduleRecord?.ProductName || '',
        date: currentScheduleRecord.Date,
        startTime: currentScheduleRecord.StartTime,
        location: currentScheduleRecord.Location,
      });

      successLog(person, controllerName);
      const status = updatedRecord ? true : false;
      // Send confirmation to frontend
      return res.status(200).json({
        confirmation: status,
        message: 'Uczestnik oznaczony jako obecny.',
        affectedRows: status ? 1 : 0,
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
//@ DELETE
export const deleteAttendanceRecord = (req, res, next) => {
  const controllerName = 'deleteAttendanceRecord';
  callLog(person, controllerName);

  const { attendanceCustomerID, attendanceBookingID } = req.body;

  // Find booking to get info for email as well
  models.BookedSchedule.findOne({
    where: { CustomerID: attendanceCustomerID, BookingID: attendanceBookingID },
    include: [
      {
        model: models.ScheduleRecord,
        required: true,
      },
      {
        model: models.Customer,
        required: true,
        include: [
          {
            model: models.User,
            attributes: ['Email'],
          },
        ],
      },
    ],
  })
    .then(foundRecord => {
      if (!foundRecord) {
        // No attendance found
        errCode = 404;
        throw new Error('Nie znaleziono rekordu obecności w dzienniku.');
      }

      const { ScheduleRecord, Customer } = foundRecord;
      const to = Customer.User.Email;

      // Send confirmation
      sendAttendanceRecordDeletedMail({
        to,
        productName: ScheduleRecord?.ProductName || 'Zajęcia',
        date: ScheduleRecord.Date,
        startTime: ScheduleRecord.StartTime,
        location: ScheduleRecord.Location,
        isAdmin: true,
      });

      // Return deleted number
      return foundRecord.destroy();
    })
    .then(deleted => {
      if (!deleted) {
        errCode = 404;
        throw new Error('Nie usunięto rekordu.');
      }

      // Confirmation for frontend
      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        message: 'Rekord obecności usunięty.',
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};

//! FEEDBACK_____________________________________________
//@ GET
export const getAllParticipantsFeedback = (req, res, next) => {
  const controllerName = 'getAllParticipantsFeedback';
  callLog(person, controllerName);

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
            [
              Sequelize.literal("CONCAT(FirstName, ' ', LastName)"),
              'Imię Nazwisko',
            ],
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
    .then(records => {
      if (!records) {
        errCode = 404;
        throw new Error('Nie znaleziono opinii.');
      }
      // Convert for records for different names
      const formattedRecords = records.map(record => {
        const newRecord = {}; // Container for formatted data
        const attributes = model.getAttributes();
        const jsonRecord = record.toJSON();
        // 🔄 Iterate after each column in user record
        for (const key in jsonRecord) {
          const newKey = columnMap[key] || key; // New or original name if not specified
          const attributeType =
            attributes[key]?.type.constructor.key?.toUpperCase();
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
            newRecord[nameKey] =
              `${jsonRecord[key].Product?.Name} (${jsonRecord[key].ScheduleID})`;
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
      successLog(person, controllerName);
      res.json({
        confirmation: 1,
        message: 'Opinie pobrane pomyślnie',
        isLoggedIn: req.session.isLoggedIn,
        records: records,
        totalHeaders, // To render
        content: formattedRecords, // With new names
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
export const getAllParticipantsFeedbackByID = (req, res, next) => {
  console.log(`\n➡️ admin called getAllParticipantsFeedbackByID`);

  const PK = req.params.id;
  models.Feedback.findByPk(PK, {
    include: [
      {
        model: models.Customer,
        attributes: { exclude: [] },
      },
      {
        model: models.ScheduleRecord,
        attributes: { exclude: ['ProductID'] },
        include: [
          {
            model: models.Product,
            attributes: { exclude: [] },
          },
        ],
      },
    ],
    attributes: { exclude: ['CustomerID', 'ScheduleID'] },
  })
    .then(review => {
      if (!review) {
        errCode = 404;
        throw new Error('Nie znaleziono opinii.');
      }
      const customerId = review.Customer.CustomerID;

      return models.Feedback.findAll({
        where: {
          CustomerID: customerId,
          // op from sequelize means not equal
          FeedbackID: { [Op.ne]: PK },
        },
        include: [
          {
            model: models.ScheduleRecord,
            attributes: { exclude: ['ProductID'] },
            include: [
              {
                model: models.Product,
                attributes: { exclude: [] },
              },
            ],
          },
        ],
        attributes: { exclude: ['CustomerID', 'ScheduleID'] },
      }).then(otherReviews => {
        successLog(person, controllerName);
        return res.status(200).json({
          confirmation: 1,
          message: 'Opinia pobrana pomyślnie',
          isLoggedIn: req.session.isLoggedIn,
          review,
          otherReviews,
        });
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
//@ POST
//@ PUT
//@ DELETE
export const deleteFeedback = (req, res, next) => {
  const controllerName = 'deleteFeedback';
  callLog(person, controllerName);

  const id = req.params.id;
  models.Feedback.destroy({
    where: {
      FeedbackID: id,
    },
  })
    .then(deletedCount => {
      if (!deletedCount) {
        errCode = 404;
        throw new Error('Nie usunięto opinii.');
      }
      successLog(person, controllerName);
      return res
        .status(200)
        .json({ confirmation: 1, message: 'Opinia usunięta pomyślnie.' });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};

//! NEWSLETTERS_____________________________________________
//@ GET
export const getAllNewsletters = (req, res, next) => {
  const controllerName = 'getAllNewsletters';
  callLog(person, controllerName);

  simpleListAllToTable(res, models.Newsletter);
};
export const getAllSubscribedNewsletters = (req, res, next) => {
  simpleListAllToTable(res, models.SubscribedNewsletter);
};
//@ POST
//@ PUT
//@ DELETE

//! PRODUCTS_____________________________________________
//@ GET
export const getAllProducts = (req, res, next) => {
  const controllerName = 'getAllProducts';
  callLog(person, controllerName);
  simpleListAllToTable(res, models.Product);
};
export const getProductByID = (req, res, next) => {
  const controllerName = 'getProductByID';
  callLog(person, controllerName);

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
                attributes: { exclude: ['UserID'] },
              },
            ],
          },
          {
            model: models.Feedback,
            required: false,
            include: [
              {
                model: models.Customer,
                attributes: { exclude: ['UserID'] },
              },
            ],
            attributes: { exclude: ['CustomerID'] },
          },
        ],
        attributes: {
          exclude: ['ProductID'],
        },
      },
    ],
  })
    .then(product => {
      if (!product) {
        errCode = 404;
        throw new Error('Nie znaleziono produktu.');
      }
      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        message: 'Produkt pobrany pomyślnie pomyślnie.',
        isLoggedIn: req.session.isLoggedIn,
        product,
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
//@ POST
export const postCreateProduct = async (req, res, next) => {
  const controllerName = 'postCreateProduct';
  callLog(person, controllerName);

  const { name, productType, StartDate, duration, location, price, status } =
    req.body;

  let productPromise;
  models.Product.findOne({ where: { Name: name } })
    .then(product => {
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
    .then(newProduct => {
      successLog(person, controllerName);
      return res.status(200).json({
        code: 200,
        confirmation: 1,
        message: 'Stworzono pomyślnie.',
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName, { code: 409 }));
};
//@ PUT
export const putEditProduct = async (req, res, next) => {
  const controllerName = 'putEditProduct';
  callLog(person, controllerName);
  const productId = req.params.id;

  const {
    type: newType,
    date: newStartDate,
    location: newLocation,
    duration: newDuration,
    price: newPrice,
    status: newStatus,
  } = req.body;
  console.log('❗❗❗ req.body ', req.body);
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
    console.log('\n❌❌❌ Error putEditProduct:', 'No enough data');
    errCode = 400;
    throw new Error('Nie podano wszystkich danych.');
  }

  models.Product.findByPk(productId)
    .then(product => {
      if (!product) {
        errCode = 404;
        throw new Error('Nie znaleziono danych uczestnika.');
      }
      successLog(person, controllerName, 'fetched');
      return product;
    })
    .then(foundProduct => {
      const { Type, StartDate, Location, Duration, Price, Status } =
        foundProduct;
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
        res.status(200).json({
          confirmation: 0,
          message: 'Brak zmian',
        });
        return null;
      }
      return foundProduct;
    })
    .then(fetchedProduct => {
      if (!fetchedProduct) return;
      models.Product.update(
        {
          Type: newType,
          StartDate: newStartDate,
          Location: newLocation,
          Duration: newDuration,
          Price: newPrice,
          Status: newStatus,
        },
        { where: { ProductID: productId } }
      )
        .then(productResult => {
          return { productResult };
        })
        .then(results => {
          successLog(person, controllerName);
          const affectedProductRows = results.productResult[0];
          const status = affectedProductRows >= 1;
          return res.status(200).json({
            confirmation: status,
            message: 'Zmiany zaakceptowane.',
            affectedProductRows,
          });
        })
        .catch(err => catchErr(res, errCode, err, controllerName));
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
//@ DELETE
export const deleteProduct = (req, res, next) => {
  const controllerName = 'deleteProduct';
  callLog(person, controllerName);

  const id = req.params.id;
  models.Product.destroy({
    where: {
      ProductID: id,
    },
  })
    .then(deletedCount => {
      if (!deletedCount) {
        errCode = 404;
        throw new Error('Nie usunięto zajęć.');
      }
      successLog(person, controllerName);
      return res
        .status(200)
        .json({ confirmation: 1, message: 'Produkt usunięty pomyślnie.' });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};

//! BOOKINGS_____________________________________________
//@ GET
export const getAllBookings = (req, res, next) => {
  const controllerName = 'getAllBookings';
  callLog(person, controllerName);
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
            [
              Sequelize.literal("CONCAT(FirstName, ' ', LastName)"),
              'Imię Nazwisko',
            ],
          ],
        },
        {
          model: models.ScheduleRecord,
          through: { model: models.BookedSchedule }, // M:N relation
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
    .then(records => {
      if (!records) {
        errCode = 404;
        throw new Error('Nie znaleziono rezerwacji.');
      }
      const formattedRecords = records.map(record => {
        const attributes = model.getAttributes();
        const newRecord = {};
        const jsonRecord = record.toJSON();

        // Konwersja pól na poprawne nazwy
        for (const key in jsonRecord) {
          const attributeType =
            attributes[key]?.type.constructor.key?.toUpperCase();
          const newKey = columnMap[key] || key;
          if (['DATE', 'DATEONLY', 'DATETIME'].includes(attributeType)) {
            newRecord[newKey] = jsonRecord[key];
          } else if (key === 'Customer') {
            const customer = jsonRecord[key]['Imię Nazwisko'];
            const customerID = jsonRecord.CustomerID;
            newRecord[newKey] = `${customer} (${customerID})`;
          } else if (key === 'ScheduleRecords') {
            const products = jsonRecord[key]
              .map(
                sr => `${sr.Product?.Name} (${sr.BookedSchedule?.ScheduleID})`
              )
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

      const totalHeaders = keysForHeaders;
      req.session.isLoggedIn = true;
      successLog(person, controllerName);
      res.json({
        confirmation: 1,
        message: 'Rezerwacje pobrane pomyślnie.',
        isLoggedIn: req.session.isLoggedIn,
        totalHeaders,
        records: records,
        content: formattedRecords.sort(
          (a, b) =>
            new Date(b['Data Rezerwacji']) - new Date(a['Data Rezerwacji'])
        ),
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
export const getBookingByID = (req, res, next) => {
  const controllerName = 'getBookingByID';
  callLog(person, controllerName);

  const PK = req.params.id;
  models.Booking.findByPk(PK, {
    through: { attributes: [] }, // omit data from mid table
    required: false,
    attributes: {
      exclude: ['Product', 'CustomerID'],
    },
    include: [
      {
        model: models.Customer,
        attributes: { exclude: [] },
      },
      {
        model: models.ScheduleRecord,
        attributes: { exclude: ['UserID'] },
        through: { attributes: [] }, // omit data from mid table
        include: [
          {
            model: models.Product,
            attributes: { exclude: [] },
          },
        ],
      },
    ],
  })
    .then(booking => {
      if (!booking) {
        errCode = 404;
        throw new Error('Nie znaleziono rezerwacji.');
      }
      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        message: 'Rezerwacja pobrana pomyślnie.',
        isLoggedIn: req.session.isLoggedIn,
        booking,
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
//@ POST
export const postCreateBooking = (req, res, next) => {
  const controllerName = 'postCreateBooking';
  callLog(person, controllerName);

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
  let currentScheduleRecord;
  let customerEmail;
  let isNewCustomer = false;
  db.transaction(t => {
    // Fetch schedule and lock it for other paralele transactions
    return models.ScheduleRecord.findOne({
      where: { ScheduleID: scheduleID }, //from mutation
      transaction: t,
      lock: t.LOCK.UPDATE, //@
    })

      .then(scheduleRecord => {
        if (!scheduleRecord) {
          errCode = 404;
          throw new Error('Nie znaleziono terminu');
        }
        currentScheduleRecord = scheduleRecord;
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
          where: { ScheduleID: scheduleID, Attendance: 1 },
          transaction: t,
          lock: t.LOCK.UPDATE, //@
        }).then(currentAttendance => {
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
                where: { ScheduleID: scheduleID },
                through: {
                  attributes: [
                    'Attendance',
                    'CustomerID',
                    'BookingID',
                    'ScheduleID',
                  ],
                  where: { CustomerID: customerID },
                },
                required: true,
              },
            ],
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        });
      })
      .then(existingBooking => {
        if (existingBooking) {
          //! assuming single schedule/booking
          throw new Error(
            'Uczestnik już rezerwował ten termin. Można mu ewentualnie poprawić obecność w zakładce wspomnianego terminu w "Grafik" w panelu admina.'
          );
        } else {
          // booking doesn't exist - create new one
          const amountDueCalculated =
            parseFloat(productPrice) - parseFloat(amountPaid);
          const statusDeduced =
            amountDueCalculated <= 0 ? 'w pełni' : 'Częściowo';
          const paymentMethodDeduced =
            paymentMethod == 1
              ? 'Gotówka (M)'
              : paymentMethod == 2
                ? 'BLIK (M)'
                : 'Przelew (M)';

          models.Customer.findByPk(customerID, {
            include: [{ model: models.User, attributes: ['Email'] }],
            required: true,
          }).then(customer => (customerEmail = customer.User.Email));

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
            { transaction: t }
          ).then(booking => {
            sendReservationFreshMail({
              to: customerEmail,
              productName: productName,
              date: currentScheduleRecord.Date,
              startTime: currentScheduleRecord.StartTime,
              location: currentScheduleRecord.Location,
            });

            // After creating the reservation, we connected addScheduleRecord which was generated by Sequelize for many-to-many relationship between reservation and ScheduleRecord. The method adds entry to intermediate table (booked_schedules) and connects created reservation with schedule feeder (ScheduleRecord).
            return booking
              .addScheduleRecord(scheduleID, {
                through: { CustomerID: customerID, DidAction: person },
                transaction: t,
                individualHooks: true,
              })
              .then(() => booking);
          });
        }
      });
  })
    .then(booking => {
      successLog(person, controllerName);
      res.status(201).json({
        isNewCustomer,
        confirmation: 1,
        message: 'Rezerwacja utworzona pomyślnie.',
        booking,
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
//@ PUT
//@ DELETE
export const deleteBooking = (req, res, next) => {
  const controllerName = 'deleteBooking';
  callLog(person, controllerName);

  const id = req.params.id;

  // First - find the targeted booking with attached customer and user for email
  return models.Booking.findOne({
    where: { BookingID: id },
    include: [
      {
        model: models.Customer,
        include: [{ model: models.User, attributes: ['Email'] }],
      },
    ],
  })
    .then(booking => {
      if (!booking) {
        errCode = 404;
        throw new Error('\n❌ Nie znaleziono rezerwacji.');
      }

      // Assign email
      const customerEmail = booking.Customer?.User?.Email;

      // Send email before deletion
      sendReservationCancelledMail({
        to: customerEmail,
        bookingID: booking.BookingID,
      });

      // Now delete
      return models.Booking.destroy({
        where: { BookingID: id },
      });
    })
    .then(deletedCount => {
      if (!deletedCount) {
        errCode = 500;
        throw new Error('\n❌ Wystąpił problem przy usuwaniu rezerwacji.');
      }

      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        message: 'Rezerwacja usunięta pomyślnie.',
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
// export const deleteBooking = (req, res, next) => {
//   const controllerName = 'deleteBooking';
//   callLog(person, controllerName);

//   const id = req.params.id;
//   return models.Booking.destroy({
//     where: {
//       BookingID: id,
//     },
//   })
//     .then(deletedCount => {
//       if (!deletedCount) {
//         errCode = 404;
//         throw new Error('\n❌ Nie usunięto rezerwacji.');
//       }

//       sendReservationCancelledMail({to:,bookingID:})

//       successLog(person, controllerName);
//       return res.status(200).json({
//         confirmation: 1,
//         message: 'Rezerwacja usunięta pomyślnie.',
//       });
//     })
//     .catch(err => catchErr(res, errCode, err, controllerName));
// };

//! INVOICES_____________________________________________
//@ GET
export const getAllInvoices = (req, res, next) => {
  const controllerName = 'getAllInvoices';
  callLog(person, controllerName);

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
    .then(records => {
      if (!records) {
        errCode = 404;
        throw new Error('Nie znaleziono faktur.');
      }
      // Convert for records for different names
      const formattedRecords = records.map(record => {
        const newRecord = {}; // Container for formatted data
        const attributes = model.getAttributes();
        const jsonRecord = record.toJSON();
        // 🔄 Iterate after each column in user record
        for (const key in jsonRecord) {
          const newKey = columnMap[key] || key; // New or original name if not specified
          const attributeType =
            attributes[key]?.type.constructor.key.toUpperCase(); // check type
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
      successLog(person, controllerName);
      res.json({
        confirmation: 1,
        message: 'Faktury pobrane pomyślnie.',
        isLoggedIn: req.session.isLoggedIn,
        totalHeaders, // To render
        content: formattedRecords, // With new names
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
//@ POST
//@ PUT
//@ DELETE
