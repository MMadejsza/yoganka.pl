import db from '../utils/db.js';

class Invoice {
	constructor(invoiceID, bookingID, invoiceDate, dueDate, totalAmount, paymentStatus) {
		this.invoiceID = invoiceID;
		this.bookingID = bookingID;
		this.invoiceDate = invoiceDate;
		this.dueDate = dueDate;
		this.totalAmount = totalAmount;
		this.paymentStatus = paymentStatus;
	}

	static fetchAll() {
		return db.execute(`SELECT * FROM invoices`);
	}
}
export default Invoice;
