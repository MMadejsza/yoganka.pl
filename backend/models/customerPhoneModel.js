// import {DataTypes} from 'sequelize';
// import sequelizeDb from '../utils/db.js';

// /** @type {import('sequelize').Model} */

// const CustomerPhones = sequelizeDb.define(
// 	'CustomerPhones',
// 	{
// 		CustomerID: {
// 			type: DataTypes.INTEGER,
// 			primaryKey: true,

// 			references: {
// 				model: 'customers', // The name of the target table
// 				key: 'CustomerID', // The name of the column in the target table
// 			},
// 		},
// 		CustomerMobile: {
// 			type: DataTypes.STRING(20),
// 			primaryKey: true,
// 			unique: true,
// 			allowNull: false,
// 		},
// 	},
// 	{
// 		tableName: 'customers_phones', // exact mysql table name
// 		timestamps: false, // turn off `createdAt` and `updatedAt`
// 	},
// );
// export default CustomerPhones;
