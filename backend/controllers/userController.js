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
    let PK = req.user.Customer.customerId;
    return models.Customer.findByPk(PK, {
      include: [
        {
          model: models.User, // Add Customer
          required: false, // May not exist
          include: [
            {
              model: models.UserPrefSetting, // Customer phone numbers
              required: false,
              attributes: {
                exclude: ['userId'], // deleting
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
                exclude: ['paymentId'], // deleting
              },
            },
          ],
          where: { customerId: req.user.Customer.customerId },
          attributes: {
            exclude: ['productId', 'customerId'], // deleting
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
                  where: { customerId: req.user.Customer.customerId }, // but only for particular customer
                  attributes: {
                    exclude: ['customerId', 'scheduleId'], // deleting
                  },
                },
              ],
              attributes: {
                exclude: ['productId'], // deleting
              },
            },
          ],
          attributes: {
            exclude: ['customerId', 'scheduleId'], // deleting
          },
        },
      ],
      attributes: {
        exclude: ['userId'], // deleting
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
  const PK = req.user.UserPrefSetting?.userPrefId;

  models.UserPrefSetting.findByPk(PK)
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

  const userId = req.user.userId;

  const { handedness, font, notifications, animation, theme } = req.body;
  // console.log(`❗❗❗`, req.body);

  // if preferences don't exist - create new ones:
  models.UserPrefSetting.findOrCreate({
    where: { userId: userId },
    defaults: {
      userId: userId,
      handedness: !!handedness || false,
      fontSize: parseInt(font) || 14,
      notifications: !!notifications || false,
      animation: !!animation || false,
      theme: !!theme || false,
    },
  })
    .then(([preferences, created]) => {
      if (!created) {
        // Nothing changed
        if (
          preferences.handedness == !!handedness &&
          preferences.fontSize == parseInt(font) &&
          preferences.notifications == !!notifications &&
          preferences.animation == !!animation &&
          preferences.theme == !!theme
        ) {
          // Nothing changed
          console.log('\n❓❓❓ User putEditSettings no change');
          res.status(200).json({ confirmation: 0, message: 'Brak zmian' });
          return null;
        } else {
          // Update
          preferences.handedness = !!handedness;
          preferences.fontSize = parseInt(font);
          preferences.notifications = !!notifications;
          preferences.animation = !!animation;
          preferences.theme = !!theme;
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
          attributes: ['type', 'name', 'price'],
        },
        {
          model: models.Payment,
          required: false,
          attributes: ['paymentId'], //payment Id is enough
          through: {
            attributes: ['attendance', 'customerId'], // dołącz dodatkowe atrybuty
          },

          // where: isUser && isCustomer ? {customerId: req.user.Customer.customerId} : undefined, // Filter
        },
      ],
      attributes: {
        exclude: ['productId'], // Deleting substituted ones
      },
      where: Sequelize.where(
        fn(
          'CONCAT',
          col('ScheduleRecord.date'),
          'T',
          col('ScheduleRecord.start_time'),
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
            newRecord['Typ'] = jsonRecord[key].type; //  flatten object
            newRecord['Nazwa'] = jsonRecord[key].name;
          } else if (key === 'Payments') {
            newRecord.wasUserReserved = jsonRecord.Payments.some(
              payment =>
                payment.Booking.customerId === req.user?.Customer?.customerId
            );
            newRecord.isUserGoing = jsonRecord.Payments.some(payment => {
              const isBooked = payment.Booking;
              const customerId = payment.Booking.customerId;
              const loggedInID = req.user?.Customer?.customerId;
              const isGoing =
                payment.Booking.attendance === 1 ||
                payment.Booking.attendance === true;

              return isBooked && customerId == loggedInID && isGoing;
            });
          } else {
            newRecord[newKey] = jsonRecord[key]; // Assignment
          }
        }
        // console.log(jsonRecord);
        const activePayments = jsonRecord.Payments.filter(
          payment =>
            payment.Booking &&
            (payment.Booking.attendance === 1 ||
              payment.Booking.attendance === true)
        );
        newRecord['Dzień'] = getWeekDay(jsonRecord['date']);
        newRecord['Zadatek'] = jsonRecord.Product.price;
        newRecord[
          'Miejsca'
        ] = `${activePayments.length}/${jsonRecord.capacity}`;
        newRecord.full = activePayments.length >= jsonRecord.capacity;
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
      schedule.attendance = 0;
      schedule.full = false;
      // We substitute payments content for security
      if (schedule.Bookings && schedule.Bookings?.length > 0) {
        let wasUserReserved;
        const beingAttendedSchedules = schedule.Bookings.filter(
          schedule => schedule.attendance == 1 || schedule.attendance == true
        );
        if (isUser && isCustomer) {
          wasUserReserved = schedule.Bookings.some(
            booking => booking.customerId === req.user?.Customer.customerId
          );
          isUserGoing = beingAttendedSchedules.some(
            booking => booking.customerId === req.user.Customer.customerId
          );
          schedule.Bookings = beingAttendedSchedules.length;
        }
        schedule.attendance = beingAttendedSchedules.length;
        schedule.isUserGoing = isUserGoing;
        schedule.wasUserReserved = wasUserReserved;
        schedule.full = beingAttendedSchedules.length >= schedule.capacity;
      }

      successLog(person, controllerName);
      return res.status(200).json({ schedule, user: req.user });
      // return res.status(200).json({schedule});
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
