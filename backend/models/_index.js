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
VerificationToken.belongsTo(User, { foreignKey: 'user_id' });

//@ User (1) ->| ⇄ (1) Customer
// When a User is deleted, the associated Customer is also deleted.
User.hasOne(Customer, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Customer.belongsTo(User, { foreignKey: 'user_id' });

//@ User (1) ->| ⇄ (1) UserPrefSetting
// When a User is deleted, the associated UserPrefSetting is also deleted.
User.hasOne(UserPrefSetting, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserPrefSetting.belongsTo(User, { foreignKey: 'user_id' });

// ! CUSTOMER ASSOCIATIONS __________________________________________________
//@ Customer (1) ->| ⇄ (M) Payment
// Deleting a Customer deletes all associated Payments.
Customer.hasMany(Payment, { foreignKey: 'customer_id', onDelete: 'CASCADE' });
Payment.belongsTo(Customer, { foreignKey: 'customer_id' });

//@ Customer (1) ->| ⇄ (M) Booking
// Deleting a Customer deletes all associated Bookings.
Customer.hasMany(Booking, { foreignKey: 'customer_id', onDelete: 'CASCADE' });
Booking.belongsTo(Customer, { foreignKey: 'customer_id' });

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

// //
// // ASSOCIATIONS BETWEEN THE USER MODEL AND OTHER MODELS
// //

// // User ⇄ VerificationToken (1:M)
// // A user can have many verification tokens.
// User.hasMany(VerificationToken, { foreignKey: 'user_id' });
// VerificationToken.belongsTo(User, { foreignKey: 'user_id' });

// // User ⇄ Customer (1:1, total participation on Customer)
// // When a User is deleted, the associated Customer is also deleted.
// User.hasOne(Customer, { foreignKey: 'user_id', onDelete: 'CASCADE' });
// Customer.belongsTo(User, { foreignKey: 'user_id' });

// // User ⇄ UserPrefSetting (1:1, total participation on UserPrefSetting)
// // When a User is deleted, the associated UserPrefSetting are also deleted.
// User.hasOne(UserPrefSetting, { foreignKey: 'user_id', onDelete: 'CASCADE' });
// UserPrefSetting.belongsTo(User, { foreignKey: 'user_id' });

// //
// // ASSOCIATIONS BETWEEN THE CUSTOMER MODEL AND OTHER MODELS
// //

// // Customer ⇄ Payment (1:M, total participation on Payment)
// // Deleting a Customer will delete all associated Payments.
// Customer.hasMany(Payment, { foreignKey: 'customer_id', onDelete: 'CASCADE' });
// Payment.belongsTo(Customer, { foreignKey: 'customer_id' });

// // Customer ⇄ Booking (1:M, total participation on Booking)
// // Deleting a Customer will delete all associated Booking records.
// Customer.hasMany(Booking, { foreignKey: 'customer_id', onDelete: 'CASCADE' });
// Booking.belongsTo(Customer, { foreignKey: 'customer_id' });

// // Customer ⇄ Feedback (1:M, total participation on Feedback)
// // Deleting a Customer will delete all associated Feedback entries.
// Customer.hasMany(Feedback, { foreignKey: 'customer_id', onDelete: 'CASCADE' });
// Feedback.belongsTo(Customer, { foreignKey: 'customer_id' });

// // Customer ⇄ CustomerPass (1:M, total participation on CustomerPass)
// // Every pass (CustomerPass) must be assigned to the customer.
// Customer.hasMany(CustomerPass, {
//   foreignKey: 'customer_id',
//   onDelete: 'CASCADE',
// });
// CustomerPass.belongsTo(Customer, { foreignKey: 'customer_id' });

// //
// // ASSOCIATIONS BETWEEN THE SCHEDULERECORD MODEL AND OTHER MODELS
// //

// // ScheduleRecord ⇄ Feedback (1:M)
// // Deleting a ScheduleRecord will delete all associated Feedback.
// ScheduleRecord.hasMany(Feedback, {
//   foreignKey: 'schedule_id',
//   onDelete: 'CASCADE',
// });
// Feedback.belongsTo(ScheduleRecord, { foreignKey: 'schedule_id' });

// // Product ⇄ ScheduleRecord (1:M, total participation on ScheduleRecord)
// // Deleting a Product will delete all associated ScheduleRecords.
// Product.hasMany(ScheduleRecord, {
//   foreignKey: 'product_id',
//   onDelete: 'CASCADE',
// });
// ScheduleRecord.belongsTo(Product, { foreignKey: 'product_id' });

// //
// // ASSOCIATIONS BETWEEN THE PAYMENT MODEL AND OTHER MODELS
// //

// // Payment ⇄ Booking (M:M, total participation on both sides)
// // Through the join table Booking, deleting a Payment will delete its associated Booking records.
// Payment.belongsToMany(ScheduleRecord, {
//   through: { model: Booking, onDelete: 'CASCADE' },
//   foreignKey: 'payment_id',
// });
// Booking.belongsTo(Payment, { foreignKey: 'payment_id', onDelete: 'CASCADE' });
// // Booking ⇄ CustomerPass (1:M, optional relation)
// // If the booking is payed with the pass, Booking.customer_pass_id points CustomerPass.
// CustomerPass.hasMany(Booking, {
//   foreignKey: 'customer_pass_id',
//   onDelete: 'CASCADE',
// });
// Booking.belongsTo(CustomerPass, {
//   foreignKey: 'customer_pass_id',
//   onDelete: 'CASCADE',
// });

// // Payment ⇄ CustomerPass (1:M)
// // Płatność, która dotyczy zakupu karnetu, może kupić wiele instancji karnetu.
// Payment.hasMany(CustomerPass, {
//   foreignKey: 'payment_id',
//   onDelete: 'CASCADE',
// });
// CustomerPass.belongsTo(Payment, {
//   foreignKey: 'payment_id',
//   onDelete: 'CASCADE',
// });

// // Payment ⇄ Invoice (1:1, total participation on Invoice)
// // Deleting a Payment will delete the associated Invoice.
// Payment.hasOne(Invoice, { foreignKey: 'payment_id', onDelete: 'CASCADE' });
// Invoice.belongsTo(Payment, { foreignKey: 'payment_id' });

// // ScheduleRecord ⇄ Booking (1:M, total participation on Booking)
// // Deleting a ScheduleRecord will delete all associated Booking records.
// ScheduleRecord.hasMany(Booking, {
//   foreignKey: 'schedule_id',
//   onDelete: 'CASCADE',
// });
// Booking.belongsTo(ScheduleRecord, {
//   foreignKey: 'schedule_id',
//   onDelete: 'CASCADE',
// });

// // PassDefinition ⇄ CustomerPass (1:M)
// // Every pass (CustomerPass) refers to 1 pass definition.
// PassDefinition.hasMany(CustomerPass, {
//   foreignKey: 'pass_def_id',
//   onDelete: 'CASCADE',
// });
// CustomerPass.belongsTo(PassDefinition, {
//   foreignKey: 'pass_def_id',
//   onDelete: 'CASCADE',
// });

// // Additional many-to-many association:
// // ScheduleRecord ⇄ Payment (M:M) using Booking as join table.
// ScheduleRecord.belongsToMany(Payment, {
//   through: Booking,
//   foreignKey: 'schedule_id',
// });

// //
// // ASSOCIATIONS BETWEEN THE NEWSLETTER MODEL AND THE USER MODEL
// //

// // Newsletter ⇄ User (M:M)
// // Deleting a Newsletter or User will delete the corresponding entries in the join table.
// Newsletter.belongsToMany(User, {
//   through: SubscribedNewsletter,
//   foreignKey: 'newsletter_id',
//   onDelete: 'CASCADE',
// });
// User.belongsToMany(Newsletter, {
//   through: SubscribedNewsletter,
//   foreignKey: 'user_id',
//   onDelete: 'CASCADE',
// });

// export {
//   Booking,
//   Customer,
//   Feedback,
//   Invoice,
//   Newsletter,
//   Payment,
//   Product,
//   ScheduleRecord,
//   SubscribedNewsletter,
//   User,
//   UserPrefSetting,
//   VerificationToken,
// };
