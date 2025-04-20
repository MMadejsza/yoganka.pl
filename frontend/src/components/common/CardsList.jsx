import { useLocation } from 'react-router-dom';
import { hasValidPassFn } from '../../utils/userCustomerUtils';
import SymbolOrIcon from './SymbolOrIcon.jsx';

function CardsList({
  content,
  active,
  onOpen,
  onQuickAction,
  status,
  isAdminPage,
  adminActions,
}) {
  console.log(`✅ CardsList Data: `);
  console.log(content);
  const isLoggedIn =
      status?.isLoggedIn != undefined ? status.isLoggedIn : 'N/A',
    isCustomer = status?.role === 'CUSTOMER',
    isAdmin = status?.role === 'ADMIN';
  const location = useLocation();
  const isAdminView = location.pathname.includes('admin-console');
  const isAvailablePassesView = location.pathname.includes('grafik/karnety');
  const isCommonScheduleView = location.pathname.includes('/grafik');

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

  // const formatValue = (value, keyClass) => {
  //   let val = value;
  //   if (value != undefined && typeof value == 'boolean') {
  //     val = (
  //       <span
  //         className={`material-symbols-rounded nav__icon nav__icon--${keyClass}`}
  //       >
  //         {value == true ? 'check' : 'close'}
  //       </span>
  //     );
  //   }
  //   if (value == undefined) {
  //     val = '';
  //   }
  //   return val;
  // };

  const onRowBtnClick = (row, archived, method, e) => {
    const isUserGoing = row.isUserGoing != undefined ? row.isUserGoing : false;
    const isArchived = archived != undefined ? archived : 'N/A';
    const isAuthorized =
      status?.role != undefined ? isCustomer || isAdmin : 'N/A';
    const hasPass =
      isAdminView || isAvailablePassesView ? true : hasValidPassFn(status, row);

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

  const list = content.map((row, index) => {
    let isActive,
      cardTypeModifier,
      cardId,
      cardCircle,
      cardTitle,
      dimmedDescription,
      squareTop,
      squareMiddle,
      squareBottom,
      description,
      cardFooter,
      descriptionIcon,
      footerIcon;

    if (isCommonScheduleView && !isAvailablePassesView) {
      const isArchived =
        new Date(
          `${row.date?.split('.').reverse().join('-')}T${
            row.startTime ?? '00:00:00'
          }`
        ) < new Date();
      const hasValidPass =
        isAdminView || isAvailablePassesView
          ? true
          : hasValidPassFn(status, row);
      const quickBtnRawSymbol = pickCustomerSymbol(
        row,
        isArchived,
        onQuickAction[0].symbol,
        hasValidPass,
        isAvailablePassesView
      );

      isActive =
        quickBtnRawSymbol == 'restore' || quickBtnRawSymbol == 'calendar_add_on'
          ? true
          : false;

      const quickActionSymbol = getSymbol(
        row,
        hasValidPass,
        isArchived,
        onQuickAction[0]
      );
      const quickActionBtn = (
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

      const durationRaw = row.productDuration.split(':').slice(0, 2);
      const durationHH = String(Number(durationRaw[0]));
      const durationMM = String(Number(durationRaw[1]));

      const dateParts = row.date.split('.'); // [2025, 04, 19]
      const day = dateParts[0];
      const month = dateParts[1];
      const year = dateParts[2];
      const monthName = monthMap[month] || '';

      const typePart = row.productType.slice(1).toLowerCase();
      const type = row.productType[0] + typePart;

      cardTypeModifier = type || row.paymentMethod || '';
      cardId = row.rowId || '';
      cardCircle = quickActionBtn || `status`;
      cardTitle = row.productName || row.product || '';
      squareTop = row.day || '';
      squareMiddle = day || '';
      squareBottom = `${monthName} ${year}` || '';
      dimmedDescription =
        durationMM != '0'
          ? ` (${durationHH}h ${durationMM}min)`
          : ` (${durationHH}h)`;
      description = row.startTime || '';
      cardFooter = row.location || `status - time`;
      descriptionIcon = 'schedule';
      footerIcon = 'location_on';
    } else if (isAvailablePassesView) {
      const typePart = row.allowedProductTypes
        .split(',')
        .map(type => {
          const clean = type.trim().toLowerCase();
          return clean.charAt(0).toUpperCase() + clean.slice(1);
        })
        .join(', ');

      cardId = row.rowId || '';
      cardTypeModifier = typePart || '';
      cardCircle = '';
      cardTitle = row.name || row.product || '';
      squareTop = 'Sesje';
      squareMiddle =
        row.usesTotal != '-' ? (
          row.usesTotal
        ) : (
          <SymbolOrIcon specifier='all_inclusive' />
        );
      squareBottom = ``;
      description = row.description;
      dimmedDescription = '';
      cardFooter = row.validityDays;
      footerIcon = 'calendar_month';
    }

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
          <SymbolOrIcon specifier='category' classModifier={'secondary'} />
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
