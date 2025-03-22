import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

/** @type {import('sequelize').Model} */
const Product = sequelizeDb.define(
  'Product',
  {
    ProductID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: 'unique_name_index',
    },
    Type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Duration: {
      type: DataTypes.TIME, //  HH:MM:SS
      allowNull: false,
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    StartDate: {
      type: DataTypes.DATEONLY, //  YYYY-MM-DD
      allowNull: false,
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: 'products', // exact mysql table name
    timestamps: false, // turn off `createdAt` and `updatedAt`
  }
);
export default Product;
