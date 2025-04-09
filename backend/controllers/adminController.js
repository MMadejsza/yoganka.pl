import bcrypt from 'bcryptjs';
import { addDays, addMonths, addYears } from 'date-fns';
import { Op } from 'sequelize';
import * as models from '../models/_index.js';
import {
  areCustomerDetailsChanged,
  areSettingsChanged,
  convertDurationToTime,
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
export const getAllUsers = (req, res, next) => {
  const controllerName = 'getAllUsers';
  callLog(req, person, controllerName);

  const model = models.User;
  model
    .findAll({
      include: [
        {
          model: models.UserPrefSetting,
          attributes: ['userPrefId'],
        },
      ],
    })
    .then(records => {
      if (!records) {
        errCode = 404;
        throw new Error('Nie znaleziono użytkowników.');
      }

      // Convert for records
      const formattedRecords = records.map(record => {
        const user = record.toJSON();

        return {
          ...user,
          rowId: user.userId,
          registrationDate: formatIsoDateTime(user.registrationDate),
          prefSettings: user.UserPrefSetting
            ? `Tak (Id: ${user.UserPrefSetting.userPrefId})`
            : 'Nie',
          lastLoginDate: formatIsoDateTime(user.lastLoginDate),
        };
      });

      // New headers (keys from columnMap)
      const totalKeys = [
        'userId',
        'email',
        'lastLoginDate',
        'registrationDate',
        'role',
        'prefSettings',
      ];

      // ✅ Return response to frontend
      successLog(person, controllerName);
      res.json({
        confirmation: 1,
        message: 'Konta pobrane pomyślnie.',
        isLoggedIn: req.session.isLoggedIn,
        totalKeys,
        content: formattedRecords.sort((a, b) =>
          a.email.localeCompare(b.email)
        ), // With new names
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
export const getUserById = (req, res, next) => {
  const controllerName = 'getUserById';
  callLog(req, person, controllerName);

  const PK = req.params.id || req.user.userId;
  models.User.findByPk(PK, {
    include: [
      {
        model: models.Customer, // Add Customer
        required: false, // May not exist
      },
      {
        model: models.UserPrefSetting, // User settings if exist
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
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
export const getUserSettings = (req, res, next) => {
  const controllerName = 'getUserSettings';
  callLog(req, person, controllerName);

  models.UserPrefSetting.findByPk(req.params.id)
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
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//@ POST
export const postCreateUser = (req, res, next) => {
  const controllerName = 'postCreateUser';
  callLog(req, person, controllerName);
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
            registrationDate: date,
            passwordHash: passwordHashed,
            lastLoginDate: date,
            email: email,
            role: 'user',
            profilePictureSrcSetJson: null,
          });
        })
        .then(newUser => {
          // Notification email
          if (email) {
            adminEmails.sendUserAccountCreatedMail({ to: email });
          }

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
      catchErr(person, res, errCode, err, controllerName, {
        type: 'signup',
        code: 409,
      })
    );
};
//@ PUT
export const putEditUserSettings = (req, res, next) => {
  const controllerName = 'putEditUserSettings';
  callLog(req, person, controllerName);

  const givenSettings = req.body;
  const { handedness, font, notifications, animation, theme } = givenSettings;
  const userId = req.params.id;
  console.log(`❗❗❗`, req.body);
  console.log(`❗❗❗`, req.params.id);

  if (!userId) {
    throw new Error('Brak identyfikatora użytkownika');
  }

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
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//@ DELETE
export const deleteUser = (req, res, next) => {
  const controllerName = 'deleteUser';
  callLog(req, person, controllerName);

  const id = req.params.id;
  let userEmail;

  // Fetch user to delete to get email
  models.User.findByPk(id)
    .then(user => {
      if (!user) {
        errCode = 404;
        throw new Error('Nie znaleziono użytkownika.');
      }

      // Assign for notification email
      userEmail = user.email;

      // Finally delete
      return models.User.destroy({
        where: {
          userId: id,
        },
      });
    })
    .then(deletedCount => {
      if (!deletedCount) {
        errCode = 404;
        throw new Error('Nie usunięto użytkownika.');
      }

      // Send notification
      if (userEmail) {
        adminEmails.sendUserAccountDeletedMail({ to: userEmail });
      }

      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        message: 'Konto usunięte pomyślnie.',
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};

//! CUSTOMERS_____________________________________________
//@ GET
export const getAllCustomers = (req, res, next) => {
  const controllerName = 'getAllCustomers';
  callLog(req, person, controllerName);

  models.Customer.findAll()
    .then(records => {
      if (!records) {
        errCode = 404;
        throw new Error('Nie znaleziono użytkowników.');
      }

      const formattedRecords = records.map(record => {
        const customer = record.toJSON();

        return {
          ...customer,
          rowId: customer.customerId,
          userId: customer.userId,
          customerFullName: `${customer.firstName} ${customer.lastName}`,
        };
      });

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

      // ✅ Return response to frontend
      successLog(person, controllerName);
      res.json({
        confirmation: 1,
        isLoggedIn: req.session.isLoggedIn,
        totalKeys,
        content: formattedRecords.sort((a, b) =>
          a.lastName.localeCompare(b.lastName)
        ), // With new names
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
export const getCustomerById = (req, res, next) => {
  const controllerName = 'getCustomerById';
  callLog(req, person, controllerName);

  // console.log(req.user);
  const PK = req.params.id;
  models.Customer.findByPk(PK, {
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
                model: models.Product, //schedule's product
                required: false,
              },
              {
                model: models.Feedback,
                required: false,
                where: { customerId: PK }, // but only for particular customer
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
        throw new Error('Nie znaleziono profilu uczestnika.');
      }
      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        isLoggedIn: req.session.isLoggedIn,
        customer,
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
export const getCustomerDetails = (req, res, next) => {
  const controllerName = 'getEditCustomerDetails';
  callLog(req, person, controllerName);

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
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//@ POST
export const postCreateCustomer = (req, res, next) => {
  const controllerName = 'postCreateCustomer';
  callLog(req, person, controllerName);
  console.log(`req.body`, req.body);

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

  if (!firstName || !firstName.trim()) {
    console.log('\n❌❌❌ firstName field empty');
    throw new Error('Imię nie może być puste.');
  }
  if (!lastName || !lastName.trim()) {
    console.log('\n❌❌❌ lastName field empty');
    throw new Error('Nazwisko nie może być puste.');
  }
  if (!dob || !dob.trim()) {
    console.log('\n❌❌❌ dob field empty');
    throw new Error('Data urodzenia nie może być pusta.');
  }
  if (!phone || !phone.trim()) {
    console.log('\n❌❌❌ phone field empty');
    throw new Error('Numer telefonu nie może być pusty.');
  }
  if (!isAdult(dob)) {
    console.log('\n❌❌❌ Customer below 18');
    throw new Error('Uczestnik musi być pełnoletni.');
  }

  models.Customer.findOne({ where: { userId: userId } })
    .then(customer => {
      if (customer) {
        errCode = 409;
        throw new Error('Profil uczestnika już istnieje.');
      }

      // Getting user for email purposes
      return models.User.findByPk(userId, {
        attributes: ['userId', 'email'],
      });
    })
    .then(user => {
      if (!user) {
        errCode = 404;
        throw new Error('Nie znaleziono użytkownika.');
      }

      // Assign email
      customerEmail = user.email;

      // Create user
      return models.Customer.create({
        customerType: customerType || 'Indywidualny',
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        phone: phone,
        preferredContactMethod: cMethod || '=',
        referralSource: 'Admin insert',
        loyalty: loyalty || 5,
        notes: notes,
      }).then(newCustomer => {
        return user.update({ role: 'customer' }).then(() => newCustomer);
      });
    })
    .then(newCustomer => {
      // Notification email
      if (customerEmail) {
        adminEmails.sendCustomerCreatedMail({
          to: customerEmail,
          firstName,
        });
      }

      successLog(person, controllerName);
      return res.status(200).json({
        code: 200,
        confirmation: 1,
        message: 'Zarejestrowano pomyślnie.',
      });
    })
    .catch(err =>
      catchErr(person, res, errCode, err, controllerName, { code: 409 })
    );
};
//@ PUT
export const putEditCustomerDetails = (req, res, next) => {
  const controllerName = 'putEditCustomerDetails';
  callLog(req, person, controllerName);

  const customerId = req.params.id;

  const {
    phone: newPhone,
    cMethod: newContactMethod,
    loyalty: newLoyalty,
    notes: newNotes,
  } = req.body;

  models.Customer.findByPk(customerId)
    .then(customer => {
      errCode = 404;
      if (!customer) throw new Error('Nie znaleziono danych uczestnika.');

      successLog(person, controllerName, 'fetched');
      return customer;
    })
    .then(foundCustomer => {
      const interrupted = areCustomerDetailsChanged(
        res,
        person,
        foundCustomer,
        newPhone,
        newContactMethod
      );
      if (interrupted) return;

      const { phone, preferredContactMethod, loyalty, notes } = foundCustomer;

      if (
        phone == newPhone &&
        preferredContactMethod == newContactMethod &&
        loyalty == newLoyalty &&
        notes == newNotes
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
          phone: newPhone,
          preferredContactMethod: newContactMethod,
          loyalty: newLoyalty,
          notes: newNotes,
        },
        { where: { customerId: customerId } }
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
        .catch(err => catchErr(person, res, errCode, err, controllerName));
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//@ DELETE
export const deleteCustomer = (req, res, next) => {
  const controllerName = 'deleteCustomer';
  callLog(req, person, controllerName);

  const id = req.params.id;
  let userEmail;

  models.Customer.findOne({
    where: { customerId: id },
    include: [
      {
        model: models.User,
        attributes: ['email'],
      },
    ],
  })
    .then(customer => {
      if (!customer) {
        errCode = 404;
        throw new Error('Nie znaleziono profilu uczestnika.');
      }

      userEmail = customer.User?.email;
      return customer.destroy();
    })
    .then(() => {
      // email notification
      if (userEmail) {
        adminEmails.sendCustomerDeletedMail({ to: userEmail });
      }

      successLog(person, controllerName);
      return res
        .status(200)
        .json({ confirmation: 1, message: 'Profil usunięty pomyślnie.' });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};

//! SCHEDULES_____________________________________________
//@ GET
export const getAllSchedules = (req, res, next) => {
  const controllerName = 'getAllSchedules';
  callLog(req, person, controllerName);

  models.ScheduleRecord.findAll({
    include: [
      {
        model: models.Product,
        attributes: ['type', 'name', 'price'],
      },
      {
        model: models.Booking,
      },
    ],
    attributes: {
      exclude: ['productId'], // Deleting substituted ones
    },
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
        schedule.attendance = `${activeBookings?.length}/${schedule.capacity}`;
        schedule.day = getWeekDay(schedule.date);
        schedule.rowId = schedule.scheduleId;

        schedule.productType = schedule.Product.type;
        schedule.productName = schedule.Product.name;
        schedule.productPrice = schedule.Product.price;
        return schedule;
      });

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
      // ✅ Return response to frontend
      successLog(person, controllerName);
      res.json({
        confirmation: 1,
        message: 'Terminy pobrane pomyślnie.',
        totalKeys, // to map to the rows attributes
        content: formattedRecords.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        ), // With new names
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
export const getScheduleById = (req, res, next) => {
  const controllerName = 'getScheduleById';
  console.log(`\n➡️➡️➡️ admin called`, controllerName);

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
        include: [
          {
            model: models.Customer,
            attributes: { exclude: ['userId'] },
          },
          // For direct payment bookings
          {
            model: models.Payment,
            required: false,
            // attributes: ['paymentId'],
          },
          // For bookings paid with a pass
          {
            model: models.CustomerPass,
            required: false,
            include: [
              {
                model: models.PassDefinition,
                attributes: { exclude: ['userId'] },
              },
            ],
            // attributes: ['customerPassId'],
          },
        ],
      },
      {
        model: models.Feedback,
        required: false,
        include: [
          {
            model: models.Customer,
            attributes: { exclude: ['userId'] },
          },
        ],
        attributes: { exclude: ['customerId'] },
      },
    ],
  })
    .then(scheduleData => {
      if (!scheduleData) {
        errCode = 404;
        throw new Error('Nie znaleziono terminu.');
      }
      // console.log(scheduleData);
      let schedule = scheduleData.toJSON();

      schedule.attendance = 0;
      let attendedRecords = [];
      let cancelledRecords = [];
      if (schedule.Bookings && schedule.Bookings.length > 0) {
        schedule.Bookings.forEach(b => {
          if (b.attendance == 1 || b.attendance == true)
            attendedRecords.push({ ...b, rowId: b.bookingId });
          if (b.attendance == 0 || b.attendance == false)
            cancelledRecords.push({ ...b, rowId: b.bookingId });
        });

        schedule.attendance = attendedRecords.length;
        schedule.full = attendedRecords.length >= schedule.capacity;
      }

      const scheduleDateTime = new Date(
        `${schedule.date}T${schedule.startTime}:00`
      );
      const now = new Date();
      schedule.isCompleted = scheduleDateTime <= now;
      schedule.attendedRecords = attendedRecords;
      schedule.cancelledRecords = cancelledRecords;

      // Find all schedule payment regardless relation to booking because they are non refundable
      return models.Payment.findAll({
        where: {
          product: {
            [Op.like]: `%sId: ${schedule.scheduleId}%`, // % any amount of characters
          },
        },
        include: [
          {
            model: models.Customer,
            attributes: { exclude: ['userId'] },
          },
        ],
      }).then(paymentsList => {
        schedule.payments = paymentsList.map(payment => {
          const p = payment.toJSON();
          console.log(`❗❗❗p.date`, p.date);
          return {
            ...p,
            rowId: p.paymentId,
            date: formatIsoDateTime(p.date),
            customerFullName: `${p.Customer.firstName} ${p.Customer.lastName} (${p.Customer.customerId})`,
          };
        });
        successLog(person, controllerName);
        return res.status(200).json({
          confirmation: 1,
          message: 'Termin pobrany pomyślnie',
          schedule,
          user: req.user,
        });
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
export const getProductSchedules = (req, res, next) => {
  const controllerName = 'getProductSchedulesById';
  console.log(`\n➡️➡️➡️ admin called`, controllerName);

  const productId = req.params.pId;
  const customerId = req.params.cId;

  // find all schedule for chosen Product
  models.ScheduleRecord.findAll({ where: { productId: productId } })
    .then(foundSchedules => {
      //find all bookings for given customer
      return models.Booking.findAll({
        where: { customerId: customerId },
      }).then(bookedByCustomerSchedules => {
        // filter bookings which have not been booked yet by him
        const filteredSchedules = foundSchedules.filter(foundSchedule => {
          return !bookedByCustomerSchedules.some(
            bs => bs.scheduleId == foundSchedule.scheduleId
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
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
export const getBookings = (req, res, next) => {};
//@ POST
export const postCreateScheduleRecord = (req, res, next) => {
  const controllerName = 'postCreateScheduleRecord';
  callLog(req, person, controllerName);
  const {
    productId,
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
        productId: productId,
        date: currentDate,
        startTime: startTime,
        location: location,
        capacity: capacity,
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
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//@ PUT
export const putEditSchedule = async (req, res, next) => {
  const controllerName = 'putEditSchedule';
  callLog(req, person, controllerName);

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
        capacity,
        date: scheduleDate,
        location,
        startTime,
      } = foundSchedule;
      if (
        new Date(`${foundSchedule.date}T${foundSchedule.startTime}:00`) <
        new Date()
      ) {
        errCode = 400;
        console.log('\n❓❓❓ Admin schedule is past - not to edit');
        throw new Error('Nie można edytować minionego terminu.');
      } else if (
        capacity == newCapacity &&
        scheduleDate === newStartDate &&
        location === newLocation &&
        startTime === newStartTime
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
          capacity: newCapacity,
          date: newStartDate,
          startTime: newStartTime,
          location: newLocation,
        },
        { where: { scheduleId: scheduleId } }
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
        .catch(err => catchErr(person, res, errCode, err, controllerName));
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//@ DELETE
export const deleteSchedule = (req, res, next) => {
  const controllerName = 'deleteSchedule';
  callLog(req, person, controllerName);
  const id = req.params.id;
  console.log(`${controllerName} deleting id: `, id);

  models.ScheduleRecord.findOne({
    where: {
      scheduleId: id,
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
        new Date(`${foundSchedule.date}T${foundSchedule.startTime}:00`) <
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

      return models.Booking.findOne({
        where: { scheduleId: id },
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
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};

//! PRODUCTS_____________________________________________
//@ GET
export const getAllProducts = (req, res, next) => {
  const controllerName = 'getAllProducts';
  callLog(req, person, controllerName);

  models.Product.findAll()
    .then(records => {
      if (!records) {
        errCode = 404;
        throw new Error('Nie znaleziono rekordów.');
      }

      // Convert for records for different names
      const formattedRecords = records.map(record => {
        const product = record.toJSON();

        return {
          ...product,
          rowId: product.productId,
          startDate: formatIsoDateTime(product.startDate),
        };
      });

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
export const getProductById = (req, res, next) => {
  const controllerName = 'getProductById';
  callLog(req, person, controllerName);

  const PK = req.params.id;
  models.Product.findByPk(PK, {
    include: [
      {
        model: models.ScheduleRecord,
        required: false,
        include: [
          {
            model: models.Booking,
            required: false,
            include: [
              {
                model: models.Customer,
                attributes: { exclude: ['userId'] },
              },
              {
                model: models.Payment,
                required: false,
                attributes: {
                  exclude: ['product'],
                },
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
            attributes: { exclude: ['customerId'] },
          },
          {
            model: models.Feedback,
            required: false,
            include: [
              {
                model: models.Customer,
                attributes: { exclude: ['userId'] },
              },
            ],
            attributes: { exclude: ['customerId'] },
          },
        ],
        attributes: {
          exclude: ['productId'],
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
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//@ POST
export const postCreateProduct = async (req, res, next) => {
  const controllerName = 'postCreateProduct';
  callLog(req, person, controllerName);

  const { name, productType, startDate, duration, location, price, status } =
    req.body;

  models.Product.findOne({ where: { name: name } })
    .then(product => {
      if (product) {
        errCode = 409;
        throw new Error('Produkt już istnieje.');
      }
      return models.Product.create({
        name: name,
        type: productType,
        location: location,
        duration: convertDurationToTime(duration),
        price: price,
        startDate: startDate,
        status: status || 'Aktywny',
      });
    })
    .then(newProduct => {
      successLog(person, controllerName);
      return res.status(200).json({
        code: 200,
        confirmation: 1,
        message: 'Stworzono pomyślnie.',
      });
    })
    .catch(err =>
      catchErr(person, res, errCode, err, controllerName, { code: 409 })
    );
};
//@ PUT
export const putEditProduct = async (req, res, next) => {
  const controllerName = 'putEditProduct';
  callLog(req, person, controllerName);
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
      const { type, startDate, location, duration, price, status } =
        foundProduct;
      if (
        type === newType &&
        startDate === newStartDate &&
        location === newLocation &&
        duration === newDuration &&
        price === newPrice &&
        status === newStatus
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
          type: newType,
          startDate: newStartDate,
          location: newLocation,
          duration: newDuration,
          price: newPrice,
          status: newStatus,
        },
        { where: { productId: productId } }
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
        .catch(err => catchErr(person, res, errCode, err, controllerName));
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//@ DELETE
export const deleteProduct = (req, res, next) => {
  const controllerName = 'deleteProduct';
  callLog(req, person, controllerName);

  const id = req.params.id;
  models.Product.destroy({
    where: {
      productId: id,
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
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};

//! PASSES_______________________________________________
//@ GET
export const getAllPasses = (req, res, next) => {
  const controllerName = 'getAllPasses';
  callLog(req, person, controllerName);

  models.PassDefinition.findAll({
    where: { status: true },
  })
    .then(records => {
      if (!records) {
        errCode = 404;
        throw new Error('Nie znaleziono rekordów.');
      }

      // Convert for records for different names
      const formattedRecords = records.map(record => {
        const passDef = record.toJSON();

        return {
          ...passDef,
          rowId: passDef.passDefId,
          usesTotal: passDef.usesTotal || '-',
          validityDays: `${
            passDef.validityDays ? `${passDef.validityDays} dni` : '-'
          }`,
          price: `${passDef.price} zł`,
          allowedProductTypes: JSON.parse(passDef.allowedProductTypes).join(
            ', '
          ),
        };
      });

      const sortedRecords = formattedRecords.sort(
        (a, b) => new Date(a.passDefId) - new Date(b.passDefId)
      );

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

      successLog(person, controllerName);
      return res.json({
        totalKeys,
        confirmation: 1,
        message: 'Pobrano pomyślnie',
        content: sortedRecords,
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
export const getPassById = (req, res, next) => {
  const controllerName = 'getPassById';
  console.log(`\n➡️➡️➡️ admin called`, controllerName);

  const PK = req.params.id;
  models.PassDefinition.findByPk(PK, {
    include: [
      {
        model: models.CustomerPass,
        include: [
          {
            model: models.Customer,
            include: [
              {
                model: models.User,
                attributes: { exclude: ['userId'] },
              },
            ],
          },
          { model: models.Payment },
        ],
      },
    ],
  })
    .then(passData => {
      if (!passData) {
        errCode = 404;
        throw new Error('Nie znaleziono definicji karnetu.');
      }
      // console.log(scheduleData);
      let passDef = passData.toJSON();

      const payments = passDef.CustomerPasses.map(customerPass => {
        const cp = customerPass;
        const customer = cp.Customer;
        const payment = cp.Payment;
        return {
          ...payment,
          rowId: payment.paymentId,
          date: formatIsoDateTime(payment.date),
          customerFullName: `${customer.firstName} ${customer.lastName} (${customer.customerId})`,
        };
      });

      const customerPasses = passDef.CustomerPasses.map(customerPass => {
        const cp = customerPass;
        const customer = cp.Customer;

        return {
          customerPassId: cp.customerPassId,
          rowId: cp.customerPassId,
          customerFullName: `${customer.firstName} ${customer.lastName} (${customer.customerId})`,
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

      passDef = { ...passDef, CustomerPasses: null };

      let passDefFormatted = {
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

      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        message: 'Definicja karnetu pobrana pomyślnie',
        passDef: passDefFormatted,
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//@ POST
//@ PUT

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
          createdAt: formatIsoDateTime(record.createdAt),
          timestamp: formatIsoDateTime(record.timestamp),
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
export const postCreateBooking = (req, res, next) => {
  const controllerName = 'adminCreateBooking';
  callLog(req, person, controllerName);

  const {
    customerId,
    scheduleId,
    passDefinitionId,
    bookingType,
    amountPaid,
    paymentMethod,
  } = req.body;
  console.log(req.body);
  if (isNaN(amountPaid) || Number(amountPaid) < 0) {
    console.log('\n❌❌❌ amountPaid wrong');
    throw new Error('amountPaid wrong');
  }
  if ([1, 2, 3].includes(Number(paymentMethod))) {
    console.log('\n❌❌❌ paymentMethod wrong');
    throw new Error('paymentMethod wrong');
  }
  if (!customerId || !scheduleId || !bookingType) {
    errCode = 400;
    return next(new Error('Brakuje pól: customerId, scheduleId, bookingType'));
  }
  const wantsNotifications = req.user?.UserPrefSetting
    ? req.user?.UserPrefSetting?.notifications
    : true;

  let currentCustomer, currentScheduleRecord;
  const paymentMethodDeduced =
    paymentMethod == 1
      ? 'Gotówka (M)'
      : paymentMethod == 2
      ? 'BLIK (M)'
      : 'Przelew (M)';
  // Load customer with passes

  return db
    .transaction(t => {
      return models.Customer.findByPk(customerId, {
        include: [
          {
            model: models.CustomerPass,
            include: [models.PassDefinition],
          },
        ],
        transaction: t,
      })
        .then(customer => {
          if (!customer) throw new Error('Nie znaleziono profilu uczestnika');
          currentCustomer = customer;

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
              customerId: currentCustomer.customerId,
              scheduleId,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        })
        .then(existingBooking => {
          if (existingBooking) {
            if (req.user.email && wantsNotifications) {
              adminEmails.sendAttendanceReturningMail({
                to: req.user.email,
                productName: currentScheduleRecord.Product.name,
                date: currentScheduleRecord.date,
                startTime: currentScheduleRecord.startTime,
                location: currentScheduleRecord.location,
              });
            }

            // If booking exists, update attendance flag.
            return existingBooking.update(
              { attendance: false, timestamp: new Date() },
              {
                transaction: t,
              }
            );
          } else {
            // Create new booking based on bookingType
            if (bookingType === 'pass') {
              let validPass = null;

              if (!passDefinitionId) {
                throw new Error(
                  'Brak id karnetu do użycia w celu identyfikacji.'
                );
              }

              // Check if customer already has a valid pass for this schedule.
              if (
                currentCustomer.CustomerPasses &&
                currentCustomer.CustomerPasses.length > 0
              ) {
                validPass = currentCustomer.CustomerPasses.find(pass =>
                  isPassValidForSchedule(pass, currentScheduleRecord)
                );
              }

              if (validPass) {
                return models.Booking.create(
                  {
                    customerId: currentCustomer.customerId,
                    scheduleId: currentScheduleRecord.scheduleId,
                    customerPassId: validPass.customerPassId,
                    attendance: true,
                    timestamp: new Date(),
                  },
                  {
                    transaction: t,
                  }
                );
              } else {
                throw new Error('Karnet nie jest ważny na ten termin.');
              }
            } else if (bookingType === 'direct') {
              if (validPass.PassDefinition.price < amountPaid)
                throw new Error('Kwota nie może być większa niż żądana cena.');
              const amountDueCalculated =
                parseFloat(validPass.PassDefinition.price) -
                parseFloat(amountPaid);
              const statusDeduced =
                amountDueCalculated <= 0 ? 'w pełni' : 'Częściowo';

              // Create payment first, then booking.
              return models.Payment.create(
                {
                  customerId: currentCustomer.customerId,
                  date: new Date(),
                  product: `${currentScheduleRecord.Product.name} (sId: ${currentScheduleRecord.scheduleId})`,
                  status: statusDeduced,
                  amountPaid: amountPaid,
                  amountDue: amountDueCalculated,
                  paymentMethod: paymentMethodDeduced,
                  paymentStatus: 'Completed',
                },
                {
                  transaction: t,
                }
              ).then(payment => {
                return models.Booking.create(
                  {
                    customerId: currentCustomer.customerId,
                    scheduleId,
                    paymentId: payment.paymentId,
                    attendance: true,
                    timestamp: new Date(),
                  },
                  {
                    transaction: t,
                  }
                ).then(booking => {
                  return { payment, booking };
                });
              });
            } else {
              throw new Error(
                'Typ rezerwacji nieprawidłowy - dozwolona jest z karnetem lub płatnością bezpośrednią'
              );
            }
          }
        });
    })
    .then(result => {
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
        }
      );
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
        include: [{ model: models.PassDefinition }],
        required: false,
      },
    ],
  })
    .then(payment => {
      if (!payment) {
        errCode = 404;
        throw new Error('Nie znaleziono płatności.');
      }
      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        message: 'Płatność pobrana pomyślnie.',
        isLoggedIn: req.session.isLoggedIn,
        payment,
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
    passDefinitionId,
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
        if (passDefinitionId) {
          // Check if customer already has that pass
          return models.CustomerPass.findOne({
            where: {
              customerId: customer.customerId,
              passDefId: passDefinitionId,
              status: 'active',
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
              return models.PassDefinition.findByPk(passDefinitionId, {
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
              const statusDeduced =
                amountDueCalculated <= 0 ? 'w pełni' : 'Częściowo';

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
                  paymentStatus: 'Completed',
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
              let calcExpiryDate = null;

              if (validityDays && validityDays < 30) {
                // if less then month
                calcExpiryDate = addDays(purchaseDate, validityDays);
              } else if (validityDays && validityDays % 30 == 0) {
                // if a couple of months where month = 30
                calcExpiryDate = addMonths(purchaseDate, validityDays / 30);
              } else if (validityDays && validityDays == 365) {
                // if 1 year - no more expected
                calcExpiryDate = addYears(purchaseDate, 1);
              }

              return models.CustomerPass.create(
                {
                  customerId: currentCustomer.customerId,
                  paymentId: payment.paymentId,
                  passDefId: currentPassDefinition.passDefId,
                  purchaseDate,
                  validFrom: passStartDate,
                  validUntil: calcExpiryDate,
                  usesLeft: currentPassDefinition.usesTotal,
                  status: 'active',
                },
                {
                  transaction: t,
                }
              ).then(customerPass => {
                if (customerPass)
                  successLog(person, controllerName, 'customerPass created');

                if (customerEmail) {
                  adminEmails.sendNewPassPurchasedMail({
                    to: customerEmail,
                    productName: currentPassDefinition.name,
                    productPrice: currentPassDefinition.price,
                    purchaseDate: customerPass.purchaseDate,
                    validFrom: customerPass.validFrom,
                    validUntil: customerPass.validUntil,
                    allowedProductTypes:
                      currentPassDefinition.allowedProductTypes,
                    usesTotal: currentPassDefinition.usesTotal,
                    description: currentPassDefinition.description,
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

                const amountDueCalculated =
                  parseFloat(scheduleRecord.Product.price) -
                  parseFloat(amountPaid);
                const statusDeduced =
                  amountDueCalculated <= 0 ? 'w pełni' : 'Częściowo';

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
                    paymentStatus: 'Completed',
                  },
                  {
                    transaction: t,
                  }
                ).then(payment => {
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
