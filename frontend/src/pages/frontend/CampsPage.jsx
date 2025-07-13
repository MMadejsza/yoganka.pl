import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import Loader from '../../components/common/Loader.jsx';
import CampsBenefitsSection from '../../components/frontend/camps/CampsBenefitsSection.jsx';
// import CampsGalerySection from '../../components/frontend/camps/CampsGalerySection.jsx';
import CampsIntoSection from '../../components/frontend/camps/CampsIntoSection.jsx';
import ReviewsSection from '../../components/frontend/camps/ReviewsSection.jsx';
import OfferSection from '../../components/frontend/OfferSection.jsx';
import { client } from '../../utils/sanityClient.js';

function CampsPage() {
  const { data: CAMPS_DATA, isLoading: campsLoading } = useQuery({
    queryKey: ['campsData'],
    queryFn: () => client.fetch(`*[_type == "camp"]`),
  });

  if (campsLoading) {
    return <Loader label={'Ładowanie'} />;
  }

  let products = null;
  const contentLoaded = CAMPS_DATA;
  if (contentLoaded) {
    console.log(CAMPS_DATA);
    const camps = CAMPS_DATA.map(c => ({
      ...c,
      link: c.slug.current,
      type: c._type,
    }));

    products = [
      { id: 'wyjazdy', header: `Wybierz swój wyjazd`, data: camps, limit: 0 },
    ];
  }
  return (
    <>
      <Helmet>
        <html lang='pl' />
        <title>Wyjazdy Joga – Polska i zagranica | Yoganka</title>
        <meta
          name='description'
          content='Wyjazdy jogowe w Polsce - praktyka jogi, medytacja i regeneracja. Sprawdź ofertę najbliższych wyjazdów z Yoganką.'
        />
        <meta
          name='keywords'
          content='wyjazdy z jogą, joga w naturze, retreat jogowy, wyjazd weekendowy joga'
        />
        <meta name='author' content='MMadejsza' />
        <link rel='canonical' href='https://yoganka.pl/wyjazdy' />
        <meta name='robots' content='index, follow' />
        <meta property='og:locale' content='pl_PL' />
        <meta property='og:title' content='Wyjazdy z Jogą – Yoganka' />
        <meta
          property='og:description'
          content='Weekendowe i tygodniowe wyjazdy z jogą, zdrową kuchnią i mindfulness. Sprawdź terminy i zapisz się!'
        />
        <meta property='og:url' content='https://yoganka.pl/wyjazdy' />
        <meta property='og:type' content='website' />
        <meta property='og:image' content='/favicon_io/apple-touch-icon.png' />
      </Helmet>
      <CampsIntoSection />
      <CampsBenefitsSection />
      {contentLoaded && <OfferSection products={products} />}
      <ReviewsSection />
      {/* {contentLoaded && (
        <CampsGalerySection camps={CAMPS_DATA} isMobile={true} />
      )} */}
    </>
  );
}

export default CampsPage;
