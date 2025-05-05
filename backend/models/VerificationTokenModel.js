import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

const VerificationToken = sequelizeDb.define(
  'VerificationToken',
  {
    tokenId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'token_id',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'user_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    type: {
      type: DataTypes.ENUM('password', 'email'),
      allowNull: false,
      field: 'type',
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'token',
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expiration_date',
    },
    used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'used',
    },
  },
  {
    tableName: 'verification_tokens',
    timestamps: true,
    createdAt: 'creation_date',
    updatedAt: false,
  }
);

export default VerificationToken;
