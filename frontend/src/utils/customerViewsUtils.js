export function calculateAge(dateString) {
	const birthDate = new Date(dateString);
	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();

	// Decrease if before birthday
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}
export const calculateMode = (agesArray) => {
	const frequency = {};
	let maxFreq = 0;
	let mode = null;

	// Count frequency of each age
	agesArray.forEach((age) => {
		frequency[age] = (frequency[age] || 0) + 1;
		if (frequency[age] > maxFreq) {
			maxFreq = frequency[age];
			mode = age;
		}
	});

	return mode;
};

//@ stats helpers
export function durationToSeconds(durationStr) {
	const [hours, minutes, seconds] = durationStr.split(':').map(Number);
	return hours * 3600 + minutes * 60 + seconds;
}

export function secondsToDuration(totalSeconds, limiter) {
	let days;
	if (limiter != 'hours') {
		days = Math.floor(totalSeconds / (24 * 3600));
		totalSeconds %= 24 * 3600;
	}
	const hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	// Leading zeros
	const dd = String(days); //.padStart(2, '0');
	const hh = String(hours); //.padStart(2, '0');
	const mm = String(minutes); //.padStart(2, '0');
	const ss = String(seconds); //.padStart(2, '0');

	if (limiter == 'hours') {
		return {hours: hh, minutes: mm, seconds: ss};
	}

	return {days: dd, hours: hh, minutes: mm, seconds: ss};
}
export const getWeekDay = (dateStr) => {
	const date = new Date(dateStr);
	const days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
	return days[date.getDay()];
};

//@ stats helper for calculation
export const calculateStats = (customer) => {
	// console.log(`calculateStats passed customer`, customer);
	const today = new Date().toISOString().split('T')[0];
	const scheduleRecords = [];
	// const scheduleRecords = [];
	const totalBookings = [];
	const invoices = [];
	const reviews = [];
	let totalRevenue = 0;
	let totalTimeInSeconds = 0;
	let totalCampsAmount = 0;
	let totalEventsAmount = 0;
	let totalClassesAmount = 0;
	let totalOnlineAmount = 0;
	let totalSchedulesAmount =
		totalCampsAmount + totalEventsAmount + totalClassesAmount + totalOnlineAmount;
	// console.log(customer.Bookings);
	for (let booking of customer.Bookings) {
		totalRevenue += parseFloat(booking.AmountPaid);
		// console.log(`totalRevenue: ${totalRevenue}`);

		totalBookings.push({
			id: booking.BookingID,
			date: booking.Date,
			classes: booking.Product,
			totalValue: booking.AmountPaid,
			method: booking.PaymentMethod,
			status: booking.PaymentStatus,
		});

		const invoice = booking.Invoice;
		if (invoice) {
			const invoiceID = invoice.InvoiceID;
			const invoiceBID = invoice.BookingID;
			const invoiceDate = invoice.InvoiceDate;
			const invoiceDue = invoice.DueDate;
			const invoiceTotalValue = invoice.TotalAmount;
			const invoiceStatus = invoice.PaymentStatus;

			invoices.push({
				id: invoiceID,
				bId: invoiceBID,
				date: invoiceDate,
				due: invoiceDue,
				totalValue: invoiceTotalValue,
				status: invoiceStatus,
			});
		}

		// console.groupEnd();
	}

	for (let bookedSchedule of customer.BookedSchedules?.filter(
		(schedule) => schedule.Attendance == 1 || schedule.Attendance == true,
	)) {
		// console.group(`schedule: ${schedule}`);
		const {ScheduleRecord: schedule} = bookedSchedule;
		const scheduleID = schedule.ScheduleID;
		const scheduleDate = schedule.Date;
		const scheduleStartTime = schedule.StartTime;
		const scheduleLocation = schedule.Location;

		const productType = schedule.Product.Type;
		const productName = schedule.Product.Name;
		const productDuration = schedule.Product.Duration;

		scheduleRecords.push({
			id: scheduleID,
			date: scheduleDate,
			day: getWeekDay(scheduleDate),
			time: scheduleStartTime,
			location: scheduleLocation,
			type: productType,
			name: productName,
			isUserGoing: true,
		});

		// console.log(`scheduleDate >= today ${scheduleDate} ${today}`);
		if (scheduleDate <= today) {
			totalSchedulesAmount += 1;
			// console.log(`totalSchedulesAmount: ${totalSchedulesAmount}`);
			// if (productType === 'Class') {
			// 	totalClassesAmount += 1;
			// 	// console.log(`totalClassesAmount: ${totalClassesAmount}`);
			// } else
			if (productType === 'Online' || productType === 'Class') {
				totalOnlineAmount += 1;
				// console.log(`totalOnlineAmount: ${totalOnlineAmount}`);
			} else if (productType === 'Event') {
				totalEventsAmount += 1;
				// console.log(`totalEventsAmount: ${totalEventsAmount}`);
			} else if (productType === 'Camp') {
				totalCampsAmount += 1;
				// console.log(`totalCampsAmount: ${totalCampsAmount}`);
			}
			totalTimeInSeconds += durationToSeconds(productDuration);
			// console.log(`totalTimeInSeconds: ${totalTimeInSeconds}`);
			// console.groupEnd();
		}

		if (schedule.Feedbacks && schedule.Feedbacks.length > 0) {
			const feedback = schedule.Feedbacks[0];
			reviews.push({
				id: feedback.FeedbackID,
				product: schedule.Product.Name,
				schedule: `
				(ID: ${scheduleID})
				${scheduleDate}
				${getWeekDay(scheduleDate)}
				${scheduleStartTime}
				`,
				date: feedback.SubmissionDate,
				rating: feedback.Rating,
				review: feedback.Text,
				delay: feedback.Delay,
			});
		}
	}

	const splitDuration = secondsToDuration(totalTimeInSeconds, 'hours');
	const stats = {
		records: scheduleRecords,
		bookings: totalBookings,
		recordsKeys: ['', 'id', 'date', 'day', 'time', 'type', 'name', 'location'],
		reviews: reviews,
		invoices: invoices,
		revenue: `${Math.round(totalRevenue * 100) / 100}zł`,
		schedulesAmount: {
			total: totalSchedulesAmount,
			breakdown: {
				classes: totalSchedulesAmount,
				online: totalOnlineAmount,
				events: totalEventsAmount,
				camps: totalCampsAmount,
			},
		},
		totalHours: `${splitDuration.hours}:${splitDuration.minutes}`,
	};
	return stats;
};
