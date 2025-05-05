import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

const Newsletter = sequelizeDb.define(
  'Newsletter',
  {
    newsletterId: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      field: 'newsletter_id',
    },
    status: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      field: 'status',
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'creation_date',
    },
    sendDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'send_date',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'title',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'content',
    },
  },
  {
    tableName: 'newsletters',
    timestamps: false,
  }
);

export default Newsletter;
