import DetailsCustomerStats from './DetailsCustomerStats.jsx';
import ModalTable from './ModalTable';
import {calculateStats} from '../../utils/customerViewsUtils.js';

function ViewCustomerTotalSchedules({data}) {
	// console.clear();
	console.log(
		`📝 
        ViewUserTotalSchedules object from backend:`,
		data,
	);

	const headers = ['ID', 'Data', 'Dzień', 'Godzina', 'Typ', 'Zajęcia', 'Miejsce'];
	const customerStats = calculateStats(data);
	const content = customerStats.records.sort((a, b) => new Date(b.date) - new Date(a.date));
	// console.log(`✅ content: `, content);
	// console.log(`✅ keys: `, keys);
	// console.log(`✅ customerStats: `, customerStats);

	let stats;
	let table;
	stats = (
		<div className='user-container schedules'>
			<DetailsCustomerStats
				customerStats={customerStats}
				altTitle={'W liczbach:'}
				userAccountPage={true}
			/>
		</div>
	);

	table = (
		<ModalTable
			headers={headers}
			keys={['id', 'date', 'day', 'time', 'type', 'name', 'location']}
			content={content}
			active={false}
			// classModifier={classModifier}
		/>
	);

	return (
		<>
			<h1 className='user-container__user-title modal__title'>Historia zajęć</h1>
			{stats}
			{table}
		</>
	);
}

export default ViewCustomerTotalSchedules;
