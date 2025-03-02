import {DataTypes} from 'sequelize';
import sequelizeDb from '../utils/db.js';

const User = sequelizeDb.define(
	'User',
	{
		UserID: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
		},
		RegistrationDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		PasswordHash: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		LastLoginDate: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		Email: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		Role: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		ProfilePictureSrcSetJSON: {
			type: DataTypes.JSON,
			allowNull: true,
		},
	},
	{
		tableName: 'users',
		timestamps: false,
	},
);

export default User;
