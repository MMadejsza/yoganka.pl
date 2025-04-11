import 'dotenv/config';
import * as models from '../models/_index.js';
import {
  areCustomerDetailsChanged,
  isPassValidForSchedule,
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
        message: 'Profil zaktualizowany pomyslnie.',
        confirmation: status,
        affectedCustomerRows,
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
//! PASSES_____________________________________________
//@ GETs
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
        throw new Error('Nie znaleziono definicji karnetu.');
      }
      // console.log(scheduleData);
      let cp = customerPassData.toJSON();

      // Format Payment data with only necessary fields
      const payment = {
        paymentId: cp.Payment.paymentId,
        date: formatIsoDateTime(cp.Payment.date),
        amountPaid: cp.Payment.amountPaid,
        paymentMethod: cp.Payment.paymentMethod,
      };

      const passDefinition = {
        passDefId: cp.PassDefinition.passDefId,
        name: cp.PassDefinition.name,
        description: cp.PassDefinition.description,
        passType: cp.PassDefinition.passType,
        usesTotal: cp.PassDefinition.usesTotal,
        validityDays: cp.PassDefinition.validityDays,
        allowedProductTypes: cp.PassDefinition.allowedProductTypes
          ? JSON.parse(cp.PassDefinition.allowedProductTypes).join(', ')
          : null,
        price: cp.PassDefinition.price,
        status:
          cp.PassDefinition.status === 'active' ||
          cp.PassDefinition.status === 1
            ? 'Aktywny'
            : cp.PassDefinition.status === 'suspended' ||
              cp.PassDefinition.status === 0
            ? 'Wstrzymany'
            : 'Niekontynuowany',
      };

      const formattedCustomerPass = {
        rowId: cp.customerPassId,
        customerPassId: cp.customerPassId,
        purchaseDate: formatIsoDateTime(cp.purchaseDate),
        validFrom: formatIsoDateTime(cp.validFrom),
        validUntil: cp.validUntil ? formatIsoDateTime(cp.validUntil) : '-',
        usesLeft: cp.usesLeft || '-',
        status:
          cp.status === 'active' || cp.status === 1
            ? 'Aktywny'
            : cp.status === 'suspended' || cp.status === 0
            ? 'Zawieszony'
            : 'Wygasły',
        payment: payment, // Attached formatted Payment
        passDefinition: passDefinition, // Attached formatted PassDefinition
      };

      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        message: 'Definicja karnetu pobrana pomyślnie',
        customerPass: formattedCustomerPass,
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};

