import {
  formatAttendance,
  formatPaymentStatus,
  pickCustomerSymbol,
} from './cardsAndTableUtils.jsx';
import { formatIsoDateTime, getWeekDay, monthMap } from './dateTime.js';
import { hasValidPassFn } from './userCustomerUtils.js';

// Parse a date string 'YYYY-MM-DD' or 'DD.MM.YYYY' into day/month/year and monthName.
function parseDateParts(dateStr) {
  if (!dateStr) return { day: '-', month: '-', year: '-', monthName: '-' };
  const raw = dateStr.slice(0, 10);
  let day, month, year;
  if (raw.includes('.')) {
    [day, month, year] = raw.split('.');
  } else {
    [year, month, day] = raw.split('-');
  }
  return { day, month, year, monthName: monthMap[month] || '-' };
}

//Format JSON list of allowed product types into a human-readable string.
function formatAllowedTypes(rawStr) {
  if (!rawStr) return '';
  let items;
  try {
    const parsed = JSON.parse(rawStr);
    // ensure it's an array
    items = Array.isArray(parsed) ? parsed : rawStr.split(',');
  } catch {
    // not valid JSON, split on commas
    items = rawStr.split(',');
  }
  return items
    .map(t => t.trim())
    .filter(Boolean)
    .map(t => t[0].toUpperCase() + t.slice(1).toLowerCase())
    .join(', ');
}

//Build props object for a Payments card.
export function getPaymentContent(row) {
  return {
    isActive: false,
    cardId: row.rowId || '',
    cardTypeModifier:
      row.paymentMethod +
      (row.performedBy !== 'Customer' ? ` (${row.performedBy})` : ''),
    cardCircle: formatPaymentStatus(row.status),
    cardTitle: row.product,
    squareTop: '',
    squareMiddle: '',
    squareMiddleIcon: 'attach_money',
    squareBottom: '',
    description: `${row.amountPaid} zł`,
    dimmedDescription: ` - ${formatIsoDateTime(row.cardDate)}`,
    cardFooter: '',
    titleIcon: 'inventory',
    typeIcon: 'credit_card',
    descriptionIcon: 'sell',
    footerIcon: '',
  };
}

// Build props object for a Customer Pass card.
export function getCustomerPassContent(row) {
  const { day, monthName, year } = parseDateParts(row.validUntil);
  const allowed = formatAllowedTypes(row.allowedProductTypes);
  const isTimeType = row.passType?.toUpperCase() === 'TIME';

  return {
    isActive: false,
    cardId: row.rowId || '',
    cardTypeModifier: allowed,
    cardCircle: '',
    cardTitle: row.passName,
    squareTop: isTimeType ? getWeekDay(row.validUntil) : 'Sesje',
    squareMiddle: isTimeType ? day : row.usesLeft,
    squareMiddleIcon: '',
    squareBottom: isTimeType
      ? `${monthName} ${year}`
      : `(${
          Number(row.status) === 1
            ? 'Aktywny'
            : Number(row.status) === 0
            ? 'Zawieszony'
            : 'Karnet wygasł'
        })`,
    description: formatIsoDateTime(row.validFrom, false),
    dimmedDescription: ' - (Data rozpoczęcia)',
    cardFooter: formatIsoDateTime(row.validUntil, false),
    titleIcon: 'card_membership',
    typeIcon: 'category',
    descriptionIcon: 'event_available',
    footerIcon: 'event_upcoming',
  };
}

//Build props object for a Booking card.
export function getBookingContent(row) {
  const { day, monthName, year } = parseDateParts(row.scheduleDate);
  const wasEdited = row.cardCreatedAt !== row.cardTimestamp;

  return {
    isActive: false,
    cardId: row.rowId || '',
    cardTypeModifier: row.payment || '',
    cardCircle: formatAttendance(row.attendance),
    cardTitle: row.scheduleName,
    squareTop: getWeekDay(row.scheduleDate) || '-',
    squareMiddle: day,
    squareMiddleIcon: '',
    squareBottom: `${monthName} ${year}`,
    description: formatIsoDateTime(row.cardCreatedAt, false),
    dimmedDescription: ` (data${wasEdited ? ' 1.' : ' '}rezerwacji)`,
    cardFooter: wasEdited
      ? `Edytowano: ${formatIsoDateTime(row.cardTimestamp, false)}`
      : '',
    titleIcon: 'self_improvement',
    typeIcon: 'credit_card',
    descriptionIcon: 'event_available',
    footerIcon: wasEdited ? 'calendar_clock' : '',
  };
}

