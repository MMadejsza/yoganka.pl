import SymbolOrIcon from '../components/common/SymbolOrIcon.jsx';
import { hasValidPassFn } from './userCustomerUtils';

// Format JSON list of allowed product types into a human-readable string.
export function formatAllowedTypes(rawStr, noUpperCase, leaveAsArr) {
  if (!rawStr) return noUpperCase ? [] : '';

  let items = [];

  try {
    // if it's already array
    if (Array.isArray(rawStr)) {
      items = rawStr;
    }
    // if it's JSON string array
    else if (typeof rawStr === 'string' && rawStr.trim().startsWith('[')) {
      items = JSON.parse(rawStr);
    }
    // if it's plain string like 'CLASS,EVENT'
    else if (typeof rawStr === 'string') {
      items = rawStr.split(',').map(s => s.trim());
    }
  } catch (e) {
    console.log('⚠️ Błąd parsowania allowedProductTypes:', rawStr, e);
    items =
      typeof rawStr === 'string' ? rawStr.split(',').map(s => s.trim()) : [];
  }

  if (!noUpperCase) {
    let result = Array.isArray(items)
      ? items
          .filter(Boolean)
          .map(t => t[0].toUpperCase() + t.slice(1).toLowerCase())
      : '';
    return leaveAsArr ? result : result.join(', ');
  } else {
    return Array.isArray(items) ? items.map(t => t.trim()).filter(Boolean) : [];
  }
}

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
  const wasAlreadyBookedInThePast = row?.wasUserReserved;
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

  if (
    !isUserGoing &&
    isLoggedIn &&
    !isArchived &&
    isAuthorized &&
    (hasPass || wasAlreadyBookedInThePast)
  ) {
    if (e?.stopPropagation) e.stopPropagation();
    method({
      customerDetails: '',
      scheduleId: row.scheduleId,
      product: row.productName,
      status: 1,
      amountPaid: row.price,
      amountDue: 0,
      paymentMethod: 'Credit Card',
      paymentStatus: 1,
      customerId: row.customerId,
      rowId: row.rowId,
      userEmail: row.email || row?.Customer?.User?.email,
      phoneNumber: row.phone || row?.Customer?.phone,
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
  let symbol = 'close';
  if (val === 'COMPLETED' || val === 'PAID' || Number(val) === 1)
    symbol = 'check';
  if (Number(val) === 0) symbol = 'pending';
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

  const calculatedSpecifier = pickCustomerSymbol(
    row,
    isArchived,
    action.symbol || action.icon,
    hasValidPass,
    isAvailablePassesView,
    isAdminPage,
    adminActions,
    isLoggedIn,
    isCustomer,
    isAdmin
  );

  return (
    <SymbolOrIcon
      type={action.icon ? 'ICON' : 'SYMBOL'}
      specifier={calculatedSpecifier}
      extraClass={conditionalExtraClass}
    />
  );
}

export const handleContactCustomer = (type, tableObj) => {
  if (type == 'mail') {
    window.open(
      `mailto:${tableObj.userEmail}`,
      '_blank',
      'noopener,noreferrer'
    );
  } else {
    window.open(
      `https://wa.me/${tableObj.phoneNumber}`,
      '_blank',
      'noopener,noreferrer'
    );
  }
};
