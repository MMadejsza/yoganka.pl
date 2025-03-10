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
export const calculateProductStats = (product, schedules) => {
	console.log(`schedules: `, schedules);

	const scheduleRecords = [];
	const bookings = [];
	const attendances = [];
	const reviews = [];
	const participantAges = [];
	const sessionParticipantsArr = [];
	const sessionReviewersPercentageArr = [];

	let totalRevenue = 0;
	let totalTimeInSeconds = 0;
	let totalSchedules = 0;
	let totalParticipantsAmount = 0;
	let totalCapacity = 0;
	let totalReviews = 0;
	let sumFeedbackRating = 0;
	let feedbackCount = 0;

	// @ SCHEDULE Level
	for (let schedule of schedules) {
		totalSchedules += 1;
		totalCapacity += schedule.Capacity;

		let sessionReviewsCount = 0;
		if (schedule.Feedbacks && schedule.Feedbacks.length > 0) {
			totalReviews += schedule.Feedbacks.length;
			sessionReviewsCount = schedule.Feedbacks.length;
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

		const allBookings = schedule.Bookings ?? [];
		let scheduleParticipantsAmount = 0;
		let scheduleAttendance = 0;
		if (allBookings.length > 0) {
			totalTimeInSeconds += durationToSeconds(product.Duration);

			// # BOOKING Level
			for (let booking of allBookings) {
				totalRevenue += parseFloat(booking.AmountPaid);
				participantAges.push(calculateAge(booking.Customer.DoB));
				const precessedBooking = {
					id: booking.BookingID,
					date: booking.Date,
					customer: `${booking.Customer.FirstName} ${booking.Customer.LastName}`,
					value: booking.AmountPaid,
					method: booking.PaymentMethod,
					attended: 0,
				};

				if (booking.BookedSchedule?.Attendance == true) {
					scheduleParticipantsAmount += 1;
					totalParticipantsAmount += 1;
					precessedBooking.attended = 1;
				}
				bookings.push(precessedBooking);
			}
			scheduleAttendance = Math.round((scheduleParticipantsAmount / schedule.Capacity) * 100);
		}
		attendances.push(scheduleAttendance);
		sessionParticipantsArr.push(scheduleParticipantsAmount);
		let sessionReviewersPercentage = 0;
		if (scheduleParticipantsAmount > 0) {
			sessionReviewersPercentage = (sessionReviewsCount / scheduleParticipantsAmount) * 100;
		}
		sessionReviewersPercentageArr.push(sessionReviewersPercentage);

		scheduleRecords.push({
			ScheduleID: schedule.ScheduleID,
			Date: schedule.Date,
			StartTime: schedule.StartTime,
			Location: schedule.Location,
			bookingsNumber: schedule.Bookings.length,
			participants: scheduleParticipantsAmount,
			capacity: schedule.Capacity,
			attendance: scheduleAttendance,
		});
	}

	const splitDuration = secondsToDuration(totalTimeInSeconds);
	const formattedDuration = `${splitDuration.days != '00' ? splitDuration.days + ' dni' : ''} ${
		splitDuration.hours != '00' ? splitDuration.hours + ' godzin' : ''
	} ${splitDuration.minutes != '00' ? splitDuration.minutes + ' minut' : ''}`;

	let avgFeedbackScore = 0;
	if (feedbackCount > 0) {
		avgFeedbackScore = sumFeedbackRating / feedbackCount;
	}

	// Global
	const medianAge = participantAges.length > 0 ? calculateMedian(participantAges) : 'Brak danych';

	// Per schedule
	const avgParticipantsAmountPerSesh =
		sessionParticipantsArr.length > 0
			? Math.round(
					(sessionParticipantsArr.reduce((acc, cur) => acc + cur, 0) /
						sessionParticipantsArr.length) *
						100,
			  ) / 100
			: 0;
	const medianParticipantsAmountPerSesh =
		sessionParticipantsArr.length > 0
			? Math.round(calculateMedian(sessionParticipantsArr) * 100) / 100
			: 0;

	const avgAttendancePercentagePerSeshValue =
		attendances.length > 0
			? Math.round(
					(attendances.reduce((acc, cur) => acc + cur, 0) / attendances.length) * 100,
			  ) / 100
			: 0;
	const avgAttendancePercentagePerSesh = `${avgAttendancePercentagePerSeshValue}%`;
	const medianAttendancePercentagePerSeshValue =
		attendances.length > 0 ? Math.round(calculateMedian(attendances) * 100) / 100 : 0;
	const medianAttendancePerSesh = `${medianAttendancePercentagePerSeshValue}%`;

	const avgReviewersPercentageValue =
		sessionReviewersPercentageArr.length > 0
			? Math.round(
					(sessionReviewersPercentageArr.reduce((acc, cur) => acc + cur, 0) /
						sessionReviewersPercentageArr.length) *
						100,
			  ) / 100
			: 0;
	const avgReviewersPercentage = `${avgReviewersPercentageValue}%`;
	const medianReviewersPercentageValue =
		sessionReviewersPercentageArr.length > 0
			? Math.round(calculateMedian(sessionReviewersPercentageArr) * 100) / 100
			: 0;
	const medianReviewersPercentage = `${medianReviewersPercentageValue}%`;

	const stats = {
		scheduleRecords: scheduleRecords, // Podsumowanie sesji
		bookings: bookings, // Lista rezerwacji
		reviews: reviews,
		totalSchedulesAmount: totalSchedules,
		totalTime: formattedDuration,
		revenue: `${Math.round(totalRevenue * 100) / 100}zł`,
		medianParticipantsAge: medianAge,
		totalParticipantsAmount: totalParticipantsAmount,
		avgParticipantsAmountPerSesh: avgParticipantsAmountPerSesh, // Średnia liczba uczestników/termin
		medianParticipantsAmountPerSesh: medianParticipantsAmountPerSesh, // Mediana liczby uczestników/termin
		avgAttendancePercentagePerSesh: avgAttendancePercentagePerSesh, // Średnia frekwencja/termin
		medianAttendancePerSesh: medianAttendancePerSesh, // Mediana frekwencji/termin
		avgReviewersPercentage: avgReviewersPercentage, // Średni % opinii/termin
		medianReviewersPercentage: medianReviewersPercentage, // Mediana % opinii/termin
		avgFeedbackScore: Math.round(avgFeedbackScore * 100) / 100,
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
		? schedule.BookedSchedules?.filter((abs) => abs.Attendance === true || abs.Attendance === 1)
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
