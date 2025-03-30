import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

/** @type {import('sequelize').Model} */
const Booking = sequelizeDb.define(
  'Booking',
  {
    bookingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'booking_id',
    },
    scheduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'schedule_id',
      references: {
        model: 'schedule_records',
        key: 'schedule_id',
      },
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'customer_id',
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'payment_id',
      references: {
        model: 'payments',
        key: 'payment_id',
      },
    },
    customerPassId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'customer_pass_id',
      references: {
        model: 'customer_passes',
        key: 'customer_pass_id',
      },
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
