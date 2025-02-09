import {DataTypes} from 'sequelize';
import sequelizeDb from '../utils/db.js';

/** @type {import('sequelize').Model} */

export const BookedSchedule = sequelizeDb.define(
	'product',
	{
		ScheduleID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		BookingID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
	},
	{
		tableName: 'booked_schedules', // exact mysql table name
		timestamps: false, // turn off `createdAt` and `updatedAt`
	},
);
