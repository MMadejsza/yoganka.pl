import {DataTypes} from 'sequelize';
import sequelizeDb from '../utils/db.js';

/** @type {import('sequelize').Model} */
export const Booking = sequelizeDb.define(
	'booking',
	{
		BookingID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		CustomerID: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		ScheduleID: {
			type: DataTypes.INTEGER,
			allowNull: false,
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
