import db from '../utils/db.js';

class ScheduleRecord {
	constructor(scheduleID, productID, date, startTime, location) {
		// constructor(data) {
		// Instead of manual this.uID = uID [...]
		// Object.assign(this,uID, cID, cType, fName, sName, DoB, pContactMethod, loyalty, refSource, notes)
		// Object.assign(this, data);
		this.scheduleID = scheduleID;
		this.productID = productID;
		this.date = date;
		this.startTime = startTime;
		this.location = location;
	}

	static fetchAll() {
		return db.execute(`SELECT * FROM schedule_records`);
	}
}
export default ScheduleRecord;
