import * as models from '../models/_index.js';

export const showScheduleByID = (req, res, next) => {
	console.log(`➡️ called showScheduleByID`);

	const PK = req.params.id;
	models.ScheduleRecord.findByPk(PK, {
		include: [
			{
				model: models.Product,
				required: true,
			},
			{
				model: models.Booking, // Booking which has relation through BookedSchedule
				through: {attributes: []}, // omit data from mid table
				required: false,
				attributes: {
					exclude: ['Product', 'CustomerID'],
				},
			},
			{
				model: models.Feedback,
				required: false,
				include: [
					{
						model: models.Customer,
						attributes: {exclude: ['UserID']},
					},
				],
				attributes: {exclude: ['CustomerID']},
			},
		],
	})
		.then((scheduleData) => {
			if (!scheduleData) {
				return res.redirect('/grafik');
			}

			// Convert to JSON
			const schedule = scheduleData.toJSON();

			// We substitute bookings content for security
			if (schedule.Bookings) {
				schedule.Bookings = schedule.Bookings.length;
			}

			return res.status(200).json({isLoggedIn: req.session.isLoggedIn, schedule});
		})
		.catch((err) => console.log(err));
};
