import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import ModalTable from '../../components/backend/ModalTable.jsx';
import SideNav from '../../components/backend/SideNav.jsx';
import TabsList from '../../components/backend/TabsList.jsx';
import TableCustomerPasses from '../../components/backend/views/tables/TableCustomerPasses.jsx';
import ViewsController from '../../components/backend/ViewsController.jsx';
import Section from '../../components/frontend/Section.jsx';
import { formatIsoDateTime } from '../../utils/dateTime.js';
import { fetchData, fetchStatus } from '../../utils/http.js';

const sideNavTabs = [
  { name: 'Konta', symbol: 'group', link: '/admin-console/show-all-users' },
  {
    name: 'Uczestnicy',
    symbol: 'sentiment_satisfied',
    link: '/admin-console/show-all-customers',
  },
  {
    name: 'Zajęcia',
    symbol: 'inventory',
    link: '/admin-console/show-all-products',
  },
  {
    name: 'Grafik',
    symbol: 'calendar_month',
    link: '/admin-console/show-all-schedules',
  },
  {
    name: `Rezerwacje`,
    symbol: 'event_available',
    link: '/admin-console/show-all-bookings',
  },
  {
    name: `Płatności`,
    symbol: 'payments',
    link: '/admin-console/show-all-payments',
  },
  {
    name: `Karnety`,
    symbol: 'local_activity',
    link: '/admin-console/show-all-passes',
  },
  // {
  //   name: `Faktury`,
  //   symbol: 'receipt_long',
  //   link: '/admin-console/show-all-invoices',
  // },
  // {
  //   name: `Newsletter'y`,
  //   symbol: 'contact_mail',
  //   link: '/admin-console/show-all-newsletters',
  // },
  {
    name: `Opinie`,
    symbol: 'reviews',
    link: '/admin-console/show-all-participants-feedback',
  },
];

