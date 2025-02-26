function ModalTable({headers, content, keys, active}) {
	return (
		<table className='data-table'>
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
				{content.map((row, rowIndex) => (
					<tr
						className={`data-table__cells ${active ? 'active' : ''}`}
						key={rowIndex}>
						{keys.map((key, keyIndex) => {
							let value = row[key];
							if (row[key] == 'date') {
								value = new Date(row.date).toISOString().slice(0, 10);
							}
							return (
								<td
									onClick={
										active
											? () => {
													handleOpenModal(row);
											  }
											: null
									}
									className='data-table__single-cell'
									key={keyIndex}>
									{value || '-'}
								</td>
							);
						})}
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default ModalTable;
