import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

export const SubscribedNewsletter = sequelizeDb.define(
  'SubscribedNewsletter',
  {
    newsletterId: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      field: 'newsletter_id',
    },
    userId: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      field: 'user_id',
    },
    subscriptionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'subscription_date',
    },
    subscriptionStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'subscription_status',
    },
  },
  {
    tableName: 'subscribed_newsletters',
    timestamps: false,
  }
);

export default SubscribedNewsletter;
