import { useLocation } from 'react-router-dom';
import {
  formatAttendance,
  formatPaymentStatus,
  getSymbol,
  onRowBtnClick,
  pickCustomerSymbol,
} from '../../utils/cardsAndTableUtils.jsx';
import { formatIsoDateTime, getWeekDay } from '../../utils/dateTime.js';
import { hasValidPassFn } from '../../utils/userCustomerUtils';
import SymbolOrIcon from './SymbolOrIcon.jsx';

function CardsList({
  content,
  active,
  onOpen,
  onQuickAction = [],
  status,
  isAdminPage,
  adminActions,
  notToArchive = false,
}) {
  console.log(`✅ CardsList Data: `);
  console.log(content);
  const isLoggedIn = status?.isLoggedIn === true,
    isCustomer = status?.role === 'CUSTOMER',
    isAdmin = status?.role === 'ADMIN';
  const location = useLocation();
  const isAdminView = location.pathname.includes('admin-console');
  const isCustomerPassesView = location.pathname.includes('konto/karnety');
  const isAccountPastSchedulesView =
    location.pathname.includes('/konto/zajecia');
  const isBookingsView = location.pathname.includes('/rezerwacje');
  const isAvailablePassesView = location.pathname.includes('grafik/karnety');
  const isAccountView = location.pathname.includes('/konto');
  const isAccountDash = location.pathname.split('/').pop() == 'konto';
  const isCommonScheduleView = location.pathname.split('/').pop() == 'grafik';
  const isPaymentsView = location.pathname.includes('/platnosci');
  const isScheduleCardsType =
    isCommonScheduleView || isAccountPastSchedulesView || isAccountDash;

  const monthMap = {
    '01': 'Styczeń',
    '02': 'Luty',
    '03': 'Marzec',
    '04': 'Kwiecień',
    '05': 'Maj',
    '06': 'Czerwiec',
    '07': 'Lipiec',
    '08': 'Sierpień',
    '09': 'Wrzesień',
    10: 'Październik',
    11: 'Listopad',
    12: 'Grudzień',
  };

  const chooseContent = (row, index) => {
    let isActive;
    if (isPaymentsView) {
      // console.log('isPaymentsView triggered');
      const cardTypeModifier = `${row.paymentMethod} ${
        row.performedBy != 'Customer' ? `(${row.performedBy})` : ''
      }`;

      const cardCircle = formatPaymentStatus(row.status);

      return {
        // isActive,
        cardId: row.rowId || '',
        cardTypeModifier,
        cardCircle,
        cardTitle: `${row.product}`,
        squareTop: '',
        squareMiddle: <SymbolOrIcon specifier={'attach_money'} />,
        squareBottom: '',
        description: `${row.amountPaid} zł`,
        dimmedDescription: ` - ${formatIsoDateTime(row.cardDate)}`,
        cardFooter: ``,
        typeIcon: 'credit_card',
        descriptionIcon: 'sell',
        footerIcon: '',
        titleIcon: 'inventory',
      };
    } else if (isCustomerPassesView) {
      // console.log('isCustomerPassesView triggered');

      const expiryDate = row.validUntil;
      let day = '-',
        month = '-',
        year = '-',
        monthName = '-';

      const typePart = JSON.parse(row.allowedProductTypes)
        .map(type => {
          const clean = type.trim().toLowerCase();
          return clean.charAt(0).toUpperCase() + clean.slice(1);
        })
        .join(', ');

      if (expiryDate) {
        const dateParts = expiryDate.slice(0, 10).split('-'); // [2025, 04, 19]
        // console.log(dateParts);
        day = dateParts[2];
        month = dateParts[1];
        year = dateParts[0];
        monthName = monthMap[month] || '';
      }

      const isTimeType = row.passType.toUpperCase() == 'TIME';
      const chosenSquareTop = isTimeType ? getWeekDay(expiryDate) : `Sesje`;
      const chosenSquareMiddle = isTimeType ? day : row.usesLeft;
      const chosenSquareBottom = isTimeType
        ? `${monthName} ${year}`
        : `(${
            Number(row.status) == 1
              ? 'Aktywny'
              : Number(row.status) == 0
              ? 'Zawieszony'
              : 'Karnet wygasł'
          })`;

      return {
        // isActive,
        cardId: row.rowId || '',
        cardTypeModifier: typePart || '',
        cardCircle: ``,
        cardTitle: `${row.passName}`,
        squareTop: chosenSquareTop,
        squareMiddle: chosenSquareMiddle,
        squareBottom: chosenSquareBottom,
        description: `${formatIsoDateTime(row.validFrom, false)}`,
        dimmedDescription: ' - (Data rozpoczęcia)',
        cardFooter: `${formatIsoDateTime(expiryDate, false)}`,
        typeIcon: 'category',
        descriptionIcon: 'event_available',
        footerIcon: 'event_upcoming',
        titleIcon: 'card_membership',
      };
    } else if (isBookingsView) {
      // console.log('isBookingsView triggered');

      const scheduleDate = row.scheduleDate;
      let day = '-',
        month = '-',
        year = '-',
        monthName = '-';

      if (scheduleDate) {
        const dateParts = scheduleDate.slice(0, 10).split('-'); // [2025, 04, 19]
        // console.log(dateParts);
        day = dateParts[2];
        month = dateParts[1];
        year = dateParts[0];
        monthName = monthMap[month] || '';
      }
      const wasAltered = row.cardCreatedAt != row.cardTimestamp;
      const dimmedDescription = ` (data${wasAltered ? ' 1.' : ' '}rezerwacji)`;
      const cardFooter = wasAltered
        ? `Edytowano: ${formatIsoDateTime(row.cardTimestamp, false)}`
        : '';
      const footerIcon = wasAltered ? 'calendar_clock' : '';

      return {
        isActive: false,
        cardId: row.rowId || '',
        cardTypeModifier: row.payment || '',
        cardCircle: formatAttendance(row.attendance),
        cardTitle: `${row.scheduleName}`,
        squareTop: getWeekDay(scheduleDate) || '-',
        squareMiddle: day || '',
        squareBottom: `${monthName} ${year}` || '',
        description: `${formatIsoDateTime(row.cardCreatedAt, false)}`,
        dimmedDescription,
        cardFooter,
        typeIcon: 'credit_card',
        descriptionIcon: 'event_available',
        footerIcon,
      };
    } else if (isScheduleCardsType) {
      // console.log('isScheduleCardsType triggered');

      const isArchived =
        new Date(
          `${row.date?.split('.').reverse().join('-')}T${
            row.startTime ?? '00:00:00'
          }`
        ) < new Date();
      const hasValidPass =
        isAdminView || isAvailablePassesView || isAccountView
          ? true
          : hasValidPassFn(status, row);

      let quickActionBtn = null;
      let quickBtnRawSymbol = '';
      if (!isAccountView && Array.isArray(onQuickAction) && onQuickAction[0]) {
        quickBtnRawSymbol = pickCustomerSymbol(
          row,
          isArchived,
          onQuickAction[0].symbol,
          hasValidPass,
          isAvailablePassesView,
          isAdminPage,
          adminActions,
          isLoggedIn,
          isCustomer,
          isAdmin
        );

        isActive =
          quickBtnRawSymbol == 'restore' ||
          quickBtnRawSymbol == 'calendar_add_on';

        const quickActionSymbol = getSymbol(
          row,
          hasValidPass,
          isArchived,
          onQuickAction[0],
          isAvailablePassesView,
          isAdminPage,
          adminActions,
          isLoggedIn,
          isCustomer,
          isAdmin
        );

        quickActionBtn = (
          <div className='action-btns'>
            <button
              key={index}
              className={`form-action-btn symbol-only-btn symbol-only-btn--submit`}
              onClick={e => {
                onRowBtnClick(
                  row,
                  isArchived,
                  onQuickAction[0].method,
                  status,
                  isAdminView,
                  isAvailablePassesView,
                  isAccountView,
                  isCustomer,
                  isAdmin,
                  e
                );
              }}
            >
              {quickActionSymbol}
            </button>
          </div>
        );
      }

      let durationRaw, durationHH, durationMM;
      if (row.productDuration) {
        durationRaw = row.productDuration?.split(':')?.slice(0, 2);
        durationHH = String(Number(durationRaw[0]));
        durationMM = String(Number(durationRaw[1]));
      }

      let day, month, year, monthName;
      if (row.date) {
        const isPLDate = row.date.includes('.');
        const dateParts = isPLDate
          ? row.date?.split('.')
          : row.date?.split('-'); // [2025, 04, 19] ||
        // console.log(dateParts);
        day = isPLDate ? dateParts[0] : dateParts[2];
        month = dateParts[1];
        year = isPLDate ? dateParts[2] : dateParts[0];
        monthName = monthMap[month] || '';
      }
      let type;
      // console.log('row.productType', row.productType);

      const typePart = row.productType?.slice(1).toLowerCase();
      type = row.productType[0] + typePart;

      return {
        isActive,
        cardTypeModifier: type,
        cardId: row.rowId || '',
        cardCircle: quickActionBtn || '',
        cardTitle: row.productName || row.product || '',
        squareTop: row.day || '',
        squareMiddle: day || '',
        squareBottom: `${monthName} ${year}` || '',
        dimmedDescription:
          durationMM !== '0'
            ? ` (${durationHH}h ${durationMM}min)`
            : ` (${durationHH}h)`,
        description: row.startTime || '',
        cardFooter: row.location || '',
        descriptionIcon: 'schedule',
        typeIcon: 'category',
        footerIcon: 'location_on',
      };
    } else if (isAvailablePassesView) {
      // console.log('isAvailablePassesView triggered');
      let typePart = '';
      if (row.allowedProductTypes) {
        typePart = row.allowedProductTypes
          .split(',')
          .map(type => {
            const clean = type.trim().toLowerCase();
            return clean.charAt(0).toUpperCase() + clean.slice(1);
          })
          .join(', ');
      }

      return {
        // isActive,
        cardId: row.rowId || '',
        cardTypeModifier: typePart,
        cardCircle: '',
        cardTitle: row.name || row.product || '',
        squareTop: 'Sesje',
        squareMiddle:
          row.usesTotal !== '-' ? (
            row.usesTotal
          ) : (
            <SymbolOrIcon specifier='all_inclusive' />
          ),
        squareBottom: '',
        description: row.description,
        dimmedDescription: '',
        cardFooter: row.validityDays,
        footerIcon: 'calendar_month',
        descriptionIcon: '',
        typeIcon: 'category',
        titleIcon: 'card_membership',
      };
    }
    return {
      cardTypeModifier: '',
      cardId: '',
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
  };

  const list = content.map((row, index) => {
    const {
      isActive,
      cardTypeModifier,
      cardId,
      cardCircle,
      cardTitle,
      squareTop,
      squareMiddle,
      squareBottom,
      description,
      dimmedDescription,
      cardFooter,
      titleIcon = 'self_improvement',
      typeIcon = 'category',
      descriptionIcon,
      footerIcon,
    } = chooseContent(row, index);

    const isArchived =
      new Date(
        `${row.date?.split('.').reverse().join('-')}T${
          row.startTime ?? '00:00:00'
        }`
      ) < new Date();

    const cardConditionalClass = `card${active ? ` card--active` : ''}${
      !isAdminPage
        ? row.isUserGoing && status?.isLoggedIn
          ? ' booked'
          : ''
        : ''
    }${
      !isAdminPage && !notToArchive
        ? isArchived && !isAdminPage
          ? ' archived'
          : ''
        : ''
    }${row.full && !isAdminView ? ' full' : ''}`;

    return (
      <div
        key={index}
        className={cardConditionalClass}
        onClick={() => active && onOpen(row)}
      >
        <div className='card__square'>
          <div className='card__square--top'>{squareTop}</div>
          <div className='card__square--middle'>{squareMiddle}</div>
          <div className='card__square--bottom'>{squareBottom}</div>
        </div>

        <div className='card__modifier'>
          <SymbolOrIcon specifier={typeIcon} classModifier={'secondary'} />
          <span className='card__single-content'>{cardTypeModifier}</span>
        </div>

        <div className='card__id'>
          <SymbolOrIcon specifier='badge' classModifier={'secondary'} />
          <span className='card__single-content'>{cardId}</span>
        </div>

        <div className='card__title'>
          <SymbolOrIcon specifier={titleIcon} />
          <span className='card__single-content'>{cardTitle}</span>
        </div>

        <div className='card__desc'>
          {descriptionIcon && <SymbolOrIcon specifier={descriptionIcon} />}
          <span className='card__single-content'>
            {description}
            <span className='card__single-content--secondary'>
              {dimmedDescription}
            </span>
          </span>
        </div>

        <div
          className={`card__circle${isActive ? ` card__circle--active` : ''}`}
        >
          <span className='card__single-content'>{cardCircle}</span>
        </div>

        <div className='card__footer'>
          <SymbolOrIcon specifier={footerIcon} />
          <span className='card__single-content'>{cardFooter}</span>
        </div>
      </div>
    );
  });

  return (
    <>
      <div className='cards-container'>{list}</div>
    </>
  );
}

export default CardsList;
