import {DataTypes} from 'sequelize';
import sequelizeDb from '../utils/db.js';

/** @type {import('sequelize').Model} */
const Booking = sequelizeDb.define(
	'Booking',
	{
		BookingID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		CustomerID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Customer', // The name of the target table
				key: 'CustomerID', // The name of the column in the target table
			},
		},
		Date: {
			type: DataTypes.DATEONLY, // YYYY-MM-DD
			allowNull: false,
		},
		Product: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		Status: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		AmountPaid: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		AmountDue: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		PaymentMethod: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		PaymentStatus: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
	},
	{
		tableName: 'bookings',
		timestamps: false,
	},
);
export default Booking;
