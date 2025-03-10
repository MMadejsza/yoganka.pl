import {
	durationToSeconds,
	secondsToDuration,
	calculateAge,
	calculateMode,
	calculateMedian,
	getWeekDay as getWeekDayFromProduct,
} from './customerViewsUtils.js';

//@ stats helpers
export const getWeekDay = getWeekDayFromProduct;
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
	return `${formattedDate} | ${formattedTime}`;
};

//@ stats calculation
// export const calculateProductStats = (product, schedules) => {
// 	console.log(`schedules: `, schedules);

// 	const scheduleRecords = [];
// 	const bookings = [];
// 	const reviews = [];
// 	const participantAges = [];
// 	let totalRevenue = 0;
// 	let totalTimeInSeconds = 0;
// 	let totalAmount = 0;
// 	let totalParticipantsAmount = 0;
// 	let totalReviews = 0;
// 	let sumFeedbackRating = 0;
// 	let feedbackCount = 0;

// 	for (let schedule of schedules) {
// 		totalAmount += 1;

// 		scheduleRecords.push({
// 			ScheduleID: schedule.ScheduleID,
// 			Date: schedule.Date,
// 			StartTime: schedule.StartTime,
// 			Location: schedule.Location,
// 			bookingsNumber: schedule.Bookings.length,
// 		});

// 		if (schedule.Bookings.length > 0) {
// 			totalTimeInSeconds += durationToSeconds(product.Duration);
// 		}

// 		for (let booking of schedule.Bookings) {
// 			totalParticipantsAmount += 1;

// 			bookings.push({
// 				id: booking.BookingID,
// 				date: booking.Date,
// 				customer: `${booking.Customer.FirstName} ${booking.Customer.LastName}`,
// 				value: booking.AmountPaid,
// 				method: booking.PaymentMethod,
// 			});

// 			totalRevenue += parseFloat(booking.AmountPaid);

// 			participantAges.push(calculateAge(booking.Customer.DoB));
// 		}

// 		if (schedule.Feedbacks && schedule.Feedbacks.length > 0) {
// 			totalReviews += schedule.Feedbacks.length;
// 			for (let feedback of schedule.Feedbacks) {
// 				sumFeedbackRating += feedback.Rating;
// 				feedbackCount++;
// 				reviews.push({
// 					id: feedback.FeedbackID,
// 					date: feedback.SubmissionDate,
// 					customer: `${feedback.Customer.FirstName} ${feedback.Customer.LastName}`,
// 					rating: feedback.Rating,
// 					review: feedback.Text,
// 					delay: feedback.Delay,
// 				});
// 			}
// 		}
// 	}

// 	const splitDuration = secondsToDuration(totalTimeInSeconds);
// 	const formattedDuration = `${splitDuration.days != '00' ? splitDuration.days + ' dni' : ''} ${
// 		splitDuration.hours != '00' ? splitDuration.hours + ' godzin' : ''
// 	} ${splitDuration.minutes != '00' ? splitDuration.minutes + ' minut' : ''}`;

// 	let avgFeedbackScore = 0;
// 	if (feedbackCount > 0) {
// 		avgFeedbackScore = sumFeedbackRating / feedbackCount;
// 	}

// 	const modeAge = participantAges.length > 0 ? calculateMode(participantAges) : 'Brak danych';
// 	const bookedScheduleRecords = scheduleRecords.filter((record) => record.bookingsNumber > 0);

