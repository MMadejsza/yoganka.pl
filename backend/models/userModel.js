import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

const User = sequelizeDb.define(
  'User',
  {
    userId: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      field: 'user_id',
    },
    registrationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'registration_date',
      get() {
        const rawValue = this.getDataValue('registrationDate');
        return rawValue ? rawValue.toISOString() : null;
      },
    },
    lastLoginDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login_date',
      get() {
        const rawValue = this.getDataValue('lastLoginDate');
        return rawValue ? rawValue.toISOString() : null;
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'email',
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'role',
    },
    profilePictureSrcSetJson: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'profile_picture_src_set_json',
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'email_verified',
    },
  },
  {
    tableName: 'users',
    timestamps: false,
  }
);

export default User;
