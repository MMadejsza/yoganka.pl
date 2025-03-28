import BookedSchedule from './bookingModel.js';
import Customer from './customerModel.js';
import Feedback from './feedbackModel.js';
import Invoice from './invoiceModel.js';
import Newsletter from './newsletterModel.js';
import SubscribedNewsletter from './newsletterSubscribedModel.js';
import Booking from './paymentModel.js';
import Product from './productModel.js';
import ScheduleRecord from './scheduleRecordModel.js';
import User from './userModel.js';
import UserPrefSettings from './userSettingsModel.js';
import VerificationToken from './verificationTokens.js';

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

//@ Customer and Booking (1:M, total participation on Booking)
// Deleting a Customer will delete all associated Bookings.
Customer.hasMany(Booking, { foreignKey: 'CustomerID', onDelete: 'CASCADE' });
Booking.belongsTo(Customer, { foreignKey: 'CustomerID' });

//@ Customer and BookedSchedule (1:M, total participation on BookedSchedule)
// Deleting a Customer will delete all associated BookedSchedule records.
Customer.hasMany(BookedSchedule, {
  foreignKey: 'CustomerID',
  onDelete: 'CASCADE',
});
BookedSchedule.belongsTo(Customer, { foreignKey: 'CustomerID' });

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

//@ Booking and BookedSchedule (M:M, total participation on both sides)
// Through the join table BookedSchedule, deleting a Booking will delete its associated BookedSchedule records.
Booking.belongsToMany(ScheduleRecord, {
  through: { model: BookedSchedule, onDelete: 'CASCADE' },
  foreignKey: 'BookingID',
});
BookedSchedule.belongsTo(Booking, {
  foreignKey: 'BookingID',
  onDelete: 'CASCADE',
});

//@ Booking and Invoice (1:1, total participation on Invoice)
// Deleting a Booking will delete the associated Invoice.
Booking.hasOne(Invoice, { foreignKey: 'BookingID', onDelete: 'CASCADE' });
Invoice.belongsTo(Booking, { foreignKey: 'BookingID' });

//!
//! ASSOCIATIONS BETWEEN THE SCHEDULERECORD MODEL AND BOOKEDSCHEDULE
//!

//@ ScheduleRecord and BookedSchedule (1:M, total participation on BookedSchedule)
// Deleting a ScheduleRecord will delete all associated BookedSchedule records.
ScheduleRecord.hasMany(BookedSchedule, {
  foreignKey: 'ScheduleID',
  onDelete: 'CASCADE',
});
BookedSchedule.belongsTo(ScheduleRecord, {
  foreignKey: 'ScheduleID',
  onDelete: 'CASCADE',
});

// Additional many-to-many association (already defined above)
//@ ScheduleRecord and Booking (M:M)
// This association uses BookedSchedule as the join table.
ScheduleRecord.belongsToMany(Booking, {
  through: BookedSchedule,
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
  BookedSchedule,
  Booking,
  Customer,
  Feedback,
  Invoice,
  Newsletter,
  Product,
  ScheduleRecord,
  SubscribedNewsletter,
  User,
  UserPrefSettings,
  VerificationToken,
};
