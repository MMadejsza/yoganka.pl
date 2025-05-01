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
const person = 'Admin';

//! USERS_____________________________________________
//@ GET
export const getAllUsers = async (req, res, next) => {
  const controllerName = 'getAllUsers';
  // Log the incoming request for debugging purposes
  callLog(req, person, controllerName);

  const model = models.User;
  try {
    // Fetch all users, including their preference setting ID if it exists
    const records = await model.findAll({
      include: [
        {
          model: models.UserPrefSetting,
          attributes: ['userPrefId'],
        },
      ],
      attributes: {
        exclude: ['passwordHash'], // deleting
      },
    });

    // If no records found, set error code and throw an error
    if (!records || records.length === 0) {
      errCode = 404;
      throw new Error('Nie znaleziono użytkowników.');
    }

    // Convert each Sequelize record to plain object and format fields
    const formattedRecords = records.map(record => {
      const user = record.toJSON();

      return {
        // Add a rowId field for UI tables
        rowId: user.userId,
        userId: user.userId,

        role: user.role,
        email: user.email,
        // Format the registration date to ISO + weekday
        registrationDate: formatIsoDateTime(user.registrationDate),
        // Show if user has pref settings or not
        // Format last login date similarly
        lastLoginDate: formatIsoDateTime(user.lastLoginDate),
        prefSettings: user.UserPrefSetting
          ? `Tak (Id: ${user.UserPrefSetting.userPrefId})`
          : 'Nie',
      };
    });

    // Define the column order/headers to send back
    const totalKeys = [
      'userId',
      'email',
      'lastLoginDate',
      'registrationDate',
      'role',
      'prefSettings',
    ];

    // All good: log success and return JSON response
    successLog(person, controllerName);
    return res.json({
      confirmation: 1,
      message: 'Konta pobrane pomyślnie.',
      isLoggedIn: req.session.isLoggedIn,
      totalKeys,
      // Sort records by email before sending
      content: formattedRecords.sort((a, b) => a.email.localeCompare(b.email)),
    });
  } catch (err) {
    // Handle any errors in one place
    return catchErr(person, res, errCode, err, controllerName);
  }
};
export const getUserById = async (req, res, next) => {
  const controllerName = 'getUserById';
  // Log the request details for debugging
  callLog(req, person, controllerName);

  // Use the ID from URL params or fallback to the logged-in user's ID
  const PK = req.params.id || req.user.userId;
  try {
    // Fetch the user by primary key, including related Customer and settings
    const user = await models.User.findByPk(PK, {
      include: [
        {
          model: models.Customer, // Include Customer record if exists
          required: false, // It's optional
          attributes: {
            exclude: ['userId', 'user_id', 'emailVerified'], // deleting
          },
        },
        {
          model: models.UserPrefSetting, // Include user preference settings
          required: false, // It's optional
          attributes: {
            exclude: ['passwordHash', 'userId', 'user_id'], // deleting
          },
        },
      ],
      attributes: {
        exclude: ['passwordHash'], // deleting
      },
    });

    // If no user found, set 404 error and throw
    if (!user) {
      errCode = 404;
      throw new Error('Nie znaleziono użytkownika.');
    }

    // Log success and return the user object
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      isLoggedIn: req.session.isLoggedIn,
      user,
    });
  } catch (err) {
    // Handle errors in a centralized way
    return catchErr(person, res, errCode, err, controllerName);
  }
};
export const getUserSettings = async (req, res, next) => {
  const controllerName = 'getUserSettings';
  // Log request for debugging
  callLog(req, person, controllerName);

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
      successLog(person, controllerName, 'fetched default');
      return res.status(200).json({
        confirmation: 1,
        message: 'Brak własnych ustawień - załadowane domyślne.',
      });
    }

    // If found, return them
    successLog(person, controllerName, 'fetched custom settings');
    return res.status(200).json({
      confirmation: 1,
      preferences,
    });
  } catch (err) {
    // Log full error, then handle centrally
    console.error('[getUserSettings] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};
//@ POST
export const postCreateUser = async (req, res, next) => {
  const controllerName = 'postCreateUser';
  // Log request for debugging
  callLog(req, person, controllerName);

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
    successLog(person, controllerName);
    return res.status(200).json({
      type: 'signup',
      code: 200,
      confirmation: 1,
      message: 'Konto utworzone pomyślnie',
    });
  } catch (err) {
    // Print full error, then handle centrally
    console.error('[postCreateUser] error:', err);
    return catchErr(person, res, errCode, err, controllerName, {
      type: 'signup',
      code: 409,
    });
  }
};
//@ PUT
export const putEditUserSettings = async (req, res, next) => {
  const controllerName = 'putEditUserSettings';
  // Log request for debugging
  callLog(req, person, controllerName);

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
        person,
        controllerName,
        preferences,
        givenSettings
      );
    } else {
      // New settings were created
      successLog(person, controllerName, 'created');
      result = {
        confirmation: 1,
        message: 'Ustawienia zostały utworzone',
      };
    }

    // If result is null, means no change happened, so response already sent
    if (!result) return;

    // Send the final response
    successLog(person, controllerName, 'sent');
    return res.status(200).json({
      confirmation: result.confirmation,
      message: result.message,
    });
  } catch (err) {
    // Log full error then handle centrally
    console.error('[putEditUserSettings] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};
//@ DELETE
export const deleteUser = async (req, res, next) => {
  const controllerName = 'deleteUser';
  // Log request for debugging
  callLog(req, person, controllerName);

  let errCode = 500; // default error code
  const id = req.params.id;
  let userEmail;

  try {
    // Find the user to delete
    const user = await models.User.findByPk(id, {
      attributes: ['email'],
    });

    if (!user) {
      errCode = 404;
      throw new Error('Nie znaleziono użytkownika.');
    }

    // Save email for notification
    userEmail = user.email;

    // Delete the user record
    const deletedCount = await models.User.destroy({
      where: { userId: id },
    });

    if (!deletedCount) {
      errCode = 404;
      throw new Error('Nie usunięto użytkownika.');
    }

    // Send deletion email if we have the address
    if (userEmail) {
      adminEmails.sendUserAccountDeletedMail({ to: userEmail });
    }

    // Log success and send response
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Konto usunięte pomyślnie.',
    });
  } catch (err) {
    // Print full error, then handle centrally
    console.error('[deleteUser] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};

//! CUSTOMERS_____________________________________________
//@ GET
export const getAllCustomers = async (req, res, next) => {
  const controllerName = 'getAllCustomers';
  // Log request for debugging
  callLog(req, person, controllerName);

  let errCode = 500; // default error code

  try {
    // Fetch only needed columns, exclude userId
    const records = await models.Customer.findAll({
      attributes: {
        exclude: ['user_id'], // deleting
      },
    });

    // If no records, throw 404
    if (!records || records.length === 0) {
      errCode = 404;
      throw new Error('Nie znaleziono klientów.');
    }

    // Convert and add rowId + full name
    const formattedRecords = records.map(record => {
      const {
        customerId,
        firstName,
        lastName,
        dob,
        userId,
        customerType,
        preferredContactMethod,
        referralSource,
        loyalty,
        notes,
      } = record.toJSON();

      return {
        // For table rows
        rowId: customerId,
        customerId,
        userId,
        // Combine first+last name
        customerFullName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        dob,
        customerType,
        preferredContactMethod,
        referralSource,
        loyalty,
        notes,
      };
    });

    // Define headers for front end (exclude userId)
    const totalKeys = [
      'customerId',
      'userId',
      'customerFullName',
      'dob',
      'customerType',
      'preferredContactMethod',
      'referralSource',
      'loyalty',
      'notes',
    ];

    // Log success and send response
    successLog(person, controllerName);
    return res.json({
      confirmation: 1,
      isLoggedIn: req.session.isLoggedIn,
      totalKeys,
      // Sort by last name
      content: formattedRecords.sort((a, b) =>
        a.lastName.localeCompare(b.lastName)
      ),
    });
  } catch (err) {
    // Print error then central handler
    console.error('[getAllCustomers] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};
export const getAllCustomersWithEligiblePasses = async (req, res, next) => {
  const controllerName = 'getAllCustomersWithEligiblePasses';
  // Log request for debugging
  callLog(req, person, controllerName);

  let errCode = 500; // default error code
  try {
    const { scheduleId } = req.params;

    // Fetch schedule with its product
    const scheduleRecord = await models.ScheduleRecord.findByPk(scheduleId, {
      attributes: {
        exclude: [
          'scheduleId', // not needed
          'productId', // we only need Product.type
          'location', // irrelevant here
          'capacity', // irrelevant here
        ],
      },
      include: [{ model: models.Product, attributes: ['type'] }], // only need the type for validation
    });
    if (!scheduleRecord) {
      errCode = 404;
      throw new Error('Nie znaleziono terminu.');
    }
    const schedule = scheduleRecord.toJSON();

    // Fetch all customers with their passes and pass definitions
    const customers = await models.Customer.findAll({
      include: [
        {
          model: models.CustomerPass,
          attributes: [
            'customerPassId',
            'status', // needed for active check
            'usesLeft', // needed for count check
            'validFrom', // needed for date window
            'validUntil', // needed for expiry check
          ],
          include: [
            {
              model: models.PassDefinition,
              attributes: [
                'name', // for logging
                'passType', // for sort order
                'allowedProductTypes', // for matching product types
              ],
            },
          ],
        },
      ],
    });
    if (!customers || customers.length === 0) {
      errCode = 404;
      throw new Error('Nie znaleziono klientów.');
    }

    // For each customer, keep only passes valid for this schedule
    const eligibleCustomers = customers
      .map(customer => {
        const cust = customer.toJSON();
        const passes = Array.isArray(cust.CustomerPasses)
          ? cust.CustomerPasses
          : [];
        cust.eligiblePasses = passes.filter(pass =>
          isPassValidForSchedule(pass, schedule)
        );
        delete cust.CustomerPasses; // remove old passes array
        return cust;
      })
      .filter(cust => cust.eligiblePasses.length > 0); // only customers with at least one

    // Log success and return result
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      content: eligibleCustomers,
    });
  } catch (err) {
    // Print error then handle it centrally
    console.error('[getAllCustomersWithEligiblePasses] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};
export const getCustomerById = async (req, res, next) => {
  const controllerName = 'getCustomerById';
  // Log request for debugging
  callLog(req, person, controllerName);

  let errCode = 500;
  const PK = req.params.id;

  try {
    // Fetch customer and related data, excluding unneeded columns
    const customer = await models.Customer.findByPk(PK, {
      attributes: {
        exclude: ['userId', 'user_id'], // we don't need the foreign key here
      },
      include: [
        {
          model: models.User, // include linked user account
          required: false,
          attributes: {
            exclude: [
              'passwordHash', // remove sensitive fields
              'profilePictureSrcSetJson',
              'emailVerified',
            ],
          },
          include: [
            {
              model: models.UserPrefSetting, // include user preferences
              required: false,
              attributes: {
                exclude: ['userId', 'user_id'], // foreign key not needed
              },
            },
          ],
        },
        {
          model: models.CustomerPass, // include all passes
          required: false,
          attributes: {
            exclude: [
              'customerId',
              'customer_id',
              'paymentId',
              'payment_id',
              'pass_def_id',
            ], // remove FKs
          },
          include: [
            {
              model: models.PassDefinition, // include pass details
              attributes: ['name', 'passDefId'],
            },
          ],
        },
        {
          model: models.Payment, // include payments
          required: false,
          attributes: {
            exclude: ['customerId', 'customer_id'], // remove FK
          },
          include: [
            {
              model: models.Invoice, // include invoices
              required: false,
            },
          ],
        },
        {
          model: models.Booking, // include bookings
          required: false,
          attributes: {
            exclude: [
              'customerId', // remove FK
              'customer_id',
              'customer_pass_id',
              'scheduleId', // remove FK
              'schedule_id', // remove FK
              'paymentId', // remove FK
              'customerPassId', // remove FK
            ],
          },
          include: [
            {
              model: models.ScheduleRecord, // include schedule info
              required: false,
              attributes: {
                exclude: [
                  'productId', // remove FK
                  'product_id', // remove FK
                  'capacity', // not needed here
                ],
              },
              include: [
                {
                  model: models.Product, // include product details
                  required: false,
                  attributes: ['productId', 'name', 'type', 'duration'],
                },
                {
                  model: models.Feedback, // include feedback for this customer
                  required: false,
                  where: { customerId: PK },
                  attributes: {
                    exclude: ['customerId', 'scheduleId'], // remove FKs
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    // If not found, return 404
    if (!customer) {
      errCode = 404;
      throw new Error('Nie znaleziono profilu uczestnika.');
    }

    // Convert to plain object
    const parsed = customer.toJSON();

    // Add human-readable pass name
    parsed.CustomerPasses =
      parsed.CustomerPasses?.map(cp => ({
        ...cp,
        passName: cp.PassDefinition.name,
      })) || [];

    // Define which keys to show for passes table
    const customerPassesKeys = [
      'customerPassId',
      'passName',
      'purchaseDate',
      'validFrom',
      'validUntil',
      'usesLeft',
      'status',
    ];

    // Log success and send response
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      isLoggedIn: req.session.isLoggedIn,
      customer: {
        ...parsed,
        customerPassesKeys,
      },
    });
  } catch (err) {
    // Print full error, then handle centrally
    console.error('[getCustomerById] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};
export const getCustomerDetails = async (req, res, next) => {
  const controllerName = 'getEditCustomerDetails';
  // Log request for debugging
  callLog(req, person, controllerName);

  let errCode = 500; // default error code

  try {
    // Fetch only the fields needed on the frontend form
    const customer = await models.Customer.findByPk(req.params.id, {
      attributes: {
        exclude: [
          'referralSource',
          'customerType',
          'customerId',
          'firstName',
          'lastName',
          'dob',
        ],
      },
    });

    // If no customer, throw 404
    if (!customer) {
      errCode = 404;
      throw new Error('Nie znaleziono danych uczestnika.');
    }

    // Convert to plain object
    const data = customer.toJSON();

    // Log success and send response
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      customer: data,
      message: 'Dane uczestnika pobrane pomyślnie.',
    });
  } catch (err) {
    // Print full error then handle centrally
    console.error('[getCustomerDetails] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};
//@ POST
export const postCreateCustomer = async (req, res, next) => {
  const controllerName = 'postCreateCustomer';
  // Log request for debugging
  callLog(req, person, controllerName);

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
    successLog(person, controllerName);
    return res.status(200).json({
      code: 200,
      confirmation: 1,
      message: 'Zarejestrowano pomyślnie.',
    });
  } catch (err) {
    // Print error then handle centrally
    console.error('[postCreateCustomer] error:', err);
    return catchErr(person, res, errCode, err, controllerName, { code: 409 });
  }
};
//@ PUT
export const putEditCustomerDetails = async (req, res, next) => {
  const controllerName = 'putEditCustomerDetails';
  // Log request for debugging
  callLog(req, person, controllerName);

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
    successLog(person, controllerName, 'fetched');

    // 2. Check if phone or contact method missing or unchanged
    const interrupted = areCustomerDetailsChanged(
      res,
      person,
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
    successLog(person, controllerName);
    return res.status(200).json({
      message: 'Profil zaktualizowany pomyślnie.',
      confirmation: affectedRows >= 1,
      affectedCustomerRows: affectedRows,
    });
  } catch (err) {
    // Print full error then handle centrally
    console.error('[putEditCustomerDetails] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};
//@ DELETE
export const deleteCustomer = async (req, res, next) => {
  const controllerName = 'deleteCustomer';
  // Log request for debugging
  callLog(req, person, controllerName);

  let errCode = 500; // default error code
  const id = req.params.id;
  let userEmail;

  try {
    // Fetch customer and only the email from linked User
    const customer = await models.Customer.findOne({
      where: { customerId: id },
      attributes: {
        exclude: ['userId', 'user_id'], // drop foreign key
      },
      include: [
        {
          model: models.User,
          required: false,
          attributes: ['email'], // only need email
        },
      ],
    });

    // If no record, throw 404
    if (!customer) {
      errCode = 404;
      throw new Error('Nie znaleziono profilu uczestnika.');
    }

    // Save email for later notification
    userEmail = customer.User?.email;

    // Delete the customer record
    await customer.destroy();

    // Send deletion email if available
    if (userEmail) {
      adminEmails.sendCustomerDeletedMail({ to: userEmail });
    }

    // Log success and respond
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Profil usunięty pomyślnie.',
    });
  } catch (err) {
    // Print full error then handle centrally
    console.error('[deleteCustomer] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};

//! SCHEDULES_____________________________________________
//@ GET
export const getAllSchedules = async (req, res, next) => {
  const controllerName = 'getAllSchedules';
  // Log request for debugging
  callLog(req, person, controllerName);

  let errCode = 500; // default error code

  try {
    // Fetch schedules, exclude productId, include only needed fields
    const records = await models.ScheduleRecord.findAll({
      attributes: { exclude: ['productId'] },
      include: [
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
      ],
    });

    // If no schedules found, throw 404
    if (!records || records.length === 0) {
      errCode = 404;
      throw new Error('Nie znaleziono terminów.');
    }

    // Transform each schedule to plain object and add computed fields
    const formattedRecords = records.map(rec => {
      // turn Sequelize instance into plain JS object
      const sched = rec.get({ plain: true });

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
    });

    // Define columns for front end table
    const totalKeys = [
      'scheduleId',
      'attendance',
      'date',
      'day',
      'startTime',
      'location',
      'productType',
      'productName',
      'productPrice',
    ];

    // Log success and send response
    successLog(person, controllerName);
    return res.json({
      confirmation: 1,
      message: 'Terminy pobrane pomyślnie.',
      totalKeys,
      // sort by date descending
      content: formattedRecords.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      ),
    });
  } catch (err) {
    // Print error then central handler
    console.error('[getAllSchedules] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};
export const getScheduleById = async (req, res, next) => {
  const controllerName = 'getScheduleById';
  // Log that admin called this endpoint
  console.log(`➡️➡️➡️ admin called`, controllerName);

  let errCode = 500;
  try {
    const PK = req.params.id;
    // Fetch the schedule record with related models
    const scheduleData = await models.ScheduleRecord.findByPk(PK, {
      include: [
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
    });

    // If not found, throw an error
    if (!scheduleData) {
      errCode = 404;
      throw new Error('Nie znaleziono terminu.');
    }

    // Convert the Sequelize instance to a plain JS object
    let schedule = scheduleData.toJSON();

    // Initialize attendance counts
    schedule.attendance = 0;
    let attendedRecords = [];
    let cancelledRecords = [];

    // Split bookings into attended vs cancelled
    if (schedule.Bookings && schedule.Bookings.length > 0) {
      schedule.Bookings.forEach(b => {
        // Mark attended
        if (b.attendance == 1 || b.attendance === true) {
          attendedRecords.push({ ...b, rowId: b.bookingId });
        }
        // Mark cancelled
        if (b.attendance == 0 || b.attendance === false) {
          cancelledRecords.push({ ...b, rowId: b.bookingId });
        }
      });
      // Set attendance count and full flag
      schedule.attendance = attendedRecords.length;
      schedule.full = attendedRecords.length >= schedule.capacity;
    }

    // Determine if the schedule is already completed
    const scheduleDateTime = new Date(
      `${schedule.date}T${schedule.startTime}:00`
    );
    schedule.isCompleted = scheduleDateTime <= new Date();
    schedule.attendedRecords = attendedRecords;
    schedule.cancelledRecords = cancelledRecords;

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

    // Log success and send the JSON response
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Termin pobrany pomyślnie',
      schedule,
      user: req.user,
    });
  } catch (err) {
    // In case of error, handle centrally
    console.error('[getScheduleById] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};
// Controller for NewPaymentForm Selects
export const getProductSchedules = async (req, res, next) => {
  // Controller for NewPaymentForm Selects
  const controllerName = 'getProductSchedulesById';
  // Log that admin called this endpoint
  console.log(`➡️➡️➡️ admin called`, controllerName);

  let errCode = 500;
  try {
    const productId = req.params.pId;
    const customerId = req.params.cId;

    // Get all schedules for the chosen product
    const foundSchedules = await models.ScheduleRecord.findAll({
      where: { productId },
    });

    // Get all bookings made by this customer
    const bookedByCustomerSchedules = await models.Booking.findAll({
      where: { customerId },
    });

    // Exclude schedules the customer has already booked
    const filteredSchedules = foundSchedules.filter(
      schedule =>
        !bookedByCustomerSchedules.some(
          bs => bs.scheduleId == schedule.scheduleId
        )
    );

    // Log success and return the filtered list
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Terminy pobrane pomyślnie.',
      content: filteredSchedules,
    });
  } catch (err) {
    // Handle errors centrally
    console.error('[getProductSchedules] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};

export const getBookings = (req, res, next) => {};
//@ POST
export const postCreateScheduleRecord = async (req, res, next) => {
  const controllerName = 'postCreateScheduleRecord';
  // Log request for debugging
  callLog(req, person, controllerName);

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
        successLog(person, controllerName, `created for: ${currDate}`);
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

    successLog(person, controllerName);
    return res.status(201).json({
      confirmation: 1,
      message: 'Terminy utworzone pomyślnie.',
      records: createdRecords,
    });
  } catch (err) {
    // Handle errors centrally
    console.error('[postCreateScheduleRecord] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};
//@ PUT
export const putEditSchedule = async (req, res, next) => {
  const controllerName = 'putEditSchedule';
  // Log request for debugging
  callLog(req, person, controllerName);

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
    successLog(person, controllerName, 'fetched');

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
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: affectedRows >= 1,
      message: 'Termin zaktualizowany pomyślnie.',
      affectedScheduleRows: affectedRows,
    });
  } catch (err) {
    // Log error then handle centrally
    console.error('[putEditSchedule] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};
//@ DELETE
export const deleteSchedule = async (req, res, next) => {
  const controllerName = 'deleteSchedule';
  // Log request for debugging
  callLog(req, person, controllerName);

  let errCode = 500; // default error code
  const id = req.params.id;
  console.log(`${controllerName} deleting id: `, id);

  try {
    // Find the schedule record by ID
    const foundSchedule = await models.ScheduleRecord.findOne({
      where: { scheduleId: id },
    });

    // If not found, throw 404
    if (!foundSchedule) {
      errCode = 404;
      console.log(
        `❌❌❌ Error Admin ${controllerName} Schedule to delete not found.`
      );
      throw new Error('Nie znaleziono terminu do usunięcia.');
    }

    // If the schedule is in the past, block deletion
    const scheduleDateTime = new Date(
      `${foundSchedule.date}T${foundSchedule.startTime}:00`
    );
    if (scheduleDateTime < new Date()) {
      errCode = 400;
      console.log(
        `❌❌❌ Error Admin ${controllerName} Schedule is passed - can't be deleted.`
      );
      throw new Error(
        'Nie można usunąć terminu który już minął. Posiada też wartość historyczną dla statystyk.'
      );
    }

    // Check if any bookings exist for this schedule
    const foundRecord = await models.Booking.findOne({
      where: { scheduleId: id },
    });
    if (foundRecord) {
      errCode = 409;
      console.log(
        `❌❌❌ Error Admin ${controllerName} Schedule is booked - can't be deleted.`
      );
      throw new Error(
        'Nie można usunąć terminu, który posiada rekordy obecności (obecny/anulowany). Najpierw USUŃ rekordy obecności w konkretnym terminie.'
      );
    }

    // Delete the schedule
    const deletedCount = await foundSchedule.destroy();
    // If destroy() returns falsy, treat as not deleted
    if (!deletedCount) {
      errCode = 404;
      console.log(`❌❌❌ Error Admin ${controllerName} Schedule not deleted.`);
      throw new Error('Nie usunięto terminu.');
    }

    // Log success and send response
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Termin usunięty pomyślnie.',
    });
  } catch (err) {
    // Handle errors centrally
    console.error('[deleteSchedule] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};

//! PRODUCTS_____________________________________________
//@ GET
export const getAllProducts = async (req, res, next) => {
  const controllerName = 'getAllProducts';
  // Log request for debugging
  callLog(req, person, controllerName);

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
    successLog(person, controllerName);
    return res.json({
      totalKeys,
      confirmation: 1,
      message: 'Pobrano pomyślnie',
      content: formattedRecords,
    });
  } catch (err) {
    // Log error then handle centrally
    console.error('[getAllProducts] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};
export const getProductById = async (req, res, next) => {
  const controllerName = 'getProductById';
  // Log request for debugging
  callLog(req, person, controllerName);

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
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Produkt pobrany pomyślnie.',
      isLoggedIn: req.session.isLoggedIn,
      product,
    });
  } catch (err) {
    // Handle errors centrally
    console.error('[getProductById] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};
//@ POST
export const postCreateProduct = async (req, res, next) => {
  const controllerName = 'postCreateProduct';
  callLog(req, person, controllerName);
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
    successLog(person, controllerName);
    return res.status(200).json({
      code: 200,
      confirmation: 1,
      message: 'Stworzono pomyślnie.',
    });
  } catch (err) {
    console.error('[postCreateProduct] error:', err);
    return catchErr(person, res, errCode, err, controllerName, { code: 409 });
  }
};
//@ PUT
export const putEditProduct = async (req, res, next) => {
  const controllerName = 'putEditProduct';
  callLog(req, person, controllerName);
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
    successLog(person, controllerName, 'fetched');

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
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: affectedRows >= 1,
      message: 'Zmiany zaakceptowane.',
      affectedProductRows: affectedRows,
    });
  } catch (err) {
    console.error('[putEditProduct] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};
//@ DELETE
export const deleteProduct = async (req, res, next) => {
  const controllerName = 'deleteProduct';
  callLog(req, person, controllerName);
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
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Produkt usunięty pomyślnie.',
    });
  } catch (err) {
    console.error('[deleteProduct] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};

//! PASSES_______________________________________________
//@ GET
export const getAllPasses = async (req, res, next) => {
  const controllerName = 'getAllPasses';
  // Log request for debugging
  callLog(req, person, controllerName);

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
    successLog(person, controllerName);
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
    return catchErr(person, res, errCode, err, controllerName);
  }
};

export const getPassById = async (req, res, next) => {
  const controllerName = 'getPassById';
  // Log request for debugging
  console.log(`➡️➡️➡️ ${person} called`, controllerName);

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
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Definicja karnetu pobrana pomyślnie',
      passDefinition: passDefFormatted,
    });
  } catch (err) {
    console.error('[getPassById] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};

export const getCustomerPassById = async (req, res, next) => {
  const controllerName = 'getCustomerPassById';
  // Log request for debugging
  console.log(`➡️➡️➡️ ${person} called`, controllerName);

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
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Definicja karnetu pobrana pomyślnie',
      customerPass: formattedCustomerPass,
    });
  } catch (err) {
    console.error('[getCustomerPassById] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};
//@ POST
//@ POST
export const postCreatePassDefinition = async (req, res, next) => {
  const controllerName = 'postCreatePassDefinition';
  // Log request for debugging
  callLog(req, person, controllerName);

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
    successLog(person, controllerName);
    return res.status(200).json({
      code: 200,
      confirmation: 1,
      message: 'Karnet stworzono pomyślnie.',
    });
  } catch (err) {
    // Log error then handle centrally
    console.error('[postCreatePassDefinition] error:', err);
    return catchErr(person, res, errCode, err, controllerName, { code: 409 });
  }
};
//@ PUT
//@ DELETE
export const deleteCustomerPass = async (req, res, next) => {
  const controllerName = 'deleteCustomerPass';
  // Log request for debugging
  callLog(req, person, controllerName);

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
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Karnet uczestnika usunięty pomyślnie.',
    });
  } catch (err) {
    // Log error then handle it centrally
    console.error('[deleteCustomerPass] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};
export const deletePassDefinition = async (req, res, next) => {
  const controllerName = 'deletePassDefinition';
  // Log request for debugging
  callLog(req, person, controllerName);

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
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: 'Definicja karnetu usunięta pomyślnie.',
    });
  } catch (err) {
    // Log error then handle it centrally
    console.error('[deletePassDefinition] error:', err);
    return catchErr(person, res, errCode, err, controllerName);
  }
};

//! BOOKINGS_____________________________________________
//@ GET
export const getAllBookings = (req, res, next) => {
  const controllerName = 'getAllBookings';
  callLog(req, person, controllerName);

  models.Booking.findAll({
    include: [
      {
        model: models.Customer,
        attributes: { exclude: ['userId'] },
        include: [{ model: models.User }],
      },
      {
        model: models.ScheduleRecord,
        include: [{ model: models.Product }],
        // attributes: { exclude: ['userId'] },
      },
      {
        model: models.Payment,
        // attributes: { exclude: ['userId'] },
        required: false,
      },
      {
        model: models.CustomerPass,
        include: [{ model: models.PassDefinition }],
        // attributes: { exclude: ['userId'] },
        required: false,
      },
    ],
  })
    .then(records => {
      if (!records) {
        errCode = 404;
        throw new Error('Nie znaleziono rekordów.');
      }

      // Convert for records for different names
      const formattedRecords = records.map(record => {
        const booking = record.toJSON();
        const customerFullName = `${record.Customer.firstName} ${record.Customer.lastName} (${record.Customer.customerId})`;
        const scheduleDetails = `${record.ScheduleRecord.Product.name} (${record.ScheduleRecord.date} ${record.ScheduleRecord.startTime}, sId: ${record.ScheduleRecord.scheduleId})`;
        const payment = record.Payment
          ? `${record.Payment?.paymentMethod} (pId:${record.Payment?.paymentId})`
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

      const totalKeys = [
        'bookingId',
        'customerFullName', // full name with id
        'scheduleDetails', // name, timing, id
        'payment', // method with id in it if direct or pass name nad its id
        'attendance',
        'createdAt', // 'Utworzono'
        'timestamp', // 'Data Akcji'
        'performedBy',
      ];

      successLog(person, controllerName);
      return res.json({
        totalKeys,
        confirmation: 1,
        message: 'Pobrano pomyślnie',
        content: formattedRecords.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ),
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
export const getBookingById = (req, res, next) => {
  const controllerName = 'getBookingID';
  console.log(`\n➡️➡️➡️ admin called`, controllerName);

  const PK = req.params.id;
  models.Booking.findByPk(PK, {
    include: [
      {
        model: models.Customer,
        attributes: { exclude: ['userId'] },
        include: [{ model: models.User }],
      },
      {
        model: models.ScheduleRecord,
        include: [{ model: models.Product }, { model: models.Booking }],
        // attributes: { exclude: ['userId'] },
      },
      {
        model: models.Payment,
        // attributes: { exclude: ['userId'] },
        required: false,
      },
      {
        model: models.CustomerPass,
        include: [{ model: models.PassDefinition }],
        // attributes: { exclude: ['userId'] },
        required: false,
      },
    ],
  })
    .then(bookingData => {
      if (!bookingData) {
        errCode = 404;
        throw new Error('Nie znaleziono rezerwacji.');
      }
      // console.log(scheduleData);
      let booking = bookingData.toJSON();
      let attendance = 0;

      if (
        booking.ScheduleRecord.Bookings &&
        booking.ScheduleRecord.Bookings.length > 0
      ) {
        booking.ScheduleRecord.Bookings.forEach(b => {
          if (b.attendance == 1 || b.attendance == true) attendance += 1;
        });
      }
      let bookingFormatted = {
        ...booking,
        ScheduleRecord: {
          ...booking.ScheduleRecord,
          attendance: attendance,
        },
      };

      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        message: 'Rezerwacja pobrana pomyślnie',
        booking: bookingFormatted,
        user: req.user,
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//@ POST
export const postCreateBookingWithPass = (req, res, next) => {
  const controllerName = 'postCreateBookingWithPass';
  callLog(req, person, controllerName);
  const { scheduleId } = req.params;
  const { customerId, customerPassId } = req.body;
  console.log(req.body);
  console.log(scheduleId);
  try {
    isEmptyInput(customerId, '"Numer uczestnika"');
    isEmptyInput(scheduleId, '"Numer terminu"');
    isEmptyInput(customerPassId, '"Numer karnetu uczestnika"');
  } catch (err) {
    return catchErr(person, res, errCode, err, controllerName);
  }
  const wantsNotifications = req.user?.UserPrefSetting
    ? req.user?.UserPrefSetting?.notifications
    : true;

  let currentCustomerPass, currentScheduleRecord;

  // Load customer with passes
  return db
    .transaction(t => {
      return models.CustomerPass.findOne({
        where: { customerId, customerPassId },
        include: [{ model: models.PassDefinition }],
        transaction: t,
      })
        .then(customerPass => {
          if (!customerPass)
            throw new Error('Nie znaleziono karnetu uczestnika');
          currentCustomerPass = customerPass;

          return models.ScheduleRecord.findOne({
            where: { scheduleId },
            include: [{ model: models.Product }],
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        })
        .then(scheduleRecord => {
          if (!scheduleRecord) throw new Error('Nie znaleziono terminu');
          currentScheduleRecord = scheduleRecord;

          return models.Booking.count({
            where: { scheduleId, attendance: true },
            transaction: t,
          });
        })
        .then(count => {
          if (count >= currentScheduleRecord.capacity) {
            errCode = 409;
            throw new Error('Brak wolnych miejsc w tym terminie');
          }

          // Check if booking already exists (by customer & schedule)
          return models.Booking.findOne({
            where: {
              customerId,
              scheduleId,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        })
        .then(existingBooking => {
          let validPass = null;

          if (existingBooking) {
            errCode = 409;
            throw new Error('Użytkownik już ma rezerwację');
          }

          // Check if customer already has a valid pass for this schedule.
          validPass = isPassValidForSchedule(
            currentCustomerPass,
            currentScheduleRecord
          );

          if (!validPass) {
            throw new Error('Karnet nie jest ważny na ten termin.');
          }

          return models.Booking.create(
            {
              customerId,
              scheduleId: currentScheduleRecord.scheduleId,
              customerPassId: currentCustomerPass.customerPassId,
              attendance: true,
              timestamp: new Date(),
              performedBy: 'Administrator',
            },
            {
              transaction: t,
            }
          );
        })
        .then(newBooking => {
          if (typeof currentCustomerPass.usesLeft === 'number') {
            return currentCustomerPass
              .update(
                { usesLeft: currentCustomerPass.usesLeft - 1 },
                { transaction: t }
              )
              .then(() => newBooking);
          }
          return newBooking;
        });
    })
    .then(result => {
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
      successLog(person, controllerName);
      res.status(201).json({
        confirmation: 1,
        message: 'Rezerwacja stworzona pomyślnie.',
        result,
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//@ DELETE
export const deleteBookingRecord = (req, res, next) => {
  const controllerName = 'deleteBookingRecord';
  callLog(req, person, controllerName);

  const { customerId, rowId } = req.body;
  let currentScheduleRecord, customerEmail, wantsNotifications;

  // Find booking to get info for email as well
  models.Booking.findOne({
    where: {
      customerId: customerId,
      bookingId: rowId,
    },
    include: [
      {
        model: models.ScheduleRecord,
        required: true,
        include: [
          {
            model: models.Product,
            required: true,
          },
        ],
      },
      {
        model: models.Customer,
        required: true,
        include: [
          {
            model: models.User,
            attributes: ['email'],
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

      currentScheduleRecord = foundRecord.ScheduleRecord;
      customerEmail = foundRecord.Customer.User.email;
      wantsNotifications = foundRecord.Customer.User.UserPrefSetting
        ? foundRecord.Customer.User.UserPrefSetting?.notifications
        : true;

      // Return deleted number
      return foundRecord.destroy();
    })
    .then(deleted => {
      if (!deleted) {
        errCode = 404;
        throw new Error('Nie usunięto rekordu.');
      }

      // Send confirmation
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

      // Confirmation for frontend
      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        message:
          'Rekord obecności usunięty. Rekord płatności pozostał nieruszony.',
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
export const deleteBooking = (req, res, next) => {
  const controllerName = 'deleteBooking';
  callLog(req, person, controllerName);

  const { entityId } = req.body;
  let currentScheduleRecord, customerEmail, wantsNotifications;

  // Find booking to get info for email as well
  models.Booking.findOne({
    where: {
      bookingId: entityId,
    },
    include: [
      {
        model: models.ScheduleRecord,
        required: true,
        include: [
          {
            model: models.Product,
            required: true,
          },
        ],
      },
      {
        model: models.Customer,
        required: true,
        include: [
          {
            model: models.User,
            attributes: ['email'],
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

      currentScheduleRecord = foundRecord.ScheduleRecord;
      customerEmail = foundRecord.Customer.User.email;
      wantsNotifications = foundRecord.Customer.User.UserPrefSetting
        ? foundRecord.Customer.User.UserPrefSetting?.notifications
        : true;

      // Return deleted number
      return foundRecord.destroy();
    })
    .then(deleted => {
      if (!deleted) {
        errCode = 404;
        throw new Error('Nie usunięto rekordu.');
      }

      // Send confirmation
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

      // Confirmation for frontend
      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        message:
          'Rekord obecności usunięty. Rekord płatności pozostał nieruszony.',
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};

//! ATTENDANCE_____________________________________________
//@ GET
//@ POST
//@ PUT
export const putEditMarkAbsent = (req, res, next) => {
  const controllerName = 'putEditMarkAbsent';
  callLog(req, person, controllerName);

  const { rowId, customerId } = req.body;
  let currentScheduleRecord, customerEmail, wantsNotifications;

  // Find schedule
  models.Booking.findOne({
    where: {
      customerId: customerId,
      bookingId: rowId,
    },
    include: [
      {
        model: models.ScheduleRecord,
        include: [
          {
            model: models.Product,
            required: true,
          },
        ],
        required: true,
      },
      {
        model: models.Customer,
        required: true,
        include: [
          {
            model: models.User,
            attributes: ['email'],
          },
        ],
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
      // Assign for email data
      customerEmail = foundRecord.Customer.User.email;
      wantsNotifications = foundRecord.Customer.User.UserPrefSetting
        ? foundRecord.Customer.User.UserPrefSetting?.notifications
        : true;
      // Finally update attendance
      return models.Booking.update(
        {
          attendance: 0,
          timestamp: new Date(),
          performedBy: person,
        },
        {
          where: {
            customerId: foundRecord.Customer.customerId,
            bookingId: foundRecord.bookingId,
          },
        }
      );
    })
    .then(() => {
      // Send confirmation email
      if (customerEmail && wantsNotifications) {
        adminEmails.sendAttendanceMarkedAbsentMail({
          to: customerEmail,
          productName: currentScheduleRecord.Product.name || '',
          date: currentScheduleRecord.date,
          startTime: currentScheduleRecord.startTime,
          location: currentScheduleRecord.location,
          isAdmin: true,
        });
      }

      successLog(person, controllerName);
      // Send confirmation to frontend
      return res.status(200).json({
        confirmation: 1,
        message: 'Uczestnik oznaczony jako nieobecny.',
        affectedRows: 2,
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
export const putEditMarkPresent = (req, res, next) => {
  const controllerName = 'putEditMarkPresent';
  callLog(req, person, controllerName);

  const { customerId, rowId } = req.body;

  let currentScheduleRecord, customerEmail, wantsNotifications;

  // Find schedule
  return db
    .transaction(t => {
      return models.Booking.findOne({
        where: {
          customerId: customerId,
          bookingId: rowId,
        },
        include: [
          {
            model: models.ScheduleRecord,
            include: [
              {
                model: models.Product,
                required: true,
              },
            ],
            required: true,
          },
          {
            model: models.Customer,
            required: true,
            include: [
              {
                model: models.User,
                attributes: ['email'],
              },
            ],
          },
        ],
        transaction: t,
        lock: t.LOCK.UPDATE,
      }).then(foundRecord => {
        if (!foundRecord) {
          errCode = 404;
          throw new Error('Nie znaleziono rekordu obecności w dzienniku.');
        }
        currentScheduleRecord = foundRecord.ScheduleRecord;
        // check if still places left
        return models.Booking.count({
          where: {
            scheduleId: currentScheduleRecord.scheduleId,
            attendance: 1,
          },
          transaction: t,
        }).then(currentAttendance => {
          successLog(person, controllerName, 'got current attendance count');

          if (currentAttendance >= currentScheduleRecord.capacity) {
            errCode = 409;
            throw new Error('🪷 Brak wolnych miejsc na ten termin.');
          }

          currentScheduleRecord = foundRecord.ScheduleRecord;
          // Assign for email data
          customerEmail = foundRecord.Customer.User.email;
          wantsNotifications = foundRecord.Customer.User.UserPrefSetting
            ? foundRecord.Customer.User.UserPrefSetting.notifications
            : true;
          // Finally update attendance
          return models.Booking.update(
            {
              timestamp: new Date(),
              attendance: 1,
              performedBy: person,
            },
            {
              where: {
                customerId: foundRecord.Customer.customerId,
                bookingId: foundRecord.bookingId,
              },
              transaction: t,
            }
          );
        });
      });
    })
    .then(updatedRecord => {
      // Send confirmation email
      if (customerEmail && wantsNotifications) {
        adminEmails.sendAttendanceReturningMail({
          to: customerEmail,
          productName: currentScheduleRecord?.Product.name || '',
          date: currentScheduleRecord.date,
          startTime: currentScheduleRecord.startTime,
          location: currentScheduleRecord.location,
          isAdmin: true,
        });
      }

      successLog(person, controllerName);
      const status = updatedRecord ? true : false;
      // Send confirmation to frontend
      return res.status(200).json({
        confirmation: status,
        message: 'Uczestnik oznaczony jako obecny.',
        affectedRows: status ? 1 : 0,
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};

//! PAYMENTS_____________________________________________
//@ GET
export const getAllPayments = (req, res, next) => {
  const controllerName = 'getAllPayments';
  callLog(req, person, controllerName);

  // Find all schedule payment regardless relation to booking because they are non refundable
  return models.Payment.findAll({
    include: [
      {
        model: models.Customer,
        attributes: { exclude: ['userId'] },
      },
      {
        model: models.Booking,
      },
    ],
  })
    .then(records => {
      if (!records) {
        errCode = 404;
        throw new Error('Nie znaleziono płatności.');
      }
      const formattedRecords = records.map(record => {
        const payment = record.toJSON();
        console.log(payment);

        const schedules = payment.Bookings?.map(b => b.ScheduleRecord);

        return {
          ...payment,
          rowId: payment.paymentId,
          date: formatIsoDateTime(payment.date),
          customerFullName: `${payment.Customer.firstName} ${payment.Customer.firstName} (${payment.Customer.customerId})`,
          schedules,
        };
      });

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

      successLog(person, controllerName);
      res.json({
        confirmation: 1,
        message: 'Płatności pobrane pomyślnie.',
        isLoggedIn: req.session.isLoggedIn,
        totalKeys,
        content: formattedRecords.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        ),
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
export const getPaymentById = (req, res, next) => {
  const controllerName = 'getPaymentById';
  callLog(req, person, controllerName);

  const PK = req.params.id;
  models.Payment.findByPk(PK, {
    required: false,
    include: [
      { model: models.Customer },
      {
        model: models.Booking,
        include: [
          {
            model: models.ScheduleRecord,
            attributes: { exclude: ['userId'] },
            include: [{ model: models.Product }],
          },
        ],
        required: false,
      },
      {
        model: models.CustomerPass,
        include: [{ model: models.Customer }, { model: models.PassDefinition }],
        required: false,
      },
    ],
  })
    .then(payment => {
      if (!payment) {
        errCode = 404;
        throw new Error('Nie znaleziono płatności.');
      }

      const parsedPayment = payment.toJSON();

      const customerPasses = parsedPayment?.CustomerPasses?.map(
        customerPass => {
          const cp = customerPass;
          const customer = cp.Customer;

          return {
            customerPassId: cp.customerPassId,
            rowId: cp.customerPassId,
            customerFirstName: customer.firstName,
            customerLastName: customer.lastName,
            customerId: customer.customerId,
            passDefId: cp.PassDefinition.passDefId,
            allowedProductTypes: cp.PassDefinition.allowedProductTypes,
            // customerFullName: `${customer.firstName} ${customer.lastName} (${customer.customerId})`,
            passName: cp.PassDefinition.name,
            purchaseDate: cp.purchaseDate,
            validFrom: cp.validFrom,
            validUntil: cp.validUntil,
            usesLeft: cp.usesLeft,
            status: cp.status,
          };
        }
      );
      delete parsedPayment.CustomerPasses;

      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        message: 'Płatność pobrana pomyślnie.',
        isLoggedIn: req.session.isLoggedIn,
        payment: { ...parsedPayment, customerPasses },
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//@ POST
export const postCreatePayment = (req, res, next) => {
  const controllerName = 'postCreatePayment';
  callLog(req, person, controllerName);

  const {
    customerId,
    scheduleId,
    passDefId,
    passStartDate,
    amountPaid,
    paymentMethod,
  } = req.body;

  errCode = 400;
  if (isNaN(amountPaid) || Number(amountPaid) < 0) {
    console.log('\n❌❌❌ amountPaid wrong');
    throw new Error('amountPaid wrong');
  }
  if (![1, 2, 3].includes(Number(paymentMethod))) {
    console.log('\n❌❌❌ paymentMethod wrong');
    throw new Error('paymentMethod wrong');
  }
  if (!customerId) {
    console.log('\n❌❌❌ customerId empty.');
    throw new Error('Pole uczestnika nie może być puste.');
  }
  if (!amountPaid || !amountPaid.trim()) {
    console.log('\n❌❌❌ amountPaid empty');
    throw new Error('Pole kwoty nie może być puste.');
  }
  if (!paymentMethod || !paymentMethod.trim()) {
    console.log('\n❌❌❌ paymentMethod empty');
    throw new Error('Pole metody płatności nie może być puste.');
  }

  let currentCustomer, currentPassDefinition, customerEmail, wantsNotifications;

  const paymentMethodDeduced =
    paymentMethod == 1
      ? 'Gotówka (M)'
      : paymentMethod == 2
      ? 'BLIK (M)'
      : 'Przelew (M)';

  return db
    .transaction(t => {
      return models.Customer.findByPk(customerId, {
        include: [
          {
            model: models.CustomerPass,
            include: [models.PassDefinition],
          },
          {
            model: models.User,
          },
        ],
        transaction: t,
      }).then(customer => {
        if (!customer) throw new Error('Nie znaleziono klienta');
        successLog(person, controllerName, 'customer found');
        currentCustomer = customer;
        customerEmail = customer.User?.email;
        wantsNotifications = customer.User.UserPrefSetting
          ? customer.User.UserPrefSetting.notifications
          : true;

        // If passDefinitionId is provided, then the payment should be for a pass.
        if (passDefId) {
          // Check if customer already has that pass
          return models.CustomerPass.findOne({
            where: {
              customerId: customer.customerId,
              passDefId: passDefId,
              status: 1,
              validUntil: { [Op.gt]: passStartDate },
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          })
            .then(existingPass => {
              if (existingPass) {
                throw new Error(
                  'Nie można zapłacić 2x za ten sam karnet, który jest nadal aktywny. Wybierz datę startową nowego karnetu, po zakończeniu poprzedniego.'
                );
              }
              successLog(person, controllerName, 'customerPass NOT found');

              // Fetch definition
              return models.PassDefinition.findByPk(passDefId, {
                transaction: t,
              });
            })
            .then(definition => {
              if (definition)
                successLog(person, controllerName, 'passDefinition found');

              currentPassDefinition = definition;
              if (currentPassDefinition.price < amountPaid)
                throw new Error('Kwota nie może być większa niż żądana cena.');

              const amountDueCalculated =
                parseFloat(definition.price) - parseFloat(amountPaid);
              const statusDeduced = amountDueCalculated <= 0 ? 1 : 0;

              // Create Payment for the pass purchase.
              return models.Payment.create(
                {
                  customerId: currentCustomer.customerId,
                  date: new Date(),
                  product: `${definition.name} (dId: ${definition.passDefId})`,
                  status: statusDeduced,
                  amountPaid,
                  amountDue: amountDueCalculated,
                  paymentMethod: paymentMethodDeduced,
                  paymentStatus: 1,
                  performedBy: 'Administrator',
                },
                { transaction: t }
              );
            })
            .then(payment => {
              if (payment)
                successLog(person, controllerName, 'payment created');
              // ! MAIL WITH PAYMENT CONFIRMATION

              const purchaseDate = new Date(),
                validityDays = currentPassDefinition.validityDays;
              let calcExpiryDate = calcPassExpiryDate(validityDays);

              return models.CustomerPass.create(
                {
                  customerId: currentCustomer.customerId,
                  paymentId: payment.paymentId,
                  passDefId: currentPassDefinition.passDefId,
                  purchaseDate,
                  validFrom: passStartDate,
                  validUntil: calcExpiryDate,
                  usesLeft: currentPassDefinition.usesTotal,
                  status: 1,
                },
                {
                  transaction: t,
                }
              ).then(customerPass => {
                if (customerPass)
                  successLog(person, controllerName, 'customerPass created');
                console.log(
                  `currentPassDefinition.allowedProductTypes`,
                  currentPassDefinition.allowedProductTypes
                );
                if (customerEmail) {
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
              });
            });
        } else {
          // Check if this booking wasn't paid already
          return (
            models.Booking.findOne({
              where: {
                customerId: currentCustomer.customerId,
                scheduleId: scheduleId,
              },
              transaction: t,
              lock: t.LOCK.UPDATE,
            })
              .then(existingBooking => {
                if (existingBooking) {
                  throw new Error('Rezerwacja dla tego terminu już istnieje.');
                }
                successLog(person, controllerName, 'existingBooking NOT found');

                return models.ScheduleRecord.findOne({
                  where: { scheduleId },
                  include: [{ model: models.Product }],
                  transaction: t,
                  lock: t.LOCK.UPDATE,
                });
              })
              // If fresh booking request
              .then(scheduleRecord => {
                if (!scheduleRecord) {
                  errCode = 404;
                  throw new Error('Nie znaleziono terminu');
                }
                successLog(person, controllerName, 'scheduleRecord found');

                // Check if any spots left
                return models.Booking.count({
                  where: {
                    scheduleId: scheduleRecord.scheduleId,
                    attendance: 1,
                  },
                  transaction: t,
                  lock: t.LOCK.UPDATE,
                })
                  .then(currentAttendance => {
                    successLog(
                      person,
                      controllerName,
                      'got current attendance count'
                    );

                    if (currentAttendance >= scheduleRecord.capacity) {
                      errCode = 409;
                      throw new Error('🪷 Brak wolnych miejsc na ten termin.');
                    }

                    const amountDueCalculated =
                      parseFloat(scheduleRecord.Product.price) -
                      parseFloat(amountPaid);
                    const statusDeduced = amountDueCalculated <= 0 ? 1 : 0;

                    if (scheduleRecord.Product.price < amountPaid)
                      throw new Error(
                        'Kwota nie może być większa niż żądana cena.'
                      );
                    // No pass purchase: create a direct payment and booking.
                    return models.Payment.create(
                      {
                        customerId: currentCustomer.customerId,
                        date: new Date(),
                        product: `${scheduleRecord.Product.name} (sId: ${scheduleRecord.scheduleId})`,
                        status: statusDeduced,
                        amountPaid: amountPaid,
                        amountDue: amountDueCalculated,
                        paymentMethod: paymentMethodDeduced,
                        paymentStatus: 1,
                        performedBy: 'Administrator',
                      },
                      {
                        transaction: t,
                      }
                    );
                  })
                  .then(payment => {
                    if (payment)
                      successLog(person, controllerName, 'Payment created');
                    // ! MAIL WITH PAYMENT CONFIRMATION
                    return models.Booking.create(
                      {
                        customerId: currentCustomer.customerId,
                        scheduleId: scheduleRecord.scheduleId,
                        paymentId: payment.paymentId,
                        timestamp: new Date(),
                        attendance: true,
                        performedBy: 'Administrator',
                      },
                      {
                        transaction: t,
                      }
                    ).then(booking => {
                      if (booking)
                        successLog(person, controllerName, 'Booking created');
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
                    });
                  });
              })
          );
        }
      });
    })
    .then(result => {
      successLog(person, controllerName);
      res.status(201).json({
        isNewCustomer: false,
        confirmation: 1,
        message: 'Płatność zarejestrowana pomyślnie.',
        result,
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//@ PUT
//@ DELETE
export const deletePayment = (req, res, next) => {
  const controllerName = 'deletePayment';
  callLog(req, person, controllerName);

  const id = req.params.id;

  // First - find the targeted booking with attached customer and user for email
  return models.Payment.findOne({
    where: { paymentId: id },
    include: [
      {
        model: models.Customer,
        include: [{ model: models.User, attributes: ['email'] }],
      },
    ],
  })
    .then(payment => {
      if (!payment) {
        errCode = 404;
        throw new Error('\n❌ Nie znaleziono płatności.');
      }

      // Assign email
      const customerEmail = payment.Customer?.User?.email;

      // Send email before deletion
      if (customerEmail) {
        adminEmails.sendPaymentCancelledMail({
          to: customerEmail,
          paymentId: payment.paymentId,
          isAdmin: true,
        });
      }

      // Now delete
      return models.Payment.destroy({
        where: { paymentId: id },
      });
    })
    .then(deletedCount => {
      if (!deletedCount) {
        errCode = 500;
        throw new Error('\n❌ Wystąpił problem przy usuwaniu płatności.');
      }

      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        message: 'Płatność usunięta pomyślnie.',
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};

//! INVOICES_____________________________________________
//@ GET
export const getAllInvoices = (req, res, next) => {
  const controllerName = 'getAllInvoices';
  callLog(req, person, controllerName);

  models.Invoice.findAll({
    include: [
      {
        model: models.Payment,
        include: [
          {
            model: models.Customer, // from Payment
          },
        ],
      },
    ],
    attributes: {
      exclude: ['product'], // Deleting substituted ones
    },
  })
    .then(records => {
      if (!records) {
        errCode = 404;
        throw new Error('Nie znaleziono faktur.');
      }
      // Convert for records
      const formattedRecords = records.map(record => {
        const invoice = record.toJSON();

        return {
          ...invoice,
          rowid: invoice.invoiceId,
          invoiceDate: formatIsoDateTime(invoice.invoiceDate),
          customerFullName: `${invoice.Payment.Customer.firstName} ${invoice.Payment.Customer.lastName}`,
        };
      });

      const totalKeys = [
        'invoiceId',
        'paymentId',
        'invoiceDate',
        'customerFullName',
        'dueDate',
        'paymentStatus',
        'totalAmount',
      ];

      // ✅ Return response to frontend
      successLog(person, controllerName);
      res.json({
        confirmation: 1,
        message: 'Faktury pobrane pomyślnie.',
        isLoggedIn: req.session.isLoggedIn,
        totalKeys, // To render
        content: formattedRecords, // With new names
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//@ POST
//@ PUT
//@ DELETE

//! FEEDBACK_____________________________________________
//@ GET
export const getAllParticipantsFeedback = (req, res, next) => {
  const controllerName = 'getAllParticipantsFeedback';
  callLog(req, person, controllerName);

  models.Feedback.findAll({
    include: [
      {
        model: models.Customer,
      },
      {
        model: models.ScheduleRecord, //  ScheduleRecord
        include: [
          {
            model: models.Product, // Product through ScheduleRecord
            attributes: ['name'],
          },
        ],
      },
    ],
    attributes: {
      exclude: ['product'], // Deleting substituted ones
    },
  })
    .then(records => {
      if (!records) {
        errCode = 404;
        throw new Error('Nie znaleziono opinii.');
      }

      const formattedRecords = records.map(record => {
        const feedback = record.toJSON();

        return {
          ...feedback,
          rowid: feedback.feedbackId,
          submissionDate: formatIsoDateTime(feedback.submissionDate),
          customerFullName: `${feedback.Customer.firstName} ${feedback.Customer.lastName} (${feedback.Customer.customerId})`,
          schedule: `
          ${feedback.ScheduleRecord.Product.name}
          ${feedback.ScheduleRecord.date} | ${feedback.ScheduleRecord.startTime}`,
        };
      });

      const totalKeys = [
        'feedbackId',
        'submissionDate',
        'delay',
        'schedule',
        'rating',
        'content',
        'customerFullName',
      ];

      // ✅ Return response to frontend
      successLog(person, controllerName);
      res.json({
        confirmation: 1,
        message: 'Opinie pobrane pomyślnie',
        isLoggedIn: req.session.isLoggedIn,
        totalKeys,
        content: formattedRecords, // With new names
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
export const getAllParticipantsFeedbackById = (req, res, next) => {
  console.log(`\n➡️ admin called getAllParticipantsFeedbackById`);

  const PK = req.params.id;
  models.Feedback.findByPk(PK, {
    include: [
      {
        model: models.Customer,
        attributes: { exclude: [] },
      },
      {
        model: models.ScheduleRecord,
        attributes: { exclude: ['productId'] },
        include: [
          {
            model: models.Product,
            attributes: { exclude: [] },
          },
        ],
      },
    ],
    attributes: { exclude: ['customerId', 'scheduleId'] },
  })
    .then(review => {
      if (!review) {
        errCode = 404;
        throw new Error('Nie znaleziono opinii.');
      }
      const customerId = review.Customer.customerId;

      return models.Feedback.findAll({
        where: {
          customerId: customerId,
          // op from sequelize means not equal
          feedbackId: { [Op.ne]: PK },
        },
        include: [
          {
            model: models.ScheduleRecord,
            attributes: { exclude: ['productId'] },
            include: [
              {
                model: models.Product,
                attributes: { exclude: [] },
              },
            ],
          },
        ],
        attributes: { exclude: ['customerId', 'scheduleId'] },
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
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//@ POST
//@ PUT
//@ DELETE
export const deleteFeedback = (req, res, next) => {
  const controllerName = 'deleteFeedback';
  callLog(req, person, controllerName);

  const id = req.params.id;
  models.Feedback.destroy({
    where: {
      feedbackId: id,
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
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};

//! NEWSLETTERS_____________________________________________
//@ GET
export const getAllNewsletters = (req, res, next) => {
  const controllerName = 'getAllNewsletters';
  callLog(req, person, controllerName);

  models.Newsletter.findAll()
    .then(records => {
      if (!records) {
        errCode = 404;
        throw new Error('Nie znaleziono rekordów.');
      }

      const formattedRecords = records.map(record => {
        const newsletter = record.toJSON();

        return {
          ...newsletter,
          rowId: newsletter.newsletterId,
          creationDate: formatIsoDateTime(newsletter.creationDate),
          sendDate: formatIsoDateTime(newsletter.sendDate),
        };
      });

      const totalKeys = [
        'newsletterId',
        'status',
        'creationDate',
        'sendDate',
        'title',
        'content',
      ];

      successLog(person, controllerName);
      return res.json({
        totalKeys,
        confirmation: 1,
        message: 'Pobrano pomyślnie',
        content: formattedRecords, //.sort((a, b) => new Date(b.Data) - new Date(a.Data)),
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
export const getAllSubscribedNewsletters = (req, res, next) => {
  //
};
//@ POST
//@ PUT
//@ DELETE