// 	const stats = {
// 		totalBookings: scheduleRecords,
// 		totalBookings: bookings,
// 		reviews: reviews,
// 		totalSchedulesAmount: totalAmount,
// 		totalTime: formattedDuration,
// 		revenue: `${Math.round(totalRevenue * 100) / 100}zł`,
// 		totalParticipantsAmount: totalParticipantsAmount,
// 		avgParticipantsAmount: totalAmount
// 			? Math.round((totalParticipantsAmount / bookedScheduleRecords.length) * 100) / 100
// 			: 0,
// 		avgAttendancePercentage: `${Math.round(
// 			(totalParticipantsAmount / (product.TotalSpaces * bookedScheduleRecords.length)) * 100,
// 		)}%`,
// 		avgReviewersPercentage: `${Math.round((totalReviews / totalParticipantsAmount) * 100)}%`,
// 		modeParticipantsAge: modeAge,
// 		avgFeedbackScore: avgFeedbackScore,
// 	};
// 	return stats;
// };
export const calculateProductStats = (product, schedules) => {
	const scheduleRecords = [];
	const bookings = [];
	const reviews = [];
	const participantAges = [];
	let totalRevenue = 0;
	let totalTimeInSeconds = 0;
	let totalCompletedSchedules = 0;
	let totalParticipantsAmount = 0;
	let totalReviews = 0;
	let sumFeedbackRating = 0;
	let feedbackCount = 0;

	const now = new Date();

	schedules.forEach((schedule) => {
		// Data object for schedules joining time and date
		const scheduleDateTime = new Date(`${schedule.Date}T${schedule.StartTime}:00`);
		// If it's not passed yet - skip
		if (scheduleDateTime > now) return;

		// We allow in statistics empty schedules - its valuable indicator
		totalCompletedSchedules++;

		scheduleRecords.push({
			ScheduleID: schedule.ScheduleID,
			Date: schedule.Date,
			StartTime: schedule.StartTime,
			Location: schedule.Location,
			bookingsNumber: schedule.Bookings.length,
		});

		// We accumulate time of these which have only passed
		if (schedule.Bookings.length > 0) {
			totalTimeInSeconds += durationToSeconds(product.Duration);
		}

		schedule.Bookings.forEach((booking) => {
			console.log(
				`\n➡️➡️➡️ calculateProductStats schedule.Bookings.forEach booking`,
				booking,
			);
			totalParticipantsAmount++;
			bookings.push({
				id: booking.BookingID,
				date: booking.Date,
				customer: `${booking.Customer.FirstName} ${booking.Customer.LastName}`,
				value: booking.AmountPaid,
				method: booking.PaymentMethod,
			});
			totalRevenue += parseFloat(booking.AmountPaid);
			participantAges.push(calculateAge(booking.Customer.DoB));
		});

		if (schedule.Feedbacks && schedule.Feedbacks.length > 0) {
			totalReviews += schedule.Feedbacks.length;
			schedule.Feedbacks.forEach((feedback) => {
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
			});
		}
	});

	const splitDuration = secondsToDuration(totalTimeInSeconds);
	const formattedDuration = `${splitDuration.days !== '00' ? splitDuration.days + ' dni ' : ''}${
		splitDuration.hours !== '00' ? splitDuration.hours + ' godzin ' : ''
	}${splitDuration.minutes !== '00' ? splitDuration.minutes + ' minut' : ''}`.trim();

	const avgFeedbackScore = feedbackCount > 0 ? sumFeedbackRating / feedbackCount : 0;
	const modeAge = participantAges.length > 0 ? calculateMode(participantAges) : 'Brak danych';

	// Liczymy statystyki tylko dla sesji, w których były rezerwacje
	const schedulesWithBookings = scheduleRecords.filter((record) => record.bookingsNumber > 0);
	const avgParticipantsAmount =
		schedulesWithBookings.length > 0
			? (totalParticipantsAmount / schedulesWithBookings.length).toFixed(2)
			: 0;
	const avgAttendancePercentage =
		schedulesWithBookings.length > 0
			? Math.round(
					(totalParticipantsAmount /
						(product.TotalSpaces * schedulesWithBookings.length)) *
						100,
			  )
			: 0;
	const avgReviewersPercentage =
		totalParticipantsAmount > 0
			? Math.round((totalReviews / totalParticipantsAmount) * 100)
			: 0;

	const stats = {
		totalBookings: scheduleRecords,
		totalBookings: bookings,
		reviews: reviews,
		totalSchedulesAmount: totalCompletedSchedules,
		totalTime: formattedDuration,
		revenue: `${Math.round(totalRevenue * 100) / 100}zł`,
		totalParticipantsAmount: totalParticipantsAmount,
		avgParticipantsAmount: avgParticipantsAmount,
		avgAttendancePercentage: `${avgAttendancePercentage}%`,
		avgReviewersPercentage: `${avgReviewersPercentage}%`,
		modeParticipantsAge: modeAge,
		avgFeedbackScore: avgFeedbackScore,
	};

	return stats;
};
export const calculateScheduleStats = (product, schedule) => {
	// Inicjalizacja zmiennych statystycznych
	const attendedBookings = [];
	const totalBookings = [];
	const reviews = [];
	const participantAges = [];
	let totalRevenue = 0;
	let totalTimeInSeconds = 0;
	let totalBookingsAmount = 0;
	let attendedBookingsAmount = 0;
	let totalReviews = 0;
	let sumFeedbackRating = 0;
	let feedbackCount = 0;

	const now = new Date();

	// Kluczowa zmiana:
	// Używamy BookedSchedules (z atrybutem Attendance) do określenia faktycznego uczestnictwa
	const attendedRecords = schedule
		? schedule.BookedSchedules.filter((abs) => abs.Attendance === true || abs.Attendance === 1)
		: [];

	schedule.BookedSchedules.forEach((bs) => {
		// Tworzymy obiekt Date z daty i godziny terminu
		const scheduleDateTime = new Date(`${bs.Date}T${bs.StartTime}:00`);
		// Uważamy termin za "odbyte", jeśli jego data już minęła
		if (scheduleDateTime > now) return;
		totalBookingsAmount++;
		// Sumujemy czas trwania zajęć tylko wtedy, gdy są potwierdzeni uczestnicy
		if (attendedRecords.length > 0) {
			totalTimeInSeconds += durationToSeconds(product.Duration);
		}
		// Liczymy przychód na podstawie wszystkich rezerwacji, niezależnie od tego, czy użytkownik przyszedł
		totalBookings.push(bs.Booking);
		totalRevenue += parseFloat(bs.Booking.AmountPaid);
	});

	// Przetwarzamy dane z potwierdzonych uczestnictw (BookedSchedules)
	attendedRecords.forEach((record) => {
		attendedBookingsAmount++;
		participantAges.push(calculateAge(record.Customer.DoB));

		attendedBookings.push({
			id: record.BookingID, // Zakładamy, że rekord BookedSchedule zawiera odniesienie do BookingID
			date: record.Booking.Date || bs.Date, //! Jeśli dostępna, inaczej używamy daty terminu
			customer: `${record.Customer.FirstName} ${record.Customer.LastName}`,
			value: record.Booking.AmountPaid, // Informacja z BookedSchedule – dla odniesienia (nie wpływa na revenue)
			method: record.Booking.PaymentMethod,
		});
	});

	// Przetwarzamy opinie – logika pozostaje bez zmian
	if (schedule.Feedbacks && schedule.Feedbacks.length > 0) {
		totalReviews += schedule.Feedbacks.length;
		schedule.Feedbacks.forEach((feedback) => {
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
		});
	}

	const splitDuration = secondsToDuration(totalTimeInSeconds);
	const formattedDuration = `${splitDuration.days !== '00' ? splitDuration.days + ' dni ' : ''}${
		splitDuration.hours !== '00' ? splitDuration.hours + ' godzin ' : ''
	}${splitDuration.minutes !== '00' ? splitDuration.minutes + ' minut' : ''}`.trim();

	const avgFeedbackScore = feedbackCount > 0 ? sumFeedbackRating / feedbackCount : 0;
	console.log(`✅✅participantAges`, participantAges);
	console.log(`✅✅calculateMode(participantAges)`, calculateMode(participantAges));
	const medianAge = participantAges.length > 0 ? calculateMedian(participantAges) : 'Brak danych';

	// Uśredniamy na podstawie liczby minionych terminów (nawet pustych)

	console.log(
		`➡️ stats avgAttendancePercentage = ${attendedBookingsAmount}/${product.TotalSpaces}`,
	);
	const avgAttendancePercentage =
		attendedBookingsAmount > 0
			? Math.round((attendedBookingsAmount / schedule.Capacity) * 100)
			: 0;
	const avgReviewersPercentage =
		attendedBookingsAmount > 0 ? Math.round((totalReviews / attendedBookingsAmount) * 100) : 0;

	const stats = {
		totalBookings: totalBookings, // Zawiera wszystkie minione terminy, nawet puste
		totalBookingsAmount: totalBookingsAmount,
		attendedBookings: attendedBookings, // Dane tylko z potwierdzonych uczestnictw (BookedSchedules)
		totalParticipantsAmount: attendedBookingsAmount,
		medianParticipantsAge: medianAge,
		avgAttendancePercentage: `${avgAttendancePercentage}%`,
		reviews: reviews,
		avgReviewersPercentage: `${avgReviewersPercentage}%`,
		avgFeedbackScore: avgFeedbackScore,
		totalTime: formattedDuration,
		revenue: `${Math.round(totalRevenue * 100) / 100}zł`, // Przychód liczony na podstawie rezerwacji (Bookings)
	};

	return stats;
};
