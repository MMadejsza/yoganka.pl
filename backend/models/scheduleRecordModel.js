import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

const ScheduleRecord = sequelizeDb.define(
  'ScheduleRecord',
  {
    ScheduleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ProductID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products', // The name of the target table
        key: 'ProductID', // The name of the column in the target table
      },
    },
    Date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    StartTime: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    Location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Capacity: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: 'schedule_records',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['ProductID', 'Date', 'StartTime', 'Location'],
      },
    ],
  }
);

export default ScheduleRecord;
