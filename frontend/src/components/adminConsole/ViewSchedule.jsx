import DetailsSchedule from './DetailsSchedule.jsx';
import DetailsProduct from './DetailsProduct.jsx';
import DetailsProductStats from './DetailsProductStats.jsx';
import DetailsProductBookings from './DetailsProductBookings.jsx';
import DetailsProductReviews from './DetailsProductReviews.jsx';
import {calculateProductStats} from '../../utils/productViewsUtils.js';
import {useMutation} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
// import {calculateStats} from '../../utils/productViewsUtils.js';

function ViewSchedule({data}) {
	const navigate = useNavigate();
	// console.clear();
	console.log(
		`📝
	    Schedule object from backend:`,
		data,
	);
	const {schedule} = data;
	const {Product: product} = schedule;
	const type = product.Type;
	let prodStats = null;

	const userAccessed = typeof schedule.Bookings == 'number';

	if (!userAccessed) prodStats = calculateProductStats(product, [schedule]);

	const {mutate, isError, error} = useMutation({
		mutationFn: async () =>
			await fetch(`/api/grafik/book/${schedule.ScheduleID}`, {
				method: 'POST',
				body: JSON.stringify({
					schedule: schedule.ScheduleID,
					date: new Date().toISOString().split('T')[0],
					product: product.Name,
					status: 'Paid',
					amountPaid: product.Price,
					amountDue: 0,
					paymentMethod: 'Credit Card',
					paymentStatus: 'Completed',
				}),
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			}).then((response) => {
				if (!response.ok) {
					return response.json().then((errorData) => {
						throw new Error(errorData.error || 'Błąd podczas rezerwacji');
					});
				}
				return response.json();
			}),
		onSuccess: () => {
			navigate('/grafik');
		},
	});

	const handleBooking = () => {
		mutate();
	};

	let btn = (
		<button
			onClick={handleBooking}
			className='book modal__btn'>
			<span className='material-symbols-rounded nav__icon nav__icon--side account'>
				shopping_bag_speed
			</span>
			Rezerwuj
		</button>
	);

	if (isError) {
		btn = error.message;
	}

	return (
		<>
			{userAccessed ? (
				<>
					<h1 className='user-container__user-title modal__title'>{`${product.Name}`}</h1>
				</>
			) : (
				<>
					<h1 className='user-container__user-title modal__title'>{`Termin (ID:${schedule.ScheduleID})`}</h1>
					<h1 className='user-container__user-status modal__title'>{`Dla: "${product.Name} (ID:${product.ProductID})"`}</h1>
				</>
			)}

			{/*//@ Schedule main details */}
			<div className='user-container__main-details modal-checklist'>
				<DetailsSchedule
					data={schedule}
					userAccessed={userAccessed}
				/>
			</div>
			{/*//@ Product main details */}
			<div className='user-container__main-details modal-checklist'>
				<DetailsProduct
					data={product}
					placement={'schedule'}
					userAccessed={userAccessed}
				/>
			</div>

			{/*//@ Product stats */}
			{!userAccessed && (
				<>
					<div className='user-container__main-details modal-checklist'>
						<DetailsProductStats
							data={product}
							prodStats={prodStats}
							placement={'schedule'}
						/>
					</div>

					{/*//@ all bookings if not event/camp? */}

					<div className='user-container__main-details  schedules modal-checklist'>
						<DetailsProductBookings
							stats={prodStats}
							type={type}
						/>
					</div>

					{/*//@ Feedback */}

					<div className='user-container__main-details  schedules modal-checklist'>
						<DetailsProductReviews stats={prodStats} />
					</div>
				</>
			)}

			{isError && <div className='error-box'>{error.message}</div>}

			{!isError && userAccessed && (
				<button
					onClick={handleBooking}
					className='book modal__btn'>
					<span className='material-symbols-rounded nav__icon nav__icon--side account'>
						shopping_bag_speed
					</span>
					Rezerwuj
				</button>
			)}
		</>
	);
}

export default ViewSchedule;
