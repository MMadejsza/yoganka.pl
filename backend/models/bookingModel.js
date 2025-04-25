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
      references: {
        model: 'customers',
        key: 'customer_id',
      },
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
      field: 'timestamp',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
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
    timestamps: true, // Sequelize manages created_at
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['customer_id', 'schedule_id'],
      },
    ],
  }
);

export default Booking;
