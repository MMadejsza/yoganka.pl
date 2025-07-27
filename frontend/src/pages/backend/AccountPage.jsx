import { useQuery } from '@tanstack/react-query';
import { Suspense, lazy, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import TabsList from '../../components/backend/TabsList.jsx';
import Loader from '../../components/common/Loader.jsx';
import Section from '../../components/frontend/Section.jsx';
import { fetchItem, queryClient } from '../../utils/http.js';
const ViewAccountBookings = lazy(() =>
  import('../../components/backend/views/ViewAccountBookings.jsx')
);
const ViewAccountCustomerPasses = lazy(() =>
  import('../../components/backend/views/ViewAccountCustomerPasses.jsx')
);
const ViewAccountDashboard = lazy(() =>
  import('../../components/backend/views/ViewAccountDashboard.jsx')
);
const ViewAccountPayments = lazy(() =>
  import('../../components/backend/views/ViewAccountPayments.jsx')
);
const ViewAccountSchedulesHistory = lazy(() =>
  import('../../components/backend/views/ViewAccountSchedulesHistory.jsx')
);
const ViewUser = lazy(() =>
  import('../../components/backend/views/ViewUser.jsx')
);

const menuSet = [
  // {
  // 	name: 'Statystyki',
  // 	symbol: 'bar_chart',
  // 	link: 'statystyki',
  // },
  {
    name: 'Profil',
    symbol: 'account_circle',
    link: '/konto',
  },
  {
    name: 'Wszystkie rezerwacje',
    symbol: 'event_available',
    link: 'rezerwacje',
    limitedTo: 'customer',
  },
  {
    name: 'Odbyte zajęcia',
    symbol: 'history',
    link: 'zajecia',
    limitedTo: 'customer',
  },
  {
    name: 'Karnety',
    symbol: 'card_membership',
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
  // {
  //   name: 'Ustawienia',
  //   symbol: 'settings',
  //   link: 'ustawienia',
  // },
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

  useEffect(() => {
    if (location.search.includes('payment=success')) {
      queryClient.invalidateQueries(['authStatus']);
    }
  }, []);

  const cacheConfig = { staleTime: 1000 * 60 * 10, cacheTime: 1000 * 60 * 15 };
  const { data, isError, error } = useQuery({
    queryKey: ['account'],
    queryFn: ({ signal }) => fetchItem('/show-account', { signal }),
    ...cacheConfig,
  });

  let userTabs, name, content, customer;

  if (data) {
    console.log('AccountPage data: ', data);

    // Loading component based on url
    const wrap = element => (
      <Suspense fallback={<Loader label={'Ładowanie...'} />}>
        {element}
      </Suspense>
    );

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
        content = wrap(
          <ViewAccountSchedulesHistory data={data} isUserAccountPage={true} />
        );
        break;
      case isChosenContent.includes('/konto/grafik/'): // just to handle opening modal after reshuffling the components. this one must be rendered to open modal
        content = wrap(
          <ViewAccountDashboard data={data} queryStatus={{ isError, error }} />
        );
        break;
      case isChosenContent.includes('rezerwacje'):
        content = wrap(
          <>
            <ViewAccountDashboard
              data={data}
              queryStatus={{ isError: isError, error: error }}
            />
            <ViewAccountBookings data={data} isUserAccountPage={true} />
          </>
        );
        break;
      case isChosenContent.includes('karnety'):
        content = wrap(
          <ViewAccountCustomerPasses data={data} isUserAccountPage={true} />
        );
        break;
      case isChosenContent.includes('platnosci'):
        content = wrap(
          <ViewAccountPayments data={data} isUserAccountPage={true} />
        );
        break;
      // case isChosenContent.includes('ustawienia'):
      //   content = wrap(<ViewUser data={data} isUserAccountPage={true} />);
      //   break;

      default:
        // content = wrap(
        //   <ViewAccountDashboard
        //     data={data}
        //     queryStatus={{ isError: isError, error: error }}
        //   />
        // );
        content = wrap(<ViewUser data={data} isUserAccountPage={true} />);
        break;
    }
  }

  return (
    <>
      <Helmet>
        <html lang='pl' />
        <title>Panel użytkownika - Yoganka</title>
        <meta name='robots' content='noindex, nofollow' />
      </Helmet>

      <div className='backend-content-wrapper'>
        <Section classy='intro--admin' header={name} />
        {userTabs}
        {content}
      </div>
    </>
  );
}

export default AccountPage;
