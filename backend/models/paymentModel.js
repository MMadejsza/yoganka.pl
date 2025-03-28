import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

/** @type {import('sequelize').Model} */
const Payment = sequelizeDb.define(
  'Payment',
  {
    PaymentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CustomerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers', // The name of the target table
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
    DidAction: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'Customer',
    },
  },
  {
    tableName: 'payments',
    timestamps: false,
  }
);
export default Payment;