const sideNavActions = [
  {
    name: 'Dodaj',
    symbol: 'add_circle',
    link: 'add-user',
  },
];
const noCreateOptionPages = [
  'show-all-schedules',
  'show-all-bookings',
  'show-all-customer-passes',
  'show-all-invoices',
  'show-all-newsletters',
  'show-all-participants-feedback',
];
const allowedPaths = sideNavTabs.map(tab => tab.link);
allowedPaths.push('/admin-console/show-all-customer-passes');
function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation(); // fetch current path
  const shouldAllowCreation = !noCreateOptionPages.some(lockedPath =>
    location.pathname.includes(lockedPath)
  );
  const isAdminPage = location.pathname.includes('admin-console') ?? false;
  const isInactiveTable = ['invoices', 'newsletters', 'feedback'].some(path =>
    location.pathname.includes(path)
  );
  const modalMatch = useMatch('/admin-console/show-all-users/:id');
  const [isModalOpen, setIsModalOpen] = useState(modalMatch);

  const query =
    location.pathname == '/admin-console/show-all-customer-passes'
      ? 'admin-console/show-all-passes'
      : location.pathname;
  const { data, isError, error } = useQuery({
    // as id for later caching received data to not send the same request again where location.pathname is key
    queryKey: ['data', query],
    // definition of the code sending the actual request- must be returning the promise
    queryFn: () => fetchData(query),
    // only when location.pathname is set extra beyond admin panel:
    enabled: allowedPaths.includes(location.pathname),
    // stopping unnecessary requests when jumping tabs
    staleTime: 10000,
    // how long tada is cached (default 5 mins)
    // gcTime:30000
  });

  const { data: status, isLoading: isStatusLoading } = useQuery({
    queryKey: ['authStatus'],
    queryFn: fetchStatus,
    cache: 'no-store',
  });

  const handleSwitchContent = link => {
    navigate(`${link}`, {
      state: { background: location },
    });
  };

  const handleOpenModal = row => {
    const recordId = row.rowId;
    setIsModalOpen(true);
    navigate(`${location.pathname}/${recordId}`, {
      state: { background: location },
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate(location.state?.background?.pathname || '/', { replace: true });
  };

  let table,
    keys,
    content = data?.content,
    headers,
    title,
    subTabs;
  const pickModifier = path => {
    let modifier;
    switch (true) {
      case path.includes('show-all-users'):
        modifier = 'user';
        title = 'Wszystkie konta';
        headers = [
          'Id',
          'Email',
          'Ostatni login',
          'Zarejestrowano',
          'Uprawnienia',
          'Preferencje',
        ];
        return modifier;
      case path.includes('show-all-customers'):
        modifier = 'customer';
        title = 'Wszyscy uczestnicy';
        headers = [
          'Id',
          'Konto',
          'Imię Nazwisko',
          'Urodzona',
          'Typ',
          'Kontakt',
          'Źródło polecenia	',
          'Lojalność',
          'Uwagi',
        ];
        return modifier;
      case path.includes('show-all-products'):
        modifier = 'product';
        title = 'Wszystkie zajęcia';
        headers = [
          'Id',
          'Rodzaj',
          'Nazwa',
          'Miejsce',
          'Czas trwania',
          'Zadatek',
          'Data rozpoczęcia',
          'Status',
        ];
        return modifier;
      case path.includes('show-all-schedules'):
        modifier = 'schedule';
        title = 'Wszystkie terminy';
        headers = [
          'Id',
          'Obecność',
          'Data',
          'Dzień',
          'Godzina',
          'Miejsce',
          'Typ',
          'Zajęcia',
          'Zadatek',
        ];
        return modifier;
      case path.includes('show-all-payments'):
        modifier = 'payment';
        title = 'Wszystkie płatności';
        headers = [
          'Id',
          'Data',
          'Uczestnik',
          'Produkty',
          'Status',
          'Metoda',
          'Kwota',
          'Wykonał',
        ];
        return modifier;
      case path.includes('show-all-participants-feedback'):
        modifier = 'feedback';
        title = 'Wszystkie opinie';
        headers = [
          'Id',
          'Wystawiono',
          'Opóźnienie',
          'Zajęcia',
          'Ocena',
          'Treść',
          'Uczestnik',
        ];
        return modifier;
      case path.includes('show-all-invoices'):
        modifier = 'invoice';
        title = 'Wszystkie faktury';
        headers = [
          'Id',
          'Płatność',
          'Wystawiono',
          'Uczestnik',
          'Termin płatności',
          'Status',
          'Kwota',
        ];
        return modifier;
      case path.includes('show-all-bookings'):
        modifier = 'booking';
        title = 'Wszystkie rezerwacje';

        let formattedContent = content?.map(booking => {
          return {
            ...booking,
            createdAt: formatIsoDateTime(booking.createdAt),
            timestamp: formatIsoDateTime(booking.timestamp),
          };
        });
        content = formattedContent;
        headers = [
          'Id',
          'Uczestnik',
          'Termin',
          'Płatność',
          'Obecność',
          'Utworzono',
          'Data akcji',
          'Wykonał',
        ];
        return modifier;
      case path.includes('show-all-passes'):
        modifier = 'passDef';
        title = 'Wszystkie definicje karnetów';

        subTabs = [
          {
            name: 'Zakupione',
            symbol: 'spa',
            link: '/admin-console/show-all-customer-passes',
          },
        ];
        headers = [
          'Id',
          'Nazwa',
          'Opis',
          'Typ',
          'Liczba wejść',
          'Ważność',
          'Zakres',
          'Cena',
        ];
        return modifier;
      case path.includes('show-all-customer-passes'):
        modifier = 'customerPass';
        title = 'Wszystkie zakupione karnety';
        subTabs = [
          {
            name: 'Definicje',
            symbol: 'category',
            link: '/admin-console/show-all-passes',
          },
        ];
        return modifier;
      case path.includes('show-all-newsletters'):
        modifier = 'newsletter';
        title = 'Wszystkie newslettery';
        headers = ['Id', 'Status', 'Utworzono', 'Wysłano', 'Tytuł', 'Treść'];
        return modifier;
      default:
        return (modifier = '');
    }
  };
  const pickedModifier = pickModifier(location.pathname);

  if (isStatusLoading) {
    return <div>Loading...</div>;
  }

  const adminTabs = (
    <TabsList
      menuSet={sideNavTabs}
      onClick={handleSwitchContent}
      classModifier='admin'
    />
  );

  if (isError) {
    if (error.code == 401) {
      navigate('/login');
      console.log(error.message);
    } else {
      window.alert(error.info?.message || 'Failed to fetch');
    }
  }
  if (data && status?.role === 'ADMIN') {
    console.log(`✅ Data: `);
    console.log(data);
    keys = data.totalKeys || data.totalHeaders;

    table = (
      <ModalTable
        classModifier='admin-view'
        headers={headers}
        keys={keys}
        content={content}
        active={!isInactiveTable}
        onOpen={handleOpenModal}
        status={status}
        isAdminPage={isAdminPage}
      />
    );
    if (location.pathname == '/admin-console/show-all-customer-passes') {
      keys = data.customerPassesKeys;
      content = data.formattedCustomerPasses;

      table = (
        <TableCustomerPasses
          customerPasses={content}
          isActive={!isInactiveTable}
          onOpen={handleOpenModal}
          shouldShowCustomerName={true}
          shouldShowPassName={true}
          shouldShowAllowedProductTypes={false}
          isAdminDash={true}
        />
      );
    }
  }

  return (
    <div className='admin-console'>
      {status.role === 'ADMIN' && (
        <>
          <Section classy='admin-intro' header={`Admin Panel`}></Section>
          <SideNav menuSet={sideNavTabs} />
          {adminTabs}
          {shouldAllowCreation && (
            <SideNav
              menuSet={sideNavActions}
              side='right'
              type='action'
              onclose={handleCloseModal}
            />
          )}

          <h1 className='modal__title modal__title--view'>{title}</h1>
          {subTabs && (
            <TabsList
              menuSet={subTabs}
              onClick={handleSwitchContent}
              classModifier='admin-subTabs'
              shouldSwitchState={true}
              disableAutoActive={true}
            />
          )}
          {table}
          {isModalOpen && (
            <ViewsController
              modifier={pickedModifier}
              visited={isModalOpen}
              onClose={handleCloseModal}
              userAccountPage={false}
            />
          )}
        </>
      )}
    </div>
  );
}

export default AdminPage;
