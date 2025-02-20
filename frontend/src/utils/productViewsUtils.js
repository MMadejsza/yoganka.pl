import {
	durationToSeconds,
	secondsToDuration,
	calculateAge,
	calculateMode,
} from './customerViewsUtils.js';

export const getWeekDay = (dateStr) => {
	const date = new Date(dateStr);
	const days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
	return days[date.getDay()];
};
export const formatIsoDateTime = (isoString) => {
	// Create object Date
	const date = new Date(isoString);

	// format [date] [time (hh:mm)]
	const formattedDate = date.toLocaleString('pl-PL', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
	let formattedTime;
	if (isoString?.length != 10) {
		formattedTime = date.toLocaleString('pl-PL', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		});
	} else formattedTime = '';

	// Concat
	return `${formattedDate} ${formattedTime}`;
};
export const calculateProductStats = (product, schedules) => {
	console.log(`schedules: `, schedules);

	const scheduleRecords = [];
	const bookings = [];
	const reviews = [];
	const participantAges = [];
	let totalRevenue = 0;
	let totalTimeInSeconds = 0;
	let totalAmount = 0;
	let totalParticipantsAmount = 0;
	let totalReviews = 0;
	let sumFeedbackRating = 0;
	let feedbackCount = 0;

	for (let schedule of schedules) {
		totalAmount += 1;

		scheduleRecords.push({
			ScheduleID: schedule.ScheduleID,
			Date: schedule.Date,
			StartTime: schedule.StartTime,
			Location: schedule.Location,
			bookingsNumber: schedule.Bookings.length,
		});

		if (schedule.Bookings.length > 0) {
			totalTimeInSeconds += durationToSeconds(product.Duration);
		}

		for (let booking of schedule.Bookings) {
			totalParticipantsAmount += 1;

			bookings.push({
				id: booking.BookingID,
				date: booking.Date,
				customer: `${booking.Customer.FirstName} ${booking.Customer.LastName}`,
				value: booking.AmountPaid,
				method: booking.PaymentMethod,
			});

			totalRevenue += parseFloat(booking.AmountPaid);

			participantAges.push(calculateAge(booking.Customer.DoB));
		}

		if (schedule.Feedbacks && schedule.Feedbacks.length > 0) {
			totalReviews += schedule.Feedbacks.length;
			for (let feedback of schedule.Feedbacks) {
				sumFeedbackRating += feedback.Rating;
				feedbackCount++;
				reviews.push({
					id: feedback.FeedbackID,
					date: feedback.SubmissionDate,
					customer: `${feedback.Customer.FirstName} ${feedback.Customer.LastName}`,
					rating: feedback.Rating,
					review: feedback.Text,
					delay: feedback.Delay,
				});
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
	const bookedScheduleRecords = scheduleRecords.filter((record) => record.bookingsNumber > 0);

	const stats = {
		totalScheduleRecords: scheduleRecords,
		totalBookings: bookings,
		reviews: reviews,
		totalSchedulesAmount: totalAmount,
		totalTime: formattedDuration,
		revenue: `${Math.round(totalRevenue * 100) / 100}zł`,
		totalParticipantsAmount: totalParticipantsAmount,
		avgParticipantsAmount: totalAmount
			? Math.round((totalParticipantsAmount / bookedScheduleRecords.length) * 100) / 100
			: 0,
		avgAttendancePercentage: `${Math.round(
			(totalParticipantsAmount / (product.TotalSpaces * bookedScheduleRecords.length)) * 100,
		)}%`,
		avgReviewersPercentage: `${Math.round((totalReviews / totalParticipantsAmount) * 100)}%`,
		modeParticipantsAge: modeAge,
		avgFeedbackScore: avgFeedbackScore,
	};
	return stats;
};
