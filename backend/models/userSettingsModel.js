import db from '../utils/db.js';

class UserSettings {
	constructor(uID, regDate, login, pass, lastLoginDate, email, role, picJON) {
		// constructor(data) {
		// Instead of manual this.uID = uID [...]
		// Object.assign(this,uID, cID, cType, fName, sName, DoB, pContactMethod, loyalty, refSource, notes)
		// Object.assign(this, data);
		this.uID = uID;
		this.regDate = regDate;
		this.login = login;
		this.pass = pass;
		this.lastLoginDate = lastLoginDate;
		this.email = email;
		this.role = role;
		this.picJON = picJON;
	}

	static fetchAll() {
		return db.execute(`SELECT * FROM user_pref_settings`);
	}
}
export default UserSettings;
