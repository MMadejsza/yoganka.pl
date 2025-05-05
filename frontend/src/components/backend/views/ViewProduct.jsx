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
  const statusMap = {
    1: 'Aktywny',
    0: 'Zawieszony',
    '-1': 'Wygasły',
  };
  return (
    <>
      <h1 className='modal__title modal__title--view'>{`${product.name} (Id:${product.productId})`}</h1>
      <h3 className='modal__title modal__title--status'>
        {statusMap[product.status]}
      </h3>

      {/*//@ Product main details */}
      <div className='generic-outer-wrapper'>
        <div className='generic-component-wrapper'>
          <DetailsListProduct
            data={product}
            placement={'productView'}
            classModifier='product-view'
          />
        </div>
        {/*//@ Product business details */}
        <DetailsListProductStats
          data={product}
          prodStats={prodStats}
          classModifier='product-view'
        />
        {/* //! Jeśli jeden schedule i camp/event to wyświetl jego ustawienia eby zmieni np. liczbe miejsc*/}
      </div>

      {/*//@ Schedules if not event/camp*/}
      <TableSchedules
        data={product}
        scheduleRecords={prodStats.scheduleRecords}
        status={status}
        isAdminPage={isAdminPanel}
      />

      {(type == 'CAMP' || type == 'EVENT') && (
        <TableAttendance allBookings={prodStats} isAdminPage={isAdminPanel} />
      )}

      {/*//@ All payments */}
      <TableProductPayments
        payments={prodStats.totalPayments}
        type={type}
        isAdminPage={isAdminPanel}
      />

      {/*//@ Feedback */}
      <TableProductReviews stats={prodStats} />
    </>
  );
}

export default ViewProduct;
