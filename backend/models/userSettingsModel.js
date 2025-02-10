import {DataTypes} from 'sequelize';
import sequelizeDb from '../utils/db.js';

const UserPrefSettings = sequelizeDb.define(
	'UserPrefSettings',
	{
		UserPrefID: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
		},
		UserID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'users', // table name
				key: 'UserID',
			},
		},
		Handedness: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		FontSize: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		Theme: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		Notifications: {
			type: DataTypes.TINYINT(1),
			allowNull: true,
		},
		Animation: {
			type: DataTypes.TINYINT(1),
			allowNull: true,
		},
	},
	{
		tableName: 'user_pref_settings',
		timestamps: false,
	},
);

export default UserPrefSettings;
