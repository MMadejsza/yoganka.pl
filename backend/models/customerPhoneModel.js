import {DataTypes} from 'sequelize';
import sequelizeDb from '../utils/db.js';

/** @type {import('sequelize').Model} */

export const CustomerPhones = sequelizeDb.define(
	'customerPhones',
	{
		CustomerID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		CustomerMobile: {
			type: DataTypes.STRING(20),
			primaryKey: true,
		},
	},
	{
		tableName: 'customers_phones', // exact mysql table name
		timestamps: false, // turn off `createdAt` and `updatedAt`
	},
);
