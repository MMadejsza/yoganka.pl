import { useLocation } from 'react-router-dom';
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
}) {
  console.log(`✅ CardsList Data: `);
  console.log(content);
  const isLoggedIn =
      status?.isLoggedIn != undefined ? status?.isLoggedIn : 'N/A',
    isCustomer = status?.role === 'CUSTOMER',
    isAdmin = status?.role === 'ADMIN';
  const location = useLocation();
  const isAdminView = location.pathname.includes('admin-console');
  const isCustomerPassesView = location.pathname.includes('konto/karnety');
  const isAvailablePassesView = location.pathname.includes('grafik/karnety');
  const isAccountView = location.pathname.includes('/konto');
  const isCommonScheduleView = location.pathname.includes('/grafik');
  const isBookingsView = location.pathname.includes('/rezerwacje');
  const isPaymentsView = location.pathname.includes('/platnosci');

  const pickCustomerSymbol = (
    row,
    isArchived,
    symbol,
    hasValidPass,
    isAvailablePassesView
  ) => {
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
  };

  const getSymbol = (row, hasValidPass, isArchived, action) => {
    // console.log('hasValidPass', hasValidPass);
    const conditionalClass = `material-symbols-rounded nav__icon${
      row.isActionDisabled === true ? ' dimmed' : ''
    }${action.extraClass ? ` ${action.extraClass}` : ''}${
      !hasValidPass && !row.isUserGoing && !row.wasUserReserved ? ` black` : ''
    }`;

    return (
      <span className={conditionalClass}>
        {pickCustomerSymbol(
          row,
          isArchived,
          action.symbol,
          hasValidPass,
          isAvailablePassesView
        )}
      </span>
    );
  };

  const formatAttendance = value => {
    let val = value;

    if (value == undefined) {
      val = '';
    } else if (value != undefined && typeof value == 'boolean') {
      val = value == true ? 'check' : 'close';
    }

    return <SymbolOrIcon specifier={val} classModifier={'attendance'} />;
  };

  const formatPaymentStatus = value => {
    let val = value.toUpperCase();
    let symbol = 'pending';

    if (value == undefined) return;

    if (val == 'COMPLETED' || val == 'PAID') {
      symbol = 'check';
    }
    if (val == 0) {
      symbol = val == 1 ? 'check' : val == 0 ? 'pending' : 'close';
    }

    return <SymbolOrIcon specifier={symbol} />;
  };

  const onRowBtnClick = (row, archived, method, e) => {
    const isUserGoing = row.isUserGoing != undefined ? row.isUserGoing : false;
    const isArchived = archived != undefined ? archived : 'N/A';
    const isAuthorized =
      status?.role != undefined ? isCustomer || isAdmin : 'N/A';
    const hasPass =
      isAdminView || isAvailablePassesView || isAccountView
        ? true
        : hasValidPassFn(status, row);

    if (!isUserGoing && isLoggedIn && !isArchived && isAuthorized && hasPass) {
      e.stopPropagation();
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
  };

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
      const creationDate = row.cardDate;
      let day = '-',
        month = '-',
        year = '-',
        monthName = '-';

      if (row.cardDate) {
        const dateParts = row.cardDate.slice(0, 10).split('-'); // [2025, 04, 19]
        // console.log(dateParts);
        day = dateParts[2];
        month = dateParts[1];
        year = dateParts[0];
        monthName = monthMap[month] || '';
      }
      const cardTypeModifier = `${row.paymentMethod} ${
        row.performedBy != 'Customer' ? `(${row.performedBy})` : ''
      }`;

      const cardCircle = formatPaymentStatus(row.status);

      return {
        isActive,
        cardId: row.rowId || '',
        cardTypeModifier,
        cardCircle,
        cardTitle: `${row.product}`,
        squareTop: getWeekDay(creationDate),
        squareMiddle: day,
        squareBottom: `${monthName} ${year}` || '',
        description: `${row.amountPaid} zł`,
        dimmedDescription: ` (${row.cardTime})`,
        cardFooter: ``,
        typeIcon: 'credit_card',
        descriptionIcon: 'sell',
        footerIcon: '',
      };
    } else if (isCustomerPassesView) {
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

      if (row.validUntil) {
        const dateParts = row.validUntil.slice(0, 10).split('-'); // [2025, 04, 19]
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
            row.status == 1
              ? 'Aktywny'
              : row.status == 0
              ? 'Zawieszony'
              : 'Karnet wygasł'
          })`;

      // const squareTopWithIcon = (
      //   <span className='card__square--top-content'>
      //     <SymbolOrIcon specifier='event_upcoming' />
      //     <br />
      //     <br />
      //     {getWeekDay(expiryDate)}
      //   </span>
      // );

      return {
        isActive,
        cardId: row.rowId || '',
        cardTypeModifier: typePart || '',
        cardCircle: ``,
        cardTitle: `${row.passName} (${row.passDefId})`,
        squareTop: chosenSquareTop,
        squareMiddle: chosenSquareMiddle,
        squareBottom: chosenSquareBottom,
        description: `${formatIsoDateTime(row.validFrom, false)}`,
        dimmedDescription: '',
        cardFooter: `${formatIsoDateTime(expiryDate, false)}`,
        typeIcon: 'category',
        descriptionIcon: 'event_available',
        footerIcon: 'event_upcoming',
      };
    } else if (isBookingsView) {
      const creationDate = row.cardCreatedAt;
      let day = '-',
        month = '-',
        year = '-',
        monthName = '-';

      if (row.cardCreatedAt) {
        const dateParts = row.cardCreatedAt.slice(0, 10).split('-'); // [2025, 04, 19]
        // console.log(dateParts);
        day = dateParts[2];
        month = dateParts[1];
        year = dateParts[0];
        monthName = monthMap[month] || '';
      }
      return {
        isActive,
        cardId: row.rowId || '',
        cardTypeModifier: row.payment || '',
        cardCircle: formatAttendance(row.attendance),
        cardTitle: `${row.scheduleName} (${row.scheduleId})`,
        squareTop: getWeekDay(creationDate) || '-',
        squareMiddle: day || '',
        squareBottom: `${monthName} ${year}` || '',
        description: `${formatIsoDateTime(row.cardCreatedAt, false)}`,
        dimmedDescription: '',
        cardFooter: '',
        typeIcon: 'credit_card',
        descriptionIcon: 'event',
        footerIcon: '',
      };
    } else if (
      (isCommonScheduleView || isAccountView) &&
      !isAvailablePassesView
    ) {
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
          isAvailablePassesView
        );

        isActive =
          quickBtnRawSymbol == 'restore' ||
          quickBtnRawSymbol == 'calendar_add_on';

        const quickActionSymbol = getSymbol(
          row,
          hasValidPass,
          isArchived,
          onQuickAction[0]
        );

        quickActionBtn = (
          <div className='action-btns'>
            <button
              key={index}
              className={`form-action-btn symbol-only-btn symbol-only-btn--submit`}
              onClick={e => {
                onRowBtnClick(row, isArchived, onQuickAction[0].method, e);
              }}
            >
              {quickActionSymbol}
            </button>
          </div>
        );
      } else {
        isActive = false;
      }

      const durationRaw = row.productDuration.split(':').slice(0, 2);
      const durationHH = String(Number(durationRaw[0]));
      const durationMM = String(Number(durationRaw[1]));

      const isPLDate = row.date.includes('.');
      const dateParts = isPLDate ? row.date?.split('.') : row.date?.split('-'); // [2025, 04, 19] ||
      // console.log(dateParts);
      const day = isPLDate ? dateParts[0] : dateParts[2];
      const month = dateParts[1];
      const year = isPLDate ? dateParts[2] : dateParts[0];
      const monthName = monthMap[month] || '';

      const typePart = row.productType.slice(1).toLowerCase();
      const type = row.productType[0] + typePart;
      return {
        isActive,
        cardTypeModifier: type || row.paymentMethod || '',
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
        cardFooter: row.location || 'status - time',
        descriptionIcon: 'schedule',
        typeIcon: 'category',
        footerIcon: 'location_on',
      };
    } else if (isAvailablePassesView) {
      const typePart = row.allowedProductTypes
        .split(',')
        .map(type => {
          const clean = type.trim().toLowerCase();
          return clean.charAt(0).toUpperCase() + clean.slice(1);
        })
        .join(', ');
      return {
        isActive,
        cardId: row.rowId || '',
        cardTypeModifier: typePart || '',
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
      };
    }
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
      typeIcon = 'category',
      descriptionIcon,
      footerIcon,
    } = chooseContent(row, index);

    return (
      <div
        key={index}
        className={`card${active ? ` card--active` : ''}`}
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
          <SymbolOrIcon specifier='self_improvement' />
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
