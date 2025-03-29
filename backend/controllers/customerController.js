import 'dotenv/config';
import * as models from '../models/_index.js';
import { isAdult } from '../utils/dateUtils.js';
import db from '../utils/db.js';
import {
  callLog,
  catchErr,
  errorCode,
  successLog,
} from '../utils/loggingUtils.js';
import {
  sendAttendanceFirstBookingForScheduleMail,
  sendAttendanceMarkedAbsentMail,
  sendAttendanceReturningMail,
} from '../utils/mails/templates/customerActions/attendanceEmails.js';
import { sendCustomerCreatedMail } from '../utils/mails/templates/customerActions/creationEmails.js';
import { sendReservationFreshMail } from '../utils/mails/templates/customerActions/reservationEmails.js';

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

  if (!newPhone || !newPhone.trim()) {
    console.log('\n❌❌❌ Error putEditCustomerDetails:', 'No phone');
    errCode = 400;
    throw new Error('Numer telefonu nie może być pusty');
  }

  if (
    customer.phone === newPhone &&
    customer.preferredContactMethod === newContactMethod
  ) {
    console.log('\n❓❓❓ Customer pudEditCustomer No change');
    return res.status(200).json({
      confirmation: 0,
      message: 'Brak zmian',
    });
  }

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

//! BOOKINGS_____________________________________________
//@ GET
export const getPaymentByID = (req, res, next) => {
  const controllerName = 'getPaymentByID';
  callLog(req, person, controllerName);

  const PK = req.params.id;
  const customerId = req.user.Customer && req.user.Customer.customerId;

  models.Payment.findOne({
    where: { paymentId: PK, customerId: customerId },
    through: { attributes: [] }, // omit data from mid table
    required: false,
    attributes: {
      exclude: ['customerId'],
    },
    include: [
      {
        model: models.Customer,
        attributes: { exclude: [] },
      },
      {
        model: models.ScheduleRecord,
        attributes: { exclude: ['userId'] },
        through: { attributes: [] }, // omit data from mid table
        include: [
          {
            model: models.Product,
            attributes: { exclude: [] },
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
//@ POST
export const postCreateBookSchedule = (req, res, next) => {
  const controllerName = 'postCreateBookSchedule';
  callLog(req, person, controllerName);
  console.log(`req.body`, req.body);
  // @ Fetching USER
  let customerPromise, currentCustomer, currentScheduleRecord;
  let isNewCustomer = false;
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
      if (req.user.email) {
        sendCustomerCreatedMail({
          to: req.user.email,
          firstName: cDetails.fname,
        });
      }
      req.session.user.Customer = newCustomer;
      req.session.role = 'CUSTOMER';
      req.session.save();

      isNewCustomer = true;
      successLog(person, controllerName, 'customer created');
      return models.User.update(
        { role: 'CUSTOMER' },
        { where: { userId: req.user.userId } }
      ).then(() => newCustomer);
    });
  } else {
    customerPromise = Promise.resolve(req.user.Customer);
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
        // console.log('scheduleRecord', scheduleRecord);
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

          // IF still enough spaces - check if booked in the past
          return models.Payment.findOne({
            where: {
              customerId: currentCustomer.customerId,
            },
            include: [
              {
                model: models.ScheduleRecord,
                where: { scheduleId: req.body.schedule },
                through: {
                  attributes: [
                    'attendance',
                    'customerId',
                    'paymentId',
                    'scheduleId',
                  ],
                  where: { customerId: currentCustomer.customerId },
                },
                required: true,
              },
            ],
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        });
      })
      .then(existingPayment => {
        if (existingPayment) {
          // console.log('existingPayment', existingPayment);

          if (req.user.email) {
            sendAttendanceReturningMail({
              to: req.user.email,
              productName: req.body.product,
              date: currentScheduleRecord.date,
              startTime: currentScheduleRecord.startTime,
              location: currentScheduleRecord.location,
            });
          }

          //! assuming single schedule/payment
          return existingPayment.ScheduleRecords[0].Booking.update(
            { attendance: true },
            { transaction: t }
          ).then(() => existingPayment);
        } else {
          // payment doesn't exist - create new one
          return models.Payment.create(
            {
              customerId: currentCustomer.customerId,
              date: new Date(),
              product: req.body.product,
              status: req.body.status,
              amountPaid: req.body.amountPaid,
              amountDue: req.body.amountDue,
              paymentMethod: req.body.paymentMethod,
              paymentStatus: req.body.paymentStatus,
            },
            { transaction: t }
          ).then(payment => {
            // After creating the reservation, we connected addScheduleRecord which was generated by Sequelize for many-to-many relationship between reservation and ScheduleRecord. The method adds entry to intermediate table (bookingss) and connects created reservation with schedule feeder (ScheduleRecord).

            // Reservation with payment fro ex. membership confirmation
            if (req.user.email) {
              sendReservationFreshMail({
                to: req.user.email,
                productName: req.body.product,
                date: currentScheduleRecord.date,
                startTime: currentScheduleRecord.startTime,
                location: currentScheduleRecord.location,
              });
            }

            successLog(person, controllerName, 'payment created');
            return payment
              .addScheduleRecord(req.body.schedule, {
                through: { customerId: currentCustomer.customerId },
                transaction: t,
                individualHooks: true,
              })
              .then(() => {
                // reserving the schedule confirmation
                if (req.user.email) {
                  sendAttendanceFirstBookingForScheduleMail({
                    to: req.user.email,
                    productName: currentScheduleRecord?.ProductName || '',
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
      });
  })
    .then(payment => {
      successLog(person, controllerName);
      res.status(201).json({
        isNewCustomer,
        confirmation: 1,
        message: 'Miejsce zaklepane - do zobaczenia ;)',
        payment,
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
        { attendance: false },
        {
          where: {
            scheduleId: scheduleID,
            customerId: req.user.Customer.customerId,
          },
        }
      ).then(([updatedCount]) => {
        if (updatedCount > 0) {
          if (req.user.email) {
            sendAttendanceMarkedAbsentMail({
              to: req.user.email,
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
