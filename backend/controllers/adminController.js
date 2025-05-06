import bcrypt from 'bcryptjs';
import { addDays, addMonths, addYears } from 'date-fns';
import { Op } from 'sequelize';
import * as models from '../models/_index.js';
import {
  areCustomerDetailsChanged,
  areSettingsChanged,
  calcPassExpiryDate,
  convertDurationToTime,
  isEmptyInput,
  isPassValidForSchedule,
} from '../utils/controllersUtils.js';
import {
  createDelete,
  createDeleteBooking,
  createGetAll,
  createGetById,
} from '../utils/crudFactory.js';
import {
  formatIsoDateTime,
  getWeekDay,
  isAdult,
} from '../utils/dateTimeUtils.js';
import db from '../utils/db.js';
import {
  callLog,
  catchErr,
  errorCode,
  successLog,
} from '../utils/debuggingUtils.js';
import * as adminEmails from '../utils/mails/templates/adminOnlyActions/_adminEmails.js';

let errCode = errorCode;
const actor = 'Admin';

//! USERS_____________________________________________
//@ GET
export const getAllUsers = createGetAll(actor, models.User, {
  includeRelations: [
    { model: models.UserPrefSetting, attributes: ['userPrefId'] },
  ],
  excludeFields: ['passwordHash'],
  mapRecord: user => {
    return {
      rowId: user.userId,
      userId: user.userId,
      email: user.email,
      role: user.role,
      registrationDate: formatIsoDateTime(user.registrationDate),
      lastLoginDate: formatIsoDateTime(user.lastLoginDate),
      prefSettings: user.UserPrefSetting
        ? `Tak (Id: ${user.UserPrefSetting.userPrefId})`
        : 'Nie',
    };
  },
  columnKeys: [
    'userId',
    'email',
    'lastLoginDate',
    'registrationDate',
    'role',
    'prefSettings',
  ],
  sortFunction: (a, b) => a.email.localeCompare(b.email),
  successMessage: 'Konta pobrane pomyślnie.',
});
export const getUserById = createGetById(actor, models.User, {
  includeRelations: [
    {
      model: models.Customer,
      required: false,
      attributes: {
        exclude: ['userId', 'user_id', 'emailVerified'],
      },
    },
    {
      model: models.UserPrefSetting,
      required: false,
      attributes: {
        exclude: ['passwordHash', 'userId', 'user_id'],
      },
    },
  ],
  excludeFields: ['passwordHash'],
  mapRecord: instance => {
    const user = instance.toJSON();
    delete user.passwordHash;
    return user;
  },
  successMessage: 'Konto pobrane pomyślnie.',
});
//! NO FACTORY USED
export const getUserSettings = async (req, res, next) => {
  const controllerName = 'getUserSettings';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500; // default error code

  try {
    // Try to find user settings by PK
    const preferences = await models.UserPrefSetting.findByPk(req.params.id, {
      attributes: {
        exclude: ['userId', 'user_id'], // deleting
      },
    });

    // If no custom settings, send default message
    if (!preferences) {
      successLog(actor, controllerName, 'fetched default');
      return res.status(200).json({
        confirmation: 1,
        message: 'Brak własnych ustawień - załadowane domyślne.',
      });
    }

    // If found, return them
    successLog(actor, controllerName, 'fetched custom settings');
    return res.status(200).json({
      confirmation: 1,
      preferences,
    });
  } catch (err) {
    // Log full error, then handle centrally
    console.error('[getUserSettings] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
//@ POST
export const postCreateUser = async (req, res, next) => {
  const controllerName = 'postCreateUser';
  // Log request for debugging
  callLog(req, actor, controllerName);

  const { email, password, confirmedPassword, date } = req.body;
  let errCode = 500; // default error code

  try {
    // Check if user already exists
    const existing = await models.User.findOne({ where: { email } });
    if (existing) {
      errCode = 409;
      throw new Error('Konto już istnieje.');
    }

    // Hash the password
    const passwordHashed = await bcrypt.hash(password, 12);

    // Create new user record
    const newUser = await models.User.create({
      registrationDate: date,
      passwordHash: passwordHashed,
      lastLoginDate: date,
      email: email,
      role: 'USER',
      profilePictureSrcSetJson: null,
    });

    // Send notification email
    if (email) {
      adminEmails.sendUserAccountCreatedMail({ to: email });
    }

    // Log success and respond
    successLog(actor, controllerName);
    return res.status(200).json({
      type: 'signup',
      code: 200,
      confirmation: 1,
      message: 'Konto utworzone pomyślnie',
    });
  } catch (err) {
    // Print full error, then handle centrally
    console.error('[postCreateUser] error:', err);
    return catchErr(actor, res, errCode, err, controllerName, {
      type: 'signup',
      code: 409,
    });
  }
};
//@ PUT
export const putEditUserSettings = async (req, res, next) => {
  const controllerName = 'putEditUserSettings';
  // Log request for debugging
  callLog(req, actor, controllerName);

  const givenSettings = req.body;
  const { handedness, font, notifications, animation, theme } = givenSettings;
  const userId = req.params.id;
  let errCode = 500; // default error code

  console.log(`❗❗❗`, req.body);
  console.log(`❗❗❗`, req.params.id);

  try {
    // Check if userId param is provided
    if (!userId) {
      errCode = 400;
      throw new Error('Brak identyfikatora użytkownika');
    }

    // Try to find or create the settings row
    const [preferences, created] = await models.UserPrefSetting.findOrCreate({
      where: { userId: userId },
      defaults: {
        userId: userId,
        handedness: !!handedness,
        fontSize: font || 'M',
        notifications: !!notifications,
        animation: !!animation,
        theme: !!theme,
      },
    });

    let result;
    if (!created) {
      // If already existed, check for changes
      // areSettingsChanged returns null if no change,
      // or a promise resolving to update info
      result = await areSettingsChanged(
        res,
        actor,
        controllerName,
        preferences,
        givenSettings
      );
    } else {
      // New settings were created
      successLog(actor, controllerName, 'created');
      result = {
        confirmation: 1,
        message: 'Ustawienia zostały utworzone',
      };
    }

    // If result is null, means no change happened, so response already sent
    if (!result) return;

    // Send the final response
    successLog(actor, controllerName, 'sent');
    return res.status(200).json({
      confirmation: result.confirmation,
      message: result.message,
    });
  } catch (err) {
    // Log full error then handle centrally
    console.error('[putEditUserSettings] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
//@ DELETE
export const deleteUser = createDelete(actor, models.User, {
  primaryKey: 'userId',
  // Find the user first so we can grab their email
  preAction: async req => {
    const user = await models.User.findByPk(req.params.id, {
      attributes: ['email'],
    });
    if (!user) {
      const err = new Error('Nie znaleziono użytkownika.');
      err.status = 404;
      throw err;
    }
    return user.email; // Pass email onward to postAction (check factory)
  },

  // After delete, send notification to the saved email
  postAction: async userEmail => {
    if (userEmail) {
      adminEmails.sendUserAccountDeletedMail({ to: userEmail });
    }
  },

  successMessage: 'Konto usunięte pomyślnie.',
  notFoundMessage: 'Nie znaleziono konta.',
});

//! CUSTOMERS_____________________________________________
//@ GET
export const getAllCustomers = createGetAll(actor, models.Customer, {
  includeRelations: [], // no extra joins
  excludeFields: [], // hide foreign key
  mapRecord: c => {
    return {
      rowId: c.customerId,
      customerId: c.customerId,
      userId: c.userId,
      customerFullName: `${c.firstName} ${c.lastName}`,
      firstName: c.firstName,
      lastName: c.lastName,
      dob: c.dob,
      customerType: c.customerType,
      preferredContactMethod: c.preferredContactMethod,
      referralSource: c.referralSource,
      loyalty: c.loyalty,
      notes: c.notes,
    };
  },
  columnKeys: [
    'customerId',
    'userId',
    'customerFullName',
    'dob',
    'customerType',
    'preferredContactMethod',
    'referralSource',
    'loyalty',
    'notes',
  ],
  successMessage: 'Uczestnicy pobrani pomyślnie.',
});
export const getAllCustomersWithEligiblePasses = createGetAll(
  actor,
  models.Customer,
  {
    // fetch exactly those fields on CustomerPass that you need
    includeRelations: [
      {
        model: models.CustomerPass,
        attributes: [
          'customerPassId',
          'status',
          'usesLeft',
          'validFrom',
          'validUntil',
        ],
        include: [
          {
            model: models.PassDefinition,
            attributes: ['name', 'passType', 'allowedProductTypes'],
          },
        ],
      },
    ],

    // first load the schedule + its product.type sorted in the factory as hookData
    preAction: async req => {
      const sched = await models.ScheduleRecord.findByPk(
        req.params.scheduleId,
        {
          attributes: {
            exclude: ['scheduleId', 'productId', 'location', 'capacity'],
          },
          include: [{ model: models.Product, attributes: ['type'] }],
        }
      );
      if (!sched) {
        const err = new Error('Nie znaleziono terminu.');
        err.status = 404;
        throw err;
      }
      return sched.toJSON();
    },

    // filter and attach eligiblePasses exactly as before (schedule=hookData)
    mapRecord: (customerInstance, schedule) => {
      const customer = customerInstance.toJSON();
      const allPasses = Array.isArray(customer.CustomerPasses)
        ? customer.CustomerPasses
        : [];
      const eligible = allPasses.filter(p =>
        isPassValidForSchedule(p, schedule)
      );
      if (eligible.length === 0) return null;
      customer.eligiblePasses = eligible;
      delete customer.CustomerPasses;
      return customer;
    },

    // frontend only reads `content`, so these can stay empty
    columnKeys: [],
    successMessage: '',
    notFoundMessage: 'Nie znaleziono klientów.',
  }
);
export const getCustomerById = createGetById(actor, models.Customer, {
  // remove fields we don't need from Customer
  excludeFields: ['userId', 'user_id'],

  // load related User and its settings
  includeRelations: [
    {
      model: models.User,
      required: false,
      // drop sensitive columns
      attributes: {
        exclude: ['passwordHash', 'profilePictureSrcSetJson', 'emailVerified'],
      },
      include: [
        {
          model: models.UserPrefSetting,
          required: false,
          // remove the FK
          attributes: { exclude: ['userId', 'user_id'] },
        },
      ],
    },
    // load all passes belonging to this customer
    {
      model: models.CustomerPass,
      required: false,
      // exclude unused foreign keys
      attributes: {
        exclude: [
          'customerId',
          'customer_id',
          'paymentId',
          'payment_id',
          'pass_def_id',
        ],
      },
      include: [
        {
          model: models.PassDefinition,
          // we need the pass name and its ID
          attributes: ['name', 'passDefId'],
        },
      ],
    },
    // load payments and any invoices
    {
      model: models.Payment,
      required: false,
      // drop the link back to Customer
      attributes: { exclude: ['customerId', 'customer_id'] },
      include: [
        {
          model: models.Invoice,
          required: false,
        },
      ],
    },
    // load bookings with schedule, product and feedback
    {
      model: models.Booking,
      required: false,
      attributes: {
        exclude: [
          'customerId',
          'customer_id',
          'customer_pass_id',
          'scheduleId',
          'schedule_id',
          'paymentId',
          'customerPassId',
        ],
      },
      include: [
        {
          model: models.ScheduleRecord,
          required: false,
          // remove unused schedule fields
          attributes: { exclude: ['productId', 'product_id', 'capacity'] },
          include: [
            {
              model: models.Product,
              required: false,
              // only bring productId, name, type, duration
              attributes: ['productId', 'name', 'type', 'duration'],
            },
            {
              model: models.Feedback,
              required: false,
              // limit to this customer’s feedback
              attributes: { exclude: ['customerId', 'scheduleId'] },
            },
          ],
        },
      ],
    },
  ],

  // after fetching, convert instance to JSON and adjust output
  mapRecord: (instance, req) => {
    // convert Sequelize object to plain JS
    const customer = instance.toJSON();

    // for each pass, add human-readable passName
    customer.CustomerPasses = (customer.CustomerPasses || []).map(cp => ({
      ...cp,
      passName: cp.PassDefinition.name,
    }));

    // tell frontend which columns to show for passes table
    customer.customerPassesKeys = [
      'customerPassId',
      'passName',
      'purchaseDate',
      'validFrom',
      'validUntil',
      'usesLeft',
      'status',
    ];

    return customer;
  },

  // include login flag in top-level response
  attachResponse: req => ({
    isLoggedIn: req.session.isLoggedIn,
  }),

  // no custom message here
  successMessage: '',
  notFoundMessage: 'Nie znaleziono profilu uczestnika.',
});
export const getCustomerDetails = createGetById(actor, models.Customer, {
  // drop fields the edit form doesn't need
  excludeFields: [
    'referralSource',
    'customerType',
    'customerId',
    'firstName',
    'lastName',
    'dob',
  ],

  // no related models to include here
  // the message to send on success
  successMessage: 'Dane uczestnika pobrane pomyślnie.',
  // the message if no record is found
  notFoundMessage: 'Nie znaleziono danych uczestnika.',
});
//@ POST
export const postCreateCustomer = async (req, res, next) => {
  const controllerName = 'postCreateCustomer';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500; // default error code
  const {
    userId,
    customerType,
    firstName,
    lastName,
    dob,
    phone,
    cMethod,
    loyalty,
    notes,
  } = req.body;
  let customerEmail;

  try {
    // Validate required fields
    isEmptyInput(firstName, 'imię');
    isEmptyInput(lastName, 'nazwisko');
    isEmptyInput(dob, 'data urodzenia');
    isEmptyInput(phone, 'telefon');

    // Check age
    if (!isAdult(dob)) {
      errCode = 400;
      console.log('\n❌❌❌ Customer below 18');
      throw new Error('Uczestnik musi być pełnoletni.');
    }

    // Make sure no customer exists for this user
    const existing = await models.Customer.findOne({ where: { userId } });
    if (existing) {
      errCode = 409;
      throw new Error('Profil uczestnika już istnieje.');
    }

    // Fetch user email for notification
    const user = await models.User.findByPk(userId, {
      attributes: ['userId', 'email'],
    });
    if (!user) {
      errCode = 404;
      throw new Error('Nie znaleziono użytkownika.');
    }
    customerEmail = user.email;

    // Create new customer record
    const newCustomer = await models.Customer.create({
      customerType: customerType || 'Indywidualny',
      userId,
      firstName,
      lastName,
      dob,
      phone,
      preferredContactMethod: cMethod || '=',
      referralSource: 'Admin insert',
      loyalty: loyalty ?? 5,
      notes,
    });

    // Update user role to CUSTOMER
    await user.update({ role: 'CUSTOMER' });

    // Send notification email
    if (customerEmail) {
      adminEmails.sendCustomerCreatedMail({
        to: customerEmail,
        firstName,
      });
    }

    // Success response
    successLog(actor, controllerName);
    return res.status(200).json({
      code: 200,
      confirmation: 1,
      message: 'Zarejestrowano pomyślnie.',
    });
  } catch (err) {
    // Print error then handle centrally
    console.error('[postCreateCustomer] error:', err);
    return catchErr(actor, res, errCode, err, controllerName, { code: 409 });
  }
};
//@ PUT
export const putEditCustomerDetails = async (req, res, next) => {
  const controllerName = 'putEditCustomerDetails';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500; // default error code
  const customerId = req.params.id;
  const {
    phone: newPhone,
    cMethod: newContactMethod,
    loyalty: newLoyalty,
    notes: newNotes,
  } = req.body;

  try {
    // 1. Find customer by PK
    const customer = await models.Customer.findByPk(customerId, {
      attributes: ['phone', 'preferredContactMethod', 'loyalty', 'notes'],
    });

    if (!customer) {
      errCode = 404;
      throw new Error('Nie znaleziono danych uczestnika.');
    }
    successLog(actor, controllerName, 'fetched');

    // 2. Check if phone or contact method missing or unchanged
    const interrupted = areCustomerDetailsChanged(
      res,
      actor,
      customer,
      newPhone,
      newContactMethod
    );
    if (interrupted) return;

    // 3. Check if other fields are unchanged
    const { phone, preferredContactMethod, loyalty, notes } = customer;

    if (
      phone === newPhone &&
      preferredContactMethod === newContactMethod &&
      loyalty === newLoyalty &&
      notes === newNotes
    ) {
      // Nothing changed
      console.log('\n❓❓❓ Admin Customer no change');
      return res.status(200).json({
        confirmation: 0,
        message: 'Brak zmian',
      });
    }

    // 4. Perform update
    const [affectedRows] = await models.Customer.update(
      {
        phone: newPhone,
        preferredContactMethod: newContactMethod,
        loyalty: newLoyalty,
        notes: newNotes,
      },
      { where: { customerId } }
    );

    // 5. Log success and send response
    successLog(actor, controllerName);
    return res.status(200).json({
      message: 'Profil zaktualizowany pomyślnie.',
      confirmation: affectedRows >= 1,
      affectedCustomerRows: affectedRows,
    });
  } catch (err) {
    // Print full error then handle centrally
    console.error('[putEditCustomerDetails] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
//@ DELETE
export const deleteCustomer = createDelete(actor, models.Customer, {
  // our PK field in the model
  primaryKeyName: 'customerId',

  // before deleting, fetch the customer to get their email
  preAction: async req => {
    const id = req.params.id;
    const customer = await models.Customer.findOne({
      where: { customerId: id },
      attributes: {
        exclude: ['userId', 'user_id'], // drop foreign key
      },
      include: [
        {
          model: models.User,
          attributes: ['email'], // only need the email field
          required: false,
        },
      ],
    });

    // if no customer found, signal a 404
    if (!customer) {
      const err = new Error('Nie znaleziono profilu uczestnika.');
      err.status = 404;
      throw err;
    }

    // return the email address (or undefined)
    return customer.User?.email;
  },

  // after successful delete, send notification if we have an email
  postAction: async email => {
    if (email) {
      await adminEmails.sendCustomerDeletedMail({ to: email });
    }
  },

  // message on successful deletion
  successMessage: 'Profil usunięty pomyślnie.',
  // message if record wasn't found
  notFoundMessage: 'Nie znaleziono profilu uczestnika.',
});

//! SCHEDULES_____________________________________________
//@ GET
export const getAllSchedules = createGetAll(actor, models.ScheduleRecord, {
  includeRelations: [
    {
      model: models.Product,
      required: false,
      // only need type, name, price for display
      attributes: ['type', 'name', 'price'],
    },
    {
      model: models.Booking,
      required: false,
      // only need attendance to count active bookings
      attributes: ['attendance'],
    },
  ], // no extra joins
  excludeFields: ['productId'], // hide foreign key
  mapRecord: sched => {
    // count active bookings (attendance true/1)
    const activeBookings = (sched.Bookings || []).filter(
      b => b.attendance === true || b.attendance === 1
    );
    sched.attendance = `${activeBookings.length}/${sched.capacity}`;
    // add weekday name
    sched.day = getWeekDay(sched.date);
    // add rowId for row key
    sched.rowId = sched.scheduleId;
    // flatten product details
    sched.productType = sched.Product?.type;
    sched.productName = sched.Product?.name;
    sched.productPrice = sched.Product?.price;
    // we don't need the Bookings or Product objects any more
    delete sched.Bookings;
    delete sched.Product;
    return sched;
  },
  columnKeys: [
    'scheduleId',
    'attendance',
    'date',
    'day',
    'startTime',
    'location',
    'productType',
    'productName',
    'productPrice',
  ],
  successMessage: 'Terminy pobrane pomyślnie.',
  notFoundMessage: 'Nie znaleziono terminów.',
});
export const getScheduleById = createGetById(actor, models.ScheduleRecord, {
  includeRelations: [
    // Fetch the schedule record with related models
    { model: models.Product, required: true },
    {
      model: models.Booking,
      required: false,
      include: [
        { model: models.Customer, attributes: { exclude: ['userId'] } },
        { model: models.Payment, required: false },
        {
          model: models.CustomerPass,
          required: false,
          include: [
            {
              model: models.PassDefinition,
              attributes: { exclude: ['userId'] },
            },
          ],
        },
      ],
    },
    {
      model: models.Feedback,
      required: false,
      include: [
        { model: models.Customer, attributes: { exclude: ['userId'] } },
      ],
      attributes: { exclude: ['customerId'] },
    },
  ],
  mapRecord: scheduleData => {
    // Convert the Sequelize instance to a plain JS object
    const schedule = scheduleData.toJSON();

    // Initialize attendance counts
    schedule.attendance = 0;
    let attendedRecords = [];
    let cancelledRecords = [];

    // Split bookings into attended vs cancelled
    (schedule.Bookings || []).forEach(b => {
      // Mark attended
      const rec = { ...b, rowId: b.bookingId };
      if (b.attendance === true || b.attendance === 1) {
        attendedRecords.push(rec);
      } else {
        // Mark cancelled
        cancelledRecords.push(rec);
      }
    });

    // Set attendance count and full flag
    schedule.attendance = attendedRecords.length;
    schedule.full = schedule.attendance >= schedule.capacity;

    // Determine if the schedule is already completed
    const scheduleDateTime = new Date(
      `${schedule.date}T${schedule.startTime}:00`
    );
    schedule.isCompleted = scheduleDateTime <= new Date();

    schedule.attendedRecords = attendedRecords;
    schedule.cancelledRecords = cancelledRecords;

    return schedule;
  },
  postAction: async (_req, schedule) => {
    // Fetch any standalone payments related to this schedule
    const paymentsList = await models.Payment.findAll({
      where: {
        product: { [Op.like]: `%sId: ${schedule.scheduleId}%` }, // % any amount of characters
      },
      include: [
        { model: models.Customer, attributes: { exclude: ['userId'] } },
      ],
    });

    // Format those payments for response
    schedule.payments = paymentsList.map(payment => {
      const p = payment.toJSON();
      return {
        ...p,
        rowId: p.paymentId,
        date: formatIsoDateTime(p.date),
        customerFullName: `${p.Customer.firstName} ${p.Customer.lastName} (${p.Customer.customerId})`,
      };
    });
  },
  successMessage: 'Termin pobrany pomyślnie',
  notFoundMessage: 'Nie znaleziono terminu.',
  resultName: 'schedule',
  attachResponse: (req, result) => ({
    user: req.user,
  }),
});

// Controller for NewPaymentForm Selects
export const getProductSchedules = createGetAll(actor, models.ScheduleRecord, {
  // grab productId and all scheduleIds already booked by this customer before fetching schedules
  preAction: async req => {
    const productId = req.params.pId;
    const customerId = req.params.cId;

    // fetch only scheduleId field to minimize data transfer
    const bookings = await models.Booking.findAll({
      where: { customerId },
      attributes: ['scheduleId'],
    });

    // return both productId and the booked IDs for mapRecord
    return {
      productId,
      bookedScheduleIds: bookings.map(b => b.scheduleId),
    };
  },

  where: ({ productId }) => ({ productId }),

  // we filter out any schedules that aren’t for our product or that the customer already has booked
  mapRecord: (schedule, { bookedScheduleIds }) => {
    // skip schedules already booked by this customer
    if (bookedScheduleIds.includes(schedule.scheduleId)) return null;
    // keep the schedule otherwise
    return schedule;
  },
  successMessage: 'Terminy pobrane pomyślnie.',
  notFoundMessage: 'Nie znaleziono terminów.',
});

export const getBookings = (req, res, next) => {};
//@ POST
export const postCreateScheduleRecord = async (req, res, next) => {
  const controllerName = 'postCreateScheduleRecord';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500;
  const {
    productId,
    date,
    capacity,
    location,
    startTime,
    repeatCount,
    shouldRepeat,
  } = req.body;

  // Check required inputs
  const inputs = [
    date,
    capacity,
    location,
    startTime,
    repeatCount || 1,
    shouldRepeat,
  ];
  try {
    inputs.forEach(val => {
      if (!val || !val.toString().trim()) {
        errCode = 400;
        throw new Error('Nie podano wszystkich danych.');
      }
    });

    // Determine how many times to run
    const iterations = shouldRepeat == 1 ? 1 : repeatCount;
    let currentDate = new Date(`${date}T${startTime}`);

    // Recursive helper to create multiple schedule records
    const createRecord = (i, currDate, records, transaction) => {
      if (i >= iterations) return Promise.resolve(records); // base condition to stop and resolve the promise
      return models.ScheduleRecord.create(
        {
          productId,
          date: currDate,
          startTime,
          location,
          capacity,
        },
        { transaction }
      ).then(rec => {
        successLog(actor, controllerName, `created for: ${currDate}`);
        // Update date based on repeat interval
        if (shouldRepeat == 7) currDate = addDays(currDate, 7);
        else if (shouldRepeat == 30) currDate = addMonths(currDate, 1);
        else if (shouldRepeat == 365) currDate = addYears(currDate, 1);
        records.push(rec);
        return createRecord(i + 1, currDate, records, transaction);
      });
    };

    // Run all creates in one transaction
    const createdRecords = await db.transaction(t =>
      createRecord(0, currentDate, [], t)
    );

    successLog(actor, controllerName);
    return res.status(201).json({
      confirmation: 1,
      message: 'Terminy utworzone pomyślnie.',
      records: createdRecords,
    });
  } catch (err) {
    // Handle errors centrally
    console.error('[postCreateScheduleRecord] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
//@ PUT
export const putEditSchedule = async (req, res, next) => {
  const controllerName = 'putEditSchedule';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500;
  const scheduleId = req.params.id;
  // Get new values from request body
  const {
    capacity: newCapacity,
    date: newDate,
    startTime: newStartTime,
    location: newLocation,
  } = req.body;

  try {
    // Check for missing inputs
    if (
      !newCapacity ||
      !newDate?.trim() ||
      !newStartTime?.trim() ||
      !newLocation?.trim()
    ) {
      errCode = 400;
      throw new Error('Nie podano wszystkich danych.');
    }

    // Fetch existing schedule record
    const schedule = await models.ScheduleRecord.findByPk(scheduleId);
    if (!schedule) {
      errCode = 404;
      throw new Error('Nie znaleziono danych terminu.');
    }
    // Log that we fetched the record
    successLog(actor, controllerName, 'fetched');

    // Check if schedule date is in the past
    const originalDateTime = new Date(
      `${schedule.date}T${schedule.startTime}:00`
    );
    if (originalDateTime < new Date()) {
      errCode = 400;
      console.log('\n❓❓❓ Admin schedule is past - not to edit');
      throw new Error('Nie można edytować minionego terminu.');
    }

    // Check if no fields actually changed
    if (
      schedule.capacity == newCapacity &&
      schedule.date === newDate &&
      schedule.startTime === newStartTime &&
      schedule.location === newLocation
    ) {
      // Nothing changed, return early
      console.log('\n❓❓❓ Admin schedule no change');
      return res.status(200).json({ confirmation: 0, message: 'Brak zmian' });
    }

    // Perform the update
    const [affectedRows] = await models.ScheduleRecord.update(
      {
        capacity: newCapacity,
        date: newDate,
        startTime: newStartTime,
        location: newLocation,
      },
      { where: { scheduleId } }
    );

    // Log success and send response
    successLog(actor, controllerName);
    return res.status(200).json({
      confirmation: affectedRows >= 1,
      message: 'Termin zaktualizowany pomyślnie.',
      affectedScheduleRows: affectedRows,
    });
  } catch (err) {
    // Log error then handle centrally
    console.error('[putEditSchedule] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
//@ DELETE
export const deleteSchedule = createDelete(actor, models.ScheduleRecord, {
  // primary key field in ScheduleRecord is scheduleId
  primaryKeyName: 'scheduleId',

  // preAction runs all the checks and logs with emojis
  preAction: async req => {
    const controllerName = 'deleteSchedule';
    // Log that admin called this endpoint
    console.log(`➡️➡️➡️ admin called`, controllerName);

    const id = req.params.id;
    console.log(`${controllerName} deleting id:`, id);

    // Find the schedule record by ID
    const foundSchedule = await models.ScheduleRecord.findOne({
      where: { scheduleId: id },
    });
    if (!foundSchedule) {
      console.log(
        `❌❌❌ Error Admin ${controllerName} Schedule to delete not found.`
      );
      const err = new Error('Nie znaleziono terminu do usunięcia.');
      err.status = 404;
      throw err;
    }

    // If the schedule is in the past, block deletion
    const scheduleDateTime = new Date(
      `${foundSchedule.date}T${foundSchedule.startTime}:00`
    );
    if (scheduleDateTime < new Date()) {
      console.log(
        `❌❌❌ Error Admin ${controllerName} Schedule is passed - can't be deleted.`
      );
      const err = new Error(
        'Nie można usunąć terminu który już minął. Posiada też wartość historyczną dla statystyk.'
      );
      err.status = 400;
      throw err;
    }

    // Check if any bookings exist for this schedule
    const hasBooking = await models.Booking.findOne({
      where: { scheduleId: id },
    });
    if (hasBooking) {
      console.log(
        `❌❌❌ Error Admin ${controllerName} Schedule is booked - can't be deleted.`
      );
      const err = new Error(
        'Nie można usunąć terminu, który posiada rekordy obecności (obecny/anulowany). Najpierw USUŃ rekordy obecności w konkretnym terminie.'
      );
      err.status = 409;
      throw err;
    }

    // If we get here, deletion is permitted
  },

  // Message on successful deletion
  successMessage: 'Termin usunięty pomyślnie.',
  notFoundMessage: 'Nie znaleziono terminu do usunięcia.',
});

//! PRODUCTS_____________________________________________
//@ GET
export const getAllProducts = createGetAll(actor, models.Product, {
  includeRelations: [],
  // convert each plain object and add rowId + format startDate
  mapRecord: product => ({
    ...product,
    // Add rowId for table rows
    rowId: product.productId,
    // Format startDate for display
    startDate: formatIsoDateTime(product.startDate),
  }),

  // table headers / keys
  columnKeys: [
    'productId',
    'type',
    'name',
    'location',
    'duration',
    'price',
    'startDate',
    'status',
  ],

  // messages
  successMessage: 'Pobrano pomyślnie.',
  notFoundMessage: 'Nie znaleziono rekordów.',
});
export const getProductById = createGetById(actor, models.Product, {
  includeRelations: [
    {
      model: models.ScheduleRecord,
      required: false,
      attributes: { exclude: ['productId'] },
      include: [
        {
          model: models.Booking,
          required: false,
          attributes: { exclude: ['customerId'] },
          include: [
            {
              model: models.Customer,
              attributes: { exclude: ['userId'] },
            },
            {
              model: models.Payment,
              required: false,
              attributes: { exclude: ['product'] },
              include: [
                {
                  model: models.Customer,
                  attributes: { exclude: ['userId'] },
                },
              ],
            },
            {
              model: models.CustomerPass,
              required: false,
              include: [{ model: models.PassDefinition }],
            },
          ],
        },
        {
          model: models.Feedback,
          required: false,
          attributes: { exclude: ['customerId'] },
          include: [
            {
              model: models.Customer,
              attributes: { exclude: ['userId'] },
            },
          ],
        },
      ],
    },
  ],

  // message on success / not found
  successMessage: 'Produkt pobrany pomyślnie.',
  notFoundMessage: 'Nie znaleziono produktu.',

  // include the login flag at top level
  attachResponse: req => ({
    isLoggedIn: req.session.isLoggedIn,
  }),
});
//@ POST
export const postCreateProduct = async (req, res, next) => {
  const controllerName = 'postCreateProduct';
  callLog(req, actor, controllerName);
  let errCode = 500;

  try {
    const { name, productType, startDate, duration, location, price, status } =
      req.body;

    // Check if product already exists
    const existing = await models.Product.findOne({ where: { name } });
    if (existing) {
      errCode = 409;
      throw new Error('Produkt już istnieje.');
    }

    // Create new product
    await models.Product.create({
      name,
      type: productType,
      location,
      duration: convertDurationToTime(duration),
      price,
      startDate,
      status: Number(status) || 1,
    });

    // Log success and respond
    successLog(actor, controllerName);
    return res.status(200).json({
      code: 200,
      confirmation: 1,
      message: 'Stworzono pomyślnie.',
    });
  } catch (err) {
    console.error('[postCreateProduct] error:', err);
    return catchErr(actor, res, errCode, err, controllerName, { code: 409 });
  }
};
//@ PUT
export const putEditProduct = async (req, res, next) => {
  const controllerName = 'putEditProduct';
  callLog(req, actor, controllerName);
  let errCode = 500;

  try {
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
    // Check for missing inputs
    if (
      !newType?.trim() ||
      !newStartDate?.trim() ||
      !newLocation?.trim() ||
      !newDuration ||
      newPrice == null ||
      !newStatus?.trim()
    ) {
      errCode = 400;
      console.log('\n❌❌❌ Error putEditProduct:', 'No enough data');
      throw new Error('Nie podano wszystkich danych.');
    }

    // Fetch existing product
    const product = await models.Product.findByPk(productId);
    if (!product) {
      errCode = 404;
      throw new Error('Nie znaleziono danych produktu.');
    }
    successLog(actor, controllerName, 'fetched');

    // Check if nothing changed
    if (
      product.type === newType &&
      product.startDate === newStartDate &&
      product.location === newLocation &&
      product.duration === newDuration &&
      product.price === newPrice &&
      String(product.status) === newStatus
    ) {
      // Nothing changed
      console.log('\n❓❓❓ Admin Product no change');
      return res.status(200).json({
        confirmation: 0,
        message: 'Brak zmian',
      });
    }

    // Perform update
    const [affectedRows] = await models.Product.update(
      {
        type: newType,
        startDate: newStartDate,
        location: newLocation,
        duration: newDuration,
        price: newPrice,
        status: newStatus,
      },
      { where: { productId } }
    );

    // Log success and respond
    successLog(actor, controllerName);
    return res.status(200).json({
      confirmation: affectedRows >= 1,
      message: 'Zmiany zaakceptowane.',
      affectedProductRows: affectedRows,
    });
  } catch (err) {
    console.error('[putEditProduct] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
//@ DELETE
export const deleteProduct = createDelete(actor, models.Product, {
  // message when deletion succeeds
  successMessage: 'Produkt usunięty pomyślnie.',
  // message when no record was deleted (404)
  notFoundMessage: 'Nie usunięto zajęć.',
});

//! PASSES_______________________________________________
//@ GET
export const getAllPasses = createGetAll(actor, models.PassDefinition, {
  includeRelations: [],

  //transform each PassDefinition for the frontend
  mapRecord: passDef => ({
    ...passDef,
    rowId: passDef.passDefId,
    usesTotal: passDef.usesTotal || '-',
    validityDays: passDef.validityDays ? `${passDef.validityDays} dni` : '-',
    price: `${passDef.price} zł`,
    allowedProductTypes: JSON.parse(passDef.allowedProductTypes).join(', '),
  }),

  //after we have the list of definitions, also fetch & format all CustomerPasses
  postAction: async (req, list) => {
    list.sort((a, b) => a.passDefId - b.passDefId);
    const cps = await models.CustomerPass.findAll({
      include: [
        {
          model: models.Customer,
          attributes: ['customerId', 'firstName', 'lastName'],
        },
        { model: models.PassDefinition, attributes: ['passDefId', 'name'] },
      ],
    });

    const formattedCustomerPasses = cps
      .map(cp => {
        const { Customer: c, PassDefinition: pd } = cp;
        return {
          customerPassId: cp.customerPassId,
          rowId: cp.customerPassId,
          customerFullName: `${c.firstName} ${c.lastName}`,
          customerId: cp.Customer.customerId,
          passName: pd.name,
          passDefId: pd.passDefId,
          purchaseDate: cp.purchaseDate,
          validFrom: cp.validFrom,
          validUntil: cp.validUntil,
          usesLeft: cp.usesLeft,
          status: cp.status,
        };
      })
      .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

    //stash on req so attachResponse can pick it up
    req.passExtras = {
      formattedCustomerPasses,
      customerPassesKeys: [
        'customerPassId',
        'customerFullName',
        'passName',
        'purchaseDate',
        'validFrom',
        'validUntil',
        'usesLeft',
        'status',
      ],
    };
  },

  //include the extras (pick them up) alongside the standard payload
  attachResponse: req => req.passExtras || {},

  //columns for pass definitions
  columnKeys: [
    'passDefId',
    'name',
    'description',
    'passType',
    'usesTotal',
    'validityDays',
    'allowedProductTypes',
    'price',
  ],

  successMessage: 'Pobrano pomyślnie.',
  notFoundMessage: 'Nie znaleziono rekordów.',
});
export const getPassById = createGetById(actor, models.PassDefinition, {
  //Fetch pass definition with its customer passes and payments
  includeRelations: [
    {
      model: models.CustomerPass,
      include: [{ model: models.Customer }, { model: models.Payment }],
    },
  ],

  mapRecord: passData => {
    const passDef = passData.toJSON();

    //Extract and format payments
    const payments = passDef.CustomerPasses.map(cp => {
      const { Customer, Payment } = cp;
      return {
        ...Payment,
        rowId: Payment.paymentId,
        date: formatIsoDateTime(Payment.date),
        customerFullName: `${Customer.firstName} ${Customer.lastName} (${Customer.customerId})`,
      };
    });

    //Extract and format customer passes
    const customerPasses = passDef.CustomerPasses.map(cp => {
      const { Customer } = cp;
      return {
        customerPassId: cp.customerPassId,
        rowId: cp.customerPassId,
        customerFirstName: Customer.firstName,
        customerLastName: Customer.lastName,
        customerId: Customer.customerId,
        purchaseDate: cp.purchaseDate,
        validFrom: cp.validFrom,
        validUntil: cp.validUntil,
        usesLeft: cp.usesLeft,
        status: cp.status,
      };
    });

    //Prepare final passDefinition object
    delete passDef.CustomerPasses;
    return {
      ...passDef,
      payments,
      paymentsKeys: [
        'paymentId',
        'date',
        'customerFullName',
        'amountPaid',
        'paymentMethod',
      ],
      customerPasses,
      customerPassesKeys: [
        'customerPassId',
        'customerFullName',
        'purchaseDate',
        'validFrom',
        'validUntil',
        'usesLeft',
        'status',
      ],
    };
  },

  resultName: 'passDefinition',
  successMessage: 'Definicja karnetu pobrana pomyślnie',
  notFoundMessage: 'Nie znaleziono definicji karnetu.',
});
export const getCustomerPassById = createGetById(actor, models.CustomerPass, {
  // Fetch specific customer pass with its definition and payment
  includeRelations: [
    { model: models.PassDefinition },
    { model: models.Payment },
  ],

  mapRecord: cp => {
    // Format payment
    const payment = {
      paymentId: cp.Payment.paymentId,
      date: formatIsoDateTime(cp.Payment.date),
      amountPaid: cp.Payment.amountPaid,
      paymentMethod: cp.Payment.paymentMethod,
      status: cp.Payment.status,
    };

    // Format pass definition fields
    const passDefinition = {
      passDefId: cp.PassDefinition.passDefId,
      name: cp.PassDefinition.name,
      description: cp.PassDefinition.description,
      passType: cp.PassDefinition.passType,
      usesTotal: cp.PassDefinition.usesTotal,
      validityDays: cp.PassDefinition.validityDays,
      allowedProductTypes: cp.PassDefinition.allowedProductTypes,
      price: cp.PassDefinition.price,
      status: cp.PassDefinition.status,
    };

    // Build final customerPass object
    return {
      rowId: cp.customerPassId,
      customerPassId: cp.customerPassId,
      purchaseDate: cp.purchaseDate,
      validFrom: cp.validFrom,
      validUntil: cp.validUntil,
      usesLeft: cp.usesLeft,
      status: cp.status,
      payment,
      passDefinition,
    };
  },

  // return under “customerPass” key
  resultName: 'customerPass',
  successMessage: 'Definicja karnetu pobrana pomyślnie',
  notFoundMessage: 'Nie znaleziono definicji karnetu.',
});
//@ POST
//@ POST
export const postCreatePassDefinition = async (req, res, next) => {
  const controllerName = 'postCreatePassDefinition';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500; // default error code
  const {
    name,
    allowedProductTypes,
    count,
    validityDays,
    price,
    status,
    description,
  } = req.body;
  let passType;

  try {
    // Validate required text fields
    isEmptyInput(name, '"nazwa"');
    isEmptyInput(allowedProductTypes, '"obejmuje"');
    isEmptyInput(price, '"cena"');
    isEmptyInput(status, '"status"');
    isEmptyInput(description, '"opis"');

    // Ensure at least one of count or validityDays is provided
    if (
      (!count || !String(count).trim()) &&
      (!validityDays || !String(validityDays).trim())
    ) {
      console.log('\n❌❌❌ count and validityDays field empty');
      throw new Error(
        'Karnet musi posiadać co najmniej 1 z wartości: ważność lub ilość wejść.'
      );
    }

    // Determine passType based on provided fields
    if (count && validityDays) passType = 'MIXED';
    else if (!count && validityDays) passType = 'TIME';
    else passType = 'COUNT';

    // Create the new pass definition
    await models.PassDefinition.create({
      name,
      passType,
      description,
      allowedProductTypes,
      price,
      usesTotal: count || null,
      validityDays: validityDays || null,
      status: Number(status),
    });

    // Log success and send response
    successLog(actor, controllerName);
    return res.status(200).json({
      code: 200,
      confirmation: 1,
      message: 'Karnet stworzono pomyślnie.',
    });
  } catch (err) {
    // Log error then handle centrally
    console.error('[postCreatePassDefinition] error:', err);
    return catchErr(actor, res, errCode, err, controllerName, { code: 409 });
  }
};
//@ PUT
//@ DELETE
export const deleteCustomerPass = createDelete(actor, models.CustomerPass, {
  successMessage: 'Karnet uczestnika usunięty pomyślnie.',
  notFoundMessage: 'Nie usunięto karnetu uczestnika.',
});
export const deletePassDefinition = createDelete(actor, models.PassDefinition, {
  primaryKeyName: 'passDefId',
  successMessage: 'Definicja karnetu usunięta pomyślnie.',
  notFoundMessage: 'Nie usunięto definicji karnetu.',
});

//! BOOKINGS_____________________________________________
//@ GET
export const getAllBookings = createGetAll(actor, models.Booking, {
  includeRelations: [
    {
      model: models.Customer,
      attributes: { exclude: ['userId'] },
      include: [{ model: models.User }],
    },
    {
      model: models.ScheduleRecord,
      include: [{ model: models.Product }],
    },
    { model: models.Payment, required: false },
    {
      model: models.CustomerPass,
      required: false,
      include: [{ model: models.PassDefinition }],
    },
  ],

  mapRecord: booking => {
    // Format customer full name
    const customerFullName = `${booking.Customer.firstName} ${booking.Customer.lastName} (${booking.Customer.customerId})`;

    // Format schedule details
    const sched = booking.ScheduleRecord;
    const scheduleDetails = `${sched.Product.name} (${sched.date} ${sched.startTime}, sId: ${sched.scheduleId})`;

    // Format payment or customer pass
    const payment = booking.Payment
      ? `${booking.Payment.paymentMethod} (pId:${booking.Payment.paymentId})`
      : `${booking.CustomerPass?.PassDefinition?.name} (cpId:${booking.CustomerPass?.customerPassId})`;

    return {
      ...booking,
      rowId: booking.bookingId,
      customerFullName,
      scheduleDetails,
      payment,
      createdAt: booking.createdAt,
      timestamp: booking.timestamp,
    };
  },

  postAction: (_req, list) => {
    // sort by createdAt descending
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  columnKeys: [
    'bookingId',
    'customerFullName',
    'scheduleDetails',
    'payment',
    'attendance',
    'createdAt',
    'timestamp',
    'performedBy',
  ],
  successMessage: 'Pobrano pomyślnie',
  notFoundMessage: 'Nie znaleziono rekordów.',
});
export const getBookingById = createGetById(actor, models.Booking, {
  // Fetch the booking with related data
  includeRelations: [
    {
      model: models.Customer,
      attributes: { exclude: ['userId'] },
      include: [{ model: models.User }],
    },
    {
      model: models.ScheduleRecord,
      include: [{ model: models.Product }, { model: models.Booking }],
    },
    { model: models.Payment, required: false },
    {
      model: models.CustomerPass,
      required: false,
      include: [{ model: models.PassDefinition }],
    },
  ],

  mapRecord: bookingInstance => {
    // Convert to plain object
    const booking = bookingInstance.toJSON();

    // Calculate attendance count
    let attendance = 0;
    if (
      booking.ScheduleRecord.Bookings &&
      booking.ScheduleRecord.Bookings.length > 0
    ) {
      booking.ScheduleRecord.Bookings.forEach(b => {
        if (b.attendance === true || b.attendance === 1) {
          attendance += 1;
        }
      });
    }

    // Attach attendance to schedule
    return {
      ...booking,
      ScheduleRecord: {
        ...booking.ScheduleRecord,
        attendance,
      },
    };
  },

  attachResponse: req => ({ user: req.user }),
  successMessage: 'Rezerwacja pobrana pomyślnie',
  notFoundMessage: 'Nie znaleziono rezerwacji.',
});
//@ POST
export const postCreateBookingWithPass = async (req, res, next) => {
  const controllerName = 'postCreateBookingWithPass';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500; // default error code

  try {
    const { scheduleId } = req.params;
    const { customerId, customerPassId } = req.body;

    // Validate required inputs
    isEmptyInput(customerId, '"Numer uczestnika"');
    isEmptyInput(scheduleId, '"Numer terminu"');
    isEmptyInput(customerPassId, '"Numer karnetu uczestnika"');

    // Determine if user wants notifications
    const wantsNotifications = req.user?.UserPrefSetting
      ? req.user.UserPrefSetting.notifications
      : true;

    let currentCustomerPass;
    let currentScheduleRecord;

    // Run booking logic inside a transaction
    const newBooking = await db.transaction(async t => {
      //Load the customer's pass definition
      const customerPass = await models.CustomerPass.findOne({
        where: { customerId, customerPassId },
        include: [{ model: models.PassDefinition }],
        transaction: t,
      });
      if (!customerPass) {
        throw new Error('Nie znaleziono karnetu uczestnika');
      }
      currentCustomerPass = customerPass;

      //Load and lock the schedule record
      const scheduleRecord = await models.ScheduleRecord.findOne({
        where: { scheduleId },
        include: [{ model: models.Product }],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!scheduleRecord) {
        throw new Error('Nie znaleziono terminu');
      }
      currentScheduleRecord = scheduleRecord;

      //Check capacity by counting current attendees
      const count = await models.Booking.count({
        where: { scheduleId, attendance: true },
        transaction: t,
      });
      if (count >= scheduleRecord.capacity) {
        errCode = 409;
        throw new Error('Brak wolnych miejsc w tym terminie');
      }

      //Ensure the customer hasn't already booked this schedule
      const existingBooking = await models.Booking.findOne({
        where: { customerId, scheduleId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (existingBooking) {
        errCode = 409;
        throw new Error('Użytkownik już ma rezerwację');
      }

      //Validate the pass for this schedule
      const validPass = isPassValidForSchedule(
        currentCustomerPass,
        currentScheduleRecord
      );
      if (!validPass) {
        throw new Error('Karnet nie jest ważny na ten termin.');
      }

      //Create the booking
      const booking = await models.Booking.create(
        {
          customerId,
          scheduleId,
          customerPassId: currentCustomerPass.customerPassId,
          attendance: true,
          timestamp: new Date(),
          performedBy: 'Administrator',
        },
        { transaction: t }
      );

      //Decrement pass uses if applicable
      if (typeof currentCustomerPass.usesLeft === 'number') {
        await currentCustomerPass.update(
          { usesLeft: currentCustomerPass.usesLeft - 1 },
          { transaction: t }
        );
      }

      return booking;
    });

    //Send notification email if needed
    if (req.user.email && wantsNotifications) {
      adminEmails.sendNewReservationMail({
        to: req.user.email,
        productName: currentScheduleRecord.Product.name,
        date: currentScheduleRecord.date,
        startTime: currentScheduleRecord.startTime,
        location: currentScheduleRecord.location,
        isAdmin: true,
      });
    }

    //Log success and return response
    successLog(actor, controllerName);
    return res.status(201).json({
      confirmation: 1,
      message: 'Rezerwacja stworzona pomyślnie.',
      result: newBooking,
    });
  } catch (err) {
    // Handle any errors centrally
    console.error('[postCreateBookingWithPass] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
//@ DELETE
export const deleteBookingRecord = createDeleteBooking(
  actor,
  'deleteBookingRecord',
  req => ({
    //thats' 'whereFn'
    customerId: req.body.customerId,
    bookingId: req.body.rowId,
  })
);
export const deleteBooking = createDeleteBooking(
  actor,
  'deleteBooking',
  req => ({ bookingId: req.body.entityId }) //thats' 'whereFn'
);

//! ATTENDANCE_____________________________________________
//@ GET
//@ POST
//@ PUT
export const putEditMarkAbsent = async (req, res, next) => {
  const controllerName = 'putEditMarkAbsent';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500;
  try {
    const { rowId, customerId } = req.body;

    // Load the booking with schedule and customer info
    const foundRecord = await models.Booking.findOne({
      where: { customerId, bookingId: rowId },
      include: [
        {
          model: models.ScheduleRecord,
          required: true,
          include: [{ model: models.Product, required: true }],
        },
        {
          model: models.Customer,
          required: true,
          include: [{ model: models.User, attributes: ['email'] }],
        },
      ],
    });
    if (!foundRecord) {
      errCode = 404;
      throw new Error('Nie znaleziono rekordu obecności w dzienniku.');
    }

    // Prepare data for notification
    const schedule = foundRecord.ScheduleRecord;
    const email = foundRecord.Customer.User.email;
    const wantsNotifications =
      foundRecord.Customer.User.UserPrefSetting?.notifications ?? true;

    // Mark as absent
    await models.Booking.update(
      {
        attendance: 0,
        timestamp: new Date(),
        performedBy: actor,
      },
      {
        where: { customerId, bookingId: rowId },
      }
    );

    // Send email if needed
    if (email && wantsNotifications) {
      adminEmails.sendAttendanceMarkedAbsentMail({
        to: email,
        productName: schedule.Product.name || '',
        date: schedule.date,
        startTime: schedule.startTime,
        location: schedule.location,
        isAdmin: true,
      });
    }

    // Respond success
    successLog(actor, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Uczestnik oznaczony jako nieobecny.',
      affectedRows: 1,
    });
  } catch (err) {
    console.error('[putEditMarkAbsent] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
export const putEditMarkPresent = async (req, res, next) => {
  const controllerName = 'putEditMarkPresent';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500;
  try {
    const { customerId, rowId } = req.body;

    // Run in transaction to lock and count capacity
    const result = await db.transaction(async t => {
      // Load booking with related data
      const foundRecord = await models.Booking.findOne({
        where: { customerId, bookingId: rowId },
        include: [
          {
            model: models.ScheduleRecord,
            required: true,
            include: [{ model: models.Product, required: true }],
          },
          {
            model: models.Customer,
            required: true,
            include: [{ model: models.User, attributes: ['email'] }],
          },
        ],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!foundRecord) {
        errCode = 404;
        throw new Error('Nie znaleziono rekordu obecności w dzienniku.');
      }

      const schedule = foundRecord.ScheduleRecord;
      // Count current present attendees
      const currentAttendance = await models.Booking.count({
        where: { scheduleId: schedule.scheduleId, attendance: true },
        transaction: t,
      });
      if (currentAttendance >= schedule.capacity) {
        errCode = 409;
        throw new Error('Brak wolnych miejsc na ten termin.');
      }

      // Prepare notification data
      const email = foundRecord.Customer.User.email;
      const wantsNotifications =
        foundRecord.Customer.User.UserPrefSetting?.notifications ?? true;

      // Mark as present
      await models.Booking.update(
        {
          attendance: 1,
          timestamp: new Date(),
          performedBy: actor,
        },
        {
          where: { customerId, bookingId: rowId },
          transaction: t,
        }
      );

      // Return info to outer scope
      return { schedule, email, wantsNotifications };
    });

    // Send email if needed
    if (result.email && result.wantsNotifications) {
      adminEmails.sendAttendanceReturningMail({
        to: result.email,
        productName: result.schedule.Product.name || '',
        date: result.schedule.date,
        startTime: result.schedule.startTime,
        location: result.schedule.location,
        isAdmin: true,
      });
    }

    // Respond success
    successLog(actor, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Uczestnik oznaczony jako obecny.',
      affectedRows: 1,
    });
  } catch (err) {
    console.error('[putEditMarkPresent] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};

//! PAYMENTS_____________________________________________
//@ GET
export const getAllPayments = createGetAll(actor, models.Payment, {
  // Log request for debugging (handled by factory)
  includeRelations: [
    { model: models.Customer, attributes: { exclude: ['userId'] } },
    { model: models.Booking },
  ],
  mapRecord: payment => {
    // Format each payment for frontend
    const { Bookings, ...rest } = payment;
    const schedules = Bookings?.map(b => b.ScheduleRecord);
    return {
      ...rest,
      rowId: rest.paymentId,
      date: formatIsoDateTime(rest.date),
      customerFullName: `${rest.Customer.firstName} ${rest.Customer.lastName} (${rest.Customer.customerId})`,
      schedules,
    };
  },
  // sort by date descending
  sortFunction: (a, b) => new Date(b.date) - new Date(a.date),
  columnKeys: [
    'paymentId',
    'date',
    'customerFullName',
    'product',
    'status',
    'paymentMethod',
    'amountPaid',
    'performedBy',
  ],
  attachResponse: req => ({
    // include login flag
    isLoggedIn: req.session.isLoggedIn,
  }),
  successMessage: 'Płatności pobrane pomyślnie.',
  notFoundMessage: 'Nie znaleziono płatności.',
});
export const getPaymentById = createGetById(actor, models.Payment, {
  // Log request for debugging (handled by factory)
  includeRelations: [
    { model: models.Customer },
    {
      model: models.Booking,
      required: false,
      include: [
        {
          model: models.ScheduleRecord,
          attributes: { exclude: ['userId'] },
          include: [{ model: models.Product }],
        },
      ],
    },
    {
      model: models.CustomerPass,
      required: false,
      include: [{ model: models.Customer }, { model: models.PassDefinition }],
    },
  ],
  mapRecord: paymentRecord => {
    // Format customer passes
    const customerPasses = (paymentRecord.CustomerPasses || []).map(cp => {
      const { Customer: cust, PassDefinition: def } = cp;
      return {
        customerPassId: cp.customerPassId,
        rowId: cp.customerPassId,
        customerFirstName: cust.firstName,
        customerLastName: cust.lastName,
        customerId: cust.customerId,
        passDefId: def.passDefId,
        allowedProductTypes: def.allowedProductTypes,
        passName: def.name,
        purchaseDate: cp.purchaseDate,
        validFrom: cp.validFrom,
        validUntil: cp.validUntil,
        usesLeft: cp.usesLeft,
        status: cp.status,
      };
    });
    delete paymentRecord.CustomerPasses;
    // return under "payment" key with formatted customerPasses
    return { ...paymentRecord, customerPasses };
  },
  // include login flag
  attachResponse: req => ({
    isLoggedIn: req.session.isLoggedIn,
  }),
  successMessage: 'Płatność pobrana pomyślnie.',
  notFoundMessage: 'Nie znaleziono płatności.',
});
//@ POST
export const postCreatePayment = async (req, res, next) => {
  const controllerName = 'postCreatePayment';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 400;
  const {
    customerId,
    scheduleId,
    passDefId,
    passStartDate,
    amountPaid,
    paymentMethod,
  } = req.body;

  try {
    // Validate amountPaid
    if (isNaN(amountPaid) || Number(amountPaid) < 0) {
      throw new Error('amountPaid wrong');
    }
    // Validate paymentMethod
    const pm = Number(paymentMethod);
    if (![1, 2, 3].includes(pm)) {
      throw new Error('paymentMethod wrong');
    }
    // Ensure customerId and required fields are present
    if (!customerId) {
      throw new Error('Pole uczestnika nie może być puste.');
    }
    if (!String(amountPaid).trim()) {
      throw new Error('Pole kwoty nie może być puste.');
    }
    if (!String(paymentMethod).trim()) {
      throw new Error('Pole metody płatności nie może być puste.');
    }

    // Deduce human-readable payment method
    const paymentMethodDeduced =
      pm === 1 ? 'Gotówka (M)' : pm === 2 ? 'BLIK (M)' : 'Przelew (M)';

    // Prepare shared variables for email
    let currentCustomer,
      currentPassDefinition,
      customerEmail,
      wantsNotifications;

    // Run all DB operations in a transaction
    const result = await db.transaction(async t => {
      // Load customer with passes and user
      currentCustomer = await models.Customer.findByPk(customerId, {
        include: [
          { model: models.CustomerPass, include: [models.PassDefinition] },
          { model: models.User },
        ],
        transaction: t,
      });
      if (!currentCustomer) {
        errCode = 404;
        throw new Error('Nie znaleziono klienta');
      }
      // Prepare email info
      customerEmail = currentCustomer.User.email;
      wantsNotifications = currentCustomer.User.UserPrefSetting
        ? currentCustomer.User.UserPrefSetting.notifications
        : true;

      if (passDefId) {
        // -------------------------
        //# PASS PURCHASE BRANCH
        // -------------------------
        // Prevent double-purchase of an active pass
        const existingPass = await models.CustomerPass.findOne({
          where: {
            customerId,
            passDefId,
            status: 1,
            validUntil: { [Op.gt]: passStartDate },
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (existingPass) {
          throw new Error(
            'Nie można zapłacić 2x za ten sam karnet, który jest nadal aktywny. Wybierz datę startową nowego karnetu, po zakończeniu poprzedniego.'
          );
        }
        // Load pass definition
        currentPassDefinition = await models.PassDefinition.findByPk(
          passDefId,
          {
            transaction: t,
          }
        );
        if (!currentPassDefinition) {
          errCode = 404;
          throw new Error('Nie znaleziono definicji karnetu.');
        }
        // Validate paid amount
        if (parseFloat(currentPassDefinition.price) < parseFloat(amountPaid)) {
          throw new Error('Kwota nie może być większa niż żądana cena.');
        }
        const amountDueCalculated =
          parseFloat(currentPassDefinition.price) - parseFloat(amountPaid);
        const statusDeduced = amountDueCalculated <= 0 ? 1 : 0;

        // Create payment record
        const payment = await models.Payment.create(
          {
            customerId,
            date: new Date(),
            product: `${currentPassDefinition.name} (dId: ${currentPassDefinition.passDefId})`,
            status: statusDeduced,
            amountPaid,
            amountDue: amountDueCalculated,
            paymentMethod: paymentMethodDeduced,
            paymentStatus: 1,
            performedBy: 'Administrator',
          },
          { transaction: t }
        );

        // Create customer-pass link
        const purchaseDate = new Date();
        const calcExpiryDate = calcPassExpiryDate(
          currentPassDefinition.validityDays
        );
        const customerPass = await models.CustomerPass.create(
          {
            customerId,
            paymentId: payment.paymentId,
            passDefId: currentPassDefinition.passDefId,
            purchaseDate,
            validFrom: passStartDate,
            validUntil: calcExpiryDate,
            usesLeft: currentPassDefinition.usesTotal,
            status: 1,
          },
          { transaction: t }
        );

        // Send purchase email if needed
        if (customerEmail && wantsNotifications) {
          adminEmails.sendNewPassPurchasedMail({
            to: customerEmail,
            productName: currentPassDefinition.name,
            productPrice: currentPassDefinition.price,
            purchaseDate: customerPass.purchaseDate,
            validFrom: customerPass.validFrom,
            validUntil: customerPass.validUntil,
            allowedProductTypes: JSON.parse(
              currentPassDefinition.allowedProductTypes
            ),
            usesTotal: currentPassDefinition.usesTotal,
            description: currentPassDefinition.description,
            isAdmin: true,
          });
        }

        return { payment, customerPass };
      } else {
        // -------------------------
        //# DIRECT BOOKING & PAYMENT BRANCH
        // -------------------------
        // Prevent duplicate booking
        const existingBooking = await models.Booking.findOne({
          where: { customerId, scheduleId },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (existingBooking) {
          throw new Error('Rezerwacja dla tego terminu już istnieje.');
        }
        // Load schedule and product
        const scheduleRecord = await models.ScheduleRecord.findByPk(
          scheduleId,
          {
            include: [{ model: models.Product }],
            transaction: t,
            lock: t.LOCK.UPDATE,
          }
        );
        if (!scheduleRecord) {
          errCode = 404;
          throw new Error('Nie znaleziono terminu');
        }
        // Check capacity
        const currentAttendance = await models.Booking.count({
          where: { scheduleId, attendance: true },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (currentAttendance >= scheduleRecord.capacity) {
          errCode = 409;
          throw new Error('Brak wolnych miejsc na ten termin.');
        }
        // Validate payment amount
        if (parseFloat(scheduleRecord.Product.price) < parseFloat(amountPaid)) {
          throw new Error('Kwota nie może być większa niż żądana cena.');
        }
        const amountDueCalculated =
          parseFloat(scheduleRecord.Product.price) - parseFloat(amountPaid);
        const statusDeduced = amountDueCalculated <= 0 ? 1 : 0;

        // Create payment record
        const payment = await models.Payment.create(
          {
            customerId,
            date: new Date(),
            product: `${scheduleRecord.Product.name} (sId: ${scheduleRecord.scheduleId})`,
            status: statusDeduced,
            amountPaid,
            amountDue: amountDueCalculated,
            paymentMethod: paymentMethodDeduced,
            paymentStatus: 1,
            performedBy: 'Administrator',
          },
          { transaction: t }
        );

        // Create booking record
        const booking = await models.Booking.create(
          {
            customerId,
            scheduleId: scheduleRecord.scheduleId,
            paymentId: payment.paymentId,
            timestamp: new Date(),
            attendance: true,
            performedBy: 'Administrator',
          },
          { transaction: t }
        );

        // Send booking email if needed
        if (customerEmail && wantsNotifications) {
          adminEmails.sendNewReservationMail({
            to: customerEmail,
            productName: scheduleRecord.Product.name,
            date: scheduleRecord.date,
            startTime: scheduleRecord.startTime,
            location: scheduleRecord.location,
            isAdmin: true,
          });
        }

        return { payment, booking };
      }
    });

    // Log success and send response
    successLog(actor, controllerName);
    return res.status(201).json({
      isNewCustomer: false,
      confirmation: 1,
      message: 'Płatność zarejestrowana pomyślnie.',
      result,
    });
  } catch (err) {
    console.error('[postCreatePayment] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
//@ PUT
//@ DELETE
export const deletePayment = createDelete(actor, models.Payment, {
  preAction: async req => {
    const id = req.params.id;

    // Load the payment to get customer email
    const payment = await models.Payment.findOne({
      where: { paymentId: id },
      include: [
        {
          model: models.Customer,
          include: [{ model: models.User, attributes: ['email'] }],
        },
      ],
    });
    if (!payment) {
      const err = new Error('Nie znaleziono płatności.');
      err.status = 404;
      throw err;
    }

    // pass to postAction email and paymentId
    return {
      customerEmail: payment.Customer?.User?.email,
      paymentId: id,
    };
  },

  // where for delete
  where: req => ({ paymentId: req.params.id }),

  // Send cancellation email if customer email exists
  postAction: async ({ customerEmail, paymentId }) => {
    if (customerEmail) {
      await adminEmails.sendPaymentCancelledMail({
        to: customerEmail,
        paymentId,
        isAdmin: true,
      });
    }
  },
  successMessage: 'Płatność usunięta pomyślnie.',
  notFoundMessage: 'Nie znaleziono płatności.',
});

//! INVOICES_____________________________________________
//@ GET
export const getAllInvoices = createGetAll(actor, models.Invoice, {
  includeRelations: [
    {
      model: models.Payment,
      include: [{ model: models.Customer }],
    },
  ],
  excludeFields: ['product'],
  mapRecord: invoice => ({
    ...invoice,
    rowId: invoice.invoiceId,
    invoiceDate: formatIsoDateTime(invoice.invoiceDate),
    customerFullName: `${invoice.Payment.Customer.firstName} ${invoice.Payment.Customer.lastName}`,
  }),
  columnKeys: [
    'invoiceId',
    'paymentId',
    'invoiceDate',
    'customerFullName',
    'dueDate',
    'paymentStatus',
    'totalAmount',
  ],
  attachResponse: req => ({
    isLoggedIn: req.session.isLoggedIn,
  }),
  successMessage: 'Faktury pobrane pomyślnie.',
  notFoundMessage: 'Nie znaleziono faktur.',
});
//@ POST
//@ PUT
//@ DELETE

//! FEEDBACK_____________________________________________
//@ GET
export const getAllParticipantsFeedback = createGetAll(actor, models.Feedback, {
  includeRelations: [
    { model: models.Customer },
    {
      model: models.ScheduleRecord,
      include: [{ model: models.Product, attributes: ['name'] }],
    },
  ],
  excludeFields: ['product'],
  mapRecord: feedback => {
    return {
      ...feedback,
      rowId: feedback.feedbackId,
      submissionDate: formatIsoDateTime(feedback.submissionDate),
      customerFullName: `${feedback.Customer.firstName} ${feedback.Customer.lastName} (${feedback.Customer.customerId})`,
      schedule: `${feedback.ScheduleRecord.Product.name} ${feedback.ScheduleRecord.date} | ${feedback.ScheduleRecord.startTime}`,
    };
  },
  columnKeys: [
    'feedbackId',
    'submissionDate',
    'delay',
    'schedule',
    'rating',
    'content',
    'customerFullName',
  ],
  attachResponse: req => ({
    isLoggedIn: req.session.isLoggedIn,
  }),
  successMessage: 'Opinie pobrane pomyślnie',
  notFoundMessage: 'Nie znaleziono opinii.',
});
export const getAllParticipantsFeedbackById = createGetById(
  actor,
  models.Feedback,
  {
    // Log request for debugging (handled by factory)
    includeRelations: [
      { model: models.Customer },
      {
        model: models.ScheduleRecord,
        attributes: { exclude: ['productId'] },
        include: [{ model: models.Product }],
      },
    ],
    excludeFields: ['customerId', 'scheduleId'],

    // Fetch the requested review with its customer and schedule->product
    mapRecord: review => review,

    // Fetch other reviews by same customer, excluding this one
    postAction: async (req, review) => {
      const otherReviews = await models.Feedback.findAll({
        where: {
          customerId: review.Customer.customerId,
          feedbackId: { [Op.ne]: review.feedbackId },
        },
        include: [
          {
            model: models.ScheduleRecord,
            attributes: { exclude: ['productId'] },
            include: [{ model: models.Product }],
          },
        ],
        attributes: { exclude: ['customerId', 'scheduleId'] },
      });
      req.otherReviews = otherReviews.map(o => o.toJSON());
    },

    // include login flag and otherReviews in response
    attachResponse: req => ({
      isLoggedIn: req.session.isLoggedIn,
      otherReviews: req.otherReviews,
    }),
    resultName: 'review',
    successMessage: 'Opinia pobrana pomyślnie',
    notFoundMessage: 'Nie znaleziono opinii.',
  }
);
//@ POST
//@ PUT
//@ DELETE
export const deleteFeedback = createDelete(actor, models.Feedback, {
  // Delete the feedback by its ID (factory uses feedbackId = req.params.id)
  successMessage: 'Opinia usunięta pomyślnie.',
  notFoundMessage: 'Nie usunięto opinii.',
});

//! NEWSLETTERS_____________________________________________
//@ GET
export const getAllNewsletters = createGetAll(actor, models.Newsletter, {
  includeRelations: [], // no extra joins
  excludeFields: [], // hide no fields

  // Format each newsletter for frontend
  mapRecord: newsletter => ({
    ...newsletter,
    rowId: newsletter.newsletterId,
    creationDate: formatIsoDateTime(newsletter.creationDate),
    sendDate: formatIsoDateTime(newsletter.sendDate),
  }),

  columnKeys: [
    'newsletterId',
    'status',
    'creationDate',
    'sendDate',
    'title',
    'content',
  ],
  successMessage: 'Pobrano pomyślnie',
  notFoundMessage: 'Nie znaleziono rekordów.',
});
export const getAllSubscribedNewsletters = (req, res, next) => {
  //
};
//@ POST
//@ PUT
//@ DELETE
