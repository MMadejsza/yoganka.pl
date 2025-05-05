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
export const getAllProducts = async (req, res, next) => {
  const controllerName = 'getAllProducts';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500; // default error code

  try {
    // Fetch all product records
    const records = await models.Product.findAll();

    // If no records found, throw 404
    if (!records || records.length === 0) {
      errCode = 404;
      throw new Error('Nie znaleziono rekordów.');
    }

    // Convert each record to plain object and format startDate
    const formattedRecords = records.map(record => {
      const product = record.toJSON();
      return {
        ...product,
        // Add rowId for table rows
        rowId: product.productId,
        // Format startDate for display
        startDate: formatIsoDateTime(product.startDate),
      };
    });

    // Define table headers / keys
    const totalKeys = [
      'productId',
      'type',
      'name',
      'location',
      'duration',
      'price',
      'startDate',
      'status',
    ];

    // Log success and send response
    successLog(actor, controllerName);
    return res.json({
      totalKeys,
      confirmation: 1,
      message: 'Pobrano pomyślnie',
      content: formattedRecords,
    });
  } catch (err) {
    // Log error then handle centrally
    console.error('[getAllProducts] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
export const getProductById = async (req, res, next) => {
  const controllerName = 'getProductById';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500; // default error code
  try {
    const PK = req.params.id;

    // Fetch product and related records
    const product = await models.Product.findByPk(PK, {
      include: [
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
    });

    // If not found, throw 404
    if (!product) {
      errCode = 404;
      throw new Error('Nie znaleziono produktu.');
    }

    // Log success and send the product object
    successLog(actor, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Produkt pobrany pomyślnie.',
      isLoggedIn: req.session.isLoggedIn,
      product,
    });
  } catch (err) {
    // Handle errors centrally
    console.error('[getProductById] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
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
export const deleteProduct = async (req, res, next) => {
  const controllerName = 'deleteProduct';
  callLog(req, actor, controllerName);
  let errCode = 500;

  try {
    const id = req.params.id;

    // Delete product by ID
    const deletedCount = await models.Product.destroy({
      where: { productId: id },
    });

    if (!deletedCount) {
      errCode = 404;
      throw new Error('Nie usunięto zajęć.');
    }

    // Log success and respond
    successLog(actor, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Produkt usunięty pomyślnie.',
    });
  } catch (err) {
    console.error('[deleteProduct] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};

//! PASSES_______________________________________________
//@ GET
export const getAllPasses = async (req, res, next) => {
  const controllerName = 'getAllPasses';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500;
  try {
    //Fetch all pass definitions
    const records = await models.PassDefinition.findAll();
    if (!records || records.length === 0) {
      errCode = 404;
      throw new Error('Nie znaleziono rekordów.');
    }

    //Format each pass definition for frontend
    const formattedRecords = records.map(record => {
      const passDef = record.toJSON();
      return {
        ...passDef,
        rowId: passDef.passDefId,
        usesTotal: passDef.usesTotal || '-',
        validityDays: passDef.validityDays
          ? `${passDef.validityDays} dni`
          : '-',
        price: `${passDef.price} zł`,
        allowedProductTypes: JSON.parse(passDef.allowedProductTypes).join(', '),
      };
    });

    //Sort definitions by ID
    const sortedRecords = formattedRecords.sort(
      (a, b) => a.passDefId - b.passDefId
    );

    //Define table columns
    const totalKeys = [
      'passDefId',
      'name',
      'description',
      'passType',
      'usesTotal',
      'validityDays',
      'allowedProductTypes',
      'price',
    ];

    //Fetch all customer passes with related models
    const cp = await models.CustomerPass.findAll({
      include: [{ model: models.Customer }, { model: models.PassDefinition }],
    });

    //Format customer passes for frontend
    const formattedCustomerPasses = cp
      .map(customerPass => {
        const { Customer: customer, PassDefinition } = customerPass;
        return {
          customerPassId: customerPass.customerPassId,
          rowId: customerPass.customerPassId,
          customerFirstName: customer.firstName,
          customerLastName: customer.lastName,
          customerId: customer.customerId,
          passName: PassDefinition.name,
          passDefId: PassDefinition.passDefId,
          allowedProductTypes: PassDefinition.allowedProductTypes,
          purchaseDate: customerPass.purchaseDate,
          validFrom: customerPass.validFrom,
          validUntil: customerPass.validUntil,
          usesLeft: customerPass.usesLeft,
          status: customerPass.status,
        };
      })
      .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

    //Send response
    successLog(actor, controllerName);
    return res.json({
      totalKeys,
      confirmation: 1,
      message: 'Pobrano pomyślnie',
      content: sortedRecords,
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
    });
  } catch (err) {
    console.error('[getAllPasses] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};

export const getPassById = async (req, res, next) => {
  const controllerName = 'getPassById';
  // Log request for debugging
  console.log(`➡️➡️➡️ ${actor} called`, controllerName);

  let errCode = 500;
  try {
    const PK = req.params.id;

    //Fetch pass definition with its customer passes and payments
    const passData = await models.PassDefinition.findByPk(PK, {
      include: [
        {
          model: models.CustomerPass,
          include: [{ model: models.Customer }, { model: models.Payment }],
        },
      ],
    });

    if (!passData) {
      errCode = 404;
      throw new Error('Nie znaleziono definicji karnetu.');
    }
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
    const passDefinition = {
      ...passDef,
      CustomerPasses: null,
    };
    const passDefFormatted = {
      ...passDefinition,
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

    //Return response
    successLog(actor, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Definicja karnetu pobrana pomyślnie',
      passDefinition: passDefFormatted,
    });
  } catch (err) {
    console.error('[getPassById] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};

export const getCustomerPassById = async (req, res, next) => {
  const controllerName = 'getCustomerPassById';
  // Log request for debugging
  console.log(`➡️➡️➡️ ${actor} called`, controllerName);

  let errCode = 500;
  try {
    const passId = req.params.id;

    //Fetch specific customer pass with definition and payment
    const cpData = await models.CustomerPass.findOne({
      where: { customerPassId: passId },
      include: [{ model: models.PassDefinition }, { model: models.Payment }],
    });

    if (!cpData) {
      errCode = 404;
      throw new Error('Nie znaleziono definicji karnetu.');
    }
    const cp = cpData.toJSON();

    //Format payment
    const payment = {
      paymentId: cp.Payment.paymentId,
      date: formatIsoDateTime(cp.Payment.date),
      amountPaid: cp.Payment.amountPaid,
      paymentMethod: cp.Payment.paymentMethod,
      status: cp.Payment.status,
    };

    //Format pass definition fields
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

    //Build final customerPass object
    const formattedCustomerPass = {
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

    //Return response
    successLog(actor, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Definicja karnetu pobrana pomyślnie',
      customerPass: formattedCustomerPass,
    });
  } catch (err) {
    console.error('[getCustomerPassById] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
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
export const deleteCustomerPass = async (req, res, next) => {
  const controllerName = 'deleteCustomerPass';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500; // default error code
  try {
    const id = req.params.id;
    // Delete the customer pass by ID
    const deletedCount = await models.CustomerPass.destroy({
      where: { customerPassId: id },
    });

    // If nothing was deleted, throw 404
    if (!deletedCount) {
      errCode = 404;
      throw new Error('Nie usunięto karnetu uczestnika.');
    }

    // Log success and send response
    successLog(actor, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Karnet uczestnika usunięty pomyślnie.',
    });
  } catch (err) {
    // Log error then handle it centrally
    console.error('[deleteCustomerPass] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
export const deletePassDefinition = async (req, res, next) => {
  const controllerName = 'deletePassDefinition';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500; // default error code
  try {
    const id = req.params.id;
    // Delete the pass definition by ID
    const deletedCount = await models.PassDefinition.destroy({
      where: { passDefId: id },
    });

    // If nothing was deleted, throw 404
    if (!deletedCount) {
      errCode = 404;
      throw new Error('Nie usunięto definicji karnetu.');
    }

    // Log success and send response
    successLog(actor, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Definicja karnetu usunięta pomyślnie.',
    });
  } catch (err) {
    // Log error then handle it centrally
    console.error('[deletePassDefinition] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};

//! BOOKINGS_____________________________________________
//@ GET
export const getAllBookings = async (req, res, next) => {
  const controllerName = 'getAllBookings';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500;
  try {
    // Fetch all bookings with related data
    const records = await models.Booking.findAll({
      include: [
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
          include: [{ model: models.PassDefinition }],
          required: false,
        },
      ],
    });

    // If no records found, throw 404
    if (!records || records.length === 0) {
      errCode = 404;
      throw new Error('Nie znaleziono rekordów.');
    }

    // Format each booking for frontend
    const formattedRecords = records.map(record => {
      const booking = record.toJSON();
      const customerFullName = `${record.Customer.firstName} ${record.Customer.lastName} (${record.Customer.customerId})`;
      const scheduleDetails = `${record.ScheduleRecord.Product.name} (${record.ScheduleRecord.date} ${record.ScheduleRecord.startTime}, sId: ${record.ScheduleRecord.scheduleId})`;
      const payment = record.Payment
        ? `${record.Payment.paymentMethod} (pId:${record.Payment.paymentId})`
        : `${record.CustomerPass?.PassDefinition?.name} (cpId:${record.CustomerPass?.customerPassId})`;

      return {
        ...booking,
        rowId: booking.bookingId,
        customerFullName,
        scheduleDetails,
        payment,
        createdAt: record.createdAt,
        timestamp: record.timestamp,
      };
    });

    // Define table columns
    const totalKeys = [
      'bookingId',
      'customerFullName',
      'scheduleDetails',
      'payment',
      'attendance',
      'createdAt',
      'timestamp',
      'performedBy',
    ];

    // Log success and send response
    successLog(actor, controllerName);
    return res.json({
      totalKeys,
      confirmation: 1,
      message: 'Pobrano pomyślnie',
      content: formattedRecords.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    });
  } catch (err) {
    console.error('[getAllBookings] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
export const getBookingById = async (req, res, next) => {
  const controllerName = 'getBookingID';
  // Log request for debugging
  console.log(`➡️➡️➡️ admin called`, controllerName);

  let errCode = 500;
  try {
    const PK = req.params.id;
    // Fetch the booking with related data
    const bookingData = await models.Booking.findByPk(PK, {
      include: [
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
          include: [{ model: models.PassDefinition }],
          required: false,
        },
      ],
    });

    // If not found, throw 404
    if (!bookingData) {
      errCode = 404;
      throw new Error('Nie znaleziono rezerwacji.');
    }

    // Convert to plain object
    const booking = bookingData.toJSON();

    // Calculate attendance count
    let attendance = 0;
    if (
      booking.ScheduleRecord.Bookings &&
      booking.ScheduleRecord.Bookings.length > 0
    ) {
      booking.ScheduleRecord.Bookings.forEach(b => {
        if (b.attendance == 1 || b.attendance === true) {
          attendance += 1;
        }
      });
    }

    // Attach attendance to schedule
    const bookingFormatted = {
      ...booking,
      ScheduleRecord: {
        ...booking.ScheduleRecord,
        attendance,
      },
    };

    // Log success and send response
    successLog(actor, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Rezerwacja pobrana pomyślnie',
      booking: bookingFormatted,
      user: req.user,
    });
  } catch (err) {
    console.error('[getBookingById] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
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
export const deleteBookingRecord = async (req, res, next) => {
  const controllerName = 'deleteBookingRecord';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500;
  try {
    const { customerId, rowId } = req.body;

    // Find the specific booking record with related schedule and customer data
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

    // Extract data for email notification
    const currentScheduleRecord = foundRecord.ScheduleRecord;
    const customerEmail = foundRecord.Customer.User.email;
    const wantsNotifications = foundRecord.Customer.User.UserPrefSetting
      ? foundRecord.Customer.User.UserPrefSetting.notifications
      : true;

    // Delete the booking record
    const deleted = await foundRecord.destroy();
    if (!deleted) {
      errCode = 404;
      throw new Error('Nie usunięto rekordu.');
    }

    // Send notification email if the user wants it
    if (customerEmail && wantsNotifications) {
      adminEmails.sendBookingDeletedMail({
        to: customerEmail,
        productName: currentScheduleRecord.Product.name || 'Zajęcia',
        date: currentScheduleRecord.date,
        startTime: currentScheduleRecord.startTime,
        location: currentScheduleRecord.location,
        isAdmin: true,
      });
    }

    // Log success and send response
    successLog(actor, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message:
        'Rekord obecności usunięty. Rekord płatności pozostał nieruszony.',
    });
  } catch (err) {
    console.error('[deleteBookingRecord] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
export const deleteBooking = async (req, res, next) => {
  const controllerName = 'deleteBooking';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500;
  try {
    const { entityId } = req.body;

    // Find the booking with related schedule and customer data
    const foundRecord = await models.Booking.findOne({
      where: { bookingId: entityId },
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

    // Extract data for email notification
    const currentScheduleRecord = foundRecord.ScheduleRecord;
    const customerEmail = foundRecord.Customer.User.email;
    const wantsNotifications = foundRecord.Customer.User.UserPrefSetting
      ? foundRecord.Customer.User.UserPrefSetting.notifications
      : true;

    // Delete the booking
    const deleted = await foundRecord.destroy();
    if (!deleted) {
      errCode = 404;
      throw new Error('Nie usunięto rekordu.');
    }

    // Send notification email if the user wants it
    if (customerEmail && wantsNotifications) {
      adminEmails.sendBookingDeletedMail({
        to: customerEmail,
        productName: currentScheduleRecord.Product.name || 'Zajęcia',
        date: currentScheduleRecord.date,
        startTime: currentScheduleRecord.startTime,
        location: currentScheduleRecord.location,
        isAdmin: true,
      });
    }

    // Log success and send response
    successLog(actor, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message:
        'Rekord obecności usunięty. Rekord płatności pozostał nieruszony.',
    });
  } catch (err) {
    console.error('[deleteBooking] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};

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
export const getAllPayments = async (req, res, next) => {
  const controllerName = 'getAllPayments';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500;
  try {
    // Fetch all payments with customer and booking info
    const records = await models.Payment.findAll({
      include: [
        { model: models.Customer, attributes: { exclude: ['userId'] } },
        { model: models.Booking },
      ],
    });
    // If no payments found, throw 404
    if (!records || records.length === 0) {
      errCode = 404;
      throw new Error('Nie znaleziono płatności.');
    }

    // Format each payment for frontend
    const formattedRecords = records.map(record => {
      const payment = record.toJSON();
      const schedules = payment.Bookings?.map(b => b.ScheduleRecord);
      return {
        ...payment,
        rowId: payment.paymentId,
        date: formatIsoDateTime(payment.date),
        customerFullName: `${payment.Customer.firstName} ${payment.Customer.lastName} (${payment.Customer.customerId})`,
        schedules,
      };
    });

    // Define table columns
    const totalKeys = [
      'paymentId',
      'date',
      'customerFullName',
      'product',
      'status',
      'paymentMethod',
      'amountPaid',
      'performedBy',
    ];

    // Log success and send response
    successLog(actor, controllerName);
    return res.json({
      confirmation: 1,
      message: 'Płatności pobrane pomyślnie.',
      isLoggedIn: req.session.isLoggedIn,
      totalKeys,
      content: formattedRecords.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      ),
    });
  } catch (err) {
    console.error('[getAllPayments] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
export const getPaymentById = async (req, res, next) => {
  const controllerName = 'getPaymentById';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500;
  try {
    const PK = req.params.id;
    // Fetch payment with related data
    const paymentRecord = await models.Payment.findByPk(PK, {
      include: [
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
          include: [
            { model: models.Customer },
            { model: models.PassDefinition },
          ],
        },
      ],
    });
    // If not found, throw 404
    if (!paymentRecord) {
      errCode = 404;
      throw new Error('Nie znaleziono płatności.');
    }

    const parsed = paymentRecord.toJSON();
    // Format customer passes
    const customerPasses =
      parsed.CustomerPasses?.map(cp => {
        const cust = cp.Customer;
        const def = cp.PassDefinition;
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
      }) || [];
    delete parsed.CustomerPasses;

    // Log success and send response
    successLog(actor, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Płatność pobrana pomyślnie.',
      isLoggedIn: req.session.isLoggedIn,
      payment: { ...parsed, customerPasses },
    });
  } catch (err) {
    console.error('[getPaymentById] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
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
export const deletePayment = async (req, res, next) => {
  const controllerName = 'deletePayment';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500;
  try {
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
      errCode = 404;
      throw new Error('Nie znaleziono płatności.');
    }

    // Send cancellation email if customer email exists
    const customerEmail = payment.Customer?.User?.email;
    if (customerEmail) {
      await adminEmails.sendPaymentCancelledMail({
        to: customerEmail,
        paymentId: payment.paymentId,
        isAdmin: true,
      });
    }

    // Delete the payment record
    const deletedCount = await models.Payment.destroy({
      where: { paymentId: id },
    });
    if (!deletedCount) {
      errCode = 500;
      throw new Error('Wystąpił problem przy usuwaniu płatności.');
    }

    // Log success and send response
    successLog(actor, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Płatność usunięta pomyślnie.',
    });
  } catch (err) {
    console.error('[deletePayment] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};

//! INVOICES_____________________________________________
//@ GET
export const getAllInvoices = async (req, res, next) => {
  const controllerName = 'getAllInvoices';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500;
  try {
    // Fetch all invoices with related payment and customer data
    const records = await models.Invoice.findAll({
      include: [
        {
          model: models.Payment,
          include: [{ model: models.Customer }],
        },
      ],
      attributes: { exclude: ['product'] },
    });
    if (!records || records.length === 0) {
      errCode = 404;
      throw new Error('Nie znaleziono faktur.');
    }

    // Format each invoice for frontend
    const formattedRecords = records.map(record => {
      const invoice = record.toJSON();
      return {
        ...invoice,
        rowId: invoice.invoiceId,
        invoiceDate: formatIsoDateTime(invoice.invoiceDate),
        customerFullName: `${invoice.Payment.Customer.firstName} ${invoice.Payment.Customer.lastName}`,
      };
    });

    // Define table columns
    const totalKeys = [
      'invoiceId',
      'paymentId',
      'invoiceDate',
      'customerFullName',
      'dueDate',
      'paymentStatus',
      'totalAmount',
    ];

    // Log success and send response
    successLog(actor, controllerName);
    return res.json({
      confirmation: 1,
      message: 'Faktury pobrane pomyślnie.',
      isLoggedIn: req.session.isLoggedIn,
      totalKeys,
      content: formattedRecords,
    });
  } catch (err) {
    console.error('[getAllInvoices] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
//@ POST
//@ PUT
//@ DELETE

//! FEEDBACK_____________________________________________
//@ GET
export const getAllParticipantsFeedback = async (req, res, next) => {
  const controllerName = 'getAllParticipantsFeedback';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500;
  try {
    // Fetch all feedbacks with customer and schedule->product
    const records = await models.Feedback.findAll({
      include: [
        { model: models.Customer },
        {
          model: models.ScheduleRecord,
          include: [{ model: models.Product, attributes: ['name'] }],
        },
      ],
      attributes: { exclude: ['product'] },
    });
    if (!records || records.length === 0) {
      errCode = 404;
      throw new Error('Nie znaleziono opinii.');
    }

    // Format each feedback for frontend
    const formattedRecords = records.map(record => {
      const feedback = record.toJSON();
      return {
        ...feedback,
        rowId: feedback.feedbackId,
        submissionDate: formatIsoDateTime(feedback.submissionDate),
        customerFullName: `${feedback.Customer.firstName} ${feedback.Customer.lastName} (${feedback.Customer.customerId})`,
        schedule: `${feedback.ScheduleRecord.Product.name} ${feedback.ScheduleRecord.date} | ${feedback.ScheduleRecord.startTime}`,
      };
    });

    // Define table columns
    const totalKeys = [
      'feedbackId',
      'submissionDate',
      'delay',
      'schedule',
      'rating',
      'content',
      'customerFullName',
    ];

    // Log success and send response
    successLog(actor, controllerName);
    return res.json({
      confirmation: 1,
      message: 'Opinie pobrane pomyślnie',
      isLoggedIn: req.session.isLoggedIn,
      totalKeys,
      content: formattedRecords,
    });
  } catch (err) {
    console.error('[getAllParticipantsFeedback] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
export const getAllParticipantsFeedbackById = async (req, res, next) => {
  const controllerName = 'getAllParticipantsFeedbackById';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500;
  try {
    const PK = req.params.id;
    // Fetch the requested feedback with its customer and schedule->product
    const review = await models.Feedback.findByPk(PK, {
      include: [
        { model: models.Customer },
        {
          model: models.ScheduleRecord,
          attributes: { exclude: ['productId'] },
          include: [{ model: models.Product }],
        },
      ],
      attributes: { exclude: ['customerId', 'scheduleId'] },
    });
    if (!review) {
      errCode = 404;
      throw new Error('Nie znaleziono opinii.');
    }

    // Fetch other reviews by same customer, excluding this one
    const otherReviews = await models.Feedback.findAll({
      where: {
        customerId: review.Customer.customerId,
        feedbackId: { [Op.ne]: PK },
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

    // Log success and send response
    successLog(actor, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Opinia pobrana pomyślnie',
      isLoggedIn: req.session.isLoggedIn,
      review,
      otherReviews,
    });
  } catch (err) {
    console.error('[getAllParticipantsFeedbackById] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
//@ POST
//@ PUT
//@ DELETE
export const deleteFeedback = async (req, res, next) => {
  const controllerName = 'deleteFeedback';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500;
  try {
    const id = req.params.id;

    // Delete the feedback by its ID
    const deletedCount = await models.Feedback.destroy({
      where: { feedbackId: id },
    });
    // If nothing was deleted, treat as not found
    if (!deletedCount) {
      errCode = 404;
      throw new Error('Nie usunięto opinii.');
    }

    // Log success and send response
    successLog(actor, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Opinia usunięta pomyślnie.',
    });
  } catch (err) {
    console.error('[deleteFeedback] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};

//! NEWSLETTERS_____________________________________________
//@ GET
export const getAllNewsletters = async (req, res, next) => {
  const controllerName = 'getAllNewsletters';
  // Log request for debugging
  callLog(req, actor, controllerName);

  let errCode = 500;
  try {
    // Fetch all newsletter records
    const records = await models.Newsletter.findAll();
    // If none found, throw 404
    if (!records || records.length === 0) {
      errCode = 404;
      throw new Error('Nie znaleziono rekordów.');
    }

    // Format each newsletter for frontend
    const formattedRecords = records.map(record => {
      const newsletter = record.toJSON();
      return {
        ...newsletter,
        rowId: newsletter.newsletterId,
        creationDate: formatIsoDateTime(newsletter.creationDate),
        sendDate: formatIsoDateTime(newsletter.sendDate),
      };
    });

    // Define table columns
    const totalKeys = [
      'newsletterId',
      'status',
      'creationDate',
      'sendDate',
      'title',
      'content',
    ];

    // Log success and send response
    successLog(actor, controllerName);
    return res.json({
      totalKeys,
      confirmation: 1,
      message: 'Pobrano pomyślnie',
      content: formattedRecords,
    });
  } catch (err) {
    console.error('[getAllNewsletters] error:', err);
    return catchErr(actor, res, errCode, err, controllerName);
  }
};
export const getAllSubscribedNewsletters = (req, res, next) => {
  //
};
//@ POST
//@ PUT
//@ DELETE
