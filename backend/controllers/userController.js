import { Op, Sequelize, col, fn } from 'sequelize';
import * as models from '../models/_index.js';
import columnMaps from '../utils/columnsMapping.js';
import { formatIsoDateTime, getWeekDay } from '../utils/dateUtils.js';
import {
  callLog,
  catchErr,
  errorCode,
  successLog,
} from '../utils/loggingUtils.js';
let errCode = errorCode;
const person = 'User';

//! USER_____________________________________________
//@ GET
export const getAccount = (req, res, next) => {
  const controllerName = 'getAccount';
  callLog(req, person, controllerName);

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
    return res.status(200).json({
      confirmation: 1,
      message: 'Profil uczestnika pobrany pomyślnie.',
      user,
    });
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
          model: models.Payment, // His reservations
          required: false,
          include: [
            {
              model: models.Invoice, // eventual invoices
              required: false,
              attributes: {
                exclude: ['PaymentID'], // deleting
              },
            },
          ],
          where: { CustomerID: req.user.Customer.CustomerID },
          attributes: {
            exclude: ['ProductID', 'CustomerID'], // deleting
          },
        },
        {
          model: models.Booking,
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
          throw new Error('Nie pobrano danych uczestnika.');
        }
        console.log('\n✅✅✅ showAccount customer fetched');
        return res.status(200).json({
          customer,
          confirmation: 1,
          message: 'Profil uczestnika pobrany pomyślnie.',
        });
      })
      .catch(err => catchErr(person, res, errCode, err, controllerName));
  }
};
export const getSettings = (req, res, next) => {
  const controllerName = 'getSettings';
  callLog(req, person, controllerName);
  const PK = req.user.UserPrefSetting?.UserPrefID;

  models.UserPrefSettings.findByPk(PK)
    .then(preferences => {
      if (!preferences) {
        errCode = 404;
        successLog(person, controllerName, 'default');
        return res.status(200).json({
          confirmation: 1,
          message: 'Ustawienia domyślne.',
          preferences,
        });
        // throw new Error('Nie pobrano ustawień.');
      }
      successLog(person, controllerName, 'custom');
      return res.status(200).json({
        confirmation: 1,
        message: 'Ustawienia pobrana pomyślnie.',
        preferences,
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//@ PUT
export const putEditSettings = (req, res, next) => {
  const controllerName = 'putEditSettings';
  callLog(req, person, controllerName);

  const userID = req.user.UserID;

  const { handedness, font, notifications, animation, theme } = req.body;
  // console.log(`❗❗❗`, req.body);

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
          console.log('\n❓❓❓ User putEditSettings no change');
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
              message: 'Ustawienia zostały zaktualizowane',
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
    .catch(err =>
      catchErr(person, res, errCode, err, controllerName, { code: 409 })
    );
};

//! SCHEDULES_____________________________________________
//@ GET
export const getAllSchedules = (req, res, next) => {
  const controllerName = 'getAllSchedules';
  callLog(req, person, controllerName);

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
          model: models.Payment,
          required: false,
          attributes: ['PaymentID'], //payment Id is enough
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
          ':00'
        ),
        { [Op.gte]: now.toISOString() }
      ),
    })
    .then(records => {
      if (!records) {
        errCode = 404;
        throw new Error('Nie znaleziono terminów.');
      }
      // Convert for records for different names
      const formattedRecords = records.map(record => {
        const newRecord = {}; // Container for formatted data

        const attributes = model.getAttributes();
        const jsonRecord = record.toJSON();
        // console.log('jsonRecord', jsonRecord);

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
            newRecord[newKey] = formatIsoDateTime(jsonRecord[key], true);
          } else if (key === 'Product' && jsonRecord[key]) {
            newRecord['Typ'] = jsonRecord[key].Type; //  flatten object
            newRecord['Nazwa'] = jsonRecord[key].Name;
          } else if (key === 'Payments') {
            newRecord.wasUserReserved = jsonRecord.Payments.some(
              payment =>
                payment.Booking.CustomerID === req.user?.Customer?.CustomerID
            );
            newRecord.isUserGoing = jsonRecord.Payments.some(payment => {
              const isBooked = payment.Booking;
              const customerID = payment.Booking.CustomerID;
              const loggedInID = req.user?.Customer?.CustomerID;
              const isGoing =
                payment.Booking.Attendance === 1 ||
                payment.Booking.Attendance === true;

              return isBooked && customerID == loggedInID && isGoing;
            });
          } else {
            newRecord[newKey] = jsonRecord[key]; // Assignment
          }
        }
        // console.log(jsonRecord);
        const activePayments = jsonRecord.Payments.filter(
          payment =>
            payment.Booking &&
            (payment.Booking.Attendance === 1 ||
              payment.Booking.Attendance === true)
        );
        newRecord['Dzień'] = getWeekDay(jsonRecord['Date']);
        newRecord['Zadatek'] = jsonRecord.Product.Price;
        newRecord[
          'Miejsca'
        ] = `${activePayments.length}/${jsonRecord.Capacity}`;
        newRecord.full = activePayments.length >= jsonRecord.Capacity;
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
      successLog(person, controllerName);
      res.json({
        confirmation: 1,
        message: 'Terminy pobrane pomyślnie.',
        totalHeaders, // To render
        content: formattedRecords, // With new names
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
export const getScheduleByID = (req, res, next) => {
  const controllerName = 'getScheduleByID';
  callLog(req, person, controllerName);

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
        model: models.Booking,
        required: false,
      },
    ],
  })
    .then(scheduleData => {
      if (!scheduleData) {
        errCode = 404;
        throw new Error('Nie znaleziono terminu.');
      }

      // Convert to JSON
      const schedule = scheduleData.toJSON();
      let isUserGoing = false;
      schedule.Attendance = 0;
      schedule.full = false;
      // We substitute payments content for security
      if (schedule.Bookings && schedule.Bookings?.length > 0) {
        let wasUserReserved;
        const beingAttendedSchedules = schedule.Bookings.filter(
          schedule => schedule.Attendance == 1 || schedule.Attendance == true
        );
        if (isUser && isCustomer) {
          wasUserReserved = schedule.Bookings.some(
            booking => booking.CustomerID === req.user?.Customer.CustomerID
          );
          isUserGoing = beingAttendedSchedules.some(
            booking => booking.CustomerID === req.user.Customer.CustomerID
          );
          schedule.Bookings = beingAttendedSchedules.length;
        }
        schedule.Attendance = beingAttendedSchedules.length;
        schedule.isUserGoing = isUserGoing;
        schedule.wasUserReserved = wasUserReserved;
        schedule.full = beingAttendedSchedules.length >= schedule.Capacity;
      }

      successLog(person, controllerName);
      return res.status(200).json({ schedule, user: req.user });
      // return res.status(200).json({schedule});
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
