import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

/** @type {import('sequelize').Model} */
const Product = sequelizeDb.define(
  'Product',
  {
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'product_id',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'name',
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'type',
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'location',
    },
    duration: {
      type: DataTypes.TIME, //  HH:MM:SS
      allowNull: false,
      field: 'duration',
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'price',
    },
    startDate: {
      type: DataTypes.DATEONLY, //  YYYY-MM-DD
      allowNull: false,
      field: 'start_date',
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'status',
    },
  },
  {
    tableName: 'products', // exact mysql table name
    timestamps: false, // turn off `createdAt` and `updatedAt`
  }
);

export default Product;
