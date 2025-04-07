import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

const UserPrefSetting = sequelizeDb.define(
  'UserPrefSetting',
  {
    userPrefId: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      field: 'user_pref_id',
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users', // tabel
        key: 'user_id', // in db
      },
    },
    handedness: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'handedness',
    },
    fontSize: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'font_size',
    },
    theme: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'theme',
    },
    notifications: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'notifications',
      defaultValue: true,
    },
    animation: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'animation',
    },
  },
  {
    tableName: 'user_pref_settings',
    timestamps: false,
  }
);

export default UserPrefSetting;
