import { useQuery } from '@tanstack/react-query';
import { fetchStatus } from '../../../utils/http.js';
import { statsCalculatorForProduct } from '../../../utils/statistics/statsCalculatorForProduct.js';
import DetailsListProduct from './lists/DetailsListProduct.jsx';
import DetailsListProductStats from './lists/DetailsListProductStats.jsx';
import DetailsProductPayments from './tables/ViewProductPayments.jsx';
import DetailsProductReviews from './tables/ViewProductReviews.jsx';
import DetailsProductSchedules from './tables/ViewProductSchedules.jsx';
import DetailsTableAttendance from './tables/ViewTableAttendance.jsx';

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
  const type = product.type;
  const prodStats = statsCalculatorForProduct(product, product.ScheduleRecords);

  return (
    <>
      <h1 className='user-container__user-title modal__title'>{`${product.name} (ID:${product.productId})`}</h1>
      <h3 className='user-container__user-status modal__title'>
        {product.status}
      </h3>

      {/*//@ Product main details */}
      <div className='user-container__main-details modal-checklist'>
        <DetailsListProduct data={product} placement={'productView'} />
      </div>

      {/*//@ Product business details */}
      <div className='user-container__main-details modal-checklist'>
        <DetailsListProductStats data={product} prodStats={prodStats} />
        {/* //! Jeśli jeden schedule i camp/event to wyświetl jego ustawienia eby zmieni np. liczbe miejsc*/}
      </div>

      {/*//@ Schedules if not event/camp*/}
      <div className='user-container__main-details  schedules modal-checklist'>
        <DetailsProductSchedules
          scheduleRecords={prodStats.scheduleRecords}
          status={status}
          isAdminPage={isAdminPanel}
        />
      </div>

      {(type == 'Camp' || type == 'Event') && (
        <div className='user-container__main-details  schedules modal-checklist'>
          <DetailsTableAttendance
            stats={prodStats}
            type={type}
            isAdminPage={isAdminPanel}
          />
        </div>
      )}

      {/*//@ All payments */}
      <div className='user-container__main-details  schedules modal-checklist'>
        <DetailsProductPayments
          stats={prodStats}
          type={type}
          isAdminPage={isAdminPanel}
        />
      </div>

      {/*//@ Feedback */}
      <div className='user-container__main-details  schedules modal-checklist'>
        <DetailsProductReviews stats={prodStats} />
      </div>
    </>
  );
}

export default ViewProduct;
