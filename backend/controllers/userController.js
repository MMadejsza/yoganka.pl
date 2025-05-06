import { Op, Sequelize, col, fn } from 'sequelize';
import * as models from '../models/_index.js';
import { areSettingsChanged } from '../utils/controllersUtils.js';
import { createGetById } from '../utils/crudFactory.js';
import { getWeekDay } from '../utils/dateTimeUtils.js';
import {
  callLog,
  catchErr,
  errorCode,
  successLog,
} from '../utils/debuggingUtils.js';
import * as msgs from '../utils/resMessagesUtils.js';
let errCode = errorCode;
const person = 'User';

//! USER_____________________________________________
//@ GET
export const getAccount = (req, res, next) => {
  const controllerName = 'getAccount';
  callLog(req, person, controllerName);
  let formattedBookings;

  // @ Fetching USER
  // check if there is logged in User
  if (!req.user) {
    errCode = 401;
    throw new Error(msgs.notLoggedIn);
  }

  // if only user
  if (!req.user.Customer) {
    const user = req.user;
    console.log('\n✅✅✅ getAccount user fetched');
    return res.status(200).json({
      confirmation: 1,
      message: msgs.customerLoaded,
      user,
    });
  } else {
    let PK = req.user.Customer.customerId;
    return models.Customer.findOne({
      where: { customerId: PK },
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
        },
        {
          model: models.Payment,
          required: false,
          include: [
            {
              model: models.Invoice,
              required: false,
              attributes: {
                exclude: ['paymentId'], // deleting
              },
            },
          ],
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
                  model: models.Product,
                  required: false,
                },
                {
                  model: models.Feedback,
                  required: false,
                  attributes: {
                    exclude: ['customerId', 'scheduleId'], // deleting
                  },
                },
              ],
              attributes: {
                exclude: ['productId'], // deleting
              },
            },
            {
              model: models.Payment,
              required: false,
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
          throw new Error(msgs.noCustomerFound);
        }
        const customer = customerInstance.toJSON();

        customer.customerPasses = customer.CustomerPasses.map(cp => {
          return {
            rowId: cp.customerPassId,
            customerPassId: cp.customerPassId,
            passName: cp.PassDefinition.name,
            passDefId: cp.PassDefinition.passDefId,
            passType: cp.PassDefinition.passType,
            allowedProductTypes: cp.PassDefinition.allowedProductTypes,
            purchaseDate: cp.purchaseDate,
            validFrom: cp.validFrom,
            validUntil: cp.validUntil,
            usesLeft: cp.usesLeft,
            status: cp.status,
          };
        });
        delete customer.CustomerPasses;

        formattedBookings = (customerInstance.Bookings || []).map(booking => {
          const schedule = booking.ScheduleRecord;
          let scheduleDetails = '';
          if (schedule) {
            scheduleDetails = `${schedule.Product.name} - ${schedule.date} ${schedule.startTime} (${schedule.scheduleId})`;
          }
          const payment = booking.Payment
            ? `${booking.Payment.paymentMethod} (${booking.Payment.paymentId})`
            : booking.CustomerPass && booking.CustomerPass.PassDefinition
            ? `${booking.CustomerPass.PassDefinition.name}`
            : '';

          return {
            rowId: booking.bookingId,
            bookingId: booking.bookingId,
            attendance: booking.attendance,
            scheduleDetails,
            scheduleId: schedule.scheduleId,
            scheduleName: schedule.Product.name,
            scheduleDate: schedule.date,
            scheduleStartTime: schedule.startTime,
            payment,
            customerPassId: booking.CustomerPass?.customerPassId,
            passDefId: booking.CustomerPass?.PassDefinition?.passDefId,
            createdAt: booking.createdAt,
            timestamp: booking.timestamp,
          };
        });
        customer.formattedBookings = formattedBookings;

        console.log('\n✅✅✅ showAccount customer fetched');
        return res.status(200).json({
          customer,
          confirmation: 1,
          message: msgs.customerLoaded,
        });
      })
      .catch(err => catchErr(person, res, errCode, err, controllerName));
  }
};
export const getSettings = createGetById(person, models.UserPrefSetting, {
  notFoundStatus: 200,
  successMessage: 'Ustawienia pobrane',
  notFoundMessage: 'Domyślne ustawienia',
  resultName: 'preferences',
});
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
        return { confirmation: 1, message: msgs.settingsUpdated };
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
        attributes: ['type', 'name', 'duration', 'price'],
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
        throw new Error(msgs.noSchedulesFound);
      }
      // Convert for records for different names
      const formattedRecords = records.map(s => {
        // Transform to pure js object - not sequelize instance - to get all known features
        const schedule = s.toJSON();

        const activeBookings = schedule.Bookings?.filter(
          booking => booking.attendance === 1 || booking.attendance === true
        );

        const wasUserReserved =
          schedule.Bookings?.some(
            booking => booking.customerId === req.user?.Customer?.customerId
          ) || false;

        const isUserGoing = activeBookings.some(booking => {
          const customerId = booking.customerId;
          const loggedInID = req.user?.Customer?.customerId;
          return customerId == loggedInID;
        });

        return {
          ...schedule,
          rowId: schedule.scheduleId,
          day: getWeekDay(schedule.date),
          productType: schedule.Product.type,
          productName: schedule.Product.name,
          productPrice: schedule.Product.price,
          productDuration: schedule.Product.duration,
          wasUserReserved,
          isUserGoing,
          attendance: `${activeBookings?.length}/${schedule.capacity}`,
          full: activeBookings?.length >= schedule.capacity,
          rowId: schedule.scheduleId,
        };
      });

      delete formattedRecords.Product;

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
        message: msgs.schedulesFound,
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
        throw new Error(msgs.noScheduleFound);
      }

      // Convert to JSON
      const schedule = scheduleData.toJSON();

      const beingAttendedSchedules =
        schedule.Bookings && schedule.Bookings.length > 0
          ? schedule.Bookings.filter(
              booking => booking.attendance == 1 || booking.attendance == true
            )
          : [];
      const wasUserReserved =
        isUser && isCustomer
          ? schedule.Bookings?.some(
              booking => booking.customerId === req.user?.Customer.customerId
            )
          : false;
      const isUserGoing =
        isUser && isCustomer
          ? beingAttendedSchedules.some(
              booking => booking.customerId === req.user.Customer.customerId
            )
          : false;

      const formattedSchedule = {
        ...schedule,
        attendance: beingAttendedSchedules.length,
        full: beingAttendedSchedules.length >= schedule.capacity,
        isUserGoing,
        wasUserReserved,
        Bookings:
          isUser && isCustomer
            ? beingAttendedSchedules.length
            : schedule.Bookings,
      };

      successLog(person, controllerName);
      return res
        .status(200)
        .json({ schedule: formattedSchedule, user: req.user });
      // return res.status(200).json({schedule});
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};

