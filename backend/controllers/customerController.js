import { addDays, addMonths, addYears } from 'date-fns';
import 'dotenv/config';
import { Op } from 'sequelize';
import * as models from '../models/_index.js';
import {
  areCustomerDetailsChanged,
  isEmptyInput,
  isPassValidForSchedule,
  pickTheBestPassForSchedule,
} from '../utils/controllersUtils.js';
import { createGetById } from '../utils/crudFactory.js';
import { formatIsoDateTime, isAdult } from '../utils/dateTimeUtils.js';
import db from '../utils/db.js';
import {
  callLog,
  catchErr,
  errorCode,
  successLog,
} from '../utils/debuggingUtils.js';
import * as customerEmails from '../utils/mails/templates/customerActions/_customerEmails.js';
import * as msgs from '../utils/resMessagesUtils.js';
let errCode = errorCode;
const person = 'Customer';

//! CUSTOMERS_____________________________________________
//@ GET
export const getCustomerDetails = (req, res, next) => {
  const controllerName = 'getCustomerDetails';
  callLog(req, person, controllerName);
  const customer = req.user.Customer;

  successLog(person, controllerName);
  return res.status(200).json({ confirmation: 1, customer });
};
//@ PUT
export const putEditCustomerDetails = async (req, res, next) => {
  const controllerName = 'putEditCustomerDetails';
  callLog(req, person, controllerName);
  try {
    console.log(req.body);
    const customer = req.user.Customer;
    const customerId = customer.customerId;
    const { phone: newPhone, cMethod: newContactMethod } = req.body;

    const interrupted = areCustomerDetailsChanged(
      res,
      person,
      customer,
      newPhone,
      newContactMethod
    );
    if (interrupted) return;

    const [affectedCustomerRows] = await models.Customer.update(
      { phone: newPhone, preferredContactMethod: newContactMethod },
      { where: { customerId: customerId } }
    );

    successLog(person, controllerName);

    return res.status(200).json({
      message: msgs.customerDetailsUpdated,
      confirmation: affectedCustomerRows >= 1,
      affectedCustomerRows,
    });
  } catch (err) {
    return catchErr(person, res, errCode, err, controllerName);
  }
};
//! PASSES_____________________________________________
//@ GET
export const getCustomerPassById = createGetById(person, models.CustomerPass, {
  // dodatkowy guard: tylko passy należące do zalogowanego klienta
  where: req => ({ customerId: req.user.Customer.customerId }),

  includeRelations: [
    { model: models.PassDefinition },
    { model: models.Payment },
  ],

  excludeFields: [],

  mapRecord: cp => {
    const payment = {
      paymentId: cp.Payment.paymentId,
      date: formatIsoDateTime(cp.Payment.date),
      amountPaid: cp.Payment.amountPaid,
      paymentMethod: cp.Payment.paymentMethod,
      status: cp.Payment.status,
    };

    const def = cp.PassDefinition;
    const passDefinition = {
      passDefId: def.passDefId,
      name: def.name,
      description: def.description,
      passType: def.passType,
      usesTotal: def.usesTotal,
      validityDays: def.validityDays,
      allowedProductTypes: def.allowedProductTypes,
      price: def.price,
      status: cp.status,
    };

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

  resultName: 'customerPass',
  successMessage: 'Karnet pobrany pomyślnie',
  notFoundMessage: 'Nie znaleziono karnetu tego klienta.',
});
//@ POST
export const postCreateBuyPass = async (req, res, next) => {
  const controllerName = 'postCreateBuyPass';
  callLog(req, person, controllerName);

  let errCode = 500;
  let currentCustomer;
  let currentPassDefinition;
  let isNewCustomer = false;
  const userEmail = req.user.email;

  try {
    //If user has no Customer record yet, validate input and create one
    if (!req.user.Customer) {
      const cDetails = req.body.customerDetails;
      console.log(
        '❗❗❗User is not the customer, creation of the record Customer...'
      );
      errCode = 400;

      try {
        // validate required fields
        isEmptyInput(cDetails, '"dane uczestnika"', msgs.noCustomerData);
        isEmptyInput(cDetails.fname, '"imię"', msgs.noFirstName);
        isEmptyInput(cDetails.lname, '"nazwisko"', msgs.noLastName);
        isEmptyInput(cDetails.dob, '"data urodzenia"', msgs.noBirthDate);
        isEmptyInput(cDetails.phone, '"telefon"', msgs.noPhonePicked);
        isEmptyInput(
          req.body.validFrom,
          '"data rozpoczęcia"',
          msgs.noPassStartDate
        );

        // validate adult
        if (!isAdult(cDetails.dob)) {
          console.log('\n❌❌❌ Customer below 18');
          throw new Error(msgs.notAnAdult);
        }
        // validate pass start date
        if (!isAdult(req.body.validFrom)) {
          console.log('\n❌❌❌ No pass start date specified');
          throw new Error(msgs.noPassStartDate);
        }
      } catch (err) {
        return catchErr(person, res, errCode, err, controllerName, {
          code: 409,
        });
      }

      // create the Customer
      const newCustomer = await models.Customer.create({
        customerType: cDetails.cType,
        userId: req.user.userId,
        firstName: cDetails.fname,
        lastName: cDetails.lname,
        dob: cDetails.dob,
        phone: cDetails.phone,
        preferredContactMethod: cDetails.cMethod || '-',
        referralSource: cDetails.rSource || '-',
        notes: cDetails.notes,
      });

      // notify user of new Customer
      if (userEmail) {
        customerEmails.sendCustomerCreatedMail({
          to: userEmail,
          firstName: cDetails.fname,
        });
      }

      // first update db user with new role as the middleware actually always fetch from the db on request
      await models.User.update(
        { role: 'CUSTOMER' },
        { where: { userId: req.user.userId } }
      );

      // reload User with Customer and PrefSettings
      const updatedUser = await models.User.findByPk(req.user.userId, {
        include: [
          { model: models.Customer, required: false },
          { model: models.UserPrefSetting, required: false },
        ],
      });

      // update session
      req.session.user = updatedUser.toJSON();
      req.session.role = updatedUser.role.toUpperCase();
      req.session.save(err => {
        if (err) console.error(msgs.sessionNotUpdated, err);
      });

      isNewCustomer = true;
      currentCustomer = newCustomer;
      successLog(
        person,
        controllerName,
        'customer created and session updated'
      );
    } else {
      // User already has a Customer record: fetch it with existing passes
      currentCustomer = await models.Customer.findByPk(
        req.user.Customer.customerId,
        {
          include: [
            {
              model: models.CustomerPass,
              include: [models.PassDefinition],
            },
          ],
        }
      );
    }

    // Validate that a pass definition was chosen
    if (!req.body.passDefId) {
      errCode = 400;
      throw new Error(msgs.noPassIdPicked);
    }

    // Load the PassDefinition
    const passDef = await models.PassDefinition.findByPk(req.body.passDefId);
    if (!passDef) {
      throw new Error(msgs.noPassDefFound);
    }
    currentPassDefinition = passDef;

    // Validate price
    if (Number(currentPassDefinition.price) < 0) {
      throw new Error('Nieprawidłowa cena karnetu.');
    }

    // Check for overlapping active pass
    const overlapping = await models.CustomerPass.findOne({
      where: {
        customerId: currentCustomer.customerId,
        passDefId: currentPassDefinition.passDefId,
        status: 1,
        validUntil: { [Op.gt]: req.body.validFrom },
      },
    });
    if (overlapping) {
      throw new Error(msgs.customerPassOVerlapping);
    }

    // Create Payment and CustomerPass in a transaction
    const { payment, newPass } = await db.transaction(async t => {
      const purchaseDate = new Date();
      const validityDays = currentPassDefinition.validityDays;
      let calcExpiryDate = null;

      // calculate expiry date
      if (validityDays && validityDays < 30) {
        calcExpiryDate = addDays(purchaseDate, validityDays);
      } else if (validityDays < 365) {
        calcExpiryDate = addMonths(purchaseDate, Math.floor(validityDays / 30));
      } else {
        calcExpiryDate = addYears(purchaseDate, Math.floor(validityDays / 365));
      }
      if (calcExpiryDate) {
        calcExpiryDate.setHours(23, 59, 59, 999);
      }

      // create Payment record
      const payment = await models.Payment.create(
        {
          customerId: currentCustomer.customerId,
          date: purchaseDate,
          product: `${currentPassDefinition.name} (${currentPassDefinition.passDefId})`,
          status: 1,
          amountPaid: currentPassDefinition.price,
          amountDue: 0,
          paymentMethod: req.body.paymentMethod,
          paymentStatus: 1,
        },
        { transaction: t }
      );
      if (!payment) {
        throw new Error(msgs.paymentSaveError);
      }

      // create CustomerPass record
      const newPass = await models.CustomerPass.create(
        {
          customerId: currentCustomer.customerId,
          passDefId: req.body.passDefId,
          paymentId: payment.paymentId,
          purchaseDate,
          usesLeft: currentPassDefinition.usesTotal,
          validFrom: purchaseDate,
          validUntil: calcExpiryDate,
          status: 1,
        },
        { transaction: t }
      );

      return { payment, newPass };
    });

    // Refresh User in session to include the new pass
    const refreshedUser = await models.User.findByPk(req.user.userId, {
      include: [
        {
          model: models.Customer,
          include: [
            {
              model: models.CustomerPass,
              include: [models.PassDefinition],
            },
          ],
        },
        { model: models.UserPrefSetting, required: false },
      ],
    });
    req.session.user = refreshedUser.toJSON();
    req.session.role = refreshedUser.role.toUpperCase();
    req.session.save(err => {
      if (err) console.error(msgs.sessionNotUpdated, err);
    });

    // Return success
    successLog(person, controllerName);
    return res.status(201).json({
      isNewCustomer,
      confirmation: 1,
      message: msgs.newCustomerPass,
      customerPass: newPass,
    });
  } catch (err) {
    return catchErr(person, res, errCode, err, controllerName);
  }
};

//! BOOKINGS_____________________________________________
//@ POST
export const postCreateBookSchedule = async (req, res, next) => {
  const controllerName = 'postCreateBookSchedule';
  callLog(req, person, controllerName);
  console.log(`req.body`, req.body);
  console.log(`req.user`, req.user);

  let errCode = 500;
  let currentCustomer;
  let currentScheduleRecord;
  const userEmail = req.user.email;
  const wantsNotifications = req.user.UserPrefSetting
    ? req.user.UserPrefSetting.notifications
    : true;
  let isNewCustomer = false;

  try {
    // If the user is not yet a Customer, validate and create one
    if (!req.user.Customer) {
      const cDetails = req.body.customerDetails;
      console.log(
        '❗❗❗User is not the customer, creation of the record Customer...'
      );

      // set error code for validation errors
      errCode = 400;

      // validate required customer details
      try {
        isEmptyInput(cDetails, 'dane uczestnika', msgs.noCustomerData);
        isEmptyInput(cDetails.fname, 'imię', msgs.noFirstName);
        isEmptyInput(cDetails.lname, 'nazwisko', msgs.noLastName);
        isEmptyInput(cDetails.dob, 'data urodzenia', msgs.noBirthDate);
        isEmptyInput(cDetails.phone, 'telefon', msgs.noPhonePicked);
        if (!isAdult(cDetails.dob)) {
          console.log('\n❌❌❌ Customer below 18');
          throw new Error(msgs.notAnAdult);
        }
      } catch (err) {
        return catchErr(person, res, errCode, err, controllerName, {
          code: 409,
        });
      }

      // create new Customer record
      const newCustomer = await models.Customer.create({
        customerType: cDetails.cType,
        userId: req.user.userId,
        firstName: cDetails.fname,
        lastName: cDetails.lname,
        dob: cDetails.dob,
        phone: cDetails.phone,
        preferredContactMethod: cDetails.cMethod || '-',
        referralSource: cDetails.rSource || '-',
        notes: cDetails.notes,
      });

      // send notification email for newly created Customer
      if (userEmail) {
        customerEmails.sendCustomerCreatedMail({
          to: userEmail,
          firstName: cDetails.fname,
        });
      }

      // first update db user with new role as the middleware actually always fetch from the db on request
      await models.User.update(
        { role: 'CUSTOMER' },
        { where: { userId: req.user.userId } }
      );

      // reload User with new associations
      const updatedUser = await models.User.findByPk(req.user.userId, {
        include: [
          { model: models.Customer, required: false },
          { model: models.UserPrefSetting, required: false },
        ],
      });

      // update session with new User data
      req.session.user = updatedUser.toJSON();
      req.session.role = updatedUser.role.toUpperCase();
      req.session.save(err => {
        if (err) {
          console.error(msgs.sessionNotUpdated, err);
        }
      });

      isNewCustomer = true;
      successLog(
        person,
        controllerName,
        'customer created and session updated'
      );
      currentCustomer = newCustomer;
    } else {
      // Fetching from the database again ensures you get a full Sequelize instance with all methods - this is essential for using instance methods like .save()
      currentCustomer = await models.Customer.findOne({
        where: { customerId: req.user.Customer.customerId },
        include: [
          { model: models.CustomerPass, include: [models.PassDefinition] },
        ],
      });
    }
    //@ BOOKING
    // perform booking/payment logic inside a transaction
    const paymentOrBooking = await db.transaction(async t => {
      // fetch and lock the ScheduleRecord
      const scheduleRecord = await models.ScheduleRecord.findOne({
        where: { scheduleId: req.body.scheduleId },
        include: [{ model: models.Product }],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!scheduleRecord) {
        errCode = 404;
        throw new Error(msgs.noScheduleFound);
      }
      currentScheduleRecord = scheduleRecord;
      successLog(person, controllerName, 'schedule found');

      // ensure schedule has not passed
      const scheduleDateTime = new Date(
        `${scheduleRecord.date}T${scheduleRecord.startTime}:00`
      );
      if (scheduleDateTime < new Date()) {
        errCode = 401;
        throw new Error(msgs.cantMarkAbsentForPassedSchedule);
      }

      // count current attendees
      const currentAttendance = await models.Booking.count({
        where: { scheduleId: req.body.scheduleId, attendance: 1 },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      successLog(person, controllerName, 'got attendance');

      // check capacity
      if (currentAttendance >= scheduleRecord.capacity) {
        errCode = 409;
        throw new Error(msgs.noSpotsLeft);
      }

      // check for existing booking
      const existingBooking = await models.Booking.findOne({
        where: {
          customerId: currentCustomer.customerId,
          scheduleId: req.body.scheduleId,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (existingBooking) {
        // re-activate existing booking
        await existingBooking.update(
          { attendance: true, timestamp: new Date() },
          { transaction: t }
        );
        // send returning reservation email
        if (userEmail && wantsNotifications) {
          customerEmails.sendAttendanceReturningMail({
            to: userEmail,
            productName: currentScheduleRecord.Product.name,
            date: currentScheduleRecord.date,
            startTime: currentScheduleRecord.startTime,
            location: currentScheduleRecord.location,
          });
        }
        return existingBooking; // return from transaction to paymentOrBooking variable
      } else {
        // Booking doesn't exist - we need to create one but first we have to check again if customer has already the pass for this particular type of schedule or he will have to issue single payment (or chose it)
        // determine if a valid pass is available
        const chosenCustomerPassId = req.body.chosenCustomerPassId;
        const numericId = Number(chosenCustomerPassId);
        // console.log('❗❗❗ chosenCustomerPassId: ', chosenCustomerPassId);

        let validPass = null;
        if (
          chosenCustomerPassId !== 'gateway' &&
          currentCustomer.CustomerPasses &&
          currentCustomer.CustomerPasses.length > 0
        ) {
          if (!isNaN(numericId)) {
            validPass = isPassValidForSchedule(
              currentCustomer.CustomerPasses.find(
                cp => cp.customerPassId == numericId
              ),
              currentScheduleRecord
            );
          } else {
            validPass =
              pickTheBestPassForSchedule(
                currentCustomer.CustomerPasses,
                currentScheduleRecord
              )?.bestPass || false;
            console.log(' else validPass =', validPass);
          }
          console.log('❗❗❗ valid pass: ', validPass.PassDefinition.name);
        }

        if (validPass) {
          // create booking using the pass
          const booking = await models.Booking.create(
            {
              customerId: currentCustomer.customerId,
              scheduleId: currentScheduleRecord.scheduleId,
              customerPassId: validPass.customerPassId,
              timestamp: new Date(),
              attendance: true,
            },
            { transaction: t }
          );
          // send new reservation email
          if (userEmail && wantsNotifications) {
            customerEmails.sendNewReservationMail({
              to: userEmail,
              productName: currentScheduleRecord.Product.name || '',
              date: currentScheduleRecord.date,
              startTime: currentScheduleRecord.startTime,
              location: currentScheduleRecord.location,
              payment: `Karnet ${validPass.PassDefinition.name}`,
            });
          }
          successLog(person, controllerName, 'booking created with pass');

          // decrement pass uses if required
          const passType = validPass.PassDefinition.passType.toUpperCase();
          if (passType === 'COUNT' || passType === 'MIXED') {
            await models.CustomerPass.update(
              { usesLeft: validPass.usesLeft - 1 },
              {
                where: {
                  customerId: currentCustomer.customerId,
                  customerPassId: validPass.customerPassId,
                },
                transaction: t,
              }
            );
          }
          return booking; // return from transaction to paymentOrBooking variable
        } else {
          if (numericId) {
            throw new Error('❗❗❗ Nie rozpoznano wybranego karnetu.');
          }
          // create payment and then booking
          const payment = await models.Payment.create(
            {
              customerId: currentCustomer.customerId,
              date: new Date(),
              product: `${currentScheduleRecord.Product.name} (${currentScheduleRecord.scheduleId})`,
              status: req.body.status,
              amountPaid: currentScheduleRecord.Product.price,
              amountDue: req.body.amountDue,
              paymentMethod: req.body.paymentMethod,
              paymentStatus: req.body.paymentStatus,
            },
            { transaction: t }
          );
          // send payment confirmation email
          if (payment && userEmail) {
            customerEmails.sendPaymentSuccessfulMail({
              to: userEmail,
              amountPaid: payment.amountPaid,
              productName: currentScheduleRecord.Product.name || '',
              date: currentScheduleRecord.date,
              startTime: currentScheduleRecord.startTime,
              location: currentScheduleRecord.location,
            });
          }
          successLog(person, controllerName, 'payment created');

          // now create the booking
          const booking = await models.Booking.create(
            {
              customerId: currentCustomer.customerId,
              scheduleId: req.body.scheduleId,
              timestamp: new Date(),
              paymentId: payment.paymentId,
              attendance: true,
            },
            { transaction: t }
          );
          // send reservation email after payment
          if (booking && userEmail && wantsNotifications) {
            customerEmails.sendNewReservationMail({
              to: userEmail,
              productName: currentScheduleRecord.Product.name,
              date: currentScheduleRecord.date,
              startTime: currentScheduleRecord.startTime,
              location: currentScheduleRecord.location,
            });
          }
          successLog(person, controllerName, 'attendance marked');
          return payment;
        }
      }
    });

    // respond after successful transaction
    successLog(person, controllerName);
    return res.status(201).json({
      isNewCustomer,
      confirmation: 1,
      message: msgs.attendanceMarkedPresent,
      paymentOrBooking,
    });
  } catch (err) {
    return catchErr(person, res, errCode, err, controllerName);
  }
};

//! ATTENDANCE_____________________________________________
//@ PUT
export const putEditMarkAbsent = async (req, res, next) => {
  const controllerName = 'putEditMarkAbsent';
  callLog(req, person, controllerName);

  let errCode = 500;
  try {
    // Load the schedule record
    const scheduleID = req.params.scheduleID;
    const currentScheduleRecord = await models.ScheduleRecord.findOne({
      where: { scheduleId: scheduleID },
      include: [{ model: models.Product, required: true }],
    });
    if (!currentScheduleRecord) {
      errCode = 404;
      throw new Error(msgs.noScheduleFound);
    }
    // Ensure the schedule has not already passed
    const scheduleDateTime = new Date(
      `${currentScheduleRecord.date}T${currentScheduleRecord.startTime}:00`
    );
    if (scheduleDateTime < new Date()) {
      errCode = 401;
      throw new Error(msgs.cantMarkAbsentForPassedSchedule);
    }

    // Mark attendance as absent
    const [updatedCount] = await models.Booking.update(
      { attendance: false, timestamp: new Date() },
      {
        where: {
          scheduleId: scheduleID,
          customerId: req.user.Customer.customerId,
        },
      }
    );
    if (updatedCount === 0) {
      errCode = 404;
      throw new Error(msgs.noBookingFound);
    }

    // Send notification if desired
    const customerEmail = req.user.email;
    const wantsNotifications = req.user.UserPrefSetting
      ? req.user.UserPrefSetting.notifications
      : true;
    if (customerEmail && wantsNotifications) {
      customerEmails.sendAttendanceMarkedAbsentMail({
        to: customerEmail,
        productName: currentScheduleRecord.Product.name,
        date: currentScheduleRecord.date,
        startTime: currentScheduleRecord.startTime,
        location: currentScheduleRecord.location,
      });
    }

    // Return success response
    successLog(person, controllerName);
    return res.status(200).json({
      confirmation: 1,
      message: msgs.attendanceMarkedAbsent,
    });
  } catch (err) {
    return catchErr(person, res, errCode, err, controllerName);
  }
};

//! PAYMENTS_____________________________________________
//@ GET
export const getPaymentById = createGetById(person, models.Payment, {
  where: req => ({ customerId: req.user.Customer.customerId }),
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
      include: [{ model: models.Customer }, { model: models.PassDefinition }],
      required: false,
    },
  ],
  excludeFields: [],

  mapRecord: parsedPayment => {
    const customerPasses = parsedPayment?.CustomerPasses?.map(customerPass => {
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
        passName: cp.PassDefinition.name,
        purchaseDate: cp.purchaseDate,
        validFrom: cp.validFrom,
        validUntil: cp.validUntil,
        usesLeft: cp.usesLeft,
        status: cp.status,
      };
    });
    delete parsedPayment.CustomerPasses;

    return {
      ...parsedPayment,
      customerPasses,
    };
  },

  successMessage: 'Płatność pobrana pomyślnie',
  notFoundMessage: 'Nie znaleziono płatności.',
});
