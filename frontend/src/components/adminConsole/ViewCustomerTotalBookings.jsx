import {calculateStats} from '../../utils/customerViewsUtils.js';

function ViewCustomerTotalBookings({data}) {
	// console.clear();
	console.log(
		`📝 
        ViewUserTotalSchedules object from backend:`,
		data,
	);

	let table;

	const customerStats = calculateStats(data);
	const headers = ['ID', 'Data', 'Dzień', 'Godzina', 'Typ', 'Zajęcia', 'Miejsce'];
	const content = customerStats.records;
	const keys = customerStats.recordsKeys.splice(1);
	const today = new Date().toISOString().split('T')[0];
	// console.log(`✅ content: `, content);
	// console.log(`✅ keys: `, keys);
	console.log(`✅ customerStats: `, customerStats);

	table = (
		<table className='data-table data-table--user'>
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
				{content
					.filter((schedule) => schedule.date <= today)
					.map((row, rowIndex) => (
						<tr
							className={`data-table__cells data-table__cells--user`}
							key={rowIndex}>
							{keys.map((key, headerIndex) => {
								let value = row[key];
								if (typeof value === 'object' && value !== null) {
									value = Object.values(value);
								}
								return (
									<td
										onClick={() => handleOpenScheduleModal(row.id)}
										className='data-table__single-cell data-table__single-cell--user'
										key={headerIndex}>
										{value || '-'}
									</td>
								);
							})}
						</tr>
					))}
			</tbody>
		</table>
	);

	return (
		<>
			<h1 className='user-container__user-title modal__title'>Historia rezerwacji</h1>

			{table}
		</>
	);
}

export default ViewCustomerTotalBookings;
