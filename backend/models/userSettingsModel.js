import { DataTypes } from 'sequelize';
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
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    FontSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Theme: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Notifications: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Animation: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    tableName: 'user_pref_settings',
    timestamps: false,
  }
);

export default UserPrefSettings;
