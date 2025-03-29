import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

const ScheduleRecord = sequelizeDb.define(
  'ScheduleRecord',
  {
    scheduleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'schedule_id', // MySQL column name
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id',
      references: {
        model: 'products', // The name of the target table
        key: 'product_id', // The name of the column in the target table
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'date',
    },
    startTime: {
      type: DataTypes.STRING(5),
      allowNull: false,
      field: 'start_time',
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'location',
    },
    capacity: {
      type: DataTypes.INTEGER,
      field: 'capacity',
    },
  },
  {
    tableName: 'schedule_records', // exact mysql table name
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['product_id', 'date', 'start_time', 'location'], // unique constraint
      },
    ],
  }
);

export default ScheduleRecord;
