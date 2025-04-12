import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import ModalTable from '../../components/backend/ModalTable.jsx';
import TabsList from '../../components/backend/TabsList.jsx';
import ViewsController from '../../components/backend/ViewsController.jsx';
import Section from '../../components/frontend/Section.jsx';
import { useAuthStatus } from '../../hooks/useAuthStatus.js';
import { formatIsoDateTime } from '../../utils/dateTime.js';
import { fetchData, mutateOnCreate, queryClient } from '../../utils/http.js';

function SchedulePage() {
  const navigate = useNavigate();
  const location = useLocation(); // fetch current path
  const isPassDefinitions = location.pathname.includes('/grafik/karnety');
  const modalMatch = !!useMatch('/grafik/:id') && !isPassDefinitions;
  console.log('modalMatch', modalMatch);
  const [isModalOpen, setIsModalOpen] = useState(modalMatch);

  const { data: status } = useAuthStatus();

  const query = isPassDefinitions ? '/grafik/karnety' : '/grafik';
  const { data, isError, error } = useQuery({
    // as id for later caching received data to not send the same request again where location.pathname is key
    queryKey: ['data', location.pathname],
    // definition of the code sending the actual request- must be returning the promise
    queryFn: () => fetchData(query),
    // only when location.pathname is set extra beyond admin panel:
    // enabled: location.pathname.includes('grafik'),
    // stopping unnecessary requests when jumping tabs
    staleTime: 10000,
    // how long tada is cached (default 5 mins)
    // gcTime:30000
  });

  const {
    mutateAsync: book, //async to let it return promise for child viewSchedule and let serve the feedback there based on the result of it
    isError: isBookError,
    error: bookError,
    reset,
  } = useMutation({
    mutationFn: formDataObj =>
      mutateOnCreate(status, formDataObj, `/api/customer/create-booking`),

    onSuccess: res => {
      if (res.isNewCustomer) {
        queryClient.invalidateQueries(['authStatus']);
      }
      queryClient.invalidateQueries(['data', location.pathname]);
    },
  });

  const handleSwitchContent = link => {
    navigate(link, {
      state: { background: location },
    });
  };

  const background = {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  };
  const handleOpenModal = row => {
    const id = row.rowId;
    setIsModalOpen(true);
    navigate(`${location.pathname}/${id}`, { state: { background } });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset(); // resets mutation state and flags
    navigate(-1);
  };

  if (isError) {
    if (error.code == 401) {
      navigate('/login');
      console.log(error.message);
    } else {
      window.alert(error.info?.message || 'Failed to fetch');
    }
  }

  let table, viewFrame, title, productTabs, contentSorted, headers, modifier;

  if (data) {
    // console.clear();
    console.log(`✅ Data: `);
    console.log(data);

    if (isPassDefinitions) {
      modifier = 'passDef';
      headers = [
        'Id',
        'Nazwa',
        'Opis',
        'Typ',
        'Liczba wejść',
        'Ważność',
        'Zakres',
        'Cena',
        '',
      ];

      contentSorted = data.content.map(record => {
        const passDef = record; //.toJSON();

        return {
          ...passDef,
          usesTotal: passDef.usesTotal || '-',
          validityDays: `${
            passDef.validityDays ? `${passDef.validityDays} dni` : '-'
          }`,
          price: `${passDef.price} zł`,
          allowedProductTypes: JSON.parse(passDef.allowedProductTypes).join(
            ', '
          ),
        };
      });
    } else {
      modifier = 'schedule';
      headers = data.totalHeaders;
      contentSorted = data.content.sort((a, b) => {
        const dateA = new Date(a.date.split('.').reverse().join('-'));
        const dateB = new Date(b.date.split('.').reverse().join('-'));
        return dateA - dateB;
      });

      // format date
      contentSorted.forEach(schedule => {
        schedule.date = formatIsoDateTime(schedule.date, true);
      });
    }

    switch (true) {
      case isPassDefinitions:
        table = (
          <ModalTable
            headers={headers}
            keys={data.totalKeys}
            content={contentSorted}
            active={false}
            status={status}
            onQuickAction={[{ symbol: 'shopping_bag_speed', method: book }]}
            // classModifier={classModifier}
          />
        );
        productTabs = [
          {
            name: 'Grafik',
            symbol: 'calendar_month',
            link: '/grafik',
          },
        ];
        break;

      default:
        table = (
          <ModalTable
            headers={data.totalHeaders}
            keys={data.totalKeys}
            content={contentSorted}
            active={true}
            status={status}
            onOpen={handleOpenModal}
            onQuickAction={[{ symbol: 'shopping_bag_speed', method: book }]}
            // classModifier={classModifier}
          />
        );
        productTabs = [
          {
            name: 'Karnety',
            symbol: 'local_activity',
            link: '/grafik/karnety',
          },
        ];
        break;
    }
  }

  if (data && status) {
    viewFrame = (
      <ViewsController
        modifier={modifier}
        visited={isModalOpen}
        onClose={handleCloseModal}
        paymentOps={{
          onBook: book,
          isError: isBookError,
          error: bookError,
        }}
        role={status.role}
      />
    );
  }

  title = isPassDefinitions ? 'Nasze karnety' : `Najbliższa Yoga`;

  return (
    <div className='admin-console'>
      <Section classy='admin-intro' header={title} />
      <TabsList
        menuSet={productTabs || []}
        onClick={handleSwitchContent}
        classModifier='product-tabs'
        shouldSwitchState={true}
        disableAutoActive={true}
      />
      {table}
      {isModalOpen && viewFrame}
    </div>
  );
}

export default SchedulePage;
