import Booking from './BookingModel.js';
import Customer from './CustomerModel.js';
import CustomerPass from './CustomerPassesModel.js';
import Feedback from './FeedbackModel.js';
import Invoice from './InvoiceModel.js';
import Newsletter from './NewsletterModel.js';
import SubscribedNewsletter from './NewsletterSubscribedModel.js';
import PassDefinition from './PassDefinitionModel.js';
import Payment from './PaymentModel.js';
import Product from './ProductModel.js';
import ScheduleRecord from './ScheduleRecordModel.js';
import User from './UserModel.js';
import UserPrefSetting from './UserSettingsModel.js';
import VerificationToken from './VerificationTokenModel.js';

// ! USER ASSOCIATIONS ______________________________________________________
//@ User (1) ->| ⇄ (M) VerificationToken
// When a User is deleted, all associated VerificationTokens are deleted.
User.hasMany(VerificationToken, { foreignKey: 'user_id' });
VerificationToken.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

//@ User (1) ->| ⇄ (1) Customer
// When a User is deleted, the associated Customer is also deleted.
User.hasOne(Customer, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Customer.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

//@ User (1) ->| ⇄ (1) UserPrefSetting
// When a User is deleted, the associated UserPrefSetting is also deleted.
User.hasOne(UserPrefSetting, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserPrefSetting.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// ! CUSTOMER ASSOCIATIONS __________________________________________________
//@ Customer (1) ->| ⇄ (M) Payment
// Deleting a Customer deletes all associated Payments.
Customer.hasMany(Payment, { foreignKey: 'customer_id', onDelete: 'CASCADE' });
Payment.belongsTo(Customer, { foreignKey: 'customer_id' });

//@ Customer (1) ->| ⇄ (M) Booking
// Deleting a Customer deletes all associated Bookings.
Customer.hasMany(Booking, { foreignKey: 'customer_id', onDelete: 'CASCADE' });
Booking.belongsTo(Customer, { foreignKey: 'customer_id', onDelete: 'CASCADE' });

//@ Customer (1) ->| ⇄ (M) Feedback
// Deleting a Customer deletes all associated Feedback entries.
Customer.hasMany(Feedback, { foreignKey: 'customer_id', onDelete: 'CASCADE' });
Feedback.belongsTo(Customer, { foreignKey: 'customer_id' });

//@ Customer (1) ->| ⇄ (M) CustomerPass
// Every CustomerPass must be assigned to a Customer.
Customer.hasMany(CustomerPass, {
  foreignKey: 'customer_id',
  onDelete: 'CASCADE',
});
CustomerPass.belongsTo(Customer, { foreignKey: 'customer_id' });

// ! SCHEDULE & PRODUCT ASSOCIATIONS _______________________________________
//@ ScheduleRecord (1) ->| ⇄ (M) Feedback
// Deleting a ScheduleRecord deletes all associated Feedback.
ScheduleRecord.hasMany(Feedback, {
  foreignKey: 'schedule_id',
  onDelete: 'CASCADE',
});
Feedback.belongsTo(ScheduleRecord, { foreignKey: 'schedule_id' });

//@ Product (1) ->| ⇄ (M) ScheduleRecord
// Deleting a Product deletes all associated ScheduleRecords.
Product.hasMany(ScheduleRecord, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE',
});
ScheduleRecord.belongsTo(Product, { foreignKey: 'product_id' });

// ! PAYMENT ASSOCIATIONS ____________________________________________________
//@ Payment (1) ->| ⇄ (M) Booking
// Booking.payment_id is used for direct payment.
// When a Payment is deleted, its associated Bookings are deleted.
Payment.hasMany(Booking, { foreignKey: 'payment_id', onDelete: 'CASCADE' });
Booking.belongsTo(Payment, { foreignKey: 'payment_id', onDelete: 'CASCADE' });

//@ Payment (1) ->| ⇄ (M) CustomerPass
// A Payment used for purchasing passes can create many CustomerPass records.
Payment.hasMany(CustomerPass, {
  foreignKey: 'payment_id',
  onDelete: 'CASCADE',
});
CustomerPass.belongsTo(Payment, {
  foreignKey: 'payment_id',
  onDelete: 'CASCADE',
});

//@ Payment (1) ->| ⇄ (1) Invoice
// Deleting a Payment deletes the associated Invoice.
Payment.hasOne(Invoice, { foreignKey: 'payment_id', onDelete: 'CASCADE' });
Invoice.belongsTo(Payment, { foreignKey: 'payment_id' });

// ! PASS ASSOCIATIONS _______________________________________________________
//@ PassDefinition (1) ->| ⇄ (M) CustomerPass
// Every CustomerPass refers to one PassDefinition.
PassDefinition.hasMany(CustomerPass, {
  foreignKey: 'pass_def_id',
  onDelete: 'CASCADE',
});
CustomerPass.belongsTo(PassDefinition, {
  foreignKey: 'pass_def_id',
  onDelete: 'CASCADE',
});

// ! BOOKING & SCHEDULE ASSOCIATIONS ________________________________________
//@ ScheduleRecord (1) ->| ⇄ (M) Booking
// Each Booking is for one ScheduleRecord; a ScheduleRecord can have many Bookings.
ScheduleRecord.hasMany(Booking, {
  foreignKey: 'schedule_id',
  onDelete: 'CASCADE',
});
Booking.belongsTo(ScheduleRecord, {
  foreignKey: 'schedule_id',
  onDelete: 'CASCADE',
});

//@ Booking (optional) ->| ⇄ (M) CustomerPass
// If a Booking is paid with a pass, Booking.customer_pass_id points to CustomerPass.
CustomerPass.hasMany(Booking, {
  foreignKey: 'customer_pass_id',
  onDelete: 'CASCADE',
});
Booking.belongsTo(CustomerPass, {
  foreignKey: 'customer_pass_id',
  onDelete: 'CASCADE',
});

// Additional many-to-many association using Booking as join table for ScheduleRecord ⇄ Payment
// (This is redundant if using Booking as the join for direct Payment association)
// ScheduleRecord.belongsToMany(Payment, {
//   through: Booking,
//   foreignKey: 'schedule_id',
// });

// ! NEWSLETTER ASSOCIATIONS _________________________________________________
// Newsletter (M) ->| ⇄ (M) User
// Deleting a Newsletter or User deletes corresponding join table entries.
Newsletter.belongsToMany(User, {
  foreignKey: 'newsletter_id',
  through: SubscribedNewsletter,
  onDelete: 'CASCADE',
});
User.belongsToMany(Newsletter, {
  foreignKey: 'user_id',
  through: SubscribedNewsletter,
  onDelete: 'CASCADE',
});

// Export models
export {
  Booking,
  Customer,
  CustomerPass,
  Feedback,
  Invoice,
  Newsletter,
  PassDefinition,
  Payment,
  Product,
  ScheduleRecord,
  SubscribedNewsletter,
  User,
  UserPrefSetting,
  VerificationToken,
};
