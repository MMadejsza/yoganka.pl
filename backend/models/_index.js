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
import UserPrefSetting from './userSettingsModel.js';
import VerificationToken from './verificationTokensModel.js';

//
// ASSOCIATIONS BETWEEN THE USER MODEL AND OTHER MODELS
//

// User ⇄ VerificationToken (1:M)
// A user can have many verification tokens.
User.hasMany(VerificationToken, { foreignKey: 'user_id' });
VerificationToken.belongsTo(User, { foreignKey: 'user_id' });

// User ⇄ Customer (1:1, total participation on Customer)
// When a User is deleted, the associated Customer is also deleted.
User.hasOne(Customer, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Customer.belongsTo(User, { foreignKey: 'user_id' });

// User ⇄ UserPrefSetting (1:1, total participation on UserPrefSetting)
// When a User is deleted, the associated UserPrefSetting are also deleted.
User.hasOne(UserPrefSetting, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserPrefSetting.belongsTo(User, { foreignKey: 'user_id' });

//
// ASSOCIATIONS BETWEEN THE CUSTOMER MODEL AND OTHER MODELS
//

// Customer ⇄ Payment (1:M, total participation on Payment)
// Deleting a Customer will delete all associated Payments.
Customer.hasMany(Payment, { foreignKey: 'customer_id', onDelete: 'CASCADE' });
Payment.belongsTo(Customer, { foreignKey: 'customer_id' });

// Customer ⇄ Booking (1:M, total participation on Booking)
// Deleting a Customer will delete all associated Booking records.
Customer.hasMany(Booking, { foreignKey: 'customer_id', onDelete: 'CASCADE' });
Booking.belongsTo(Customer, { foreignKey: 'customer_id' });

// Customer ⇄ Feedback (1:M, total participation on Feedback)
// Deleting a Customer will delete all associated Feedback entries.
Customer.hasMany(Feedback, { foreignKey: 'customer_id', onDelete: 'CASCADE' });
Feedback.belongsTo(Customer, { foreignKey: 'customer_id' });

//
// ASSOCIATIONS BETWEEN THE SCHEDULERECORD MODEL AND OTHER MODELS
//

// ScheduleRecord ⇄ Feedback (1:M)
// Deleting a ScheduleRecord will delete all associated Feedback.
ScheduleRecord.hasMany(Feedback, {
  foreignKey: 'schedule_id',
  onDelete: 'CASCADE',
});
Feedback.belongsTo(ScheduleRecord, { foreignKey: 'schedule_id' });

// Product ⇄ ScheduleRecord (1:M, total participation on ScheduleRecord)
// Deleting a Product will delete all associated ScheduleRecords.
Product.hasMany(ScheduleRecord, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE',
});
ScheduleRecord.belongsTo(Product, { foreignKey: 'product_id' });

//
// ASSOCIATIONS BETWEEN THE BOOKING MODEL AND OTHER MODELS
//

// Payment ⇄ Booking (M:M, total participation on both sides)
// Through the join table Booking, deleting a Payment will delete its associated Booking records.
Payment.belongsToMany(ScheduleRecord, {
  through: { model: Booking, onDelete: 'CASCADE' },
  foreignKey: 'payment_id',
});
Booking.belongsTo(Payment, { foreignKey: 'payment_id', onDelete: 'CASCADE' });

// Payment ⇄ Invoice (1:1, total participation on Invoice)
// Deleting a Payment will delete the associated Invoice.
Payment.hasOne(Invoice, { foreignKey: 'payment_id', onDelete: 'CASCADE' });
Invoice.belongsTo(Payment, { foreignKey: 'payment_id' });

// ScheduleRecord ⇄ Booking (1:M, total participation on Booking)
// Deleting a ScheduleRecord will delete all associated Booking records.
ScheduleRecord.hasMany(Booking, {
  foreignKey: 'schedule_id',
  onDelete: 'CASCADE',
});
Booking.belongsTo(ScheduleRecord, {
  foreignKey: 'schedule_id',
  onDelete: 'CASCADE',
});

// Additional many-to-many association:
// ScheduleRecord ⇄ Payment (M:M) using Booking as join table.
ScheduleRecord.belongsToMany(Payment, {
  through: Booking,
  foreignKey: 'schedule_id',
});

//
// ASSOCIATIONS BETWEEN THE NEWSLETTER MODEL AND THE USER MODEL
//

// Newsletter ⇄ User (M:M)
// Deleting a Newsletter or User will delete the corresponding entries in the join table.
Newsletter.belongsToMany(User, {
  through: SubscribedNewsletter,
  foreignKey: 'newsletter_id',
  onDelete: 'CASCADE',
});
User.belongsToMany(Newsletter, {
  through: SubscribedNewsletter,
  foreignKey: 'user_id',
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
  UserPrefSetting,
  VerificationToken,
};
