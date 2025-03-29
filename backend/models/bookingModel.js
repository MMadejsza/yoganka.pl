import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

/** @type {import('sequelize').Model} */
const Booking = sequelizeDb.define(
  'Booking',
  {
    scheduleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'schedule_id',
      references: {
        model: 'schedule_records',
        key: 'schedule_id',
      },
    },
    paymentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'payment_id',
      references: {
        model: 'payments',
        key: 'payment_id',
      },
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'customer_id',
    },
    attendance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'attendance',
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelizeDb.literal('CURRENT_TIMESTAMP'),
      field: 'timestamp',
    },
    performedBy: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'Customer',
      field: 'performed_by',
    },
  },
  {
    tableName: 'bookings',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['customer_id', 'schedule_id'],
      },
    ],
  }
);

export default Booking;
