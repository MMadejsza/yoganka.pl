import User from './userModel.js';
import UserPrefSettings from './userSettingsModel.js';
import Customer from './customerModel.js';
import CustomerPhones from './customerPhoneModel.js';
import Feedback from './feedbackModel.js';
import Product from './productModel.js';
import ScheduleRecord from './scheduleRecordModel.js';
import BookedSchedule from './bookedScheduleModel.js';
import Booking from './bookingModel.js';
import Invoice from './invoiceModel.js';
import Newsletter from './newsletterModel.js';
import SubscribedNewsletter from './newsletterSubscribedModel.js';

//@ User and Customer (1:1, total participation on Customer)
//@ --------------------------------------------------------
User.hasOne(Customer, {foreignKey: 'UserID', onDelete: 'CASCADE'});
Customer.belongsTo(User, {foreignKey: 'UserID'});

//@ User and his settings (1:1, total participation on UserPrefSettings)
//@ --------------------------------------------------------------------
User.hasOne(UserPrefSettings, {foreignKey: 'UserID', onDelete: 'CASCADE'});
UserPrefSettings.belongsTo(User, {foreignKey: 'UserID'});

//@ Customer and his phones (1:M, total participation on phones)
//@ --------------------------------------------------------------------
Customer.hasMany(CustomerPhones, {foreignKey: 'CustomerID', onDelete: 'CASCADE'});
CustomerPhones.belongsTo(Customer, {foreignKey: 'CustomerID'});

//@ Customer and Bookings (1:M, total participation on Bookings)
//@ ------------------------------------------------------------
Customer.hasMany(Booking, {foreignKey: 'CustomerID', onDelete: 'CASCADE'});
Booking.belongsTo(Customer, {foreignKey: 'CustomerID'});

//@ Customer and schedules (1:M, total participation on schedules)
//@ ------------------------------------------------------------
Customer.hasMany(BookedSchedule, {foreignKey: 'CustomerID', onDelete: 'CASCADE'});
BookedSchedule.belongsTo(Customer, {foreignKey: 'CustomerID'});

//@ Feedback and Schedule
//@ ------------------------------------------------------------
Feedback.belongsTo(ScheduleRecord, {foreignKey: 'ScheduleID'});
ScheduleRecord.hasMany(Feedback, {foreignKey: 'ScheduleID'});

//@ Booking and BookedSchedules (M:M, total participation on both sides)
//@ ----------------------------------------------------------------------
Booking.belongsToMany(ScheduleRecord, {
	through: BookedSchedule,
	foreignKey: 'BookingID',
});
ScheduleRecord.belongsToMany(Booking, {
	through: BookedSchedule,
	foreignKey: 'ScheduleID',
});

//@ Booking and Invoice (1:1, total participation on Invoice)
//@ ----------------------------------------------------------
Booking.hasOne(Invoice, {foreignKey: 'BookingID', onDelete: 'CASCADE'});
Invoice.belongsTo(Booking, {foreignKey: 'BookingID'});

//@ Customer and Feedback (1:M, total participation on Feedback)
//@ ------------------------------------------------------------
Customer.hasMany(Feedback, {foreignKey: 'CustomerID', onDelete: 'CASCADE'});
Feedback.belongsTo(Customer, {foreignKey: 'CustomerID'});

//@ Newsletter and Users (M:M, optional participation)
//@ --------------------------------------------------
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

//@ Product and ScheduleRecord (1:M, total participation on ScheduleRecord)
//@ -----------------------------------------------------------------------
Product.hasMany(ScheduleRecord, {foreignKey: 'ProductID', onDelete: 'CASCADE'});
ScheduleRecord.belongsTo(Product, {foreignKey: 'ProductID'});

export {
	User,
	UserPrefSettings,
	Customer,
	CustomerPhones,
	Feedback,
	Product,
	ScheduleRecord,
	BookedSchedule,
	Booking,
	Invoice,
	Newsletter,
	SubscribedNewsletter,
};
