import SymbolOrIcon from '../components/common/SymbolOrIcon.jsx';
import { hasValidPassFn } from './userCustomerUtils';

// returns a string or <SymbolOrIcon> depending on whether the value is boolean.
export function formatValue(value, keyClass) {
  if (value == null) return '';
  if (typeof value === 'boolean') {
    return (
      <SymbolOrIcon
        specifier={value ? 'check' : 'close'}
        classModifier={keyClass}
      />
    );
  }
  return value;
}

// handles clicking on an action button in a table row / available. If all conditions are met, "method(...)", otherwise does nothing.
export function onRowBtnClick(
  row,
  archived,
  method,
  status,
  isAdminView,
  isAvailablePassesView,
  isAccountView,
  isCustomer,
  isAdmin,
  e
) {
  const isUserGoing = row?.isUserGoing ?? false;
  const isArchived = archived ?? false;
  const isLoggedIn = status?.isLoggedIn === true;
  const isAuthorized = isCustomer || isAdmin;
  const hasPass =
    isAdminView || isAvailablePassesView || isAccountView
      ? true
      : hasValidPassFn(status, row);

  console.log('🔥 CLICK!');
  console.log({ isUserGoing, isLoggedIn, isArchived, isAuthorized, hasPass });

  if (!isUserGoing && isLoggedIn && !isArchived && isAuthorized && hasPass) {
    if (e?.stopPropagation) e.stopPropagation();
    method({
      customerDetails: '',
      scheduleId: row.scheduleId,
      product: row.productName,
      status: 'Paid',
      amountPaid: row.price,
      amountDue: 0,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Completed',
      customerId: row.customerId,
      rowId: row.rowId,
    });
  }
  return null;
}

// returns symbol for attendance
export function formatAttendance(value) {
  if (value == null) return null;
  const spec = typeof value === 'boolean' ? (value ? 'check' : 'close') : value;
  return <SymbolOrIcon specifier={spec} classModifier='attendance' />;
}

// returns symbol for payment status
export function formatPaymentStatus(value) {
  if (value == null) return null;
  const val = typeof value === 'string' ? value.toUpperCase() : value;
  let symbol = 'pending';
  if (val === 'COMPLETED' || val === 'PAID' || val === 1) symbol = 'check';
  if (val === 0) symbol = 'pending';
  return <SymbolOrIcon specifier={symbol} />;
}

export function pickCustomerSymbol(
  row,
  isArchived,
  symbol,
  hasValidPass,
  isAvailablePassesView,
  isAdminPage,
  adminActions,
  isLoggedIn,
  isCustomer,
  isAdmin
) {
  if (isAdminPage && adminActions) {
    return symbol;
  } else if (isLoggedIn && (isCustomer || isAdmin)) {
    if (row.isUserGoing) return 'check';
    else if (row.full || isArchived) return 'block';
    else if (row.wasUserReserved) return 'restore';
    else if (hasValidPass && !isAvailablePassesView) return 'calendar_add_on';
    else return 'local_mall';
  }
  return 'lock_person';
}

export function getSymbol(
  row,
  hasValidPass,
  isArchived,
  action,
  isAvailablePassesView,
  isAdminPage,
  adminActions,
  isLoggedIn,
  isCustomer,
  isAdmin
) {
  const conditionalExtraClass = `${
    row.isActionDisabled === true ? ' dimmed' : ''
  }${action.extraClass ? ` ${action.extraClass}` : ''}${
    !hasValidPass && !row.isUserGoing && !row.wasUserReserved ? ' black' : ''
  }`;

  return (
    <SymbolOrIcon
      specifier={pickCustomerSymbol(
        row,
        isArchived,
        action.symbol,
        hasValidPass,
        isAvailablePassesView,
        isAdminPage,
        adminActions,
        isLoggedIn,
        isCustomer,
        isAdmin
      )}
      extraClass={conditionalExtraClass}
    />
  );
}
