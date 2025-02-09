import {Sequelize, DataTypes, Model} from 'sequelize';
import sequelizeDb from '../utils/db.js';

/** @type {import('sequelize').Model} */
export const Product = sequelizeDb.define(
	'product',
	{
		ProductID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		Name: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		Type: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		Location: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		Duration: {
			type: DataTypes.TIME, //  HH:MM:SS
			allowNull: true,
		},
		Price: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: true,
		},
		TotalSpaces: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		StartDate: {
			type: DataTypes.DATEONLY, //  YYYY-MM-DD
			allowNull: true,
		},
	},
	{
		tableName: 'products', // exact mysql table name
		timestamps: false, // turn off `createdAt` and `updatedAt`
	},
);
// export default Product;
// import db from '../utils/db.js';

// class Product {
// 	constructor(productID, name, type, location, duration, price, totalSpaces, startDate) {
// 		// constructor(data) {
// 		// Instead of manual this.uID = uID [...]
// 		// Object.assign(this,uID, cID, cType, fName, sName, DoB, pContactMethod, loyalty, refSource, notes)
// 		// Object.assign(this, data);
// 		this.productID = productID;
// 		this.name = name;
// 		this.type = type;
// 		this.location = location;
// 		this.duration = duration;
// 		this.price = price;
// 		this.totalSpaces = totalSpaces;
// 		this.startDate = startDate;
// 	}
// 	save() {
// 		// ? as preparation for later on sequelize
// 		return db.execute(
// 			'INSERT INTO products (Name, Type, Location, Duration, Price, TotalSpaces, StartDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
// 			[
// 				this.name,
// 				this.type,
// 				this.location,
// 				this.duration,
// 				this.price,
// 				this.totalSpaces,
// 				this.startDate,
// 			],
// 		);
// 	}

// 	static fetchAll() {
// 		return db.execute(`SELECT * FROM products`);
// 	}
// }
