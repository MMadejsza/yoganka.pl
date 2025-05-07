import { formatIsoDateTime } from '../../../utils/dateTime.js';
import CardsList from '../../backend/cards/CardsList.jsx';
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
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

  const formattedContent = content?.map(booking => {
    return {
      ...booking,
      cardCreatedAt: booking.createdAt,
      cardTimestamp: booking.timestamp,
      createdAt: formatIsoDateTime(booking.createdAt),
      timestamp: formatIsoDateTime(booking.timestamp),
    };
  });
  // console.log(`✅ content: `, content);
  // console.log(`✅ keys: `, keys);
  // console.log(`✅ customerStats: `, customerStats);

  const tableInside = (
    <ModalTable
      headers={[
        'Obecność',
        'Id',
        'Termin (Nr)',
        'Płatność (Nr)',
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
  );

  const cards = <CardsList content={formattedContent} active={false} />;

  const table = (
    <WrapperModalTable
      content={formattedContent}
      title={'Wszystkie rezerwacje'}
      noContentMsg={'rezerwacji'}
    >
      {cards}
    </WrapperModalTable>
  );

  return <>{table}</>;
}

export default ViewAccountBookings;
