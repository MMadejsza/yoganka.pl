import DetailsCustomer from './DetailsCustomer.jsx';
import DetailsUser from './DetailsUser.jsx';
import DetailsUserSettings from './DetailsUserSettings.jsx';

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
const stats = (customer) => {
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

function ViewCustomer({data}) {
	console.clear();
	console.log(
		`📝 
        customer object from backend:`,
		data,
	);
	const user = data.customer.User;
	const customer = data.customer;
	const name = customer ? `${customer.FirstName} ${customer.LastName}` : user.Login;

	const customerStats = stats(customer);
	const campsNumber = customerStats.schedulesAmount.breakdown.camps;
	const eventsNumber = customerStats.schedulesAmount.breakdown.events;
	const classesNumber = customerStats.schedulesAmount.breakdown.classes;
	const onlineNumber = customerStats.schedulesAmount.breakdown.online;

	const noInvoices = customerStats.invoices.length > 0 ? false : true;
	return (
		<>
			<h1 className='user-container__user-title modal__title'>{name}</h1>
			<div className='user-container__main-details modal-checklist'>
				<DetailsCustomer customerData={customer} />
			</div>
			<div className='user-container__side-details modal-checklist'>
				<DetailsUser
					userData={user}
					customerView={true}
				/>

				{user.UserPrefSetting && (
					<DetailsUserSettings settingsData={user.UserPrefSetting} />
				)}
			</div>

			{/*//@ Schedules */}
			<div className='user-container__main-details user-container__side-details--schedules schedules modal-checklist'>
				{/*PODSUMOWANIE Kasa total, terminy total, campy/eventy/clasy total, godziny total  */}
				<h2 className='user-container__section-title modal__title--day'>Statystyki:</h2>
				<ul className='schedules__summary'>
					<li className='schedules__summary-datum'>
						<div className='schedules__summary-label'>Całkowity dochód:</div>
						<div className='schedules__summary-content'>{customerStats.revenue}</div>
					</li>
					<li className='schedules__summary-datum'>
						<div className='schedules__summary-label'>Ilość terminów:</div>
						<div className='schedules__summary-content'>
							{customerStats.schedulesAmount.total}
						</div>
					</li>
					<li className='schedules__summary-datum'>
						<div className='schedules__summary-label'>Campy/Eventy/Zajęcia/Online:</div>
						<div className='schedules__summary-content'>{`${campsNumber}/${eventsNumber}/${classesNumber}/${onlineNumber}`}</div>
					</li>
					<li className='schedules__summary-datum'>
						<div className='schedules__summary-label'>Ilość godzin yogi:</div>
						<div className='schedules__summary-content'>{customerStats.totalHours}</div>
					</li>
				</ul>
				<h2 className='user-container__section-title modal__title--day'>
					Zarezerwowane terminy:
				</h2>
				{/*REKORDY data godzina miejsce typ productNazwa  */}
				<ul className='schedules__records'>
					<li className='schedules__record schedules__record--header'>
						<div className='schedules__record-content'>ID</div>
						<div className='schedules__record-content'>Data</div>
						<div className='schedules__record-content'>Godzina</div>
						<div className='schedules__record-content'>Lokacja</div>
						<div className='schedules__record-content'>Typ</div>
						<div className='schedules__record-content'>Nazwa</div>
					</li>
					{customerStats.records.map((record, index) => (
						<li
							key={index}
							className='schedules__record'>
							<div className='schedules__record-content'>{record.id}</div>
							<div className='schedules__record-content'>{record.date}</div>
							<div className='schedules__record-content'>{record.time}</div>
							<div className='schedules__record-content'>{record.location}</div>
							<div className='schedules__record-content'>{record.type}</div>
							<div className='schedules__record-content'>{record.name}</div>
						</li>
					))}
				</ul>
			</div>
			{/*//@ Invoices */}

			<div
				className={`user-container__${
					noInvoices ? 'side' : 'main'
				}-details user-container__side-details--schedules schedules modal-checklist`}>
				<h2 className='user-container__section-title modal__title--day'>Faktury:</h2>
				{!noInvoices ? (
					<ul className='schedules__records'>
						<li className='schedules__record schedules__record--header'>
							<div className='schedules__record-content'>ID</div>
							<div className='schedules__record-content'>ID Rezerwacji</div>
							<div className='schedules__record-content'>Wystawiona</div>
							<div className='schedules__record-content'>Termin płatności</div>
							<div className='schedules__record-content'>Kwota całkowita</div>
							<div className='schedules__record-content'>Status</div>
						</li>
						{customerStats.invoices.map((invoice, index) => (
							<li
								key={index}
								className='schedules__record'>
								<div className='schedules__record-content'>{invoice.id}</div>
								<div className='schedules__record-content'>{invoice.bId}</div>
								<div className='schedules__record-content'>{invoice.date}</div>
								<div className='schedules__record-content'>{invoice.due}</div>
								<div className='schedules__record-content'>
									{invoice.totalValue}
								</div>
								<div className='schedules__record-content'>{invoice.status}</div>
							</li>
						))}
					</ul>
				) : (
					<div style={{fontWeight: 'bold', fontSize: '2rem'}}>Brak</div>
				)}
			</div>
		</>
	);
}

export default ViewCustomer;
