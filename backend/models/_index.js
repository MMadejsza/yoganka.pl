import Booking from './bookingModel.js';
import Customer from './customerModel.js';
import Feedback from './feedbackModel.js';
import Invoice from './invoiceModel.js';
import Newsletter from './newsletterModel.js';
import SubscribedNewsletter from './newsletterSubscribedModel.js';
import Payment from './paymentModel.js';
import Product from './productModel.js';
import ScheduleRecord from './scheduleRecordModel.js';
import User from './userModel.js';
import UserPrefSettings from './userSettingsModel.js';
import VerificationToken from './verificationTokensModel.js';

//!
//! ASSOCIATIONS BETWEEN THE USER MODEL AND OTHER MODELS
//!
User.hasMany(VerificationToken, { foreignKey: 'UserID' });
VerificationToken.belongsTo(User, { foreignKey: 'UserID' });

//@ User and Customer (1:1, total participation on Customer)
// When a User is deleted, the associated Customer is also deleted.
User.hasOne(Customer, { foreignKey: 'UserID', onDelete: 'CASCADE' });
Customer.belongsTo(User, { foreignKey: 'UserID' });

//@ User and UserPrefSettings (1:1, total participation on UserPrefSettings)
// When a User is deleted, the associated UserPrefSettings are also deleted.
User.hasOne(UserPrefSettings, { foreignKey: 'UserID', onDelete: 'CASCADE' });
UserPrefSettings.belongsTo(User, { foreignKey: 'UserID' });

//!
//! ASSOCIATIONS BETWEEN THE CUSTOMER MODEL AND OTHER MODELS
//!

//@ Customer and Payment (1:M, total participation on Payment)
// Deleting a Customer will delete all associated Payments.
Customer.hasMany(Payment, { foreignKey: 'CustomerID', onDelete: 'CASCADE' });
Payment.belongsTo(Customer, { foreignKey: 'CustomerID' });

//@ Customer and Booking (1:M, total participation on Booking)
// Deleting a Customer will delete all associated Booking records.
Customer.hasMany(Booking, {
  foreignKey: 'CustomerID',
  onDelete: 'CASCADE',
});
Booking.belongsTo(Customer, { foreignKey: 'CustomerID' });

//@ Customer and Feedback (1:M, total participation on Feedback)
// Deleting a Customer will delete all associated Feedback entries.
Customer.hasMany(Feedback, { foreignKey: 'CustomerID', onDelete: 'CASCADE' });
Feedback.belongsTo(Customer, { foreignKey: 'CustomerID' });

//!
//! ASSOCIATIONS BETWEEN THE SCHEDULERECORD MODEL AND OTHER MODELS
//!

//@ ScheduleRecord and Feedback (1:M)
// Deleting a ScheduleRecord will delete all associated Feedback.
ScheduleRecord.hasMany(Feedback, {
  foreignKey: 'ScheduleID',
  onDelete: 'CASCADE',
});
Feedback.belongsTo(ScheduleRecord, { foreignKey: 'ScheduleID' });

//@ Product and ScheduleRecord (1:M, total participation on ScheduleRecord)
// Deleting a Product will delete all associated ScheduleRecords.
Product.hasMany(ScheduleRecord, {
  foreignKey: 'ProductID',
  onDelete: 'CASCADE',
});
ScheduleRecord.belongsTo(Product, { foreignKey: 'ProductID' });

//!
//! ASSOCIATIONS BETWEEN THE BOOKING MODEL AND OTHER MODELS
//!

//@ Payment and Booking (M:M, total participation on both sides)
// Through the join table Booking, deleting a Payment will delete its associated Booking records.
Payment.belongsToMany(ScheduleRecord, {
  through: { model: Booking, onDelete: 'CASCADE' },
  foreignKey: 'PaymentID',
});
Booking.belongsTo(Payment, {
  foreignKey: 'PaymentID',
  onDelete: 'CASCADE',
});

//@ Payment and Invoice (1:1, total participation on Invoice)
// Deleting a Payment will delete the associated Invoice.
Payment.hasOne(Invoice, { foreignKey: 'PaymentID', onDelete: 'CASCADE' });
Invoice.belongsTo(Payment, { foreignKey: 'PaymentID' });

//!
//! ASSOCIATIONS BETWEEN THE SCHEDULERECORD MODEL AND BOOKEDSCHEDULE
//!

//@ ScheduleRecord and Booking (1:M, total participation on Booking)
// Deleting a ScheduleRecord will delete all associated Booking records.
ScheduleRecord.hasMany(Booking, {
  foreignKey: 'ScheduleID',
  onDelete: 'CASCADE',
});
Booking.belongsTo(ScheduleRecord, {
  foreignKey: 'ScheduleID',
  onDelete: 'CASCADE',
});

// Additional many-to-many association (already defined above)
//@ ScheduleRecord and Payment (M:M)
// This association uses Booking as the join table.
ScheduleRecord.belongsToMany(Payment, {
  through: Booking,
  foreignKey: 'ScheduleID',
});

//!
//! ASSOCIATIONS BETWEEN THE NEWSLETTER MODEL AND THE USER MODEL
//!

//@ Newsletter and User (M:M)
// Deleting a Newsletter or User will delete the corresponding entries in the join table.
Newsletter.belongsToMany(User, {
  through: SubscribedNewsletter,
  foreignKey: 'NewsletterID',
  onDelete: 'CASCADE',
});
User.belongsToMany(Newsletter, {
  through: SubscribedNewsletter,
  foreignKey: 'UserID',
  onDelete: 'CASCADE',
});

export {
  Booking,
  Customer,
  Feedback,
  Invoice,
  Newsletter,
  Payment,
  Product,
  ScheduleRecord,
  SubscribedNewsletter,
  User,
  UserPrefSettings,
  VerificationToken,
};
