import db from '../utils/db.js';

class CustomerPhones {
	constructor(cID, phoneNumber) {
		this.cID = cID;
		this.phoneNumber = phoneNumber;
	}

	static fetchAll() {
		return db.execute(`SELECT * FROM customers_phones`);
	}
}
export default CustomerPhones;
