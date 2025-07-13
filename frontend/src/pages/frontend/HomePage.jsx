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

  const { data: ABOUT_SECTION_DATA, isLoading: aboutLoading } = useQuery({
    queryKey: ['aboutData'],
    queryFn: () => client.fetch(`*[_type == "about"]`),
  });
  const { data: CAMPS_DATA, isLoading: campsLoading } = useQuery({
    queryKey: ['campsData'],
    queryFn: () => client.fetch(`*[_type == "camp"]`),
  });
  const { data: CLASSES_DATA, isLoading: classesLoading } = useQuery({
    queryKey: ['classesData'],
    queryFn: () => client.fetch(`*[_type == "class"]`),
  });
  const { data: EVENTS_DATA, isLoading: eventsLoading } = useQuery({
    queryKey: ['eventsData'],
    queryFn: () => client.fetch(`*[_type == "event"]`),
  });

  if (campsLoading || classesLoading || eventsLoading) {
    return <Loader label={'Ładowanie'} />;
  }

  let products = null;
  const contentLoaded = CAMPS_DATA && CLASSES_DATA && EVENTS_DATA;
  if (contentLoaded) {
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
        header: `Kobiece Wyjazdy z\u00a0Jogą`,
        data: camps,
        limit: 2,
        moreLink: '/wyjazdy',
      },
      { id: 'zajecia', header: `Zajęcia regularne`, data: classes },
      {
        id: 'wydarzenia',
        header: `Wydarzenia`,
        data: events,
        // limit: 3,
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
      {isMobile ? <HeaderMain /> : null}
      <About isMobile={isMobile} />
      {contentLoaded && <OfferSection products={products} />}
      <ReviewsSection placement='homepage' />
      <Certificates />
      <Partners />
    </>
  );
}

export default HomePage;
