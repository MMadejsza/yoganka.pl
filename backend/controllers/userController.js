import { Op, Sequelize, col, fn } from 'sequelize';
import * as models from '../models/_index.js';
import { areSettingsChanged } from '../utils/controllersUtils.js';
import { createGetAll, createGetById } from '../utils/crudFactory.js';
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
export const getAccount = async (req, res, next) => {
  const controllerName = 'getAccount';
  callLog(req, person, controllerName);

  let errCode = 500;
  try {
    // ensure user is logged in
    if (!req.user) {
      errCode = 401;
      throw new Error(msgs.notLoggedIn);
    }

    // if user has no Customer record, return just the user object
    if (!req.user.Customer) {
      const user = req.user;
      console.log('\n✅✅✅ getAccount user fetched');
      successLog(person, controllerName, 'user-only');
      return res.status(200).json({
        confirmation: 1,
        message: msgs.customerLoaded,
        user,
      });
    }

    // fetch full Customer with related data
    const PK = req.user.Customer.customerId;
    const customerInstance = await models.Customer.findOne({
      where: { customerId: PK },
      include: [
        {
          model: models.User,
          required: false,
          include: [
            {
              model: models.UserPrefSetting,
              required: false,
              attributes: { exclude: ['userId'] },
            },
          ],
        },
        {
          model: models.CustomerPass,
          required: false,
          include: [{ model: models.PassDefinition, required: true }],
        },
        {
          model: models.Payment,
          required: false,
          include: [
            {
              model: models.Invoice,
              required: false,
              attributes: { exclude: ['paymentId'] },
            },
          ],
          attributes: { exclude: ['productId', 'customerId'] },
        },
        {
          model: models.Booking,
          required: false,
          include: [
            {
              model: models.ScheduleRecord,
              required: false,
              include: [
                { model: models.Product, required: false },
                {
                  model: models.Feedback,
                  required: false,
                  attributes: { exclude: ['customerId', 'scheduleId'] },
                },
              ],
              attributes: { exclude: ['productId'] },
            },
            { model: models.Payment, required: false },
            {
              model: models.CustomerPass,
              required: false,
              include: [{ model: models.PassDefinition, required: true }],
            },
          ],
          attributes: { exclude: ['customerId', 'scheduleId'] },
        },
      ],
      attributes: { exclude: ['userId'] },
    });

    // if no customer found, throw 404
    if (!customerInstance) {
      errCode = 404;
      throw new Error(msgs.noCustomerFound);
    }

    // convert to plain object
    const customer = customerInstance.toJSON();

    // format customer passes
    customer.customerPasses = (customer.CustomerPasses || []).map(cp => ({
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
    }));
    delete customer.CustomerPasses;

    // format bookings
    const formattedBookings = (customerInstance.Bookings || []).map(booking => {
      const schedule = booking.ScheduleRecord;
      let scheduleDetails = '';
      if (schedule) {
        scheduleDetails = `${schedule.Product.name} - ${schedule.date} ${schedule.startTime} (${schedule.scheduleId})`;
      }
      const payment = booking.Payment
        ? `${booking.Payment.paymentMethod} (${booking.Payment.paymentId})`
        : booking.CustomerPass && booking.CustomerPass?.PassDefinition
        ? booking.CustomerPass.PassDefinition.name
        : '';

      return {
        rowId: booking.bookingId,
        bookingId: booking.bookingId,
        attendance: booking.attendance,
        scheduleDetails,
        scheduleId: schedule?.scheduleId,
        scheduleName: schedule?.Product?.name,
        scheduleDate: schedule?.date,
        scheduleStartTime: schedule?.startTime,
        payment,
        customerPassId: booking.CustomerPass?.customerPassId,
        passDefId: booking.CustomerPass?.PassDefinition?.passDefId,
        createdAt: booking.createdAt,
        timestamp: booking.timestamp,
      };
    });
    customer.formattedBookings = formattedBookings;

    // return the assembled response
    console.log('\n✅✅✅ showAccount customer fetched');
    successLog(person, controllerName, 'customer fetched');
    return res.status(200).json({
      customer,
      confirmation: 1,
      message: msgs.customerLoaded,
    });
  } catch (err) {
    return catchErr(person, res, errCode, err, controllerName);
  }
};
export const getSettings = createGetById(person, models.UserPrefSetting, {
  where: req => ({ userPrefId: req.user.UserPrefSetting?.userPrefId }),
  notFoundStatus: 200,
  resultName: 'preferences',
  successMessage: msgs.settingsLoaded,
  notFoundMessage: msgs.defaultSettingsLoaded,

  postAction: (req, record) => {
    // record = null log → default, otherwise custom
    successLog(person, 'getSettings', record ? 'custom' : 'default');
  },
});
//@ PUT
export const putEditSettings = async (req, res, next) => {
  const controllerName = 'putEditSettings';
  callLog(req, person, controllerName);

  let errCode = 500;
  try {
    // extract user ID and incoming settings from request
    const userId = req.user.userId;
    const givenSettings = req.body;
    const { handedness, font, notifications, animation, theme } = givenSettings;

    // find existing preferences or create new defaults
    const [preferences, created] = await models.UserPrefSetting.findOrCreate({
      where: { userId },
      defaults: {
        userId,
        handedness: !!handedness,
        fontSize: font || 'M',
        notifications: !!notifications,
        animation: !!animation,
        theme: !!theme,
      },
    });

    // if defaults were created, send created response
    if (created) {
      successLog(person, controllerName, 'preferences created');
      successLog(person, controllerName, 'response sent');
      return res.status(200).json({
        confirmation: 1,
        message: msgs.settingsUpdated,
      });
    }

    // otherwise, check if any settings actually changed
    const result = await areSettingsChanged(
      res,
      person,
      controllerName,
      preferences,
      givenSettings
    );
    if (!result) return; // no changes => response already sent

    // send update confirmation
    successLog(person, controllerName, 'response sent');
    return res.status(200).json({
      confirmation: result.confirmation,
      message: result.message,
    });
  } catch (err) {
    return catchErr(person, res, errCode, err, controllerName, { code: 409 });
  }
};

