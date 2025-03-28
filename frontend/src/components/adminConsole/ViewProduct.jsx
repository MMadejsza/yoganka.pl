import { useQuery } from '@tanstack/react-query';
import { fetchStatus } from '../../utils/http.js';
import { calculateProductStats } from '../../utils/productViewsUtils.js';
import DetailsProduct from './DetailsProduct.jsx';
import DetailsProductPayments from './DetailsProductPayments.jsx';
import DetailsProductReviews from './DetailsProductReviews.jsx';
import DetailsProductSchedules from './DetailsProductSchedules.jsx';
import DetailsProductStats from './DetailsProductStats.jsx';
import DetailsTableAttendance from './DetailsTableAttendance.jsx';

// import {calculateStats} from '../../utils/productViewsUtils.js';

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
  const type = product.Type;
  const prodStats = calculateProductStats(product, product.ScheduleRecords);

  return (
    <>
      <h1 className='user-container__user-title modal__title'>{`${product.Name} (ID:${product.ProductID})`}</h1>
      <h3 className='user-container__user-status modal__title'>
        {product.Status}
      </h3>

      {/*//@ Product main details */}
      <div className='user-container__main-details modal-checklist'>
        <DetailsProduct data={product} placement={'productView'} />
      </div>

      {/*//@ Product business details */}
      <div className='user-container__main-details modal-checklist'>
        <DetailsProductStats data={product} prodStats={prodStats} />
        {/* //! Jélsi jeden schedule i camp/event to wywietl jego ustawienia eby zmieni np. liczbe miejsc*/}
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