//Build props object for a Schedule card, including quick-action logic.
export function getScheduleContent(
  row,
  index,
  { isAdminView, isAvailablePassesView, isAccountView },
  onQuickAction,
  status,
  adminActions
) {
  const { day, monthName, year } = parseDateParts(row.date);
  const isArchived =
    new Date(
      `${row.date?.split('.').reverse().join('-')}T${
        row.startTime || '00:00:00'
      }`
    ) < new Date();
  const hasValidPass =
    isAdminView || isAvailablePassesView || isAccountView
      ? true
      : hasValidPassFn(status, row);

  let quickActionBtn = null;
  let quickActionSymbol = null;
  let quickActionMethod = null;
  let isActive = false;

  if (Array.isArray(onQuickAction) && onQuickAction.length) {
    quickActionSymbol = pickCustomerSymbol(
      row,
      isArchived,
      onQuickAction[0].symbol,
      hasValidPass,
      isAvailablePassesView,
      isAdminView,
      adminActions,
      status?.isLoggedIn,
      status?.role === 'CUSTOMER',
      status?.role === 'ADMIN'
    );
    isActive = ['restore', 'calendar_add_on'].includes(quickActionSymbol);
    quickActionMethod = onQuickAction[0].method;
  }

  const [hh = '0', mm = '0'] = row.productDuration?.split(':') || [];
  const hours = String(Number(hh));
  const mins = String(Number(mm));
  const rawType = row.productType || '';
  const typeFinal = (rawType[0] || '') + rawType.slice(1).toLowerCase();

  return {
    isActive,
    cardId: row.rowId || '',
    cardTypeModifier: typeFinal,
    cardCircle: quickActionSymbol || '',
    cardTitle: row.productName || row.product || '',
    squareTop: row.day || '',
    squareMiddle: day,
    squareMiddleIcon: '',
    squareBottom: `${monthName} ${year}`,
    description: row.startTime || '',
    dimmedDescription:
      mins !== '0' ? ` (${hours}h ${mins}min)` : ` (${hours}h)`,
    cardFooter: row.location || '',
    titleIcon: 'self_improvement',
    typeIcon: 'category',
    descriptionIcon: 'schedule',
    footerIcon: 'location_on',
    quickActionMethod: onQuickAction[0]?.method,
  };
}

//Build props object for an Pass Definition card.
export function getPassesDefinitionsContent(row) {
  const list = formatAllowedTypes(row.allowedProductTypes);
  return {
    isActive: false,
    cardId: row.rowId || '',
    cardTypeModifier: list,
    cardCircle: '',
    cardTitle: row.name || row.product || '',
    squareTop: 'Sesje',
    squareMiddle: row.usesTotal,
    squareMiddleIcon: row.usesTotal === '-' && 'all_inclusive',
    squareBottom: '',
    description: row.description || '',
    dimmedDescription: '',
    cardFooter: row.validityDays || '',
    titleIcon: 'card_membership',
    typeIcon: 'category',
    descriptionIcon: '',
    footerIcon: 'calendar_month',
  };
}

//Main dispatcher: choose the right builder based on view flags.
export function getCardProps(
  row,
  index,
  flags,
  status,
  onQuickAction = [],
  adminActions = []
) {
  if (flags.isPaymentsView) return getPaymentContent(row);
  if (flags.isCustomerPassesView) return getCustomerPassContent(row);
  if (flags.isBookingsView) return getBookingContent(row);
  if (flags.isScheduleCardsType)
    return getScheduleContent(
      row,
      index,
      {
        isAdminView: flags.isAdminView,
        isAvailablePassesView: flags.isAvailablePassesView,
        isAccountView: flags.isAccountView,
      },
      onQuickAction,
      status,
      adminActions
    );
  if (flags.isAvailablePassesView) return getPassesDefinitionsContent(row);
  // fallback: empty card
  return {
    isActive: false,
    cardId: '',
    cardTypeModifier: '',
    cardCircle: '',
    cardTitle: '',
    squareTop: '',
    squareMiddle: '',
    squareBottom: '',
    description: '',
    dimmedDescription: '',
    cardFooter: '',
    titleIcon: '',
    typeIcon: '',
    descriptionIcon: '',
    footerIcon: '',
  };
}
