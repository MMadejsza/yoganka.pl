import db from '../utils/db.js';

class Feedback {
	constructor(feedbackID, customerID, scheduleID, submissionDate, rating, text, delay) {
		this.feedbackID = feedbackID;
		this.customerID = customerID;
		this.scheduleID = scheduleID;
		this.submissionDate = submissionDate;
		this.rating = rating;
		this.text = text;
		this.delay = delay;
	}

	static fetchAll() {
		return db.execute(`SELECT * FROM participant_feedback`);
	}
}
export default Feedback;
