import { DataTypes } from 'sequelize';
import sequelizeDb from '../utils/db.js';

const Feedback = sequelizeDb.define(
  'Feedback',
  {
    feedbackId: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      field: 'feedback_id',
    },
    customerId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'customer_id',
      references: {
        model: 'customers',
        key: 'customer_id',
      },
    },
    scheduleId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'schedule_id',
      references: {
        model: 'schedule_records',
        key: 'schedule_id',
      },
    },
    submissionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'submission_date',
    },
    rating: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'rating',
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'text',
    },
    delay: {
      type: DataTypes.STRING(5),
      allowNull: true,
      field: 'delay',
    },
  },
  {
    tableName: 'participant_feedbacks',
    timestamps: false,
  }
);

export default Feedback;
