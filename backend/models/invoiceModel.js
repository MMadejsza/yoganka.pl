import {DataTypes} from 'sequelize';
import sequelizeDb from '../utils/db.js';

const Invoice = sequelizeDb.define(
	'Invoice',
	{
		InvoiceID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		BookingID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Booking', // The name of the target table
				key: 'BookingID', // The name of the column in the target table
			},
		},
		InvoiceDate: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		DueDate: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		TotalAmount: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		PaymentStatus: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
	},
	{
		tableName: 'invoices',
		timestamps: false,
	},
);
export default Invoice;
