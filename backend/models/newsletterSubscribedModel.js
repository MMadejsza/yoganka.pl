import {DataTypes} from 'sequelize';
import sequelizeDb from '../utils/db.js';

export const SubscribedNewsletter = sequelizeDb.define(
	'SubscribedNewsletter',
	{
		NewsletterID: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,

			allowNull: false,
		},
		UserID: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,

			allowNull: false,
		},
		SubscriptionDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		SubscriptionStatus: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		tableName: 'subscribed_newsletter',
		timestamps: false,
	},
);

export default SubscribedNewsletter;
