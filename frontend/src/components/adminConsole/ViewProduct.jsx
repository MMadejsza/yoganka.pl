import DetailsProduct from './DetailsProduct.jsx';
import DetailsProductStats from './DetailsProductStats.jsx';

// import {calculateStats} from '../../utils/productViewsUtils.js';

function ViewProduct({data}) {
	// console.clear();
	// console.log(
	// 	`📝
	//     Product object from backend:`,
	// 	data,
	// );
	const {product} = data;

	return (
		<>
			<h1 className='user-container__user-title modal__title'>{`${product.Name} (ID:${product.ProductID})`}</h1>

			{/*//@ Product main details */}
			<div className='user-container__main-details modal-checklist'>
				<DetailsProduct data={product} />
			</div>

			{/*//@ Product business details */}
			<div className='user-container__main-details modal-checklist'>
				<DetailsProductStats data={product} />
			</div>

			{/*//@ Generic stats */}
			<div className='user-container__main-details  schedules modal-checklist'></div>

			{/*//@ Schedules booked? */}
			<div className={'user-container__main-details schedules modal-checklist'}></div>
		</>
	);
}

export default ViewProduct;
