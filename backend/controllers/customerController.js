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
export const putEditCustomerDetails = (req, res, next) => {
  const controllerName = 'putEditCustomerDetails';
  callLog(req, person, controllerName);

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

  models.Customer.update(
    { phone: newPhone, preferredContactMethod: newContactMethod },
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
        message: msgs.customerDetailsUpdated,
        confirmation: status,
        affectedCustomerRows,
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//! PASSES_____________________________________________
//@ GET
export const getCustomerPassById = (req, res, next) => {
  const controllerName = 'getCustomerPassById';
  console.log(`\n➡️➡️➡️ ${person} called`, controllerName);

  const passId = req.params.id;
  models.CustomerPass.findOne({
    where: {
      customerPassId: passId,
      customerId: req.user.Customer.customerId, // Ensure the pass belongs to the logged-in customer
    },
    include: [{ model: models.PassDefinition }, { model: models.Payment }],
  })
    .then(customerPassData => {
      if (!customerPassData) {
        errCode = 404;
        throw new Error(msgs.noPassDefFound);
      }
      // console.log(scheduleData);
      let cp = customerPassData.toJSON();

      // Format Payment data with only necessary fields
      const payment = {
        paymentId: cp.Payment.paymentId,
        date: formatIsoDateTime(cp.Payment.date),
        amountPaid: cp.Payment.amountPaid,
        paymentMethod: cp.Payment.paymentMethod,
        status: cp.Payment.status,
      };

      const passDefinition = {
        passDefId: cp.PassDefinition.passDefId,
        name: cp.PassDefinition.name,
        description: cp.PassDefinition.description,
        passType: cp.PassDefinition.passType,
        usesTotal: cp.PassDefinition.usesTotal,
        validityDays: cp.PassDefinition.validityDays,
        allowedProductTypes: cp.PassDefinition.allowedProductTypes,
        price: cp.PassDefinition.price,
        status: cp.status,
      };

      const formattedCustomerPass = {
        rowId: cp.customerPassId,
        customerPassId: cp.customerPassId,
        purchaseDate: cp.purchaseDate,
        validFrom: cp.validFrom,
        validUntil: cp.validUntil,
        usesLeft: cp.usesLeft,
        status: cp.status,
        payment: payment, // Attached formatted Payment
        passDefinition: passDefinition, // Attached formatted PassDefinition
      };

      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        message: msgs.passDefFound,
        customerPass: formattedCustomerPass,
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//@ POST
export const postCreateBuyPass = (req, res, next) => {
  const controllerName = 'postCreateBuyPass';
  callLog(req, person, controllerName);
  // console.log(`req.body`, req.body);
  // console.log(`req.user`, req.user);

  // @ Fetching USER
  let customerPromise,
    currentCustomer,
    currentPassDefinition,
    userEmail = req.user.email,
    isNewCustomer = false;

  // If it's not a Customer yet
  if (!req.user.Customer) {
    const cDetails = req.body.customerDetails;
    console.log(
      '❗❗❗User is not the customer, creation of the record Customer...'
    );
    errCode = 400;

    if (!isAdult(req.body.validFrom)) {
      console.log('\n❌❌❌ No pass start date specified');
      throw new Error(msgs.noPassStartDate);
    }
    try {
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
      if (!isAdult(cDetails.dob)) {
        console.log('\n❌❌❌ Customer below 18');
        throw new Error(msgs.notAnAdult);
      }
    } catch (err) {
      return catchErr(person, res, errCode, err, controllerName, { code: 409 });
    }

    customerPromise = models.Customer.create({
      customerType: cDetails.cType,
      userId: req.user.userId,
      firstName: cDetails.fname,
      lastName: cDetails.lname,
      dob: cDetails.dob,
      phone: cDetails.phone,
      preferredContactMethod: cDetails.cMethod || '-',
      referralSource: cDetails.rSource || '-',
      notes: cDetails.notes,
    }).then(newCustomer => {
      // Notification email
      if (userEmail) {
        customerEmails.sendCustomerCreatedMail({
          to: userEmail,
          firstName: cDetails.fname,
        });
      }
      // first update db user with new role as the middleware actually always fetch from the db on request
      return models.User.update(
        { role: 'CUSTOMER' },
        { where: { userId: req.user.userId } }
      )
        .then(() => {
          return models.User.findByPk(req.user.userId, {
            include: [
              { model: models.Customer, required: false },
              { model: models.UserPrefSetting, required: false },
            ],
          });
        })
        .then(updatedUser => {
          req.session.user = updatedUser.toJSON();
          req.session.role = updatedUser.role.toUpperCase(); // np. "CUSTOMER"
          req.session.save(err => {
            if (err) reject(new Error(msgs.sessionNotUpdated + err.message));
          });

          isNewCustomer = true;
          successLog(
            person,
            controllerName,
            'customer created and session updated'
          );
          return newCustomer;
        });
    });
  } else {
    // Fetching from the database again ensures you get a full Sequelize instance with all methods - this is essential for using instance methods like .save()
    customerPromise = models.Customer.findByPk(req.user.Customer.customerId, {
      include: [
        {
          model: models.CustomerPass,
          include: [models.PassDefinition],
        },
      ],
    });
  }

  customerPromise
    .then(customer => {
      currentCustomer = customer;

      if (!req.body.passDefId) {
        errCode = 400;
        throw new Error(msgs.noPassIdPicked);
      }

      //@ PAYMENT
      return models.PassDefinition.findByPk(req.body.passDefId);
    })
    .then(passDef => {
      if (!passDef) {
        throw new Error(msgs.noPassDefFound);
      }
      currentPassDefinition = passDef;

      if (Number(currentPassDefinition.price) < 0) {
        throw new Error('Nieprawidłowa cena karnetu.');
      }

      // check if has this pass already
      return models.CustomerPass.findOne({
        where: {
          customerId: currentCustomer.customerId,
          passDefId: currentPassDefinition.passDefId,
          status: 1,
          validUntil: { [Op.gt]: new Date() },
        },
      }).then(existingPass => {
        if (existingPass) {
          throw new Error(msgs.customerPassOVerlapping);
        }

        return currentPassDefinition;
      });
    })
    .then(passDef => {
      // Saving into db in transaction
      return db.transaction(t => {
        const purchaseDate = new Date();
        const validityDays = currentPassDefinition.validityDays;
        let calcExpiryDate = null;

        return models.Payment.create(
          {
            customerId: currentCustomer.customerId,
            date: new Date(),
            product: `${currentPassDefinition.name} (${currentPassDefinition.passDefId})`,
            status: 'COMPLETED', // temp
            amountPaid: currentPassDefinition.price,
            amountDue: 0, // temp
            paymentMethod: req.body.paymentMethod,
            paymentStatus: 'COMPLETED', // temp
          },
          { transaction: t }
        ).then(payment => {
          if (!payment) throw new Error(msgs.paymentSaveError);

          if (validityDays && validityDays < 30) {
            // if less then month
            calcExpiryDate = addDays(purchaseDate, validityDays);
          } else if (validityDays && validityDays >= 30) {
            // if a couple of months where month = 30
            calcExpiryDate = addMonths(
              purchaseDate,
              Math.floor(validityDays / 30)
            );
          } else if (validityDays && validityDays >= 365) {
            // if over 1 year
            calcExpiryDate = addYears(
              purchaseDate,
              Math.floor(validityDays / 365)
            );
          }

          if (calcExpiryDate) {
            calcExpiryDate.setHours(23, 59, 59, 999);
          }

          return models.CustomerPass.create(
            {
              customerId: currentCustomer.customerId,
              passDefId: req.body.passDefId,
              paymentId: payment.paymentId,
              purchaseDate: purchaseDate,
              usesLeft: currentPassDefinition.usesTotal,
              validFrom: purchaseDate,
              validUntil: calcExpiryDate,
              status: 1, // temp
            },
            { transaction: t }
          ).then(newPass => {
            return { payment, newPass };
          });
        });
      });
    })
    .then(paymentAndPassObj => {
      // Update session
      return models.User.findByPk(req.user.userId, {
        include: [
          {
            model: models.Customer,
            include: [
              { model: models.CustomerPass, include: [models.PassDefinition] },
            ],
          },
          { model: models.UserPrefSetting, required: false },
        ],
      }).then(updatedUser => {
        req.session.user = updatedUser.toJSON();
        req.session.role = updatedUser.role.toUpperCase();
        req.session.save(err => {
          if (err) reject(new Error(msgs.sessionNotUpdated + err.message));
        });
        return paymentAndPassObj;
      });
    })
    .then(paymentAndPassObj => {
      successLog(person, controllerName);
      res.status(201).json({
        isNewCustomer,
        confirmation: 1,
        message: msgs.newCustomerPass,
        customerPass: paymentAndPassObj.newPass,
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};

//! BOOKINGS_____________________________________________
//@ POST
export const postCreateBookSchedule = (req, res, next) => {
  const controllerName = 'postCreateBookSchedule';
  callLog(req, person, controllerName);
  console.log(`req.body`, req.body);
  console.log(`req.user`, req.user);
  // @ Fetching USER
  let customerPromise,
    currentCustomer,
    currentScheduleRecord,
    userEmail = req.user.email,
    wantsNotifications = req.user.UserPrefSetting
      ? req.user.UserPrefSetting.notifications
      : true,
    isNewCustomer = false;
  // If it's not a Customer yet
  if (!req.user.Customer) {
    const cDetails = req.body.customerDetails;
    console.log(
      '❗❗❗User is not the customer, creation of the record Customer...'
    );
    errCode = 400;

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
      return catchErr(person, res, errCode, err, controllerName, { code: 409 });
    }

    customerPromise = models.Customer.create({
      customerType: cDetails.cType,
      userId: req.user.userId,
      firstName: cDetails.fname,
      lastName: cDetails.lname,
      dob: cDetails.dob,
      phone: cDetails.phone,
      preferredContactMethod: cDetails.cMethod || '-',
      referralSource: cDetails.rSource || '-',
      notes: cDetails.notes,
    }).then(newCustomer => {
      // Notification email
      if (userEmail) {
        customerEmails.sendCustomerCreatedMail({
          to: userEmail,
          firstName: cDetails.fname,
        });
      }
      // first update db user with new role as the middleware actually always fetch from the db on request
      return models.User.update(
        { role: 'CUSTOMER' },
        { where: { userId: req.user.userId } }
      )
        .then(() => {
          return models.User.findByPk(req.user.userId, {
            include: [
              {
                model: models.Customer,
                required: false,
              },
              {
                model: models.UserPrefSetting,
                required: false,
              },
            ],
          });
        })
        .then(updatedUser => {
          req.session.user = updatedUser.toJSON();
          req.session.role = updatedUser.role.toUpperCase(); // np. "CUSTOMER"
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
          return newCustomer;
        });
    });
  } else {
    // Fetching from the database again ensures you get a full Sequelize instance with all methods - this is essential for using instance methods like .save()
    customerPromise = models.Customer.findOne({
      where: { customerId: req.user.Customer.customerId },
      include: [
        {
          model: models.CustomerPass,
          include: [models.PassDefinition],
        },
      ],
    });
  }

  // if (!req.body.passDefId) {
  //   errCode = 400;
  //   throw new Error(msgs.noPassIdPicked);
  // }

  //@ BOOKING
  db.transaction(t => {
    return customerPromise
      .then(customer => {
        currentCustomer = customer;
        // Fetch schedule and lock it for other paralele transactions
        return models.ScheduleRecord.findOne({
          where: { scheduleId: req.body.scheduleId }, //from mutation
          include: [
            {
              model: models.Product,
            },
          ],
          transaction: t,
          lock: t.LOCK.UPDATE, //@
        });
      })
      .then(scheduleRecord => {
        if (!scheduleRecord) {
          errCode = 404;
          throw new Error(msgs.noScheduleFound);
        }
        currentScheduleRecord = scheduleRecord;
        successLog(person, controllerName, 'schedule found');

        const scheduleDateTime = new Date(
          `${scheduleRecord.date}T${scheduleRecord.startTime}:00`
        );
        if (scheduleDateTime < new Date()) {
          errCode = 401;
          throw new Error(msgs.cantMarkAbsentForPassedSchedule);
        }

        // Count the current amount of reservations
        return models.Booking.count({
          where: { scheduleId: req.body.scheduleId, attendance: 1 },
          transaction: t,
          lock: t.LOCK.UPDATE, //@
        }).then(currentAttendance => {
          successLog(person, controllerName, 'got attendance');

          if (currentAttendance >= scheduleRecord.capacity) {
            // If limit is reached
            errCode = 409;
            throw new Error(msgs.noSpotsLeft);
          }

          // If still enough spaces - check if booked in the past
          return models.Booking.findOne({
            where: {
              customerId: currentCustomer.customerId,
              scheduleId: req.body.scheduleId,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        });
      })
      .then(existingBooking => {
        if (existingBooking) {
          //! assuming single schedule chosen
          return existingBooking
            .update(
              { attendance: true, timestamp: new Date() },
              { transaction: t }
            )
            .then(() => {
              if (userEmail && wantsNotifications) {
                customerEmails.sendAttendanceReturningMail({
                  to: userEmail,
                  productName: currentScheduleRecord.Product.name,
                  date: currentScheduleRecord.date,
                  startTime: currentScheduleRecord.startTime,
                  location: currentScheduleRecord.location,
                });
              }

              return existingBooking;
            });
        } else {
          // Booking doesn't exist - we need to create one but first we have to check again if customer has already the pass for this particular type of schedule or he will have to issue single payment (or chose it)
          let validPass = null;

          // Fetch passes from middleware
          const chosenCustomerPassId = req.body.chosenCustomerPassId;
          const numericId = Number(chosenCustomerPassId);
          console.log('❗❗❗ chosenCustomerPassId: ', chosenCustomerPassId);
          if (
            chosenCustomerPassId != 'gateway' &&
            currentCustomer.CustomerPasses &&
            currentCustomer.CustomerPasses.length > 0
          ) {
            // Apply validation from prepared util to Chose the best for User pass unless customer manually chose the one
            if (!isNaN(numericId)) {
              validPass = isPassValidForSchedule(
                currentCustomer.CustomerPasses.find(
                  cp => cp.customerPassId == numericId
                ),
                currentScheduleRecord
              );
            } else {
              validPass = pickTheBestPassForSchedule(
                currentCustomer.CustomerPasses,
                currentScheduleRecord
              ).bestPass;
            }
            console.log('❗❗❗ valid pass: ', validPass.PassDefinition.name);
          }

          if (validPass) {
            // Just create the booking
            return models.Booking.create(
              {
                customerId: currentCustomer.customerId,
                scheduleId: currentScheduleRecord.scheduleId,
                customerPassId: validPass.customerPassId,
                timestamp: new Date(),
                attendance: true,
              },
              { transaction: t }
            ).then(booking => {
              if (userEmail && wantsNotifications) {
                customerEmails.sendNewReservationMail({
                  to: userEmail,
                  productName: currentScheduleRecord?.Product.name || '',
                  date: currentScheduleRecord.date,
                  startTime: currentScheduleRecord.startTime,
                  location: currentScheduleRecord.location,
                  payment: `Karnet ${validPass.PassDefinition.name}`,
                });
              }
              successLog(person, controllerName, 'booking created with pass');

              // If pass was of type count
              if (
                validPass?.PassDefinition.passType.toUpperCase() === 'COUNT'
              ) {
                return models.CustomerPass.update(
                  { usesLeft: validPass.usesLeft - 1 },
                  {
                    where: {
                      customerId: currentCustomer.customerId,
                      customerPassId: validPass.customerPassId,
                    },
                    transaction: t,
                  }
                ).then(() => booking);
              }
              return booking;
            });
          } else {
            if (numericId)
              throw new Error('❗❗❗ Nie rozpoznano wybranego karnetu.');
            // No pass - payment first
            return models.Payment.create(
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
            ).then(payment => {
              if (payment && userEmail) {
                customerEmails.sendPaymentSuccessfulMail({
                  to: userEmail,
                  amountPaid: payment.amountPaid,
                  productName: currentScheduleRecord?.Product.name || '',
                  date: currentScheduleRecord.date,
                  startTime: currentScheduleRecord.startTime,
                  location: currentScheduleRecord.location,
                });
              }
              successLog(person, controllerName, 'payment created');

              // Than the booking
              return models.Booking.create(
                {
                  customerId: currentCustomer.customerId,
                  scheduleId: req.body.scheduleId,
                  timestamp: new Date(),
                  paymentId: payment.paymentId,
                  attendance: true,
                },
                { transaction: t }
              ).then(booking => {
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
              });
            });
          }
        }
      });
  })
    .then(paymentOrBooking => {
      // result is booking if was existing booking OR new booking if paid with pass OR payment obj if single payment was issued

      successLog(person, controllerName);
      res.status(201).json({
        isNewCustomer,
        confirmation: 1,
        message: msgs.attendanceMarkedPresent,
        paymentOrBooking,
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};

//! ATTENDANCE_____________________________________________
//@ PUT
export const putEditMarkAbsent = (req, res, next) => {
  const controllerName = 'putEditMarkAbsent';
  callLog(req, person, controllerName);
  const scheduleID = req.params.scheduleID;
  let currentScheduleRecord;
  const customerEmail = req.user.email;
  const wantsNotifications = req.user.UserPrefSetting
    ? req.user.UserPrefSetting.notifications
    : true;
  console.log('putEditMarkAbsent', req.body);

  models.ScheduleRecord.findOne({
    where: { scheduleId: scheduleID },
    include: [
      {
        model: models.Product,
        required: true,
      },
    ],
  })
    .then(scheduleRecord => {
      if (!scheduleRecord) {
        errCode = 404;
        throw new Error(msgs.noScheduleFound);
      }
      currentScheduleRecord = scheduleRecord;
      const scheduleDateTime = new Date(
        `${scheduleRecord.date}T${scheduleRecord.startTime}:00`
      );

      if (scheduleDateTime < new Date()) {
        errCode = 401;
        throw new Error(msgs.cantMarkAbsentForPassedSchedule);
      }
      return models.Booking.update(
        { attendance: false, timestamp: new Date() },
        {
          where: {
            scheduleId: scheduleID,
            customerId: req.user.Customer.customerId,
          },
        }
      ).then(([updatedCount]) => {
        if (updatedCount > 0) {
          if (customerEmail && wantsNotifications) {
            customerEmails.sendAttendanceMarkedAbsentMail({
              to: customerEmail,
              productName: currentScheduleRecord.Product.name,
              date: currentScheduleRecord.date,
              startTime: currentScheduleRecord.startTime,
              location: currentScheduleRecord.location,
            });
          }

          successLog(person, controllerName);

          return res.status(200).json({
            confirmation: 1,
            message: msgs.attendanceMarkedAbsent,
          });
        } else {
          errCode = 404;

          throw new Error(msgs.noBookingFound);
        }
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};

//! PAYMENTS_____________________________________________
//@ GET
export const getPaymentById = (req, res, next) => {
  const controllerName = 'getPaymentById';
  callLog(req, person, controllerName);

  const PK = req.params.id;
  const customerId = req.user.Customer && req.user.Customer.customerId;

  models.Payment.findOne({
    where: { paymentId: PK, customerId: customerId },
    required: false,
    include: [
      {
        model: models.Customer,
      },
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
  })
    .then(payment => {
      if (!payment) {
        errCode = 404;
        throw new Error(msgs.noPaymentFound);
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
        message: msgs.paymentFound,
        isLoggedIn: req.session.isLoggedIn,
        payment: { ...parsedPayment, customerPasses },
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
