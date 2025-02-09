import db from '../utils/db.js';

class Customer {
	constructor(uID, cID, cType, fName, sName, DoB, pContactMethod, loyalty, refSource, notes) {
		// constructor(data) {
		// Instead of manual this.uID = uID [...]
		// Object.assign(this,uID, cID, cType, fName, sName, DoB, pContactMethod, loyalty, refSource, notes)
		// Object.assign(this, data);
		this.uID = uID;
		this.cID = cID;
		this.cType = cType;
		this.fName = fName;
		this.sName = sName;
		this.DoB = DoB;
		this.pContactMethod = pContactMethod;
		this.loyalty = loyalty;
		this.refSource = refSource;
		this.notes = notes;
	}

	static fetchAll() {
		return db.execute(`SELECT * FROM customers`);
	}
}
export default Customer;
