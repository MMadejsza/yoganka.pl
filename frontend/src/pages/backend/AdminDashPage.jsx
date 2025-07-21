import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import FloatingBtnAddItem from '../../components/backend/FloatingBtnAddItem.jsx';
import FloatingBtns from '../../components/backend/FloatingBtns.jsx';
import ModalTable from '../../components/backend/ModalTable.jsx';
import SideNav from '../../components/backend/navigation/SideNav.jsx';
import TabsList from '../../components/backend/TabsList.jsx';
import TableCustomerPasses from '../../components/backend/views/tables/TableCustomerPasses.jsx';
import ViewsController from '../../components/backend/ViewsController.jsx';
import WrapperModalTable from '../../components/backend/WrapperModalTable.jsx';
import Section from '../../components/frontend/Section.jsx';
import { handleContactCustomer } from '../../utils/cardsAndTableUtils.jsx';
import { formatDuration, formatIsoDateTime } from '../../utils/dateTime.js';
import {
  fetchData,
  fetchStatus,
  mutateOnEdit,
  mutateOnValidationLink,
  queryClient,
} from '../../utils/http.js';

const sideNavTabs = [
  {
    name: 'Konta',
    symbol: 'account_circle',
    link: '/admin-console/show-all-users',
  },
  {
    name: 'Uczestnicy',
    symbol: 'group',
    link: '/admin-console/show-all-customers',
  },
  {
    name: 'Rodzaje zajęć',
    symbol: 'category',
    link: '/admin-console/show-all-products',
  },
  {
    name: 'Grafik zajęć',
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
    symbol: 'card_membership',
    link: '/admin-console/show-all-passes',
  },
  {
    name: `Dokumenty`,
    symbol: 'gavel',
    link: '/admin-console/show-all-tos-versions',
  },
  {
    name: `CMS`,
    symbol: 'language',
    externalLink: 'https://yogankacms.sanity.studio/',
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
  // {
  //   name: `Opinie`,
  //   symbol: 'rate_review',
  //   link: '/admin-console/show-all-participants-feedback',
  // },
];

const allowedPaths = sideNavTabs.map(tab => tab.link);
allowedPaths.push(
  '/admin-console/show-all-customer-passes',
  '/admin-console/show-all-gdpr-versions'
);
function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation(); // fetch current path

  const isAdminPage = location.pathname.includes('admin-console') ?? false;
  const isInactiveTable = [
    'invoices',
    'newsletters',
    'feedback',
    'gdpr',
    'tos',
  ].some(path => location.pathname.includes(path));

  const [isMenuSide, setIsMenuSide] = useState(false);

  const query =
    location.pathname == '/admin-console/show-all-customer-passes'
      ? '/admin-console/show-all-passes'
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
  });

  const { data: status, isLoading: isStatusLoading } = useQuery({
    queryKey: ['authStatus'],
    queryFn: fetchStatus,
    cache: 'no-store',
  });

  const {
    mutate: markAbsent,
    isPending: markAbsentIsPending,
    isError: markAbsentIsError,
    error: markAbsentError,
  } = useMutation({
    mutationFn: formDataObj => {
      return mutateOnEdit(
        status,
        formDataObj,
        `/api/admin-console/edit-mark-absent`
      );
    },

    onSuccess: res => {
      queryClient.invalidateQueries(['data', query]);
      console.log('res', res);

      updateFeedback(res);
    },
    onError: err => {
      updateFeedback(err);
    },
  });

  const {
    mutate: markPresent,
    isPending: markPresentIsPending,
    isError: markPresentIsError,
    error: markPresentError,
  } = useMutation({
    mutationFn: formDataObj => {
      return mutateOnEdit(
        status,
        formDataObj,
        `/api/admin-console/edit-mark-present`
      );
    },

    onSuccess: res => {
      queryClient.invalidateQueries(['data', query]);
      console.log('res', res);

      // updating feedback
      updateFeedback(res);
    },
    onError: err => {
      // updating feedback
      updateFeedback(err);
    },
  });

  const { mutate: resendValidationLink } = useMutation({
    mutationFn: formObj => mutateOnValidationLink(status, formObj),

    onSuccess: res => {
      queryClient.invalidateQueries(['data', query]);
      console.log('res', res);
      updateFeedback(res);
    },
    onError: err => updateFeedback(err),
  });

  useEffect(() => {
    if (status) {
      setIsMenuSide(status?.user?.UserPrefSetting?.handedness);
    }
  }, [status]);

  const handleSwitchContent = link => {
    navigate(`${link}`, {
      state: { background: location },
    });
  };

  const handleOpenModal = row => {
    const recordId = row.rowId;
    navigate(`${location.pathname}/${recordId}`, {
      state: { background: location },
    });
  };

  const handleCloseModal = () => {
    navigate(location.state?.background?.pathname || '/', { replace: true });
  };

  const handleContact = (type, tableObj) => {
    handleContactCustomer(type, tableObj);
  };
  const handleReactivation = tableObj => {
    resendValidationLink(tableObj);
  };

  let table,
    keys,
    content = data?.content,
    headers,
    title,
    subTabs,
    onQuickActions = [];
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
          { type: 'symbol', symbol: 'verified_user' },
          'Akcje',
        ];
        onQuickActions.push({
          symbol: 'sync_lock',
          method: tableObj => handleReactivation(tableObj),
        });
        onQuickActions.push({
          symbol: 'mail',
          method: tableObj => handleContact('mail', tableObj),
        });

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
          'RODO',
          'Akcje',
        ];
        onQuickActions.push(
          {
            icon: 'fa-brands fa-whatsapp',
            method: tableObj => handleContact('text', tableObj),
          },
          {
            symbol: 'mail',
            method: tableObj => handleContact('mail', tableObj),
          }
        );
        return modifier;
      case path.includes('show-all-products'):
        const statusMap = {
          1: 'Aktywny',
          0: 'Zawieszony',
          '-1': 'Wygasły',
        };

        let formattedProducts = content?.map(product => {
          return {
            ...product,
            status: statusMap[product.status],
          };
        });
        content = formattedProducts;
        modifier = 'product';
        title = 'Wszystkie zajęcia';
        headers = [
          'Id',
          'Rodzaj',
          'Nazwa',
          'Miejsce',
          'Czas trwania',
          'Cena',
          'Data rozpoczęcia',
          'Status',
        ];
        return modifier;
      case path.includes('show-all-schedules'):
        modifier = 'schedule';
        title = 'Wszystkie terminy';
        headers = [
          'Data',
          'Dzień',
          'Godzina',
          'Miejsce',
          'Typ',
          'Zajęcia',
          'Cena',
          'Obecność',
          'Id',
        ];
        return modifier;
      case path.includes('show-all-payments'):
        modifier = 'payment';
        let map = {
          1: '100%',
          0: 'Częściowo',
          '-1': 'Anulowana',
        };
        let formattedPayments = content?.map(payment => {
          return {
            ...payment,
            status: map[Number(payment.status)],
          };
        });
        content = formattedPayments;
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
          'Regulamin',
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
          'Akcje',
        ];
        onQuickActions.push(
          { symbol: 'person_remove', method: markAbsent },
          {
            symbol: 'person_add',
            method: markPresent,
          }
        );
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
      case path.includes('show-all-tos-versions'):
        modifier = 'tos';
        title = 'Wszystkie wersje regulaminów';

        subTabs = [
          {
            name: 'RODO',
            symbol: 'copyright',
            link: '/admin-console/show-all-gdpr-versions',
          },
        ];
        headers = ['Id', 'Wersja', 'Data utworzenia', 'Treść'];
        return modifier;
      case path.includes('show-all-gdpr-versions'):
        modifier = 'gdpr';
        title = 'Wszystkie wersje RODO';
        subTabs = [
          {
            name: 'Regulaminy',
            symbol: 'contract_edit',
            link: '/admin-console/show-all-tos-versions',
          },
        ];
        headers = ['Id', 'Wersja', 'Data utworzenia', 'Treść'];
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
  if (data && status?.user?.role === 'ADMIN') {
    console.log(`✅ Data: `);
    console.log(data);
    keys = data.columnKeys || data.totalKeys || data.totalHeaders;

    const formattedContent = content.map(row => {
      const formattedDuration = formatDuration(row);
      const newRow = { ...row };
      if (row.duration) newRow.duration = formattedDuration;
      return newRow;
    });

    table = (
      <WrapperModalTable content={content} title={''} noContentMsg={'rekordów'}>
        <ModalTable
          classModifier='admin-view'
          headers={headers}
          keys={keys}
          content={formattedContent}
          active={!isInactiveTable}
          onOpen={handleOpenModal}
          status={status}
          isAdminPage={isAdminPage}
          adminActions={true}
          forLegalDocuments={
            location.pathname.includes('tos') ||
            location.pathname.includes('gdpr')
          }
          onQuickAction={onQuickActions}
        />
      </WrapperModalTable>
    );
    if (location.pathname == '/admin-console/show-all-customer-passes') {
      keys = data.customerPassesKeys;
      content = data.formattedCustomerPasses;

      table = (
        <WrapperModalTable
          content={content}
          title={''}
          noContentMsg={'rekordów'}
        >
          <TableCustomerPasses
            customerPasses={content}
            isActive={!isInactiveTable}
            onOpen={handleOpenModal}
            shouldShowCustomerName={true}
            shouldShowPassName={true}
            shouldShowAllowedProductTypes={false}
            isAdminDash={true}
          />
        </WrapperModalTable>
      );
    }
  }

  return (
    <>
      <Helmet>
        <meta name='robots' content='noindex, nofollow' />
      </Helmet>

      <div className='admin-console'>
        {status.user?.role === 'ADMIN' && (
          <>
            <Section classy='admin-intro' header={`Admin Panel`}></Section>
            <SideNav menuSet={sideNavTabs} />
            {adminTabs}
            <h1 className='modal__title modal__title--view'>{title}</h1>
            {subTabs && (
              <TabsList
                menuSet={subTabs}
                onClick={handleSwitchContent}
                classModifier='admin-subTabs'
                shouldSwitchState={true}
                disableAutoActive={true}
                linkEnd='/admin-console/show-all-users'
              />
            )}
            {table}

            <ViewsController
              modifier={pickedModifier}
              onClose={handleCloseModal}
              userAccountPage={false}
              modalBasePath={location.pathname}
            />

            {
              <FloatingBtns side={isMenuSide}>
                <FloatingBtnAddItem />
              </FloatingBtns>
            }
          </>
        )}
      </div>
    </>
  );
}

export default AdminPage;
