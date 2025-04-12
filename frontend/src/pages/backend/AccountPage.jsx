import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TabsList from '../../components/backend/TabsList.jsx';
import ViewAccountBookings from '../../components/backend/views/ViewAccountBookings.jsx';
import ViewAccountCustomerPasses from '../../components/backend/views/ViewAccountCustomerPasses.jsx';
import ViewAccountDashboard from '../../components/backend/views/ViewAccountDashboard.jsx';
import ViewAccountPayments from '../../components/backend/views/ViewAccountPayments.jsx';
import ViewAccountSchedulesHistory from '../../components/backend/views/ViewAccountSchedulesHistory.jsx';
import ViewUser from '../../components/backend/views/ViewUser.jsx';
import Section from '../../components/frontend/Section.jsx';
import { fetchItem } from '../../utils/http.js';

const menuSet = [
  // {
  // 	name: 'Statystyki',
  // 	symbol: 'bar_chart',
  // 	link: 'statystyki',
  // },
  {
    name: 'Konto',
    symbol: 'home',
    link: '/konto',
  },
  {
    name: 'Historia odbytych zajęć',
    symbol: 'history',
    link: 'zajecia',
    limitedTo: 'customer',
  },
  {
    name: 'Wszystkie rezerwacje',
    symbol: 'event_available',
    link: 'rezerwacje',
    limitedTo: 'customer',
  },
  {
    name: 'Karnety',
    symbol: 'local_activity',
    link: 'karnety',
    limitedTo: 'customer',
  },
  {
    name: 'Płatności',
    symbol: 'payments',
    link: 'platnosci',
    limitedTo: 'customer',
  },
  // {
  // 	name: 'Faktury',
  // 	symbol: 'receipt_long',
  // 	link: 'faktury',
  // },
  {
    name: 'Ustawienia',
    symbol: 'settings',
    link: 'ustawienia',
  },
];

function AccountPage() {
  // console.log(`✅ AccountPAge: `);
  const location = useLocation();
  const accountTab = location.pathname; //.split('/').pop();
  console.log(accountTab);
  const [isChosenContent, setIsChosenContent] = useState(accountTab);

  useEffect(() => {
    setIsChosenContent(accountTab);
  }, [accountTab]);

  const { data, isError, error } = useQuery({
    queryKey: ['account'],
    queryFn: ({ signal }) => fetchItem('/show-account', { signal }),
    // staleTime: 300000,
    // refetchOnMount: false,
    // keepPreviousData: true, // when changing state
  });

  let userTabs, name, content, customer;

  if (data) {
    console.log('AccountPage data: ', data);
    if (data.customer) {
      customer = data.customer;
      name = `${customer.firstName} ${customer.lastName}`;
    } else {
      name = data.user.email;
      console.log(name);
    }

    userTabs = <TabsList menuSet={menuSet} onClick={setIsChosenContent} />;

    switch (true) {
      case isChosenContent.includes('zajecia'):
        content = (
          <ViewAccountSchedulesHistory data={data} isUserAccountPage={true} />
        );
        break;
      case isChosenContent.includes('rezerwacje'):
        content = <ViewAccountBookings data={data} isUserAccountPage={true} />;
        break;
      case isChosenContent.includes('karnety'):
        content = (
          <ViewAccountCustomerPasses data={data} isUserAccountPage={true} />
        );
        break;
      case isChosenContent.includes('platnosci'):
        content = <ViewAccountPayments data={data} isUserAccountPage={true} />;
        break;
      case isChosenContent.includes('ustawienia'):
        content = <ViewUser data={data} isUserAccountPage={true} />;
        break;

      default:
        content = (
          <ViewAccountDashboard
            data={data}
            queryStatus={{ isError: isError, error: error }}
          />
        );
        break;
    }
  }

  return (
    <div className='admin-console'>
      <Section classy='admin-intro' header={name} />
      {userTabs}
      {content}
    </div>
  );
}

export default AccountPage;
