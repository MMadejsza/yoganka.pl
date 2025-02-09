import db from '../utils/db.js';

class Booking {
	constructor(
		bookingID,
		customerID,
		scheduleID,
		date,
		product,
		status,
		amountPaid,
		amountDue,
		paymentMethod,
		paymentStatus,
	) {
		this.bookingID = bookingID;
		this.customerID = customerID;
		this.scheduleID = scheduleID;
		this.date = date;
		this.product = product;
		this.status = status;
		this.amountPaid = amountPaid;
		this.amountDue = amountDue;
		this.paymentMethod = paymentMethod;
		this.paymentStatus = paymentStatus;
	}

	static fetchAll() {
		return db.execute(`SELECT * FROM bookings`);
	}
}
export default Booking;
