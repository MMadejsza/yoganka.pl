import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

const Newsletter = sequelizeDb.define(
  'Newsletter',
  {
    NewsletterID: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    CreationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    SendDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'newsletters',
    timestamps: false,
  }
);
export default Newsletter;
