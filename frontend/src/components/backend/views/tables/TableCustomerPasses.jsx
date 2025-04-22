import { formatIsoDateTime } from '../../../../utils/dateTime.js';
import ModalTable from '../../ModalTable.jsx';
import WrapperModalTable from '../../WrapperModalTable.jsx';

function TableCustomerPasses({
  customerPasses,
  shouldShowPassName,
  shouldShowCustomerName,
  shouldShowPurchaseDate,
  shouldShowAllowedProductTypes,
  isAdminDash,
  isActive,
  onOpen,
}) {
  console.log('TableCustomerPasses:');
  console.log('TableCustomerPasses customerPasses:', customerPasses);

  const formattedCustomerPasses = customerPasses
    ?.slice() // copy to not work on original
    .sort((a, b) => {
      const isAActive = Number(a.status) === 1;
      const isBActive = Number(b.status) === 1;

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
      const statusMap = {
        1: 'Aktywny',
        0: 'Zawieszony',
        '-1': 'Wygasły',
      };

      let allowedProductTypes = '';
      try {
        const parsed = JSON.parse(cp.allowedProductTypes);
        allowedProductTypes = Array.isArray(parsed) ? parsed.join(', ') : '';
      } catch (e) {
        console.log(
          'Błąd parsowania allowedProductTypes:',
          cp.allowedProductTypes,
          e
        );
        allowedProductTypes = '';
      }

      return {
        ...cp,
        customerFullName: `${cp.customerFirstName} ${cp.customerLastName} (${cp.customerId})`,
        passName: `${cp.passName} (${cp.passDefId})`,
        allowedProductTypes,
        validFrom: formatIsoDateTime(cp.validFrom),
        purchaseDate: formatIsoDateTime(cp.purchaseDate),
        validUntil: formatIsoDateTime(cp.validUntil),
        status: statusMap[Number(cp.status)] || 'NIEZNANY',
        usesLeft: cp.usesLeft === null ? '-' : cp.usesLeft,
      };
    });

  const title = 'Wszystkie zakupione karnety';

  const tableMap = {
    customerPassId: 'Id',
    customerFullName: 'Uczestnik',
    passName: 'Karnet (Nr)',
    allowedProductTypes: 'Obejmuje',
    purchaseDate: 'Zakupiono',
    validFrom: 'Ważny od',
    validUntil: 'Ważny do',
    usesLeft: 'Pozostało wejść',
    status: 'Status',
  };

  let visibleMap = { ...tableMap };

  if (!shouldShowCustomerName) {
    delete visibleMap.customerFullName;
    delete visibleMap.purchaseDate;
  } else if (!shouldShowPassName) {
    delete visibleMap.passName;
    delete visibleMap.allowedProductTypes;
  }
  if (!shouldShowAllowedProductTypes) delete visibleMap.allowedProductTypes;

  const keys = Object.keys(visibleMap);
  const headers = keys.map(key => visibleMap[key]);

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
