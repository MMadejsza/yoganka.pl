import {DataTypes} from 'sequelize';
import sequelizeDb from '../utils/db.js';

const Customer = sequelizeDb.define(
	'Customer',
	{
		CustomerID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		UserID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'users', // The name of the target table
				key: 'UserID', // The name of the column in the target table
			},
		},
		CustomerType: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		FirstName: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		LastName: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		DoB: {
			type: DataTypes.DATEONLY, // YYYY-MM-DD
			allowNull: false,
		},
		PreferredContactMethod: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		Loyalty: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		ReferralSource: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		Notes: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		tableName: 'customers',
		timestamps: false,
	},
);
export default Customer;
