function DetailsCustomerInvoices({invoicesArray, noInvoices}) {
	return (
		<>
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
					{invoicesArray.map((invoice, index) => (
						<li
							key={index}
							className='schedules__record'>
							<div className='schedules__record-content'>{invoice.id}</div>
							<div className='schedules__record-content'>{invoice.bId}</div>
							<div className='schedules__record-content'>{invoice.date}</div>
							<div className='schedules__record-content'>{invoice.due}</div>
							<div className='schedules__record-content'>{invoice.totalValue}</div>
							<div className='schedules__record-content'>{invoice.status}</div>
						</li>
					))}
				</ul>
			) : (
				<div style={{fontWeight: 'bold', fontSize: '2rem'}}>Brak</div>
			)}
		</>
	);
}

export default DetailsCustomerInvoices;
