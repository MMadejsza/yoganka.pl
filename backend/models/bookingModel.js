import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

/** @type {import('sequelize').Model} */

const Booking = sequelizeDb.define(
  'Booking',
  {
    ScheduleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'ScheduleRecord', // The name of the target table
        key: 'ScheduleID', // The name of the column in the target table
      },
    },
    PaymentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,

      references: {
        model: 'Payment', // The name of the target table
        key: 'PaymentID', // The name of the column in the target table
      },
    },
    CustomerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Attendance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    TimeStamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    DidAction: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'Customer',
    },
  },
  {
    tableName: 'bookings', // exact mysql table name
    timestamps: true,
    updatedAt: 'TimeStamp', //mapping to TimeStamp
    createdAt: false,
    indexes: [
      {
        unique: true,
        fields: ['CustomerID', 'ScheduleID'], //unique key for combination of  CustomerID i ScheduleID
      },
    ],
  }
);
Booking.beforeCreate(instance => {
  if (!instance.TimeStamp) {
    instance.TimeStamp = new Date();
  }
});
export default Booking;
