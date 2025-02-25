import DetailsSchedule from './DetailsSchedule.jsx';
import DetailsProduct from './DetailsProduct.jsx';
import DetailsProductStats from './DetailsProductStats.jsx';
import DetailsProductBookings from './DetailsProductBookings.jsx';
import DetailsProductReviews from './DetailsProductReviews.jsx';
import {calculateProductStats} from '../../utils/productViewsUtils.js';
import {useMutation} from '@tanstack/react-query';

// import {calculateStats} from '../../utils/productViewsUtils.js';

function ViewSchedule({data}) {
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

	const {mutate} = useMutation({
		mutationFn: async () =>
			await fetch('/api/login-pass/logout', {
				method: 'POST',
				credentials: 'include',
			}).then((res) => {
				if (!res.ok) throw new Error('Wylogowanie nie powiodło się');
				return res.json();
			}),
		onSuccess: () => {
			// Invalidate query to reload layout
			queryClient.invalidateQueries(['authStatus']);
			navigate('/');
		},
	});

	const handleBooking = () => {
		mutate();
	};

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
			{userAccessed && (
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
