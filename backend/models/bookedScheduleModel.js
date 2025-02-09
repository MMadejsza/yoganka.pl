import db from '../utils/db.js';

class BookedSchedule {
	constructor(bookingID, scheduleID) {
		this.bookingID = bookingID;
		this.scheduleID = scheduleID;
	}

	static fetchAll() {
		return db.execute(`SELECT * FROM booked_schedules`);
	}
}
export default BookedSchedule;
