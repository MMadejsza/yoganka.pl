import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

const VerificationToken = sequelizeDb.define(
  'VerificationToken',
  {
    TokenID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Type: {
      type: DataTypes.ENUM('password', 'email'),
      allowNull: false,
    },
    Token: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ExpirationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'verification_tokens',
    timestamps: true,
    createdAt: 'CreationDate',
    updatedAt: false,
  }
);

export default VerificationToken;
