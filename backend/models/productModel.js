import db from '../utils/db.js';

class Product {
	constructor(productID, name, type, location, duration, price, totalSpaces, startDate) {
		// constructor(data) {
		// Instead of manual this.uID = uID [...]
		// Object.assign(this,uID, cID, cType, fName, sName, DoB, pContactMethod, loyalty, refSource, notes)
		// Object.assign(this, data);
		this.productID = productID;
		this.name = name;
		this.type = type;
		this.location = location;
		this.duration = duration;
		this.price = price;
		this.totalSpaces = totalSpaces;
		this.startDate = startDate;
	}
	save() {
		// ? as preparation for later on sequelize
		return db.execute(
			'INSERT INTO products (Name, Type, Location, Duration, Price, TotalSpaces, StartDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
			[
				this.name,
				this.type,
				this.location,
				this.duration,
				this.price,
				this.totalSpaces,
				this.startDate,
			],
		);
	}

	static fetchAll() {
		return db.execute(`SELECT * FROM products`);
	}
}
export default Product;
