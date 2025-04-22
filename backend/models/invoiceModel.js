import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

const Invoice = sequelizeDb.define(
  'Invoice',
  {
    invoiceId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'invoice_id',
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'payment_id',
      references: {
        model: 'payments',
        key: 'payment_id',
      },
    },
    invoiceDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'invoice_date',
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'due_date',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_amount',
    },
    paymentStatus: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      field: 'payment_status',
    },
  },
  {
    tableName: 'invoices',
    timestamps: false,
  }
);

export default Invoice;
