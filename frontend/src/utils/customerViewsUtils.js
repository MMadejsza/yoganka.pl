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

//@ stats helpers
function durationToSeconds(durationStr) {
	const [hours, minutes, seconds] = durationStr.split(':').map(Number);
	return hours * 3600 + minutes * 60 + seconds;
}

function secondsToDuration(totalSeconds) {
	const hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	// leading zero
	const hh = String(hours).padStart(2, '0');
	const mm = String(minutes).padStart(2, '0');
	const ss = String(seconds).padStart(2, '0');
	return `${hh}:${mm}:${ss}`;
}
//@ stats helper for calculation
export const calculateStats = (customer) => {
	const scheduleRecords = [];
	const invoices = [];
	let totalRevenue = 0;
	let totalTimeInSeconds = 0;
	let totalCampsAmount = 0;
	let totalEventsAmount = 0;
	let totalClassesAmount = 0;
	let totalOnlineAmount = 0;
	let totalSchedulesAmount =
		totalCampsAmount + totalEventsAmount + totalClassesAmount + totalOnlineAmount;
	for (let booking of customer.Bookings) {
		// console.group(`booking: ${booking}`);
		totalRevenue += parseFloat(booking.AmountPaid);
		// console.log(`totalRevenue: ${totalRevenue}`);

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

		for (let schedule of booking.ScheduleRecords) {
			// console.group(`schedule: ${schedule}`);

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
				time: scheduleStartTime,
				location: scheduleLocation,
				type: productType,
				name: productName,
			});

			totalSchedulesAmount += 1;
			// console.log(`totalSchedulesAmount: ${totalSchedulesAmount}`);
			if (productType === 'Class') {
				totalClassesAmount += 1;
				// console.log(`totalClassesAmount: ${totalClassesAmount}`);
			} else if (productType === 'Online') {
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
		// console.groupEnd();
	}

	const stats = {
		records: scheduleRecords,
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
		totalHours: secondsToDuration(totalTimeInSeconds),
	};
	return stats;
};
