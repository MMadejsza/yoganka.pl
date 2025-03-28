import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchItem } from '../utils/http.js';

import AccountDashboard from '../components/adminConsole/AccountDashboard.jsx';
import AccountPayments from '../components/adminConsole/AccountPayments.jsx';
import AccountSchedulesHistory from '../components/adminConsole/AccountSchedulesHistory.jsx';
import AccountSettings from '../components/adminConsole/AccountSettings.jsx';
import UserTabs from '../components/adminConsole/UserTabs.jsx';
import Section from '../components/Section.jsx';

function AccountPage() {
  // console.log(`✅ AccountPAge: `);
  const location = useLocation();
  const accountTab = location.pathname.split('/').pop();
  console.log(accountTab);
  const [isChosenContent, setIsChosenContent] = useState(accountTab);

  // useEffect(() => {
  // 	setIsChosenContent(accountTab);
  // }, [accountTab]);

  const { data, isError, error } = useQuery({
    queryKey: ['account'],
    queryFn: ({ signal }) => fetchItem('/show-account', { signal }),
    staleTime: 0,
    refetchOnMount: true,
  });

  let userTabs, name, content, customer;

  if (data) {
    console.log('AccountPage data: ', data);
    if (data.customer) {
      customer = data.customer;
      name = `${customer.FirstName} ${customer.LastName}`;
    } else {
      name = data.user.Email;
      console.log(name);
    }

    userTabs = <UserTabs onClick={setIsChosenContent} person={data} />;

    switch (isChosenContent) {
      case 'zajecia':
        content = <AccountSchedulesHistory data={customer} />;
        break;
      case 'rezerwacje':
        content = <AccountPayments data={customer} />;
        break;
      case 'ustawienia':
        content = (
          <AccountSettings
            data={data}
            queryStatus={{ isError: isError, error: error }}
          />
        );
        break;

      default:
        content = (
          <AccountDashboard
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
