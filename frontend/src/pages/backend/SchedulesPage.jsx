import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import CardsList from '../../components/backend/CardsList.jsx';
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

  const isPassDefinitions = location.pathname.startsWith('/grafik/karnety');
  const scheduleModalMatch = !!useMatch('/grafik/:id') && !isPassDefinitions;
  const passModalMatch = !!useMatch('/grafik/karnety/:id');
  const shouldOpenModal = scheduleModalMatch || passModalMatch;

  const [isModalOpen, setIsModalOpen] = useState(shouldOpenModal);
  useEffect(() => {
    setIsModalOpen(shouldOpenModal);
  }, [shouldOpenModal]);

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

  // Compute formattedContent once, avoid mutating and re-formatting on every render
  const formattedContent = useMemo(() => {
    if (!data?.content) return [];

    if (isPassDefinitions) {
      const order = { time: 0, mixed: 1, count: 2 };
      return data.content
        .map(passDef => ({
          ...passDef,
          usesTotal: passDef.usesTotal ?? '-',
          validityDays: passDef.validityDays
            ? `${passDef.validityDays} dni`
            : '-',
          price: `${passDef.price} zł`,
          allowedProductTypes: JSON.parse(passDef.allowedProductTypes).join(
            ', '
          ),
        }))
        .sort((a, b) => {
          const aKey = a.passType.toLowerCase();
          const bKey = b.passType.toLowerCase();
          return (order[aKey] || 0) - (order[bKey] || 0);
        });
    }

    // schedules: clone, sort by date, and format date once
    return data.content
      .slice()
      .sort((a, b) => {
        const dateA = new Date(a.date.split('.').reverse().join('-'));
        const dateB = new Date(b.date.split('.').reverse().join('-'));
        return dateA - dateB;
      })
      .map(schedule => ({
        ...schedule,
        date: formatIsoDateTime(schedule.date, true),
      }));
  }, [data, isPassDefinitions]);
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

  const {
    mutateAsync: buy, //async to let it return promise for child viewSchedule and let serve the feedback there based on the result of it
    isError: isBuyError,
    error: buyError,
    reset: resetBuy,
  } = useMutation({
    mutationFn: formDataObj =>
      mutateOnCreate(status, formDataObj, `/api/customer/create-pass-purchase`),

    onSuccess: res => {
      queryClient.invalidateQueries(['authStatus']);
      queryClient.invalidateQueries(['data', location.pathname]);
      queryClient.invalidateQueries(['data', '/grafik']);
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
    navigate(query);
  };

  if (isError) {
    if (error.code == 401) {
      navigate('/login');
      console.log(error.message);
    } else {
      window.alert(error.info?.message || 'Failed to fetch');
    }
  }

  let table,
    cardsList,
    viewFrame,
    title,
    productTabs,
    contentSorted,
    headers,
    modifier,
    keys,
    paymentOps;

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
        // 'Typ',
        'Liczba wejść',
        // 'Ważność',
        'Zakres',
        // 'Cena',
        // 'Kupuję',
      ];
      keys = [
        'passDefId',
        'name',
        'description',
        // 'passType',
        'usesTotal',
        // 'validityDays',
        'allowedProductTypes',
        // 'price',
        // '',
      ];
      paymentOps = {
        purchase: {
          onBuy: buy,
          isError: isBuyError,
          error: buyError,
        },
      };
      productTabs = [
        {
          name: 'Grafik',
          symbol: 'calendar_month',
          link: '/grafik',
        },
      ];
      table = (
        <ModalTable
          headers={headers}
          keys={keys}
          content={formattedContent}
          active={true}
          status={status}
          onOpen={handleOpenModal}
        />
      );
      cardsList = (
        <CardsList
          content={formattedContent}
          active={true}
          status={status}
          onOpen={handleOpenModal}
        />
      );
    } else {
      modifier = 'schedule';
      headers = data.totalHeaders;
      keys = data.totalKeys;
      paymentOps = {
        // for schedule booking only as backend will chose if should make a payment or go for using the pass automatically
        booking: { onBook: book, isError: isBookError, error: bookError },
      };
      productTabs = [
        { name: 'Karnety', symbol: 'card_membership', link: '/grafik/karnety' },
      ];

      table = (
        <ModalTable
          headers={headers}
          keys={keys}
          content={formattedContent}
          active={true}
          status={status}
          onOpen={handleOpenModal}
          onQuickAction={[{ symbol: 'shopping_bag_speed', method: book }]}
        />
      );

      cardsList = (
        <CardsList
          content={formattedContent}
          active={true}
          status={status}
          onOpen={handleOpenModal}
          onQuickAction={[{ symbol: 'shopping_bag_speed', method: book }]}
        />
      );
    }

    if (data && status) {
      viewFrame = (
        <ViewsController
          modifier={modifier}
          visited={isModalOpen}
          onClose={handleCloseModal}
          paymentOps={paymentOps}
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
        {/* {table} */}
        {cardsList}
        {isModalOpen && viewFrame}
      </div>
    );
  }
}
export default SchedulePage;
