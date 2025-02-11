import {DataTypes} from 'sequelize';
import sequelizeDb from '../utils/db.js'; // Zakładając, że `sequelizeDb` to Twoja instancja Sequelize

export const Feedback = sequelizeDb.define(
	'Feedback',
	{
		FeedbackID: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
		},
		CustomerID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'Customer',
				key: 'CustomerID', // Zakładając, że kolumna w tabeli `customers` to `customerID`
			},
		},
		ScheduleID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'ScheduleRecord', // zakładając, że masz tabelę `schedules`
				key: 'ScheduleID',
			},
		},
		SubmissionDate: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		Rating: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
		},
		Text: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		Delay: {
			type: DataTypes.STRING(5),
			allowNull: true,
		},
	},
	{
		tableName: 'participant_feedback',
		timestamps: false,
	},
);

export default Feedback;
