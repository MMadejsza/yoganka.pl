function ModalTable({
	headers,
	content,
	keys,
	active,
	classModifier,
	onOpen,
	onQuickBook,
	status,
	isAdminPage,
}) {
	const today = new Date();
	console.log('ModalTable content', content);
	console.log('ModalTable status', status);

	const symbol = (row, isArchived) => {
		if (status?.isLoggedIn && (status?.role === 'CUSTOMER' || status?.role === 'ADMIN')) {
			if (row.isUserGoing) return 'check';
			else if (row.full || isArchived) return 'block';
			else if (row.wasUserReserved) return 'cycle';
			else return 'shopping_bag_speed';
		}
		return 'lock_person';
	};

	const onClickAction = (row, isArchived) => {
		if (
			!row.isUserGoing &&
			status?.isLoggedIn &&
			!isArchived &&
			(status?.Role === 'CUSTOMER' || status?.Role === 'ADMIN')
		) {
			return (e) => {
				e.stopPropagation();
				onQuickBook({
					scheduleID: row['ID'],
					productName: row['Nazwa'],
					productPrice: row['Zadatek'],
				});
			};
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
					const isArchived = new Date(row.Data?.split('.').reverse().join('-')) < today;

					return (
						<tr
							className={`data-table__cells ${active ? 'active' : ''}  ${
								classModifier ? `data-table__cells--${classModifier}` : ''
							} ${row.isUserGoing && status?.isLoggedIn ? 'booked' : ''} ${
								isArchived && !isAdminPage ? 'archived' : ''
							} ${row.full && !isAdminPage && 'full'}`}
							key={rowIndex}>
							{keys.map((key, keyIndex) => {
								let value = row[key];
								if (row[key] == 'date') {
									value = new Date(row.date).toISOString().slice(0, 10);
								}
								if (key == '') {
									value = (
										<span
											className='material-symbols-rounded nav__icon nav__icon--side account'
											onClick={() => onClickAction(row, isArchived)}>
											{symbol(row, isArchived)}
										</span>
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
