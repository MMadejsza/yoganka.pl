function ModalTable({headers, content, keys, active, classModifier, onOpen, onQuickBook, status}) {
	const today = new Date();

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
							} ${row.bookedByUser && status?.isLoggedIn ? 'booked' : ''} ${
								isArchived ? 'archived' : ''
							} ${row.full && 'full'}`}
							key={rowIndex}>
							{keys.map((key, keyIndex) => {
								let value = row[key];
								if (row[key] == 'date') {
									value = new Date(row.date).toISOString().slice(0, 10);
								}
								if (key == '') {
									value = (
										<span
											onClick={
												!row.bookedByUser &&
												status?.isLoggedIn &&
												!isArchived
													? (e) => {
															e.stopPropagation();
															onQuickBook({
																scheduleID: row['ID'],
																productName: row['Nazwa'],
																productPrice: row['Zadatek'],
															});
													  }
													: null
											}
											className='material-symbols-rounded nav__icon nav__icon--side account'>
											{status.isLoggedIn
												? row.bookedByUser
													? 'check'
													: row.full || isArchived
													? 'block'
													: 'shopping_bag_speed'
												: 'lock_person'}
										</span>
									);
								}
								return (
									<td
										onClick={
											active
												? () => {
														onOpen(row);
												  }
												: null
										}
										className={`data-table__single-cell ${
											classModifier
												? `data-table__single-cell--${classModifier}`
												: ''
										}`}
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
