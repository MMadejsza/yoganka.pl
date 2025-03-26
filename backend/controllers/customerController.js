import 'dotenv/config';
import * as models from '../models/_index.js';
import {
  callLog,
  catchErr,
  errorCode,
  successLog,
} from '../utils/controllersUtils.js';
import db from '../utils/db.js';
import { mainTransporter } from '../utils/transporter.js';
let errCode = errorCode;
const person = 'Customer';

//! CUSTOMERS_____________________________________________
//@ GET
export const getCustomerDetails = (req, res, next) => {
  const controllerName = 'getCustomerDetails';
  callLog(person, controllerName);
  const customer = req.user.Customer;

  successLog(person, controllerName);
  return res.status(200).json({ confirmation: 1, customer });
};
//@ PUT
export const putEditCustomerDetails = (req, res, next) => {
  const controllerName = 'putEditCustomerDetails';
  callLog(person, controllerName);

  console.log(req.body);
  const customer = req.user.Customer;
  const customerId = customer.CustomerID;
  const { phone: newPhone, cMethod: newContactMethod } = req.body;

  if (!newPhone || !newPhone.trim()) {
    console.log('\n❌❌❌ Error putEditCustomerDetails:', 'No phone');
    errCode = 400;
    throw new Error('Numer telefonu nie może być pusty');
  }

  if (
    customer.Phone === newPhone &&
    customer.PreferredContactMethod === newContactMethod
  ) {
    console.log('\n❓❓❓ Customer pudEditCustomer No change');
    return res.status(200).json({
      confirmation: 0,
      message: 'Brak zmian',
    });
  }

  models.Customer.update(
    { Phone: newPhone, PreferredContactMethod: newContactMethod },
    { where: { CustomerID: customerId } }
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
    .catch(err => catchErr(res, errCode, err, controllerName));
};

//! BOOKINGS_____________________________________________
//@ GET
export const getBookingByID = (req, res, next) => {
  const controllerName = 'getBookingByID';
  callLog(person, controllerName);

  const PK = req.params.id;
  const customerID = req.user.Customer && req.user.Customer.CustomerID;

  models.Booking.findOne({
    where: { BookingID: PK, CustomerID: customerID },
    through: { attributes: [] }, // omit data from mid table
    required: false,
    attributes: {
      exclude: ['CustomerID'],
    },
    include: [
      {
        model: models.Customer,
        attributes: { exclude: [] },
      },
      {
        model: models.ScheduleRecord,
        attributes: { exclude: ['UserID'] },
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
    .then(booking => {
      if (!booking) {
        errCode = 404;
        throw new Error(
          'Nie znaleziono rezerwacji lub rezerwacja nie należy do zalogowanego klienta.'
        );
      }
      successLog(person, controllerName);
      return res.status(200).json({
        confirmation: 1,
        message: 'Rezerwacja pobrana pomyślnie.',
        isLoggedIn: req.session.isLoggedIn,
        booking,
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};
//@ POST
export const postCreateBookSchedule = (req, res, next) => {
  const controllerName = 'postCreateBookSchedule';
  callLog(person, controllerName);
  console.log(`req.body`, req.body);
  // @ Fetching USER
  let currentCustomer;
  let isNewCustomer = false;
  // If it's not a Customer yet
  let customerPromise;
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

    customerPromise = models.Customer.create({
      CustomerType: cDetails.cType,
      UserID: req.user.UserID,
      FirstName: cDetails.fname,
      LastName: cDetails.lname,
      DoB: cDetails.dob,
      Phone: cDetails.phone,
      PreferredContactMethod: cDetails.cMethod || '-',
      ReferralSource: cDetails.rSource || '-',
      Notes: cDetails.notes,
    }).then(newCustomer => {
      successLog(person, controllerName, 'customer created');
      req.session.user.Customer = newCustomer;
      req.session.role = 'CUSTOMER';
      return models.User.update(
        { Role: person },
        { where: { UserID: req.user.UserID } }
      ).then(() => newCustomer);
    });

    isNewCustomer = true;
  } else {
    customerPromise = Promise.resolve(req.user.Customer);
  }

  if (!req.body.schedule) {
    errCode = 400;
    throw new Error('Brak identyfikatora terminu.');
  }
  let currentScheduleRecord;

  //@ BOOKING
  db.transaction(t => {
    return customerPromise
      .then(customer => {
        currentCustomer = customer;
        // Fetch schedule and lock it for other paralele transactions
        return models.ScheduleRecord.findOne({
          where: { ScheduleID: req.body.schedule }, //from mutation
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
          `${scheduleRecord.Date}T${scheduleRecord.StartTime}:00`
        );
        if (scheduleDateTime < new Date()) {
          errCode = 401;
          throw new Error('Nie można rezerwować terminu, który już minął.');
        }
        // console.log('scheduleRecord', scheduleRecord);
        // Count the current amount of reservations
        return models.BookedSchedule.count({
          where: { ScheduleID: req.body.schedule, Attendance: 1 },
          transaction: t,
          lock: t.LOCK.UPDATE, //@
        }).then(currentAttendance => {
          successLog(person, controllerName, 'got attendance');

          if (currentAttendance >= scheduleRecord.Capacity) {
            // If limit is reached
            errCode = 409;
            throw new Error('Brak wolnych miejsc na ten termin.');
          }

          // IF still enough spaces - check if booked in the past
          return models.Booking.findOne({
            where: {
              CustomerID: currentCustomer.CustomerID,
            },
            include: [
              {
                model: models.ScheduleRecord,
                where: { ScheduleID: req.body.schedule },
                through: {
                  attributes: [
                    'Attendance',
                    'CustomerID',
                    'BookingID',
                    'ScheduleID',
                  ],
                  where: { CustomerID: currentCustomer.CustomerID },
                },
                required: true,
              },
            ],
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        });
      })
      .then(existingBooking => {
        if (existingBooking) {
          // console.log('existingBooking', existingBooking);
          mainTransporter.sendMail({
            from: process.env.SMTP_MAIN_USER,
            to: req.user.Email,
            subject: `Witamy z powrotem na zajeciach!`,
            html: `
            <h1>Już myśleliśmy, że ta mata zmieni właściciela... - ale na szczęście nie!</h1>
            <h3Zajęcia:</h3>
            <p>
            ${req.body.product}
            ${currentScheduleRecord.Date} ${currentScheduleRecord.StartTime}   
            ${currentScheduleRecord.Location} 
            </p>
            <p>Dziękujemy za rezerwację - od zobaczenie wkrótce! :)</p>
            `,
          });
          //! assuming single schedule/booking
          return existingBooking.ScheduleRecords[0].BookedSchedule.update(
            { Attendance: true },
            { transaction: t }
          ).then(() => existingBooking);
        } else {
          // booking doesn't exist - create new one
          return models.Booking.create(
            {
              CustomerID: currentCustomer.CustomerID,
              Date: new Date(),
              Product: req.body.product,
              Status: req.body.status,
              AmountPaid: req.body.amountPaid,
              AmountDue: req.body.amountDue,
              PaymentMethod: req.body.paymentMethod,
              PaymentStatus: req.body.paymentStatus,
            },
            { transaction: t }
          ).then(booking => {
            // After creating the reservation, we connected addScheduleRecord which was generated by Sequelize for many-to-many relationship between reservation and ScheduleRecord. The method adds entry to intermediate table (booked_schedules) and connects created reservation with schedule feeder (ScheduleRecord).

            mainTransporter.sendMail({
              from: process.env.SMTP_MAIN_USER,
              to: req.user.Email,
              subject: `Mata zaklepana! Do zobaczenia na: ${req.body.product}`,
              html: `
              <h1>Mata już na Ciebie czeka!</h1>
              <h3Zajęcia:</h3>
              <p>
              ${req.body.product}
              ${currentScheduleRecord.Date} ${currentScheduleRecord.StartTime}   
              ${currentScheduleRecord.Location} 
              </p>
              <p>Dziękujemy za rezerwację - od zobaczenie wkrótce! :)</p>
              `,
            });
            successLog(person, controllerName, 'booking created');
            return booking
              .addScheduleRecord(req.body.schedule, {
                through: { CustomerID: currentCustomer.CustomerID },
                transaction: t,
                individualHooks: true,
              })
              .then(() => {
                successLog(person, controllerName, 'attendance marked');
                return booking;
              });
          });
        }
      });
  })
    .then(booking => {
      successLog(person, controllerName);
      res.status(201).json({
        isNewCustomer,
        confirmation: 1,
        message: 'Miejsce zaklepane - do zobaczenia ;)',
        booking,
      });
    })
    .catch(err => catchErr(res, errCode, err, controllerName));
};

//! ATTENDANCE_____________________________________________
//@ PUT
export const putEditMarkAbsent = (req, res, next) => {
  const controllerName = 'putEditMarkAbsent';
  callLog(person, controllerName);
  const scheduleID = req.params.scheduleID;
  let currentScheduleRecord;
  console.log('putEditMarkAbsent', req.body);

  models.ScheduleRecord.findOne({
    where: { ScheduleID: scheduleID },
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
        `${scheduleRecord.Date}T${scheduleRecord.StartTime}:00`
      );

      if (scheduleDateTime < new Date()) {
        errCode = 401;
        throw new Error('Nie można zwolnić miejsca dla minionego terminu.');
      }
      return models.BookedSchedule.update(
        { Attendance: false },
        {
          where: {
            ScheduleID: scheduleID,
            CustomerID: req.user.Customer.CustomerID,
          },
        }
      ).then(([updatedCount]) => {
        if (updatedCount > 0) {
          mainTransporter.sendMail({
            from: process.env.SMTP_MAIN_USER,
            to: req.user.Email,
            subject: `Szkoda, że musisz lecieć... :(`,
            html: `
            <h1>Mata zwolniona ale... mamy nadzieję, że jednak wrócisz!</h1>
            <h3Zajęcia:</h3>
            <p>
            ${currentScheduleRecord.Product.Name}
            ${currentScheduleRecord.Date} ${currentScheduleRecord.StartTime}   
            ${currentScheduleRecord.Location} 
            </p>
            <p>W każdym razie dziękujemy za informację i do zobaczenie na innych zajęciach! :)</p>
            `,
          });
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
    .catch(err => catchErr(res, errCode, err, controllerName));
};
