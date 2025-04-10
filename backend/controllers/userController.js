import { Op, Sequelize, col, fn } from 'sequelize';
import * as models from '../models/_index.js';
import { areSettingsChanged } from '../utils/controllersUtils.js';
import { formatIsoDateTime, getWeekDay } from '../utils/dateTimeUtils.js';
import {
  callLog,
  catchErr,
  errorCode,
  successLog,
} from '../utils/debuggingUtils.js';
let errCode = errorCode;
const person = 'User';

//! USER_____________________________________________
//@ GET
export const getAccount = (req, res, next) => {
  const controllerName = 'getAccount';
  callLog(req, person, controllerName);
  let formattedCustomerPasses;

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
          model: models.CustomerPass,
          required: false,
          include: [
            {
              model: models.PassDefinition,
              required: true,
            },
          ],
          where: { customerId: req.user.Customer.customerId },
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
      .then(customerInstance => {
        if (!customerInstance) {
          errCode = 404;
          throw new Error('Nie pobrano danych uczestnika.');
        }
        const customer = customerInstance.toJSON();

        customer.customerPasses = customer.CustomerPasses.map(cp => {
          return {
            rowId: cp.customerPassId,
            customerPassId: cp.customerPassId,
            passName: cp.PassDefinition.name,
            purchaseDate: formatIsoDateTime(cp.purchaseDate),
            validFrom: formatIsoDateTime(cp.validFrom),
            validUntil: formatIsoDateTime(cp.validUntil),
            usesLeft: cp.usesLeft,
            status:
              cp.status == 'active' || cp.status == 1
                ? 'Aktywny'
                : cp.status == 'suspended' || cp.status == 0
                ? 'Zawieszony'
                : 'Wygasły',
          };
        });
        delete customer.CustomerPasses;

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
  const givenSettings = req.body;
  const { handedness, font, notifications, animation, theme } = givenSettings;
  // console.log(`❗❗❗`, req.body);

  // if preferences don't exist - create new ones:
  models.UserPrefSetting.findOrCreate({
    where: { userId: userId },
    defaults: {
      userId: userId,
      handedness: !!handedness || false,
      fontSize: font || 'M',
      notifications: !!notifications || false,
      animation: !!animation || false,
      theme: !!theme || false,
    },
  })
    .then(([preferences, created]) => {
      if (!created) {
        // Nothing changed
        return areSettingsChanged(
          res,
          person,
          controllerName,
          preferences,
          givenSettings
        );
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

  // If logged In and is Customer - we want to check his booked schedules to flag them later
  const now = new Date();
  models.ScheduleRecord.findAll({
    include: [
      {
        model: models.Product,
        attributes: ['type', 'name', 'price'],
      },
      {
        model: models.Booking,
        required: false,
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
      const formattedRecords = records.map(s => {
        // Transform to pure js object - not sequelize instance - to get all known features
        const schedule = s.get({ plain: true });

        const activeBookings = schedule.Bookings?.filter(
          booking => booking.attendance === 1 || booking.attendance === true
        );

        schedule.day = getWeekDay(schedule.date);
        schedule.productType = schedule.Product.type;
        schedule.productName = schedule.Product.name;
        schedule.productPrice = schedule.Product.price;
        schedule.wasUserReserved =
          schedule.Bookings?.some(
            booking => booking.customerId === req.user?.Customer?.customerId
          ) || false;
        schedule.isUserGoing = activeBookings.some(booking => {
          const customerId = booking.customerId;
          const loggedInID = req.user?.Customer?.customerId;

          return customerId == loggedInID;
        });
        schedule.attendance = `${activeBookings?.length}/${schedule.capacity}`;
        schedule.full = activeBookings?.length >= schedule.capacity;
        return schedule; // Return new record object
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
      const totalKeys = [
        '',
        'attendance',
        'date',
        'day',
        'startTime',
        'productType',
        'productName',
        'location',
      ];

      // ✅ Return response to frontend
      successLog(person, controllerName);
      res.json({
        confirmation: 1,
        message: 'Terminy pobrane pomyślnie.',
        totalHeaders, // To render
        totalKeys, // to map to the rows attributes
        content: formattedRecords, // With new names
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
export const getScheduleById = (req, res, next) => {
  const controllerName = 'getScheduleById';
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
