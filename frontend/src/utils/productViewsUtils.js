import {
	durationToSeconds,
	secondsToDuration,
	calculateAge,
	calculateMode,
} from './customerViewsUtils.js';

export const calculateProductStats = (data) => {
	console.log(`data.ScheduleRecords: `, data.ScheduleRecords);

	const scheduleRecords = [];
	const bookings = [];
	const participantAges = [];
	let totalRevenue = 0;
	let totalTimeInSeconds = 0;
	let totalAmount = 0;
	let totalParticipantsAmount = 0;
	let totalReviews = 0;
	let sumFeedbackRating = 0;
	let feedbackCount = 0;

	for (let schedule of data.ScheduleRecords) {
		totalAmount += 1;

		scheduleRecords.push({
			id: schedule.ScheduleID,
			date: schedule.Date,
			time: schedule.StartTime,
			location: schedule.Location,
		});

		if (schedule.Bookings.length > 0) {
			totalTimeInSeconds += durationToSeconds(data.Duration);
		}

		for (let booking of schedule.Bookings) {
			totalParticipantsAmount += 1;

			bookings.push({
				id: booking.BookingID,
				customer: `${booking.Customer.FirstName} ${booking.Customer.LastName}`,
				value: booking.AmountPaid,
			});

			totalRevenue += parseFloat(booking.AmountPaid);

			participantAges.push(calculateAge(booking.Customer.DoB));
		}

		if (schedule.Feedbacks && schedule.Feedbacks.length > 0) {
			totalReviews += schedule.Feedbacks.length;
			for (let feedback of schedule.Feedbacks) {
				sumFeedbackRating += feedback.Rating;
				feedbackCount++;
			}
		}
	}

	const splitDuration = secondsToDuration(totalTimeInSeconds);
	const formattedDuration = `${splitDuration.days != '00' ? splitDuration.days + ' dni' : ''} ${
		splitDuration.hours != '00' ? splitDuration.hours + ' godzin' : ''
	} ${splitDuration.minutes != '00' ? splitDuration.minutes + ' minut' : ''}`;

	let avgFeedbackScore = 0;
	if (feedbackCount > 0) {
		avgFeedbackScore = sumFeedbackRating / feedbackCount;
	}

	const modeAge = participantAges.length > 0 ? calculateMode(participantAges) : 'Brak danych';

	const stats = {
		totalSchedulesAmount: totalAmount,
		totalTime: formattedDuration,
		revenue: `${Math.round(totalRevenue * 100) / 100}zł`,
		totalParticipantsAmount: totalParticipantsAmount,
		avgParticipantsAmount: totalAmount ? Math.floor(totalParticipantsAmount / totalAmount) : 0,
		avgAttendancePercentage: `${
			(totalParticipantsAmount / (data.TotalSpaces * totalAmount)) * 100
		}%`,
		avgReviewersPercentage: `${Math.round((totalReviews / totalParticipantsAmount) * 100)}%`,
		modeParticipantsAge: modeAge,
		avgFeedbackScore: avgFeedbackScore,
	};
	return stats;
};