//! BOOKINGS_____________________________________________
//@ GET
export const getBookingById = (req, res, next) => {
  const controllerName = 'getBookingById';
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
        throw new Error('Nie znaleziono definicji karnetu.');
      }
      // console.log(scheduleData);
      let cp = customerPassData.toJSON();

      // Format Payment data with only necessary fields
      const payment = {
        paymentId: cp.Payment.paymentId,
        date: formatIsoDateTime(cp.Payment.date),
        amountPaid: cp.Payment.amountPaid,
        paymentMethod: cp.Payment.paymentMethod,
      };

      const passDefinition = {
        passDefId: cp.PassDefinition.passDefId,
        name: cp.PassDefinition.name,
        description: cp.PassDefinition.description,
        passType: cp.PassDefinition.passType,
        usesTotal: cp.PassDefinition.usesTotal,
        validityDays: cp.PassDefinition.validityDays,
        allowedProductTypes: cp.PassDefinition.allowedProductTypes
          ? JSON.parse(cp.PassDefinition.allowedProductTypes).join(', ')
          : null,
        price: cp.PassDefinition.price,
        status:
          cp.PassDefinition.status === 'active' ||
          cp.PassDefinition.status === 1
            ? 'Aktywny'
            : cp.PassDefinition.status === 'suspended' ||
              cp.PassDefinition.status === 0
            ? 'Wstrzymany'
            : 'Niekontynuowany',
      };

      const formattedCustomerPass = {
        rowId: cp.customerPassId,
        customerPassId: cp.customerPassId,
        purchaseDate: formatIsoDateTime(cp.purchaseDate),
        validFrom: formatIsoDateTime(cp.validFrom),
        validUntil: cp.validUntil ? formatIsoDateTime(cp.validUntil) : '-',
        usesLeft: cp.usesLeft || '-',
        status:
          cp.status === 'active' || cp.status === 1
            ? 'Aktywny'
            : cp.status === 'suspended' || cp.status === 0
            ? 'Zawieszony'
            : 'Wygasły',
        payment: payment, // Attached formatted Payment
        passDefinition: passDefinition, // Attached formatted PassDefinition
      };

      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        message: 'Definicja karnetu pobrana pomyślnie',
        customerPass: formattedCustomerPass,
      });
    })
    .catch(err => catchErr(person, res, errCode, err, controllerName));
};
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
      '❗❗❗User isnt the customer, creation of the record Customer...'
    );
    errCode = 400;
    if (!cDetails) {
      console.log('\n❌❌❌ No given customer data');
      throw new Error('Brak danych klienta.');
    }
    if (!cDetails.fname || !cDetails.fname.trim()) {
      console.log('\n❌❌❌ fName field empty');
      throw new Error('Imię nie może być puste.');
    }
    if (!cDetails.lname || !cDetails.lname.trim()) {
      console.log('\n❌❌❌ lname field empty');
      throw new Error('Nazwisko nie może być puste.');
    }
    if (!cDetails.dob || !cDetails.dob.trim()) {
      console.log('\n❌❌❌ dob field empty');
      throw new Error('Data urodzenia nie może być pusta.');
    }
    if (!cDetails.phone || !cDetails.phone.trim()) {
      console.log('\n❌❌❌ phone field empty');
      throw new Error('Numer telefonu nie może być pusty.');
    }
    if (!isAdult(cDetails.dob)) {
      console.log('\n❌❌❌ Customer below 18');
      throw new Error('Uczestnik musi być pełnoletni.');
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
      if (userEmail && wantsNotifications) {
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
              console.error('Error saving session:', err);
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
    customerPromise = models.Customer.findByPk(req.user.Customer.customerId, {
      include: [
        {
          model: models.CustomerPass,
          include: [models.PassDefinition],
        },
      ],
    });
  }

  if (!req.body.schedule) {
    errCode = 400;
    throw new Error('Brak identyfikatora terminu.');
  }

  //@ BOOKING
  db.transaction(t => {
    return customerPromise
      .then(customer => {
        currentCustomer = customer;
        // Fetch schedule and lock it for other paralele transactions
        return models.ScheduleRecord.findOne({
          where: { scheduleId: req.body.schedule }, //from mutation
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
          throw new Error('Nie znaleziono terminu');
        }
        currentScheduleRecord = scheduleRecord;
        successLog(person, controllerName, 'schedule found');
        const scheduleDateTime = new Date(
          `${scheduleRecord.date}T${scheduleRecord.startTime}:00`
        );
        if (scheduleDateTime < new Date()) {
          errCode = 401;
          throw new Error('Nie można rezerwować terminu, który już minął.');
        }
        // Count the current amount of reservations
        return models.Booking.count({
          where: { scheduleId: req.body.schedule, attendance: 1 },
          transaction: t,
          lock: t.LOCK.UPDATE, //@
        }).then(currentAttendance => {
          successLog(person, controllerName, 'got attendance');

          if (currentAttendance >= scheduleRecord.capacity) {
            // If limit is reached
            errCode = 409;
            throw new Error('Brak wolnych miejsc na ten termin.');
          }

          // If still enough spaces - check if booked in the past
          return models.Booking.findOne({
            where: {
              customerId: currentCustomer.customerId,
              scheduleId: req.body.schedule,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        });
      })
      .then(existingBooking => {
        if (existingBooking) {
          if (userEmail && wantsNotifications) {
            customerEmails.sendAttendanceReturningMail({
              to: userEmail,
              productName: currentScheduleRecord.Product.name,
              date: currentScheduleRecord.date,
              startTime: currentScheduleRecord.startTime,
              location: currentScheduleRecord.location,
            });
          }

          //! assuming single schedule chosen
          return existingBooking
            .update(
              { attendance: true, timestamp: new Date() },
              { transaction: t }
            )
            .then(() => existingBooking);
        } else {
          // Booking doesn't exist -we need to create one but first we have to check again if customer has already the pass for this particular type of schedule or he will have to issue single payment
          let validPass = null;

          // Fetch passes from middleware
          if (
            currentCustomer.CustomerPasses &&
            currentCustomer.CustomerPasses.length > 0
          ) {
            // Apply validation from prepared util
            validPass = currentCustomer.CustomerPasses.find(pass =>
              isPassValidForSchedule(pass, currentScheduleRecord)
            );
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

              // If pass was of typ count
              if (validPass?.PassDefinition.passType === 'count') {
                return models.CustomerPass.update(
                  { usesLeft: validPass.usesLeft - 1 },
                  {
                    where: { customerPassId: validPass.customerPassId },
                    transaction: t,
                  }
                ).then(() => booking);
              }
              return booking;
            });
          } else {
            // No pass - payment first
            return models.Payment.create(
              {
                customerId: currentCustomer.customerId,
                date: new Date(),
                product: `${currentScheduleRecord.Product.name} (sId: ${currentScheduleRecord.scheduleId})`,
                status: req.body.status,
                amountPaid: currentScheduleRecord.Product.price,
                amountDue: req.body.amountDue,
                paymentMethod: req.body.paymentMethod,
                paymentStatus: req.body.paymentStatus,
              },
              { transaction: t }
            ).then(payment => {
              if (userEmail) {
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
                  scheduleId: req.body.schedule,
                  timestamp: new Date(),
                  paymentId: payment.paymentId,
                  attendance: true,
                },
                { transaction: t }
              ).then(booking => {
                if (userEmail && wantsNotifications) {
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
        message: 'Miejsce zaklepane - do zobaczenia ;)',
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
        throw new Error('Nie znaleziono terminu.');
      }
      currentScheduleRecord = scheduleRecord;
      const scheduleDateTime = new Date(
        `${scheduleRecord.date}T${scheduleRecord.startTime}:00`
      );

      if (scheduleDateTime < new Date()) {
        errCode = 401;
        throw new Error('Nie można zwolnić miejsca dla minionego terminu.');
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
            message: 'Miejsce zwolnione - dziękujemy za informację :)',
          });
        } else {
          errCode = 404;

          throw new Error(
            'Nie znaleziono rezerwacji dla podanego terminu lub rezerwacja nie należy do klienta.'
          );
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
        include: [
          {
            model: models.ScheduleRecord,
            attributes: { exclude: ['userId'] },
            include: [
              {
                model: models.Product,
              },
            ],
          },
        ],
      },
    ],
  })
    .then(payment => {
      if (!payment) {
        errCode = 404;
        throw new Error(
          'Nie znaleziono rezerwacji lub rezerwacja nie należy do zalogowanego klienta.'
        );
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
