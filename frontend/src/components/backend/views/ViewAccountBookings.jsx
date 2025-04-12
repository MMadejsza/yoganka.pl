import { formatIsoDateTime } from '../../../utils/dateTime.js';
import ModalTable from '../ModalTable.jsx';
import WrapperModalTable from '../WrapperModalTable.jsx';

function ViewAccountBookings({ data }) {
  // console.clear();
  console.log(
    `📝 
        ViewAccountBookings data:`,
    data
  );

  let content;
  if (data.customer)
    content = data.customer.formattedBookings.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

  const formattedContent = content?.map(booking => {
    return {
      ...booking,
      createdAt: formatIsoDateTime(booking.createdAt),
      timestamp: formatIsoDateTime(booking.timestamp),
    };
  });
  // console.log(`✅ content: `, content);
  // console.log(`✅ keys: `, keys);
  // console.log(`✅ customerStats: `, customerStats);

  const table = (
    <WrapperModalTable
      content={formattedContent}
      title={'Wszystkie rezerwacje'}
      noContentMsg={'rezerwacji'}
    >
      <ModalTable
        headers={[
          'Obecność',
          'Id',
          'Termin',
          'Płatność',
          'Utworzono',
          'Ostatnia zmiana',
        ]}
        keys={[
          'attendance',
          'bookingId',
          'scheduleDetails',
          'payment',
          'createdAt',
          'timestamp',
        ]}
        content={formattedContent}
        active={false}
      />
    </WrapperModalTable>
  );

  return <>{table}</>;
}

export default ViewAccountBookings;
