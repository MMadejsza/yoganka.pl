import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

/** @type {import('sequelize').Model} */
const Payment = sequelizeDb.define(
  'Payment',
  {
    paymentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'payment_id',
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
    date: {
      type: DataTypes.DATEONLY, // YYYY-MM-DD
      allowNull: false,
      field: 'date',
    },
    product: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'product',
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'status',
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'amount_paid',
    },
    amountDue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'amount_due',
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'payment_method',
    },
    paymentStatus: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'payment_status',
    },
    performedBy: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'Customer',
      field: 'performed_by',
    },
  },
  {
    tableName: 'payments',
    timestamps: false,
  }
);

export default Payment;
