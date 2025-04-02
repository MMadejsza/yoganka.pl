import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import ModalTable from '../../components/backend/ModalTable.jsx';
import SideNav from '../../components/backend/SideNav.jsx';
import ViewFrame from '../../components/backend/ViewsController.jsx';
import Section from '../../components/frontend/Section.jsx';
import { fetchData, fetchStatus } from '../../utils/http.js';

const sideNavTabs = [
  { name: 'Użytkownicy', icon: 'group', link: '/admin-console/show-all-users' },
  {
    name: 'Uczestnicy',
    icon: 'sentiment_satisfied',
    link: '/admin-console/show-all-customers',
  },
  {
    name: 'Zajęcia',
    icon: 'inventory',
    link: '/admin-console/show-all-products',
  },
  {
    name: 'Grafik',
    icon: 'calendar_month',
    link: '/admin-console/show-all-schedules',
  },
  {
    name: `Płatności`,
    icon: 'event_available',
    link: '/admin-console/show-all-payments',
  },
  {
    name: `Faktury`,
    icon: 'receipt_long',
    link: '/admin-console/show-all-invoices',
  },
  {
    name: `Newsletter'y`,
    icon: 'contact_mail',
    link: '/admin-console/show-all-newsletters',
  },
  {
    name: `Opinie`,
    icon: 'reviews',
    link: '/admin-console/show-all-participants-feedback',
  },
];
const sideNavActions = [
  {
    name: 'Dodaj',
    icon: 'add_circle',
    link: 'add-user',
  },
];

const noCreateOptionPages = [
  'show-all-schedules',
  'show-all-invoices',
  'show-all-newsletters',
  'show-all-participants-feedback',
];
const allowedPaths = sideNavTabs.map(tab => tab.link);

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

  let headers;
  const pickModifier = path => {
    let modifier;
    switch (true) {
      case path.includes('show-all-users'):
        modifier = 'user';
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
      case path.includes('show-all-newsletters'):
        modifier = 'newsletter';
        headers = ['Id', 'Status', 'Utworzono', 'Wysłano', 'Tytuł', 'Treść'];
        return modifier;

      default:
        return (modifier = '');
    }
  };
  const pickedModifier = pickModifier(location.pathname);

  const { data, isError, error } = useQuery({
    // as id for later caching received data to not send the same request again where location.pathname is key
    queryKey: ['data', location.pathname],
    // definition of the code sending the actual request- must be returning the promise
    queryFn: () => fetchData(location.pathname),
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

  if (isStatusLoading) {
    return <div>Loading...</div>;
  }

  let table;

  if (isError) {
    if (error.code == 401) {
      navigate('/login');
      console.log(error.message);
    } else {
      window.alert(error.info?.message || 'Failed to fetch');
    }
  }
  if (data && status?.role === 'ADMIN') {
    // console.clear();
    console.log(`✅ Data: `);
    console.log(data);
    table = (
      <ModalTable
        headers={headers}
        keys={data.totalKeys || data.totalHeaders}
        content={data.content}
        active={!isInactiveTable}
        onOpen={handleOpenModal}
        status={status}
        isAdminPage={isAdminPage}
      />
    );
  }

  return (
    <div className='admin-console'>
      {status.role === 'ADMIN' && (
        <>
          <Section classy='admin-intro' header={`Admin Panel`}></Section>
          <SideNav menuSet={sideNavTabs} />
          {shouldAllowCreation && (
            <SideNav
              menuSet={sideNavActions}
              side='right'
              type='action'
              onclose={handleCloseModal}
            />
          )}
        </>
      )}
      {table}
      {isModalOpen && (
        <ViewFrame
          modifier={pickedModifier}
          visited={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default AdminPage;
