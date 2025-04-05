import { useQuery } from '@tanstack/react-query';
import { fetchStatus } from '../../../utils/http.js';
import { statsCalculatorForProduct } from '../../../utils/statistics/statsCalculatorForProduct.js';
import DetailsListProduct from './lists/DetailsListProduct.jsx';
import DetailsListProductStats from './lists/DetailsListProductStats.jsx';
import TableAttendance from './tables/TableAttendance.jsx';
import TableProductPayments from './tables/TableProductPayments.jsx';
import TableProductReviews from './tables/TableProductReviews.jsx';
import TableSchedules from './tables/TableSchedules.jsx';

function ViewProduct({ data, isAdminPanel }) {
  console.clear();
  console.log(
    `📝
	    Product object from backend:`,
    data
  );
  console.log(`	    Product isAdminPanel:`, isAdminPanel);
  const { data: status, isLoading: isStatusLoading } = useQuery({
    queryKey: ['authStatus'],
    queryFn: fetchStatus,
    cache: 'no-store',
  });
  const { product } = data;
  const type = product.type?.toUpperCase();
  const prodStats = statsCalculatorForProduct(product, product.ScheduleRecords);

  return (
    <>
      <h1 className='user-container__user-title modal__title'>{`${product.name} (Id:${product.productId})`}</h1>
      <h3 className='user-container__user-status modal__title'>
        {product.status}
      </h3>

      {/*//@ Product main details */}
      <div className='generic-outer-wrapper'>
        <div className='generic-component-wrapper'>
          <DetailsListProduct data={product} placement={'productView'} />
        </div>
        {/*//@ Product business details */}
        {/* <div className='user-container__main-details modal-checklist'> */}
        <DetailsListProductStats data={product} prodStats={prodStats} />
        {/* //! Jeśli jeden schedule i camp/event to wyświetl jego ustawienia eby zmieni np. liczbe miejsc*/}
        {/* </div> */}
      </div>

      {/*//@ Schedules if not event/camp*/}
      {/* <div className='user-container__main-details  schedules modal-checklist'> */}
      <TableSchedules
        scheduleRecords={prodStats.scheduleRecords}
        status={status}
        isAdminPage={isAdminPanel}
      />
      {/* </div> */}

      {(type == 'CAMP' || type == 'EVENT') && (
        // <div className='user-container__main-details  schedules modal-checklist'>
        <TableAttendance
          stats={prodStats}
          type={type}
          isAdminPage={isAdminPanel}
        />
        // {/* </div> */}
      )}

      {/*//@ All payments */}
      {/* <div className='user-container__main-details  schedules modal-checklist'> */}
      <TableProductPayments
        stats={prodStats}
        type={type}
        isAdminPage={isAdminPanel}
      />
      {/* </div> */}

      {/*//@ Feedback */}
      {/* <div className='user-container__main-details  schedules modal-checklist'> */}
      <TableProductReviews stats={prodStats} />
      {/* </div> */}
    </>
  );
}

export default ViewProduct;
