import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

/** @type {import('sequelize').Model} */
const PassDefinition = sequelizeDb.define(
  'PassDefinition',
  {
    passDefId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'pass_def_id',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'name',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description',
    },
    passType: {
      type: DataTypes.ENUM('count', 'time', 'mixed'),
      allowNull: false,
      field: 'pass_type',
    },
    usesTotal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'uses_total',
    },
    validityDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'validity_days',
    },
    allowedProductTypes: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'allowed_product_types',
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'price',
    },
  },
  {
    tableName: 'pass_definitions',
    timestamps: false,
  }
);

export default PassDefinition;
