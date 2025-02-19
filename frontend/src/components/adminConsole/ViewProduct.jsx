import DetailsProduct from './DetailsProduct.jsx';
import DetailsProductStats from './DetailsProductStats.jsx';
import DetailsProductSchedules from './DetailsProductSchedules.jsx';
import {calculateProductStats} from '../../utils/productViewsUtils.js';
import DetailsProductBookings from './DetailsProductBookings.jsx';

// import {calculateStats} from '../../utils/productViewsUtils.js';

function ViewProduct({data}) {
	// console.clear();
	// console.log(
	// 	`📝
	//     Product object from backend:`,
	// 	data,
	// );
	const {product} = data;
	const type = product.Type;
	const prodStats = calculateProductStats(product);

	return (
		<>
			<h1 className='user-container__user-title modal__title'>{`${product.Name} (ID:${product.ProductID})`}</h1>
			<h3 className='user-container__user-status modal__title'>{product.Status}</h3>

			{/*//@ Product main details */}
			<div className='user-container__main-details modal-checklist'>
				<DetailsProduct data={product} />
			</div>

			{/*//@ Product business details */}
			<div className='user-container__main-details modal-checklist'>
				<DetailsProductStats
					data={product}
					prodStats={prodStats}
				/>
			</div>

			{/*//@ Schedules */}
			{type !== 'Camp' && type !== 'Event' && (
				<div className='user-container__main-details  schedules modal-checklist'>
					<DetailsProductSchedules
						spots={product.TotalSpaces}
						type={type}
						stats={prodStats}
					/>
				</div>
			)}

			{/*//@ all bookings if not event/camp? */}
			<div className='user-container__main-details  schedules modal-checklist'>
				<DetailsProductBookings
					stats={prodStats}
					type={type}
				/>
			</div>

			{/*//@ Feedback */}
			<div className='user-container__main-details  schedules modal-checklist'></div>
		</>
	);
}

export default ViewProduct;
