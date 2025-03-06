import {calculateStats} from '../../utils/customerViewsUtils.js';
import ModalTable from './ModalTable';
import {useState, useEffect} from 'react';
import {useLocation, useNavigate, useMatch} from 'react-router-dom';
import ViewFrame from './ViewFrame.jsx';

function ViewCustomerTotalBookings({data}) {
	// console.clear();
	console.log(
		`📝 
        ViewCustomerTotalBookings object from backend:`,
		data,
	);
	const navigate = useNavigate();
	const location = useLocation();
	const modalMatch = !!useMatch('/konto/rezerwacje/:id');
	const [isModalOpen, setIsModalOpen] = useState(modalMatch);

	const background = {
		pathname: location.pathname,
		search: location.search,
		hash: location.hash,
	};
	const handleOpenModal = (row) => {
		const recordId = row.id;
		setIsModalOpen(true);
		navigate(`${location.pathname}/${recordId}`, {state: {background}});
	};
	const handleCloseModal = () => {
		setIsModalOpen(false);
		navigate(-1);
	};

	const customerStats = calculateStats(data);
	const content = customerStats.bookings.sort((a, b) => new Date(b.date) - new Date(a.date));
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
			onOpen={handleOpenModal}
		/>
	);

	return (
		<>
			<h1 className='user-container__user-title modal__title'>Historia rezerwacji</h1>

			{table}
			{isModalOpen && (
				<ViewFrame
					modifier='schedule'
					visited={isModalOpen}
					onClose={handleCloseModal}
				/>
			)}
		</>
	);
}

export default ViewCustomerTotalBookings;
