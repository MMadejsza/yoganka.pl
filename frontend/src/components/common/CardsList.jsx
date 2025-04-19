import { useLocation } from 'react-router-dom';
import { hasValidPassFn } from '../../utils/userCustomerUtils';
import SymbolOrIcon from './SymbolOrIcon.jsx';

function CardsList({
  content,
  headers,
  keys,
  active,
  classModifier,
  onOpen,
  onQuickAction,
  status,
  isAdminPage,
  adminActions,
  notToArchive = false,
}) {
  const isLoggedIn =
      status?.isLoggedIn != undefined ? status.isLoggedIn : 'N/A',
    isCustomer = status?.role === 'CUSTOMER',
    isAdmin = status?.role === 'ADMIN';
  const location = useLocation();
  const isAdminView = location.pathname.includes('admin-console');
  const isUserPassesView = location.pathname.includes('grafik/karnety');

  const pickCustomerSymbol = (
    row,
    isArchived,
    symbol,
    hasValidPass,
    isUserPassesView
  ) => {
    if (isAdminPage && adminActions) {
      return symbol;
    } else if (isLoggedIn && (isCustomer || isAdmin)) {
      if (row.isUserGoing) return 'check';
      else if (row.full || isArchived) return 'block';
      else if (row.wasUserReserved) return 'restore';
      else if (hasValidPass && !isUserPassesView) return 'calendar_add_on';
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
          isUserPassesView
        )}
      </span>
    );
  };

  const formatValue = (value, keyClass) => {
    let val = value;
    if (value != undefined && typeof value == 'boolean') {
      val = (
        <span
          className={`material-symbols-rounded nav__icon nav__icon--${keyClass}`}
        >
          {value == true ? 'check' : 'close'}
        </span>
      );
    }
    if (value == undefined) {
      val = '';
    }
    return val;
  };

  const onRowBtnClick = (row, archived, method, e) => {
    const isUserGoing = row.isUserGoing != undefined ? row.isUserGoing : false;
    const isArchived = archived != undefined ? archived : 'N/A';
    const isAuthorized =
      status?.role != undefined ? isCustomer || isAdmin : 'N/A';
    const hasPass =
      isAdminView || isUserPassesView ? true : hasValidPassFn(status, row);
    // console.log('onRowBtnClick:', {
    //   isUserGoing: isUserGoing,
    //   isLoggedIn: isLoggedIn,
    //   isArchived,
    //   role: status?.role,
    //   isAuthorized,
    //   method: method,
    // });

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
    const isArchived =
      new Date(
        `${row.date?.split('.').reverse().join('-')}T${
          row.startTime ?? '00:00:00'
        }`
      ) < new Date();
    const hasValidPass =
      isAdminView || isUserPassesView ? true : hasValidPassFn(status, row);
    const quickBtnRawSymbol = pickCustomerSymbol(
      row,
      isArchived,
      onQuickAction[0].symbol,
      hasValidPass,
      isUserPassesView
    );

    const isActive =
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
    const duration =
      durationMM != '0'
        ? ` (${durationHH}h ${durationMM}min)`
        : ` (${durationHH}h)`;

    const dateParts = row.date.split('.'); // [2025, 04, 19]
    const day = dateParts[0];
    const month = dateParts[1];
    const year = dateParts[2];
    const monthName = monthMap[month] || '';

    const typePart = row.productType.slice(1).toLowerCase();
    const type = row.productType[0] + typePart;

    const cardTypeModifier = type || row.paymentMethod || '';
    const cardId = row.rowId || '';
    const cardCircle = quickActionBtn || `status`;
    const cardTitle = row.productName || row.product || '';
    const cardWeekDay = row.day || '';
    const cardDay = day || '';
    const cardYear = `${monthName} ${year}` || '';
    const cardTime = row.startTime || '';
    const cardFooter = row.location || `status - time`;

    return (
      <div
        key={index}
        className={`card${active ? ` card--active` : ''}`}
        onClick={() => active && onOpen(row)}
      >
        <div className='card__date'>
          <div className='card__date--day-name'>{cardWeekDay}</div>
          <div className='card__date--day'>{cardDay}</div>
          <div className='card__date--year'>{cardYear}</div>
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
          <SymbolOrIcon specifier='schedule' />
          <span className='card__single-content'>
            {cardTime}
            <span className='card__single-content--secondary'>{duration}</span>
          </span>
        </div>

        <div
          className={`card__status-circle${
            isActive ? ` card__status-circle--active` : ''
          }`}
        >
          <span className='card__single-content'>{cardCircle}</span>
        </div>

        <div className='card__footer'>
          <SymbolOrIcon specifier='location_on' />
          <span className='card__single-content'>{cardFooter}</span>
        </div>
      </div>
      //   <div key={index} className='card'>
      //     <div className='card__left-section'>
      //       <div className='card__date'>
      //         <div className='card__date--day-name'>{cardWeekDay}</div>
      //         <div className='card__date--day'>{cardDay}</div>
      //         <div className='card__date--year'>{cardYear}</div>
      //       </div>
      //     </div>
      //     <div className='card__right-section'>
      //       <div className='card__top'>
      //         <div className='card__modifier'>{cardTypeModifier}</div>
      //         <div className='card__id'>{cardId}</div>
      //       </div>
      //       <div className='card__body'>
      //         <div className='card__body-section'>
      //           <div className='card__title'>{cardTitle}</div>
      //           <div className='card__desc'>{cardTime}</div>
      //         </div>
      //         <div className='card__body-section'>
      //           <div className='card__status-circle'>{cardCircle}</div>
      //         </div>
      //       </div>
      //       <div className='card__footer'>{cardFooter}</div>
      //     </div>
      //   </div>
    );
  });

  return (
    <>
      <div className='cards-container'>{list}</div>
    </>
  );
}

export default CardsList;
