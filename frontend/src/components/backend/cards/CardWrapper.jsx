import { useLocation } from 'react-router-dom';
import { getCardProps } from '../../../utils/cardsFactory.js';
import Card from './Card.jsx';

//Container component: computes view-flags and builds props, then renders CardView.
export default function CardWrapper(props) {
  const location = useLocation();
  const flags = {
    isPaymentsView: location.pathname.includes('/platnosci'),
    isCustomerPassesView: location.pathname.includes('konto/karnety'),
    // isBookingsView: location.pathname.includes('/rezerwacje'),
    isBookingsView: props.explicitType == 'booking',
    isAvailablePassesView: location.pathname.includes('grafik/karnety'),
    // isAccountView: location.pathname.includes('/konto'),
    isAccountView: location.pathname.includes('/konto'),
    isAdminView: location.pathname.includes('admin-console'),
    // isAccountDash: location.pathname.endsWith('/konto'),
    isAccountDash: props.explicitType == 'schedule',
    isCommonScheduleView: location.pathname.endsWith('/grafik'),
  };
  flags.isScheduleCardsType =
    flags.isCommonScheduleView ||
    location.pathname.includes('/konto/zajecia') ||
    props.explicitType == 'booking' ||
    flags.isAccountDash;

  const content = getCardProps(
    props.row,
    props.index,
    flags,
    props.status,
    props.onQuickAction,
    props.onQuickActionSymbol,
    props.adminActions
  );

  return <Card {...props} content={content} flags={flags} />;
}
