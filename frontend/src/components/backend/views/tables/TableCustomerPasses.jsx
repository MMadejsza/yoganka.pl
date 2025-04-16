import { formatIsoDateTime } from '../../../../utils/dateTime.js';
import ModalTable from '../../ModalTable.jsx';
import WrapperModalTable from '../../WrapperModalTable.jsx';

function TableCustomerPasses({
  customerPasses,
  shouldShowPassName,
  shouldShowCustomerName,
  isAdminDash,
  isActive,
  onOpen,
}) {
  console.log('TableCustomerPasses:');
  console.log('TableCustomerPasses customerPasses:', customerPasses);

  const formattedCustomerPasses = customerPasses
    ?.slice() // copy to not work on original
    .sort((a, b) => {
      const isAActive = a.status === 'ACTIVE' || a.status == 1;
      const isBActive = b.status === 'ACTIVE' || b.status == 1;

      if (isAActive && !isBActive) return -1;
      if (!isAActive && isBActive) return 1;

      if (isAActive && isBActive) {
        const dateA = new Date(a.validUntil);
        const dateB = new Date(b.validUntil);
        return dateA - dateB; // ^: soonest expiring first
      }

      return 0; // rest no change
    })
    .map(cp => {
      cp.status = cp.status.toUpperCase();
      return {
        ...cp,
        customerFullName: `${cp.customerFirstName} ${cp.customerLastName} (${cp.customerId})`,
        purchaseDate: formatIsoDateTime(cp.purchaseDate),
        validFrom: formatIsoDateTime(cp.validFrom),
        validUntil: formatIsoDateTime(cp.validUntil),
        status:
          cp.status === 'ACTIVE' || cp.status == 1
            ? 'Aktywny'
            : cp.status === 'SUSPENDED' || cp.status == 0
            ? 'Wstrzymany'
            : 'Niekontynuowany',
      };
    });

  const title = 'Wszystkie zakupione karnety';

  const headers = [
    'Id',
    'Uczestnik',
    'Karnet',
    'Zakupiono',
    'Ważny od',
    'Ważny do',
    'Pozostało wejść',
    'Status',
  ];
  if (!shouldShowCustomerName) headers.splice(1, 1);
  else if (!shouldShowPassName) headers.splice(2, 1);

  const keys = [
    'customerPassId',
    'customerFullName',
    'passName',
    'purchaseDate',
    'validFrom',
    'validUntil',
    'usesLeft',
    'status',
  ];
  if (!shouldShowCustomerName) keys.splice(1, 1);
  else if (!shouldShowPassName) keys.splice(2, 1);

  const table = isAdminDash ? (
    <ModalTable
      classModifier={'admin-view'}
      headers={headers}
      keys={keys}
      content={formattedCustomerPasses}
      active={isActive}
      onOpen={onOpen}
    />
  ) : (
    <WrapperModalTable
      content={formattedCustomerPasses}
      title={title}
      noContentMsg={'zakupionych karnetów'}
    >
      <ModalTable
        classModifier={'admin-view'}
        headers={headers}
        keys={keys}
        content={formattedCustomerPasses}
        active={isActive}
        onOpen={onOpen}
      />
    </WrapperModalTable>
  );

  return <>{table}</>;
}

export default TableCustomerPasses;
