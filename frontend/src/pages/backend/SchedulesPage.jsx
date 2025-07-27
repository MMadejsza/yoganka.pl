import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CardsList from '../../components/backend/cards/CardsList.jsx';
import ModalTable from '../../components/backend/ModalTable.jsx';
import TabsList from '../../components/backend/TabsList.jsx';
import ViewsController from '../../components/backend/ViewsController.jsx';
import IntroSection from '../../components/common/IntroSection.jsx';
import { useHandleStripeRedirect } from '../../hooks/useHandleStripeRedirect.js';
import { formatAllowedTypes } from '../../utils/cardsAndTableUtils.jsx';
import { formatIsoDateTime } from '../../utils/dateTime.js';
import { fetchData, mutateOnCreate, queryClient } from '../../utils/http.js';
import { client } from '../../utils/sanityClient.js';
const logsGloballyOn = false;

function SchedulePage() {
  const navigate = useNavigate();
  const location = useLocation(); // fetch current path

  const isPassDefinitions = location.pathname.startsWith('/grafik/karnety');

  const { id } = useParams(); // jeśli URL to /grafik/9 lub /grafik/karnety/68
  const isModalOpen = Boolean(id);

  const status = useHandleStripeRedirect();

  const cacheConfig = { staleTime: 1000 * 60 * 10, cacheTime: 1000 * 60 * 15 };
  const { data: INTRO, isLoading: introLoading } = useQuery({
    queryKey: ['scheduleIntroData'],
    queryFn: () => client.fetch(`*[_type == "scheduleIntro"][0]`),
    ...cacheConfig,
  });

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
          allowedProductTypes: passDef.allowedProductTypes
            ? formatAllowedTypes(passDef.allowedProductTypes)
            : '',
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
    navigate(`${location.pathname}/${row.rowId}`, { state: { background } });
  };

  const handleCloseModal = () => {
    reset(); // clear any mutation flags
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
    headers,
    modifier,
    keys,
    paymentOps;

  if (data && INTRO) {
    // console.clear();
    if (logsGloballyOn) {
      console.log(`✅ Data: `);
      console.log(data);
    }

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
          onClose={handleCloseModal}
          paymentOps={paymentOps}
          role={status.user?.role}
          modalBasePath={`${
            isPassDefinitions ? '/grafik/karnety' : '/grafik'
          }/${id}`}
        />
      );
    }

    title = isPassDefinitions ? 'Nasze karnety' : `Najbliższa Yoga`;
    let noContentMsg = isPassDefinitions
      ? '🌿 Nowe karnety już wkrótce - wszystko w swoim czasie. 🌿'
      : `🌿 Harmonogram dojrzewa - spotkajmy się wkrótce na żywo. 🌿`;
    let noContentParagraph = <h1 className='tile__title'>{noContentMsg}</h1>;

    return (
      <>
        <Helmet>
          <html lang='pl' />
          <title>
            {isPassDefinitions ? 'Karnety Yoganka' : 'Grafik zajęć - Yoganka'}
          </title>
          <meta
            name='description'
            content={
              isPassDefinitions
                ? 'Wybierz odpowiedni karnet jogi dla siebie - dostępne opcje wejść jednorazowych, pakietów oraz online.'
                : 'Aktualny grafik zajęć jogi prowadzonych przez Yogankę. Zarezerwuj swoje miejsce na zajęcia stacjonarne lub online.'
            }
          />
          <link
            rel='canonical'
            href={
              isPassDefinitions
                ? 'https://yoganka.pl/grafik/karnety'
                : 'https://yoganka.pl/grafik'
            }
          />
          <meta name='robots' content='index, follow' />
          <meta
            property='og:title'
            content={
              isPassDefinitions ? 'Karnety - Yoganka' : 'Grafik jogi - Yoganka'
            }
          />
          <meta
            property='og:description'
            content={
              isPassDefinitions
                ? 'Sprawdź dostępne karnety na zajęcia jogi Yoganka - różne typy, ceny i liczba wejść.'
                : 'Sprawdź aktualne terminy zajęć jogi i zarezerwuj online.'
            }
          />
          <meta property='og:type' content='website' />
          <meta
            property='og:image'
            content='/favicon_io/apple-touch-icon.png'
          />
        </Helmet>

        <div className='backend-content-wrapper'>
          <IntroSection
            modifier={`no-bcg-pic`}
            className={`intro--admin`}
            data={INTRO}
          />
          <TabsList
            menuSet={productTabs || []}
            onClick={handleSwitchContent}
            classModifier='product-tabs'
            shouldSwitchState={true}
            disableAutoActive={true}
          />
          {data.content?.length > 0 ? cardsList : noContentParagraph}
          {viewFrame}
        </div>
      </>
    );
  }
}
export default SchedulePage;
