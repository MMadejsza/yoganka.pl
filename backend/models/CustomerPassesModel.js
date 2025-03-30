import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

/** @type {import('sequelize').Model} */
const CustomerPass = sequelizeDb.define(
  'CustomerPass',
  {
    customerPassId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'customer_pass_id',
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
      allowNull: false,
      field: 'payment_id',
      references: {
        model: 'payments',
        key: 'payment_id',
      },
    },
    passDefId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'pass_def_id',
      references: {
        model: 'pass_definitions',
        key: 'pass_def_id',
      },
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelizeDb.literal('CURRENT_TIMESTAMP'),
      field: 'purchase_date',
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'valid_from',
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'valid_until',
    },
    usesLeft: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'uses_left',
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'status', //active, expired, suspended
    },
  },
  {
    tableName: 'customer_passes',
    timestamps: false,
  }
);

export default CustomerPass;
