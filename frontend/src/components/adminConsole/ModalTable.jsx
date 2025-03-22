function ModalTable({
	headers,
	content,
	keys,
	active,
	classModifier,
	onOpen,
	onQuickAction,
	status,
	isAdminPage,
	adminActions,
}) {
	const today = new Date();
	console.log('ModalTable content', content);
	console.log('ModalTable status', status);

	const symbol = (row, isArchived, symbol) => {
		if (isAdminPage && adminActions) {
			return symbol;
		} else if (
			status?.isLoggedIn &&
			(status?.role === 'CUSTOMER' || status?.role === 'ADMIN')
		) {
			if (row.isUserGoing) return 'check';
			else if (row.full || isArchived) return 'block';
			else if (row.wasUserReserved) return 'cycle';
			else return 'shopping_bag_speed';
		}
		return 'lock_person';
	};

	const onRowBtnClick = (row, archived, method, e) => {
		const isUserGoing = row.isUserGoing != undefined ? row.isUserGoing : false;
		const isLoggedIn = status?.isLoggedIn != undefined ? status.isLoggedIn : 'N/A';
		const isArchived = archived != undefined ? archived : 'N/A';
		const isAuthorized =
			status?.role != undefined
				? status?.role === 'CUSTOMER' || status?.role === 'ADMIN'
				: 'N/A';

		console.log('onRowBtnClick:', {
			isUserGoing: isUserGoing,
			isLoggedIn: isLoggedIn,
			isArchived,
			role: status?.role,
			isAuthorized,
			method: method,
		});
		if (!isUserGoing && isLoggedIn && !isArchived && isAuthorized) {
			e.stopPropagation();
			method({
				customerDetails: '',
				schedule: row['ID'],
				product: row['Nazwa'],
				status: 'Paid',
				amountPaid: row['Zadatek'],
				amountDue: 0,
				paymentMethod: 'Credit Card',
				paymentStatus: 'Completed',
				attendanceCustomerID: row.customerID,
				attendanceBookingID: row.id,
				cancelledAttendanceCustomerID: row.CustomerID,
				cancelledAttendanceBookingID: row.BookingID,
				deleteScheduleID: row.id,
				isDisabled: row.isActionDisabled,
			});
		}
		return null;
	};

	return (
		<table className={`data-table ${classModifier ? `data-table--${classModifier}` : ''}`}>
			<thead className='data-table__headers'>
				<tr>
					{headers.map((header, index) => (
						<th
							className='data-table__single-header'
							key={index}>
							{header}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{content.map((row, rowIndex) => {
					const isArchived =
						new Date(
							`${row.Data?.split('.').reverse().join('-')}T${
								row.Godzina ?? '00:00:00'
							}`,
						) < today;
					// console.log(
					// 	`${row.Data?.split('.').reverse().join('-')}T${row.Godzina ?? '00:00:00'}`,
					// );
					// console.log(`isArchived`, isArchived);
					return (
						<tr
							className={`data-table__cells ${active ? 'active' : ''}  ${
								classModifier ? `data-table__cells--${classModifier}` : ''
							} ${
								!isAdminPage
									? row.isUserGoing && status?.isLoggedIn
										? 'booked'
										: ''
									: ''
							} ${
								!isAdminPage ? (isArchived && !isAdminPage ? 'archived' : '') : ''
							} ${row.full && !isAdminPage && 'full'}`}
							key={rowIndex}>
							{keys.map((key, keyIndex) => {
								let value = row[key];
								if (row[key] == 'date') {
									value = new Date(row.date).toISOString().slice(0, 10);
								}
								if (key == '') {
									value = (
										<div className='action-btns'>
											{onQuickAction?.map((action, index) => (
												<button
													key={index}
													className={`form-action-btn table-form-btn table-form-btn--submit`}>
													<span
														className={`material-symbols-rounded nav__icon ${
															row.isActionDisabled === true
																? 'dimmed'
																: ''
														} ${
															action.extraClass
																? action.extraClass
																: ''
														}`}
														onClick={(e) =>
															onRowBtnClick(
																row,
																isArchived,
																action.method,
																e,
															)
														}>
														{symbol(row, isArchived, action.symbol)}
													</span>
												</button>
											))}
										</div>
									);
								}
								return (
									<td
										onClick={() => {
											if (active) return onOpen(row);
											return null;
										}}
										className={`data-table__single-cell ${
											classModifier
												? `data-table__single-cell--${classModifier}`
												: ''
										}${key == 'Hasło (Szyfrowane)' ? 'hash' : ''}`}
										key={keyIndex}>
										{value || '-'}
									</td>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}

export default ModalTable;
