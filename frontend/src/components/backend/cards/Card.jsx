import {
  formatAttendance,
  formatPaymentStatus,
  onRowBtnClick,
} from '../../../utils/cardsAndTableUtils.jsx';
import SymbolOrIcon from '../../common/SymbolOrIcon.jsx';
// Presentational component: renders a card based on props.content and flags.
export default function Card({
  content,
  row,
  active,
  onOpen,
  status = {},
  isAdminPage,
  notToArchive,
  flags,
  idx,
}) {
  const {
    isActive,
    cardId,
    cardTypeModifier,
    cardCircle,
    cardTitle,
    squareTop,
    squareMiddle,
    squareMiddleIcon,
    squareBottom,
    description,
    dimmedDescription,
    cardFooter,
    titleIcon,
    typeIcon,
    descriptionIcon,
    footerIcon,
    quickActionSymbol,
    quickActionMethod,
  } = content;

  const isArchived =
    new Date(
      `${row.date?.split('.').reverse().join('-')}T${
        row.startTime || '00:00:00'
      }`
    ) < new Date();

  // Build CSS classes array
  const classes = [
    'card',
    active && 'card--active',
    !isAdminPage && row.isUserGoing && status.isLoggedIn && 'booked',
    !isAdminPage && !notToArchive && isArchived && 'archived',
    row.full && !flags.isAdminView && 'full',
  ]
    .filter(Boolean)
    .join(' ');

  // Decide what to render in the circle
  let circleContent = null;

  if (quickActionSymbol) {
    //Quick-action button
    // console.log('quickActionSymbol IS', quickActionSymbol);
    circleContent = (
      <div className='action-btns'>
        <button
          key={idx}
          className='form-action-btn symbol-only-btn symbol-only-btn--submit'
          onClick={e => {
            e.stopPropagation();
            onRowBtnClick(
              row,
              isArchived,
              quickActionMethod,
              status,
              flags.isAdminView,
              flags.isAvailablePassesView,
              flags.isAccountView,
              status.role === 'CUSTOMER',
              status.role === 'ADMIN',
              e
            );
          }}
        >
          <SymbolOrIcon specifier={quickActionSymbol} />
        </button>
      </div>
    );
  } else if (flags.isBookingsView) {
    //Booking view: attendance ✔ / ❌
    circleContent = formatAttendance(row.attendance);
  } else if (flags.isPaymentsView) {
    //Payment view: status  ✔ / ❌
    circleContent = formatPaymentStatus(row.status);
  } else if (cardCircle) {
    //Generic icon
    circleContent = <SymbolOrIcon specifier={cardCircle} />;
  }

  return (
    <div className={classes} onClick={() => active && onOpen(row)}>
      <div className='card__square'>
        <div className='card__square--top'>{squareTop}</div>
        <div className='card__square--middle'>
          {squareMiddleIcon ? (
            <SymbolOrIcon specifier={squareMiddleIcon} />
          ) : (
            squareMiddle
          )}
        </div>
        <div className='card__square--bottom'>{squareBottom}</div>
      </div>
      <div className='card__modifier'>
        <SymbolOrIcon specifier={typeIcon} classModifier='secondary' />
        <span className='card__single-content'>{cardTypeModifier}</span>
      </div>
      <div className='card__id'>
        <SymbolOrIcon specifier='badge' classModifier='secondary' />
        <span className='card__single-content'>{cardId}</span>
      </div>
      <div className='card__title'>
        <SymbolOrIcon specifier={titleIcon || typeIcon} />
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
      <div className={`card__circle${isActive ? ' card__circle--active' : ''}`}>
        <span className='card__single-content'>{circleContent}</span>
      </div>
      <div className='card__footer'>
        {footerIcon && <SymbolOrIcon specifier={footerIcon} />}
        <span className='card__single-content'>{cardFooter}</span>
      </div>
    </div>
  );
}
