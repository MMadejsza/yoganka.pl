import db from '../utils/db.js';

class Newsletter {
	constructor(newsletterID, status, creationDate, sendDate, title, content) {
		this.newsletterID = newsletterID;
		this.status = status;
		this.creationDate = creationDate;
		this.sendDate = sendDate;
		this.title = title;
		this.content = content;
	}

	static fetchAll() {
		return db.execute(`SELECT * FROM newsletters`);
	}
}
export default Newsletter;
