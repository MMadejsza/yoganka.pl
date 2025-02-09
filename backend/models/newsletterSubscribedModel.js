import db from '../utils/db.js';

class SubscribedNewsletter {
	constructor(newsletterID, userID, subscriptionDate, subscriptionStatus) {
		this.newsletterID = newsletterID;
		this.userID = userID;
		this.subscriptionDate = subscriptionDate;
		this.subscriptionStatus = subscriptionStatus;
	}

	static fetchAll() {
		return db.execute(`SELECT * FROM subscribed_newsletter`);
	}
}
export default SubscribedNewsletter;