//! PASSES_______________________________________________
//@ GET
export const getAllPasses = (req, res, next) => {
  const controllerName = 'getAllPassDefinitions';
  callLog(req, person, controllerName);

  models.PassDefinition.findAll({ where: { status: 1 || true } })
    .then(records => {
      if (!records) {
        errCode = 404;
        throw new Error(msgs.noPassDefsFound);
      }

      // Convert for records for different names
      const formattedRecords = records.map(record => {
        const passDef = record.toJSON();

        return {
          ...passDef,
          rowId: passDef.passDefId,
        };
      });

      const totalKeys = [
        'passDefId',
        'name',
        'description',
        'passType',
        'usesTotal',
        'validityDays',
        'allowedProductTypes',
        'price',
        '',
      ];

      // ✅ Return response to frontend
      successLog(person, controllerName);
      res.json({
        confirmation: 1,
        message: msgs.passDefsFound,
        totalKeys, // to map to the rows attributes
        content: formattedRecords, // With new names
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
export const getPassById = (req, res, next) => {
  const controllerName = 'getPassById';
  console.log(`\n➡️➡️➡️ ${person} called`, controllerName);

  const PK = req.params.id;
  models.PassDefinition.findByPk(PK)
    .then(passData => {
      if (!passData) {
        errCode = 404;
        throw new Error(msgs.noPassDefFound);
      }
      // console.log(scheduleData);
      let passDef = passData.toJSON();

      let passDefFormatted = {
        ...passDef,
      };

      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        message: msgs.passDefFound,
        passDefinition: passDefFormatted,
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
