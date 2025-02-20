import DetailsSchedule from './DetailsSchedule.jsx';
import DetailsProduct from './DetailsProduct.jsx';
import DetailsProductStats from './DetailsProductStats.jsx';
import DetailsProductSchedules from './DetailsProductSchedules.jsx';
import DetailsProductBookings from './DetailsProductBookings.jsx';
import DetailsProductReviews from './DetailsProductReviews.jsx';
import {calculateProductStats} from '../../utils/productViewsUtils.js';

// import {calculateStats} from '../../utils/productViewsUtils.js';

function ViewSchedule({data}) {
	console.clear();
	console.log(
		`📝
	    Schedule object from backend:`,
		data,
	);
	const {schedule} = data;
	const {Product: product} = schedule;
	const type = product.Type;
	const prodStats = calculateProductStats(product, [schedule]);

	return (
		<>
			<h1 className='user-container__user-title modal__title'>{`Termin (ID:${schedule.ScheduleID})`}</h1>
			<h1 className='user-container__user-status modal__title'>{`Dla: "${product.Name} (ID:${product.ProductID})"`}</h1>

			{/*//@ Schedule main details */}
			<div className='user-container__main-details modal-checklist'>
				<DetailsSchedule data={schedule} />
			</div>
			{/*//@ Product main details */}
			<div className='user-container__main-details modal-checklist'>
				<DetailsProduct
					data={product}
					placement={'schedule'}
				/>
			</div>

			{/*//@ Product stats */}
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
	);
}

export default ViewSchedule;
