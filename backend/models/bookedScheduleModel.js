import {DataTypes} from 'sequelize';
import sequelizeDb from '../utils/db.js';

/** @type {import('sequelize').Model} */

const BookedSchedule = sequelizeDb.define(
	'BookedSchedule',
	{
		ScheduleID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			references: {
				model: 'ScheduleRecord', // The name of the target table
				key: 'ScheduleID', // The name of the column in the target table
			},
		},
		BookingID: {
			type: DataTypes.INTEGER,
			primaryKey: true,

			references: {
				model: 'Booking', // The name of the target table
				key: 'BookingID', // The name of the column in the target table
			},
		},
	},
	{
		tableName: 'booked_schedules', // exact mysql table name
		timestamps: false, // turn off `createdAt` and `updatedAt`
	},
);
export default BookedSchedule;