//! SCHEDULES_____________________________________________
//@ GET
export const getAllSchedules = async (req, res, next) => {
  const controllerName = 'getAllSchedules';
  callLog(req, person, controllerName);

  let errCode = 500;
  try {
    // fetch all future schedules with product info and optional bookings
    const now = new Date();
    const records = await models.ScheduleRecord.findAll({
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
        exclude: ['productId'],
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
    });

    // if no records found, throw 404
    if (!records) {
      errCode = 404;
      throw new Error(msgs.noSchedulesFound);
    }

    // transform each record for the frontend
    const formattedRecords = records.map(s => {
      const schedule = s.toJSON();
      const bookings = schedule.Bookings || [];

      // filter only active attendance
      const activeBookings = bookings.filter(
        b => b.attendance === true || b.attendance === 1
      );

      // determine user-specific flags
      const customerId = req.user?.Customer?.customerId;
      const wasUserReserved = bookings.some(b => b.customerId === customerId);
      const isUserGoing = activeBookings.some(b => b.customerId === customerId);

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
        attendance: `${activeBookings.length}/${schedule.capacity}`,
        full: activeBookings.length >= schedule.capacity,
      };
    });

    // prepare table headers and keys
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

    // respond with success
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: msgs.schedulesFound,
      totalHeaders,
      totalKeys,
      content: formattedRecords,
    });
  } catch (err) {
    return catchErr(person, res, errCode, err, controllerName);
  }
};
export const getScheduleById = createGetById(
  'getScheduleById',
  models.ScheduleRecord,
  {
    // include related product and bookings
    includeRelations: [
      { model: models.Product, required: true },
      { model: models.Booking, required: false },
    ],

    // transform the single record for the frontend
    mapRecord: (schedule, req) => {
      const bookings = schedule.Bookings || [];
      const active = bookings.filter(
        b => b.attendance === true || b.attendance === 1
      );
      const customerId = req.user?.Customer?.customerId;

      return {
        ...schedule,
        attendance: active.length,
        full: active.length >= schedule.capacity,
        wasUserReserved: bookings.some(b => b.customerId === customerId),
        isUserGoing: active.some(b => b.customerId === customerId),
        // if user is a customer, return just the count; otherwise include full booking array
        Bookings: req.user?.Customer ? active.length : bookings,
      };
    },

    // include the current user object in the response
    attachResponse: req => ({ user: req.user }),

    resultName: 'schedule',
    successMessage: '',
    notFoundMessage: msgs.noScheduleFound,
  }
);

//! PASSES_______________________________________________
//@ GET
export const getAllPasses = createGetAll(person, models.PassDefinition, {
  // only active passes
  where: { status: 1 },

  includeRelations: [],

  mapRecord: passDef => ({
    ...passDef,
    rowId: passDef.passDefId,
  }),

  columnKeys: [
    'passDefId',
    'name',
    'description',
    'passType',
    'usesTotal',
    'validityDays',
    'allowedProductTypes',
    'price',
    '',
  ],

  successMessage: msgs.passDefsFound,
  notFoundMessage: msgs.noPassDefsFound,
});
export const getPassById = createGetById(person, models.PassDefinition, {
  successMessage: msgs.passDefFound,
  notFoundMessage: msgs.noPassDefFound,
  resultName: 'passDefinition',
});
