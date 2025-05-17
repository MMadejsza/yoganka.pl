import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

const Customer = sequelizeDb.define(
  'Customer',
  {
    customerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'customer_id',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    customerType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'customer_type',
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'last_name',
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'dob',
    },
    phone: {
      type: DataTypes.STRING(16),
      allowNull: false,
      field: 'phone',
    },
    preferredContactMethod: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'preferred_contact_method',
    },
    loyalty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'loyalty',
    },
    referralSource: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'referral_source',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'notes',
    },
  },
  {
    tableName: 'customers',
    timestamps: false,
  }
);

export default Customer;
