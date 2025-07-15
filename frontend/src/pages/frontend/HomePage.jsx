import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import Loader from '../../components/common/Loader.jsx';
import About from '../../components/frontend/About.jsx';
import ReviewsSection from '../../components/frontend/camps/ReviewsSection.jsx';
import Certificates from '../../components/frontend/Certificates.jsx';
import HeaderMain from '../../components/frontend/HeaderMain.jsx';
import OfferSection from '../../components/frontend/OfferSection.jsx';
import Partners from '../../components/frontend/Partners.jsx';
import { client } from '../../utils/sanityClient.js';

function HomePage() {
  const mediaQuery = window.matchMedia('(max-width: 1024px)');
  const isMobile = mediaQuery.matches;

  const cacheConfig = { staleTime: 1000 * 60 * 10, cacheTime: 1000 * 60 * 15 };
  const { data: INTRO_SECTION_DATA, isLoading: introLoading } = useQuery({
    queryKey: ['introData'],
    queryFn: () => client.fetch(`*[_type == "intro"]`),
    ...cacheConfig,
  });
  const { data: LOGO_DATA, isLoading: logoLoading } = useQuery({
    queryKey: ['logotypesData'],
    queryFn: () => client.fetch(`*[_type == "logotypes"]`),
    ...cacheConfig,
  });
  const { data: ABOUT_SECTION_DATA, isLoading: aboutLoading } = useQuery({
    queryKey: ['aboutData'],
    queryFn: () => client.fetch(`*[_type == "about"]`),
    ...cacheConfig,
  });
  const { data: CAMPS_DATA, isLoading: campsLoading } = useQuery({
    queryKey: ['campsData'],
    queryFn: () => client.fetch(`*[_type == "camp"]`),
    ...cacheConfig,
  });
  const { data: CLASSES_DATA, isLoading: classesLoading } = useQuery({
    queryKey: ['classesData'],
    queryFn: () => client.fetch(`*[_type == "class"]`),
    ...cacheConfig,
  });
  const { data: EVENTS_DATA, isLoading: eventsLoading } = useQuery({
    queryKey: ['eventsData'],
    queryFn: () => client.fetch(`*[_type == "event"]`),
    ...cacheConfig,
  });
  const { data: OFFER_SECTION_DATA, isLoading: offerSectionLoading } = useQuery(
    {
      queryKey: ['offerSectionData'],
      queryFn: () => client.fetch(`*[_type == "offer"]`),
      ...cacheConfig,
    }
  );
  const { data: REVIEWS_SECTION_DATA, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviewData'],
    queryFn: () => client.fetch(`*[_type == "review"]`),
    ...cacheConfig,
  });
  const { data: CERTIFICATES_SECTION_DATA, isLoading: certificatesLoading } =
    useQuery({
      queryKey: ['certificatesData'],
      queryFn: () => client.fetch(`*[_type == "certificates"]`),
      ...cacheConfig,
    });
  const { data: PARTNERS_SECTION_DATA, isLoading: partnersLoading } = useQuery({
    queryKey: ['partnersData'],
    queryFn: () => client.fetch(`*[_type == "partners"]`),
    ...cacheConfig,
  });

  if (
    introLoading ||
    logoLoading ||
    aboutLoading ||
    campsLoading ||
    classesLoading ||
    eventsLoading ||
    offerSectionLoading ||
    reviewsLoading ||
    certificatesLoading ||
    partnersLoading
  ) {
    return <Loader label={'Ładowanie'} />;
  }

  let products = null;
  const dataSets = [
    LOGO_DATA,
    INTRO_SECTION_DATA,
    ABOUT_SECTION_DATA,
    CAMPS_DATA,
    CLASSES_DATA,
    EVENTS_DATA,
    OFFER_SECTION_DATA,
    REVIEWS_SECTION_DATA,
    CERTIFICATES_SECTION_DATA,
    PARTNERS_SECTION_DATA,
  ];
  const anyEmpty = dataSets.some(data => !data || data.length === 0);
  if (!anyEmpty) {
    console.log(CAMPS_DATA);
    const camps = CAMPS_DATA.map(c => ({
      ...c,
      link: c.slug.current,
      type: c._type,
    }));
    const classes = CLASSES_DATA.map(c => ({
      ...c,
      link: c.slug.current,
      type: c._type,
    }));
    const events = EVENTS_DATA.map(e => ({
      ...e,
      link: e.slug.current,
      type: e._type,
    }));

    products = [
      {
        id: 'wyjazdy',
        header: OFFER_SECTION_DATA[0].camps.title,
        data: camps,
        limit: 2,
        moreLink: '/wyjazdy',
      },
      {
        id: 'zajecia',
        header: OFFER_SECTION_DATA[0].classes.title,
        data: classes,
      },
      {
        id: 'wydarzenia',
        header: OFFER_SECTION_DATA[0].events.title,
        data: events,
        limit: OFFER_SECTION_DATA[0].events.limit,
        moreLink: '/wydarzenia',
        specifier: 'events',
      },
    ];
  }
  return (
    <>
      <Helmet>
        <html lang='pl' />
        <title>Yoganka – Joga Trójmiasto i Online</title>
        <meta
          name='description'
          content='Profesjonalna instruktorka jogi oferująca wyjątkowe zajęcia w Trójmieście, wyjazdy z jogą oraz warsztaty jogi dzięki certyfikatom zdobytym na Bali. Specjalizuje się również w jodze na supie oraz sesjach mindfulness.'
        />
        <meta
          name='keywords'
          content='joga Trójmiasto, joga Gdańsk, joga na SUPie, wyjazdy jogowe, joga online, joga z gongami, mindfulness'
        />
        <meta name='author' content='MMadejsza' />
        <link rel='canonical' href='https://yoganka.pl/' />
        <meta name='robots' content='index, follow' />
        <meta property='og:locale' content='pl_PL' />
        <meta
          property='og:title'
          content='Yoganka – Joga Trójmiasto i Online'
        />
        <meta
          property='og:description'
          content='Zajęcia w Trójmieście, joga na SUPie, warsztaty i wyjazdy jogowe. Certyfikowana nauczycielka z doświadczeniem z Bali.'
        />
        <meta property='og:url' content='https://yoganka.pl/' />
        <meta property='og:type' content='website' />
        <meta property='og:image' content='/favicon_io/apple-touch-icon.png' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta
          name='twitter:title'
          content='Yoganka – Joga Trójmiasto i Online'
        />
        <meta
          name='twitter:description'
          content='Zajęcia w Trójmieście, joga na SUPie, warsztaty i wyjazdy jogowe.'
        />
        <meta name='twitter:image' content='/favicon_io/apple-touch-icon.png' />
      </Helmet>

      {isMobile ? (
        <HeaderMain data={INTRO_SECTION_DATA} logo={LOGO_DATA[0]} />
      ) : null}
      <About
        isMobile={isMobile}
        data={{
          intro: INTRO_SECTION_DATA,
          about: ABOUT_SECTION_DATA,
          motto: INTRO_SECTION_DATA[0].motto,
        }}
        logo={LOGO_DATA[0]}
      />
      <OfferSection products={products} />
      <ReviewsSection placement='homepage' data={REVIEWS_SECTION_DATA} />
      <Certificates data={CERTIFICATES_SECTION_DATA} />
      <Partners data={PARTNERS_SECTION_DATA} />
    </>
  );
}

export default HomePage;
