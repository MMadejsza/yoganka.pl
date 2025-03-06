import {calculateStats} from '../../utils/customerViewsUtils.js';
import ModalTable from './ModalTable';

function ViewCustomerTotalBookings({data}) {
	// console.clear();
	console.log(
		`📝 
        ViewCustomerTotalBookings object from backend:`,
		data,
	);

	const customerStats = calculateStats(data);
	const content = customerStats.bookings;
	// console.log(`✅ content: `, content);
	// console.log(`✅ keys: `, keys);
	// console.log(`✅ customerStats: `, customerStats);

	let table;
	table = (
		<ModalTable
			headers={[
				'ID',
				'Data Rezerwacji',
				'Zajęcia',
				'Kwota całkowita',
				'Metoda płatności',
				'Status płatności',
			]}
			keys={['id', 'date', 'classes', 'totalValue', 'method', 'status']}
			content={content}
			active={true}
		/>
	);

	return (
		<>
			<h1 className='user-container__user-title modal__title'>Historia rezerwacji</h1>

			{table}
		</>
	);
}

export default ViewCustomerTotalBookings;
