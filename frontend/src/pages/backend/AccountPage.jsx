import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import UserTabs from '../../components/backend/UserTabs.jsx';
import ViewAccountDashboard from '../../components/backend/views/ViewAccountDashboard.jsx';
import ViewAccountPayments from '../../components/backend/views/ViewAccountPayments.jsx';
import ViewAccountSchedulesHistory from '../../components/backend/views/ViewAccountSchedulesHistory.jsx';
import ViewUser from '../../components/backend/views/ViewUser.jsx';
import Section from '../../components/frontend/Section.jsx';
import { fetchItem } from '../../utils/http.js';

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
    staleTime: 300000,
    refetchOnMount: false,
    keepPreviousData: true, // when changing state
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

    userTabs = <UserTabs onClick={setIsChosenContent} person={data} />;

    switch (true) {
      case isChosenContent.includes('zajecia'):
        content = <ViewAccountSchedulesHistory data={customer} />;
        break;
      case isChosenContent.includes('rezerwacje'):
        content = <ViewAccountPayments data={customer} />;
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
      <div className='user-container user-container--account modal__summary'>
        {content}
      </div>
    </div>
  );
}

export default AccountPage;
